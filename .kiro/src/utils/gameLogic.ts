import { Board, Tetromino, Position, TetrominoType, TETROMINOES, BOARD_WIDTH, BOARD_HEIGHT } from '../types/tetris';

export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

export function checkCollision(board: Board, piece: Tetromino, position: Position): boolean {
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const newRow = position.y + row;
        const newCol = position.x + col;
        
        if (newRow < 0 || newRow >= BOARD_HEIGHT || newCol < 0 || newCol >= BOARD_WIDTH) {
          return true;
        }
        
        if (board[newRow][newCol] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

export function mergePieceToBoard(board: Board, piece: Tetromino, position: Position): Board {
  const newBoard = board.map(row => [...row]);
  
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col]) {
        const newRow = position.y + row;
        const newCol = position.x + col;
        newBoard[newRow][newCol] = piece.color;
      }
    }
  }
  
  return newBoard;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const linesCleared = board.filter(row => row.every(cell => cell !== null)).length;
  
  const newBoard = board.filter(row => !row.every(cell => cell !== null));
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { board: newBoard, linesCleared };
}

export function rotatePiece(piece: Tetromino): Tetromino {
  const shape = piece.shape;
  const rows = shape.length;
  const cols = shape[0].length;
  
  const rotatedShape = Array(cols).fill(null).map(() => Array(rows).fill(false));
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      rotatedShape[col][rows - 1 - row] = shape[row][col];
    }
  }
  
  return {
    ...piece,
    shape: rotatedShape
  };
}

export function generateRandomPiece(): Tetromino {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return TETROMINOES[randomType];
}

export function isValidMove(board: Board, piece: Tetromino, position: Position): boolean {
  return !checkCollision(board, piece, position);
}
