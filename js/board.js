var gameBoard = {};

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
