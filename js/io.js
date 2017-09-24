function printSquare(square) {
  return columnChar[ColumnsBrd[square]] + rowChar[RowsBrd[square]];
}

function printMove(move) {
  var moveString;

  var colFrom = ColumnsBrd[fromSquare(move)];
  var rowFrom = RowsBrd[fromSquare(move)];
  var toCol = ColumnsBrd[toSquare(move)];
  var toRow = RowsBrd[toSquare(move)];

  moveString = columnChar[colFrom] + rowChar[rowFrom] + columnChar[toCol] + rowChar[toRow];
  var pro = promoted(move);

  if (pro != PIECES.EMPTY)
  {
    var proChar = 'q';

    if (PieceKnight[pro] == BOOL.TRUE)
    {
      proChar = 'n';
    } else if (PieceRookQueen[pro] == BOOL.TRUE && PieceBishopQueen[pro] == BOOL.FALSE)
    {
      proChar = 'r';
    } else if (PieceRookQueen[pro] == BOOL.FALSE && PieceBishopQueen[pro] == BOOL.TRUE)
    {
      proChar = 'b';
    }
    moveString += proChar;
  }
  return moveString;
}

function printMoveList() {
  var index, move;

  console.log("MoveList: ");

  for (index = gameBoard.moveListStart[gameBoard.play]; index < gameBoard.moveListStart[gameBoard.play + 1]; index++)
  {
    move = gameBoard.moveList[index];
    console.log(printMove(move));
  }

}
