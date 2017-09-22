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

var ColumnsBrd = new Array(BRD_SQ_NUM);
var RowsBrd = new Array(BRD_SQ_NUM);

//Squares starts at value 21
//anything before is offboard
function colRowToSquares(col, row) {
  return ((21 + col) + (row * 10));
}
