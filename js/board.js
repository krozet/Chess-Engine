var gameBoard = {};
function() getPieceIndex(piece, pieceNum) { return (piece * 10 + pieceNum); }

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
