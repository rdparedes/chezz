import { createPiece, EMPTY_SQUARE, getPieceColor, getPieceType, Rank, type Piece } from './piece';

export type BoardState = {
  pieces?: Piece[];
};

/**
 * Converts a board represented as a string to a BoardState.
 *
 * @param boardStr the board state represented as a string. Ex: "rnbqkbnr\npppppppp\n........\n........\n........\n........\nPPPPPPPP\nRNBQKBNR"
 */
export function toBoardState(boardStr: string): BoardState {
  const pieces = boardStr.split('').reduce((acc, char, index) => {
    if (char === EMPTY_SQUARE || char === '\n') {
      return acc;
    }
    const color = getPieceColor(char);
    const pieceType = getPieceType(char);
    const file = index % 9;
    const rank = Math.floor(index / 9);
    return [...acc, createPiece(color, pieceType, file, rank)];
  }, []);
  return { pieces };
}
