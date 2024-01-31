import { loadImage } from 'src/lib/loadImage';

export enum Rank {
  Eight = 0,
  Seven = 1,
  Six = 2,
  Five = 3,
  Four = 4,
  Three = 5,
  Two = 6,
  One = 7,
}

export enum File {
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
}

export enum PieceColor {
  Black = 'black',
  White = 'white',
}

export enum PieceType {
  Pawn = 'pawn',
  Bishop = 'bishop',
  Knight = 'knight',
  Rook = 'rook',
  Queen = 'queen',
  King = 'king',
}

export const SQUARE_SIZE = 96;
export const EMPTY_SQUARE = '.';
export const BLACK_PIECES = 'rnbqkp';
export const WHITE_PIECES = 'RNBQKP';

const HALF_SQUARE_SIZE = SQUARE_SIZE / 2;
const PIECE_SCALE_FACTOR = 0.22;

const whitePawnImage = await loadImage('src/assets/w_pawn_1x.png');
const whiteBishopImage = await loadImage('src/assets/w_bishop_1x.png');
const whiteKnightImage = await loadImage('src/assets/w_knight_1x.png');
const whiteRookImage = await loadImage('src/assets/w_rook_1x.png');
const whiteQueenImage = await loadImage('src/assets/w_queen_1x.png');
const whiteKingImage = await loadImage('src/assets/w_king_1x.png');
const blackPawnImage = await loadImage('src/assets/b_pawn_1x.png');
const blackBishopImage = await loadImage('src/assets/b_bishop_1x.png');
const blackKnightImage = await loadImage('src/assets/b_knight_1x.png');
const blackRookImage = await loadImage('src/assets/b_rook_1x.png');
const blackQueenImage = await loadImage('src/assets/b_queen_1x.png');
const blackKingImage = await loadImage('src/assets/b_king_1x.png');

const charToPieceType = {
  p: PieceType.Pawn,
  b: PieceType.Bishop,
  n: PieceType.Knight,
  r: PieceType.Rook,
  q: PieceType.Queen,
  k: PieceType.King,
};

type PieceResource = {
  image: HTMLImageElement;
  width: number;
  height: number;
};

function createPieceResource(image: HTMLImageElement): PieceResource {
  return {
    image: image,
    width: image.width * PIECE_SCALE_FACTOR,
    height: image.height * PIECE_SCALE_FACTOR,
  };
}

export const WHITES = {
  pawn: createPieceResource(whitePawnImage),
  bishop: createPieceResource(whiteBishopImage),
  knight: createPieceResource(whiteKnightImage),
  rook: createPieceResource(whiteRookImage),
  queen: createPieceResource(whiteQueenImage),
  king: createPieceResource(whiteKingImage),
};

export const BLACKS = {
  pawn: createPieceResource(blackPawnImage),
  bishop: createPieceResource(blackBishopImage),
  knight: createPieceResource(blackKnightImage),
  rook: createPieceResource(blackRookImage),
  queen: createPieceResource(blackQueenImage),
  king: createPieceResource(blackKingImage),
};

export function getPieceType(p: string): PieceType {
  return charToPieceType[p.toLowerCase()];
}

export function getPieceColor(p: string) {
  return BLACK_PIECES.includes(p) ? PieceColor.Black : PieceColor.White;
}

export type Piece = {
  file: File;
  rank: Rank;
  resource: PieceResource;
};

export function createPiece(color: PieceColor, pieceType: PieceType, startingFile: File, startingRank: Rank): Piece {
  let resource: PieceResource;
  switch (color) {
    case PieceColor.Black:
      resource = BLACKS[pieceType];
      break;
    case PieceColor.White:
      resource = WHITES[pieceType];
      break;
  }
  return {
    file: startingFile,
    rank: startingRank,
    resource,
  };
}

export function drawPiece(p: Piece, canvasContext: CanvasRenderingContext2D) {
  const leftPadding = (HALF_SQUARE_SIZE - p.resource.width / 2);
  const x = p.file * SQUARE_SIZE + leftPadding;
  const topPadding = (HALF_SQUARE_SIZE - p.resource.height / 2);
  const y = p.rank * SQUARE_SIZE + topPadding;
  canvasContext.drawImage(p.resource.image, x, y, p.resource.width, p.resource.height);
}
