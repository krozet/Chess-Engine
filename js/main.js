$(function()
{
  init();
  console.log("Main Init Called");
  parseFen(START_FEN);
  printBoard();
});

function initColumnsRowsBrd()
{
  ///board initialization
  //sets boundries
  for (var index = 0; index < BRD_SQ_NUM; index++)
  {
    ColumnsBrd[index] = SQUARES.OFFBOARD;
    RowsBrd[index] = SQUARES.OFFBOARD;
  }
  //sets inside board
  for ( var row = ROWS.ROW_1; row <= ROWS.ROW_8; row++)
  {
    for ( var col = COLUMNS.COLUMN_A; col <= COLUMNS.COLUMN_H; col++)
    {
      var square = colRowToSquares(col, row);
      ColumnsBrd[square] = col;
      RowsBrd[square] = row;
    }
  }
}

function initBoard120ToBoard64()
{
    var index = 0;
    var square64 = 0;

    ///sets values that should never be returned if operated correctly
    for (index = 0; index < BRD_SQ_NUM; index++)
    {
      board120ToBoard64[index] = 65;
    }
    for (index = 0; index < 64; index++)
    {
      board64ToBoard120[index] = 120;
    }

    //walks up the 120 sized board while setting its values and sets correct values for 64 sized board
    for (var row = ROWS.ROW_1; row <= ROWS.ROW_8; row++)
    {
      for (var col = COLUMNS.COLUMN_A; col <= COLUMNS.COLUMN_H; col++)
      {
        var square120 = colRowToSquares(col, row);
        board64ToBoard120[square64] = square120;
        board120ToBoard64[square120] = square64;
        square64++;
      }
    }


}

//gives keys for pieceKeys, sideKey, and castleKeys
function initHashKeys()
{
  var index = 0;

  for (index = 0; index < 14 * 120; index++)
  {
    pieceKeys[index] = RAND_32();
  }

  sideKey = RAND_32();

  for (index = 0; index < 16; index++)
  {
    castleKeys[index] = RAND_32();
  }
}

function init()
{
  console.log("init() called");
  initColumnsRowsBrd();
  initHashKeys();
  initBoard120ToBoard64();
}
