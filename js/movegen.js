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

function addCaptureMove (move) {
  gameBoard.moveList[gameBoard.moveListStart[gameBoard.play + 1]] = move;
  gameBoard.moveScores[gameBoard.moveListStart[gameBoard.play + 1]] = 0;
  gameBoard.moveListStart[gameBoard.play + 1]++;
}

function addQuietMove (move) {
  gameBoard.moveList[gameBoard.moveListStart[gameBoard.play + 1]] = move;
  gameBoard.moveScores[gameBoard.moveListStart[gameBoard.play + 1]] = 0;
  gameBoard.moveListStart[gameBoard.play + 1]++;
}

function addEnPassantMove (move) {
  gameBoard.moveList[gameBoard.moveListStart[gameBoard.play + 1]] = move;
  gameBoard.moveScores[gameBoard.moveListStart[gameBoard.play + 1]] = 0;
  gameBoard.moveListStart[gameBoard.play + 1]++;
}

function addWhitePawnCaptureMove(from, to, cap) {
  if (RowsBrd[from] == ROWS.ROW_7)
  {
    addCaptureMove(from, to, cap, PIECES.wQ, 0);
    addCaptureMove(from, to, cap, PIECES.wR, 0);
    addCaptureMove(from, to, cap, PIECES.wB, 0);
    addCaptureMove(from, to, cap, PIECES.wN, 0);
  } else
  {
    addCaptureMove(move(from, to, cap, PIECES.EMPTY, 0));
  }
}

function addBlackPawnCaptureMove(from, to, cap) {
  if (RowsBrd[from] == ROWS.ROW_2)
  {
    addCaptureMove(from, to, cap, PIECES.bQ, 0);
    addCaptureMove(from, to, cap, PIECES.bR, 0);
    addCaptureMove(from, to, cap, PIECES.bB, 0);
    addCaptureMove(from, to, cap, PIECES.bN, 0);
  } else
  {
    addCaptureMove(move(from, to, cap, PIECES.EMPTY, 0));
  }
}

function addWhitePawnQuietMove(from, to) {
  if (RowsBrd[from] == ROWS.ROW_7)
  {
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.wQ, 0);
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.wR, 0);
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.wB, 0);
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.wN, 0);
  } else
  {
    addQuietMove(move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
  }
}

function addBlackPawnQuietMove(from, to) {
  if (RowsBrd[from] == ROWS.ROW_2)
  {
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.bQ, 0);
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.bR, 0);
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.bB, 0);
    addCaptureMove(from, to, PIECES.EMPTY, PIECES.bN, 0);
  } else
  {
    addQuietMove(move(from, to, PIECES.EMPTY, PIECES.EMPTY, 0));
  }
}

