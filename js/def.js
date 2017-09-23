var PIECES = { EMPTY : 0, wP : 1, wN : 2, wB : 3, wR : 4, wQ : 5, wK : 6,
              bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12};
//File
var COLUMNS = {COLUMN_A : 0, COLUMN_B : 1, COLUMN_C : 2, COLUMN_D : 3, COLUMN_E : 4,
              COLUMN_F : 5, COLUMN_G : 6, COLUMN_H : 7, COLUMN_NONE : 8};
//Rank
var ROWS = {ROW_1 : 0, ROW_2 : 1, ROW_3 : 2, ROW_4 : 3,
            ROW_5 : 4, ROW_6 : 5, ROW_7 : 6, ROW_8 : 7, ROW_NONE : 8}
var SQUARES = {A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,
              A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98,
              NO_SQ:99, OFFBOARD:100};

var BRD_SQ_NUM = 120;
var PIECE_COLORS = {WHITE : 0, BLACK : 1, BOTH : 2};
var CASTLEBIT = {WKCA:1, WQCA:2, BKCA:4, BQCA:8};
var BOOL = {FALSE:0, TRUE:1};

var MAX_GAME_MOVES = 2048;
var MAX_POSITION_MOVES = 256;
var MAX_DEPTH = 64;

var ColumnsBrd = new Array(BRD_SQ_NUM);
var RowsBrd = new Array(BRD_SQ_NUM);

var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var pieceChar = ".PNBRQKpnbrqk";
var sideChar = "wb-";
var rowChar = "12345678";
var columnChar = "abcdefgh";

//Squares starts at value 21
//sets proper position for 120 sized board
function colRowToSquares(col, row) {
  return ((21 + col) + (row * 10));
}

///piece descriptions, will make evaluations easier and faster
//index corresponds to PIECES
var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
//most wildly accepted values for pieces
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var PieceCol = [ PIECE_COLORS.BOTH, PIECE_COLORS.WHITE, PIECE_COLORS.WHITE, PIECE_COLORS.WHITE, PIECE_COLORS.WHITE, PIECE_COLORS.WHITE, PIECE_COLORS.WHITE,
	               PIECE_COLORS.BLACK, PIECE_COLORS.BLACK, PIECE_COLORS.BLACK, PIECE_COLORS.BLACK, PIECE_COLORS.BLACK, PIECE_COLORS.BLACK ];
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var knightDirection = [ -8, -19, -21, -12, 8, 19, 21, 12];
var rookDirection = [-1, -10, 1, 10];
var bishopDirection = [-9, -11, 11, 9];
var kingDirection = [-1, -10, 1, 10, -9, -11, 11, 9];

//PIECE * 120 + square for index
var pieceKeys = new Array(14 * 120);
//XOR in or out depending on which side (white or black)
var sideKey;
var castleKeys = new Array(16);

var board120ToBoard64 = new Array(BRD_SQ_NUM);
var board64ToBoard120 = new Array(64);
function getBoard64(square120) { return board120ToBoard64[square120]; }
//SQ120
function getBoard120(square64) { return board64ToBoard120[square64]; }

function pieceIndex(piece, pieceNum) { return (piece * 10 + pieceNum); }

//gives a random number for gameBoard.posKey
//generates 4 numbers that each cover 8 bits and shifts them to the left to get a good coverage of 31 bits
function RAND_32()
{
  return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
        | (Math.floor((Math.random()*255)+1) << 8) | (Math.floor((Math.random()*255)+1));
}
