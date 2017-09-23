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

//prints the board to the console for debugging purposes
function printBoard()
{
  var square, col, row, piece;
  console.log("\nGame Board:\n");

  for (row = ROWS.ROW_8; row >= ROWS.ROW_1; row--)
  {
    var line = rowChar[row] + " ";
    for (col = COLUMNS.COLUMN_A; col <= COLUMNS.COLUMN_H; col++)
    {
      square = colRowToSquares(col, row);
      piece = gameBoard.pieces[square];
      line += " " + pieceChar[piece] + " ";
    }
    console.log(line);
  }

  console.log("");
  var line = "  ";
  for (col = COLUMNS.COLUMN_A; col <= COLUMNS.COLUMN_H; col++)
  {
    line += ' ' + columnChar[col] + ' ';
  }

  console.log(line);
  console.log("Side: " + sideChar[gameBoard.side]);
  console.log("En Passant: " + gameBoard.enPas);
  line = "";

  if(gameBoard.castlePerm & CASTLEBIT.WKCA)
  {
    line += 'K';
  }
  if(gameBoard.castlePerm & CASTLEBIT.WQCA)
  {
    line += 'Q';
  }
  if(gameBoard.castlePerm & CASTLEBIT.BKCA)
  {
    line += 'k';
  }
  if(gameBoard.castlePerm & CASTLEBIT.BQCA)
  {
    line += 'q';
  }
  console.log("Castle: " + line);
  console.log("Key: " + gameBoard.posKey.toString(16));
}

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

function printPieceLists() {
  var piece, pceNum;

  for (piece = PIECES.wP; piece <= PIECES.bK; piece++)
  {
    for (pceNum = 0; pceNum < gameBoard.pieceNum[piece]; pceNum++)
    {
      console.log("Piece " + pieceChar[piece] + " on " + printSquare(gameBoard.pieceList[pieceIndex(piece, pceNum)]));
    }
  }
}

