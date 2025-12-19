// Tetromino types
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

// Position interface
export interface Position {
  x: number;
  y: number;
}

// Tetromino interface
export interface Tetromino {
  shape: boolean[][];
  color: string;
  type: TetrominoType;
}

// Board constants
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Board type - each cell can contain a color string or be null (empty)
export type Board = (string | null)[][];

// Tetrominoes constant
export const TETROMINOES: Record<TetrominoType, Tetromino> = {
  I: {
    shape: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false]
    ],
    color: '#00f0f0',
    type: 'I'
  },
  O: {
    shape: [
      [true, true],
      [true, true]
    ],
    color: '#f0f000',
    type: 'O'
  },
  T: {
    shape: [
      [false, true, false],
      [true, true, true],
      [false, false, false]
    ],
    color: '#a000f0',
    type: 'T'
  },
  S: {
    shape: [
      [false, true, true],
      [true, true, false],
      [false, false, false]
    ],
    color: '#00f000',
    type: 'S'
  },
  Z: {
    shape: [
      [true, true, false],
      [false, true, true],
      [false, false, false]
    ],
    color: '#f00000',
    type: 'Z'
  },
  J: {
    shape: [
      [true, false, false],
      [true, true, true],
      [false, false, false]
    ],
    color: '#0000f0',
    type: 'J'
  },
  L: {
    shape: [
      [false, false, true],
      [true, true, true],
      [false, false, false]
    ],
    color: '#f0a000',
    type: 'L'
  }
};

// Game state interface
export interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  position: Position;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
}
