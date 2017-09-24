/*
Will largely use bitwise operations
board squares encompass 21-98, therefore we will use 7 bits to store to and from values
0000 0000 0000 0000 0000 0111 1111 = 0x7F = 127, 127 > 98

0000 0000 0000 0000 0000 0111 1111 From 0x7F
0000 0000 0000 0011 1111 1000 0000 To >> 7, 0x7F
0000 0000 0011 1100 0000 0000 0000 Captured >> 14, 0xF
0000 0000 0100 0000 0000 0000 0000 En passant & 0x40000
0000 0000 1000 0000 0000 0000 0000 Pawn start 0x80000
0000 1111 0000 0000 0000 0000 0000 Promoted piece (N, B, R, Q) >> 20, 0xF
0001 0000 0000 0000 0000 0000 0000 Castle 0x1000000
*/

function move(from, to, captured, promoted, flag)
{
  return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function generateMoves()
{
    gameBoard.moveListStart[gameBoard.play + 1] = gameBoard.moveListStart[gameBoard.play];

    var pieceType, pceNum, square;

    if (gameBoard.side == PIECE_COLORS.WHITE)
    {
      pieceType = PICES.wP;

      for (pceNum = 0; pceNum < gameBoard.pieceNum[pieceType]; piceType++)
      {
        square = gameBoard.pieceList[pieceIndex(pieceType, pceNum)];

        //pawn moving forward
        if (gameBoard.pieces[sq + 10] == PIECES.EMPTY)
        {
          //add pawn move
          if (RowsBrd[square] == ROWS.ROW_2 && gameBoard.pieces[square + 20] == PIECES.EMPTY)
          {
          //add quiet pawn move
          }
        }
        //pawn capture to the left
        if (squareOffBoard(square + 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 9]] == PIECE_COLORS.BLACK)
        {
          // add pawn cap move
        }
        //pawn capture to the right
        if (squareOffBoard(square + 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 11]] == PIECE_COLORS.BLACK)
        {
          // add pawn cap move
        }
        //en passant capture
        if (gameBoard.enPas != SQUARES.NO_SQ)
        {
          if(square + 9 == gameBoard.enPas)
          {
            //add enpas capture move
          }

          if(square + 11 == gameBoard.enPas)
          {
            //add enpas capture move
          }
        }
        {
          // add pawn cap move
        }
      }
      pceType = PIECES.wN;
    } else {
      pieceType = PICES.bP;

      for (pceNum = 0; pceNum < gameBoard.pieceNum[pieceType]; piceType++)
      {
        square = gameBoard.pieceList[pieceIndex(pieceType, pceNum)];

        //pawn moving forward
        if (gameBoard.pieces[sq - 10] == PIECES.EMPTY)
        {
          //add pawn move
          if (RowsBrd[square] == ROWS.ROW_7 && gameBoard.pieces[square - 20] == PIECES.EMPTY)
          {
          //add quiet pawn move
          }
        }
        //pawn capture to the left
        if (squareOffBoard(square - 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square - 9]] == PIECE_COLORS.WHITE)
        {
          // add pawn cap move
        }
        //pawn capture to the right
        if (squareOffBoard(square - 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square - 11]] == PIECE_COLORS.WHITE)
        {
          // add pawn cap move
        }
        //en passant capture
        if (gameBoard.enPas != SQUARES.NO_SQ)
        {
          if(square - 9 == gameBoard.enPas)
          {
            //add enpas capture move
          }

          if(square - 11 == gameBoard.enPas)
          {
            //add enpas capture move
          }
        }
        {
          // add pawn cap move
        }
      }
      pceType = PIECES.bN;
    }
}