function updateListsMaterial()
{
    var piece, square, index, color;

    for (index = 0; index < 14 * 120; index++)
    {
      //resets all the pieces to empty
      gameBoard.pieceList[index] = PIECES.EMPTY;

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

    for (index = 0; index < 64; index++)
    {
      square = getBoard120(index);
      piece = gameBoard.pieces[square];
      if(piece != PIECES.EMPTY)
      {
        color = PieceCol[piece];
        gameBoard.material[color] += PieceVal[piece];
        gameBoard.pieceList[getPieceIndex(piece, gameBoard.pieceNum[piece])] = square;
        gameBoard.pieceNum[piece]++;
      }
    }
}
function resetBoard()
{
  var index = 0;

  for (index = 0; index < BRD_SQ_NUM; index++)
  {
    gameBoard.pieces[index] = SQUARES.OFFBOARD;
    //takes care of the 64 size board
    if ( index < 64)
    {
      gameBoard.pieces[getBoard120(index)] = PIECES.EMPTY;
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

//starting fen ex.
//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
function parseFen(fen)
{
  resetBoard();

  var row = ROWS.ROW_8;
  var col = COLUMNS.COLUMN_A;
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
                count = fen[fenCount].charCodeAt() - '0'.charCodeAt();
                break;
      case '/':
      case ' ':
                row--;
                col = COLUMNS.COLUMN_A;
                fenCount++;
                continue;
      default:
                console.log("FEN error");
                return;
    }

    for (i = 0; i < count; i++)
    {
      square120 = colRowToSquares(col, row);
      gameBoard.pieces[square120] = piece;
      col++;
    }
    fenCount++;
  } //while loop end

  //which side moves next
  gameBoard.side = (fen[fenCount] == 'w') ? PIECE_COLORS.WHITE : PIECE_COLORS.BLACK;
  fenCount += 2;

  //handles castling permission using bitwise |
  for (i = 0; i < 4; i++)
  {
    if (fen[fenCount] == ' ')
    {
      break;
    }
    switch (fen[fenCount])
    {
      case 'K': gameBoard.castlePerm |= CASTLEBIT.WKCA;
                break;
      case 'Q': gameBoard.castlePerm |= CASTLEBIT.WQCA;
                break;
      case 'k': gameBoard.castlePerm |= CASTLEBIT.BKCA;
                break;
      case 'q': gameBoard.castlePerm |= CASTLEBIT.BQCA;
                break;
      default:
                break;
    }
    fenCount++;
  }

  //handles en passant
  fenCount++;

  if (fen[fenCount] != '-')
  {
    col = fen[fenCount].charCodeAt() - 'a'.charCodeAt();
    row = fen[fenCount + 1].charCodeAt() - '1'.charCodeAt();
    console.log("fen[fenCount]: " + fen[fenCount] + " Column: " + col + " Row: " + row);
    gameBoard.enPas = colRowToSquares(col, row);
  }

  gameBoard.posKey = generatePositionKey();
  updateListsMaterial();
  printSquareAttacked();
}

//prints squares attacked for deg=bugging purposes
function printSquareAttacked() {

	var square, col, row, piece;

	console.log("\nAttacked:\n");

	for(row = ROWS.ROW_8; row >= ROWS.ROW_1; row--) {
		var line =((row+1) + "  ");
		for(col = COLUMNS.COLUMN_A; col <= COLUMNS.COLUMN_H; col++) {
			square = colRowToSquares(col, row);
			if(squareAttacked(square, gameBoard.side) == BOOL.TRUE) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		console.log(line);
	}

	console.log("");

}

function squareAttacked(square, side) {
  var piece, t_square, index;

  //pawn attack
  if(side == PIECE_COLORS.WHITE)
  {
    if (gameBoard.pieces[square - 11] == PIECES.wP || gameBoard.pieces[square - 9] == PIECES.wP)
    return BOOL.TRUE;
  } else {
    if(side == PIECE_COLORS.BLACK)
    {
      if (gameBoard.pieces[square + 11] == PIECES.bP || gameBoard.pieces[square + 9] == PIECES.bP)
      return BOOL.TRUE;
    }
  }

  //knight attack
  for (index = 0; index < 8; index++)
  {
    piece = gameBoard.pieces[square + knightDirection[index]];
    if (piece != SQUARES.OFFBOARD && PieceCol[piece] == side && PieceKnight[piece] == BOOL.TRUE)
    {
      return BOOL.TRUE;
    }
  }

  //rook & queen attack
  for (index = 0; index < 4; index++)
  {
    var dir = rookDirection[index];
    t_square = square + dir;
    piece = gameBoard.pieces[t_square];
    while (piece != SQUARES.OFFBOARD)
    {
      if (piece != PIECES.EMPTY)
      {
        if (PieceRookQueen[piece] == BOOL.TRUE && PieceCol[piece] == side)
        {
          return BOOL.TRUE;
        }
        break;
      }
      t_square += dir;
      piece = gameBoard.pieces[t_square];
    }
  }

  //bishop & queen attack
  for (index = 0; index < 4; index++)
  {
    var dir = bishopDirection[index];
    t_square = square + dir;
    piece = gameBoard.pieces[t_square];
    while (piece != SQUARES.OFFBOARD)
    {
      if (piece != PIECES.EMPTY)
      {
        if (PieceBishopQueen[piece] == BOOL.TRUE && PieceCol[piece] == side)
        {
          return BOOL.TRUE;
        }
        break;
      }
      t_square += dir;
      piece = gameBoard.pieces[t_square];
    }
  }

  //king attack
  for (index = 0; index < 8; index++)
  {
    piece = gameBoard.pieces[square + kingDirection[index]];
    if (piece != SQUARES.OFFBOARD && PieceCol[piece] == side && PieceKing[piece] == BOOL.TRUE)
    {
      return BOOL.TRUE;
    }
  }
  return BOOL.FALSE;

}
