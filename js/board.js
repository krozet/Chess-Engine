var gameBoard = {};
function getPieceIndex(piece, pieceNum) { return (piece * 10 + pieceNum); }

gameBoard.pieces = new Array(BRD_SQ_NUM);
gameBoard.side = PIECE_COLORS.WHITE;
//fifty move rule in chess
//incr if move is made, decr if pawn is moved or capture is made
gameBoard.fiftyMove = 0;
//maintains count of half moves (full move is a move for white and black)
//maintains every move made in the game from the start
gameBoard.hisPlay = 0;
//numberof half moves made in the search tree
gameBoard.play = 0;
//handles en passant
gameBoard.enPas = 0;
/*castle permission
uses bitwise operations
0001
0010
0100
1000
*/
gameBoard.castlePerm = 0;
//white and black material of pieces
gameBoard.material = new Array(2);
///values for optimizing speed of finding pieces and their potential moves
//indexed by PIECES, number of each type of piece
gameBoard.pieceNum = new Array(13);
//array of all the pieces
//there can be at max 10 of one piece on the board
gameBoard.pieceList = new Array(14 * 10);
//unique position key used to detect a draw based on repetition
gameBoard.posKey = 0;

gameBoard.moveList = new Array(MAX_DEPTH * MAX_POSITION_MOVES);
gameBoard.moveScores = new Array(MAX_DEPTH * MAX_POSITION_MOVES);
gameBoard.moveListStart = new Array(MAX_DEPTH);

function generatePositionKey()
{
  var finalKey = 0;

  for (var square = 0; square < BRD_SQ_NUM; square++)
  {
    var piece = gameBoard.pieces[square];
    if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD)
    {
      finalKey ^= pieceKeys[(piece * 120) + square];
    }
  }

  if (gameBoard.side == PIECE_COLORS.WHITE)
  {
    finalKey ^= sideKey;
  }

  if (gameBoard.enPas != SQUARES.NO_SQ)
  {
    finalKey ^= pieceKeys[gameBoard.enPas];
  }

  finalKey ^= castleKeys[gameBoard.castlePerm];

  return finalKey;
}

function resetBoard()
{
  var index = 0;

  for (index = 0; index < 14 * 120; index++)
  {
    //resets all the pieces to empty
    gameBoard.pieceList[index] = PIECES.EMPTY;

    //takes care of 120 size board
    if (index < BRD_SQ_NUM)
    {
      gameBoard.pieces[index] = SQUARES.OFFBOARD
    }

    //takes care of the 64 size board
    if ( index < 64)
    {
      gameBoard.pieces[getBoard120(index)] = PIECES.EMPTY;
    }

    //resets the piece number
    if (index < 13)
    {
      gameBoard.pieceNum[index] = 0;
    }

    if (index < 2)
    {
      gameBoard.material[index] = 0;
    }
  }

  gameBoard.side = PIECE_COLORS.BOTH;
  gameBoard.enPas = SQUARES.NO_SQ;
  gameBoard.fiftyMove = 0;
  gameBoard.play = 0;
  gameBoard.hisPlay = 0;
  gameBoard.castlePerm = 0;
  gameBoard.posKey = 0;
  gameBoard.moveListStart[gameBoard.play] = 0;
}

//starting fen
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
function parseFen(fen)
{
  resetBoard();

  var row = ROWS.ROW_8;
  varcol = COLUMNS.COLUMN_A;
  var piece = 0;
  var count = 0;
  var i = 0;
  var square120 = 0;
  var fenCount = 0;

  while ((row >= ROWS.ROW_1) && fenCount < fen.length)
  {
    count = 1;
    switch (fen[fenCount])
    {
      case 'p': piece = PIECES.bP;
                break;
      case 'r': piece = PIECES.bR;
                break;
      case 'n': piece = PIECES.bN;
                break;
      case 'b': piece = PIECES.bB;
                break;
      case 'k': piece = PIECES.bK;
                break;
      case 'q': piece = PIECES.bQ;
                break;
      case 'P': piece = PIECES.wP;
                break;
      case 'R': piece = PIECES.wR;
                break;
      case 'N': piece = PIECES.wN;
                break;
      case 'B': piece = PIECES.wB;
                break;
      case 'K': piece = PIECES.wK;
                break;
      case 'Q': piece = PIECES.wQ;
                break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
                piece = PIECES.EMPTY;
                count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
                break;

      case '/':
      case ' ':
                rank--;
                file = FILES.FILE_A;
                fenCnt++;
                continue;
      default:
                console.log("FEN error");
                return;
    }
  }

}