function generateMoves() {
    gameBoard.moveListStart[gameBoard.play + 1] = gameBoard.moveListStart[gameBoard.play];

    var pieceType, pceNum, square, pceIndex, piece, t_square, direction;

    //------------------------------------white side pawn and castle------------------------------------
    if (gameBoard.side == PIECE_COLORS.WHITE)
    {
      pieceType = PIECES.wP;

      for (pceNum = 0; pceNum < gameBoard.pieceNum[pieceType]; pceNum++)
      {
        square = gameBoard.pieceList[pieceIndex(pieceType, pceNum)];

        //pawn moving forward
        if (gameBoard.pieces[square + 10] == PIECES.EMPTY)
        {
          addWhitePawnQuietMove(square, square + 10);

          if (RowsBrd[square] == ROWS.ROW_2 && gameBoard.pieces[square + 20] == PIECES.EMPTY)
          {
          addQuietMove(move(square, square + 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagPawnStart));
          }
        }
        //pawn capture to the left
        if (squareOffBoard(square + 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 9]] == PIECE_COLORS.BLACK)
        {
          addWhitePawnCaptureMove(move(square, square + 9, gameBoard.pieces[square + 9]));
        }
        //pawn capture to the right
        if (squareOffBoard(square + 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square + 11]] == PIECE_COLORS.BLACK)
        {
          addWhitePawnCaptureMove(move(square, square + 11, gameBoard.pieces[square + 11]));
        }
        //en passant capture
        if (gameBoard.enPas != SQUARES.NO_SQ)
        {
          if(square + 9 == gameBoard.enPas)
          {
            addEnPassantMove(move(square, square + 9, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPas));
          }

          if(square + 11 == gameBoard.enPas)
          {
            addEnPassantMove(move(square, square + 11, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPas));
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
            addQuietMove(move(SQUARES.E1, SQUARES.G1, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle));
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
            addQuietMove(move(SQUARES.E1, SQUARES.C1, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle));
          }
        }
      }
    } else {
      //------------------------------------black side pawn and castle------------------------------------
      pieceType = PIECES.bP;

      for (pceNum = 0; pceNum < gameBoard.pieceNum[pieceType]; pceNum++)
      {
        square = gameBoard.pieceList[pieceIndex(pieceType, pceNum)];

        if (gameBoard.pieces[square - 10] == PIECES.EMPTY)
        {
          addBlackPawnCaptureMove(square, square - 10);

          if (RowsBrd[square] == ROWS.ROW_7 && gameBoard.pieces[square - 20] == PIECES.EMPTY)
          {
          addQuietMove(move(square, square - 20, PIECES.EMPTY, PIECES.EMPTY, moveFlagPawnStart));
          }
        }
        //pawn capture to the left
        if (squareOffBoard(square - 9) == BOOL.FALSE && PieceCol[gameBoard.pieces[square - 9]] == PIECE_COLORS.WHITE)
        {
          addBlackPawnCaptureMove(move(square, square - 9, gameBoard.pieces[square + 9]));
        }
        //pawn capture to the right
        if (squareOffBoard(square - 11) == BOOL.FALSE && PieceCol[gameBoard.pieces[square - 11]] == PIECE_COLORS.WHITE)
        {
          addBlackPawnCaptureMove(move(square, square - 11, gameBoard.pieces[square + 9]));
        }
        //en passant capture
        if (gameBoard.enPas != SQUARES.NO_SQ)
        {
          if(square - 9 == gameBoard.enPas)
          {
            addEnPassantMove(move(square, square - 9, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPas));
          }

          if(square - 11 == gameBoard.enPas)
          {
            addEnPassantMove(move(square, square - 11, PIECES.EMPTY, PIECES.EMPTY, moveFlagEnPas));
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
            addQuietMove(move(SQUARES.E8, SQUARES.G8, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle));
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
            addQuietMove(move(SQUARES.E8, SQUARES.C8, PIECES.EMPTY, PIECES.EMPTY, moveFlagCastle));
          }
        }
      }
    }

    //------------------------------------non-sliding pieces------------------------------------
    pceIndex = loopNonSlideIndex[gameBoard.side];
    piece = loopNonSlidePiece[pceIndex++];

    while (piece != 0)
    {
      for (pceNum = 0; pceNum < gameBoard.pieceNum[piece]; pceNum++)
      {
        square = gameBoard.pieceList[pieceIndex(piece, pceNum)];

        for (index = 0; index < directionNum[piece]; index++)
        {
          direction = pieceDirection[piece][index];
          t_square = square + direction;

          if(squareOffBoard(t_square) == BOOL.TRUE)
          {
            continue;
          }

          if (gameBoard.pieces[t_square] != PIECES.EMPTY)
          {
            if (PieceCol[gameBoard.pieces[t_square]] != gameBoard.side)
            {
              addCaptureMove(move(square, t_square, gameBoard.pieces[t_square], PIECES.EMPTY, 0));
            }
          } else {
            addQuietMove(move(square, t_square, PIECES.EMPTY, PIECES.EMPTY, 0));
          }
        }
      }
      piece = loopNonSlidePiece[pceIndex++];
    }

    //------------------------------------sliding pieces------------------------------------
    pceIndex = loopSlideIndex[gameBoard.side];
    piece = loopSlidePiece[pceIndex++];

    while (piece != 0)
    {
      for (pceNum = 0; pceNum < gameBoard.pieceNum[piece]; pceNum++)
      {
        square = gameBoard.pieceList[pieceIndex(piece, pceNum)];

        for (index = 0; index < directionNum[piece]; index++)
        {
          direction = pieceDirection[piece][index];
          t_square = square + direction;

          while (squareOffBoard(t_square) == BOOL.FALSE)
          {
            if (gameBoard.pieces[t_square] != PIECES.EMPTY)
            {
              if (PieceCol[gameBoard.pieces[t_square]] != gameBoard.side)
              {
                addCaptureMove(move(square, t_square, gameBoard.pieces[t_square], PIECES.EMPTY, 0));
              }
              break;
            }
            addQuietMove(move(square, t_square, PIECES.EMPTY, PIECES.EMPTY, 0));
            t_sq += direction;
          }
        }
      }
      piece = loopSlidePiece[pceIndex++];
    }
}
