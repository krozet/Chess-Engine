$(function()
{
  init();
  console.log("Main Init Called");
});

function initFilesRanksBrd()
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
  console.log("ColumnsBrd[0]:" + ColumnsBrd[0] + " RowsBrd[0]" + RowsBrd[0]);
  console.log("ColumnsBrd[SQUARES.A1]:" + ColumnsBrd[SQUARES.A1] + " RowsBrd[SQUARES.A1]" + RowsBrd[SQUARES.A1]);
  console.log("ColumnsBrd[SQUARES.E8]:" + ColumnsBrd[SQUARES.E8] + " RowsBrd[SQUARES.E8]" + RowsBrd[SQUARES.E8]);
}
function init()
{

  console.log("init() called");
    initFilesRanksBrd();
}
