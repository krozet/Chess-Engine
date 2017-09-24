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


function generateMoves() {
    gameBoard.moveListStart[gameBoard.play + 1] = gameBoard.moveListStart[gameBoard.play];

    var pieceType, pceNum, square, pceIndex, piece, t_square;

    ///white side
    if (gameBoard.side == PIECE_COLORS.WHITE)
    {
      pieceType = PIECES.wP;

      for (pceNum = 0; pceNum < gameBoard.pieceNum[pieceType]; pceNum++)
      {
        square = gameBoard.pieceList[pieceIndex(pieceType, pceNum)];

        //pawn moving forward
        if (gameBoard.pieces[square + 10] == PIECES.EMPTY)
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
      }

      //generate kingside castle moves
      if (gameBoard.castlePerm & CASTLEBIT.WKCA)
      {
        if (gameBoard.pieces[SQUARES.F1] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G1] == PIECES.EMPTY)
        {
          if (squareAttacked(SQUARES.F1, PIECE_COLORS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E1, PIECE_COLORS.BLACK) == BOOL.FALSE)
          {
            //add quiet move
          }
        }
      }

      //generate queenside castle move
      if (gameBoard.castlePerm & CASTLEBIT.WQCA)
      {
        if (gameBoard.pieces[SQUARES.D1] == PIECES.EMPTY
         && gameBoard.pieces[SQUARES.C1] == PIECES.EMPTY
         && gameBoard.pieces[SQUARES.B1] == PIECES.EMPTY)
        {
          if (squareAttacked(SQUARES.D1, PIECE_COLORS.BLACK) == BOOL.FALSE && squareAttacked(SQUARES.E1, PIECE_COLORS.BLACK) == BOOL.FALSE)
          {
            //add quiet move
          }
        }
      }
    } else {
      ///black side
      pieceType = PICES.bP;

      for (pceNum = 0; pceNum < gameBoard.pieceNum[pieceType]; pceNum++)
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
      }

      //generate kingside castle move
      if (gameBoard.castlePerm & CASTLEBIT.BKCA)
      {
        if (gameBoard.pieces[SQUARES.F8] == PIECES.EMPTY && gameBoard.pieces[SQUARES.G8] == PIECES.EMPTY)
        {
          if (squareAttacked(SQUARES.F8, PIECE_COLORS.WHITE) == BOOL.FALSE && squareAttacked(SQUARES.E8, PIECE_COLORS.WHITE) == BOOL.FALSE)
          {
            //add quiet move
          }
        }
      }

      //generate queenside castle move
      if (gameBoard.castlePerm & CASTLEBIT.BQCA)
      {
        if (gameBoard.pieces[SQUARES.D8] == PIECES.EMPTY
         && gameBoard.pieces[SQUARES.C8] == PIECES.EMPTY
         && gameBoard.pieces[SQUARES.B8] == PIECES.EMPTY)
        {
          if (squareAttacked(SQUARES.D8, PIECE_COLORS.WHITE) == BOOL.FALSE && squareAttacked(SQUARES.E8, PIECE_COLORS.WHITE) == BOOL.FALSE)
          {
            //add quiet move
          }
        }
      }
    }
}
