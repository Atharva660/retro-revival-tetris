import { Board, Tetromino, Position, BOARD_WIDTH, BOARD_HEIGHT } from '../types/tetris';
import { checkCollision, mergePieceToBoard, rotatePiece } from './gameLogic';

export interface MoveEvaluation {
  position: Position;
  rotation: number;
  score: number;
}

export function evaluatePosition(board: Board, piece: Tetromino, position: Position): number {
  // Merge piece to board temporarily
  const tempBoard = mergePieceToBoard(board, piece, position);
  
  let score = 0;
  
  // Calculate column heights
  const heights: number[] = [];
  for (let col = 0; col < BOARD_WIDTH; col++) {
    let height = 0;
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (tempBoard[row][col] !== null) {
        height = BOARD_HEIGHT - row;
        break;
      }
    }
    heights.push(height);
  }
  
  // a. Aggregate height
  const aggregateHeight = heights.reduce((sum, height) => sum + height, 0);
  score += aggregateHeight * -0.5;
  
  // b. Holes
  let holes = 0;
  for (let col = 0; col < BOARD_WIDTH; col++) {
    let foundFilled = false;
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      if (tempBoard[row][col] !== null) {
        foundFilled = true;
      } else if (foundFilled && tempBoard[row][col] === null) {
        holes++;
      }
    }
  }
  score += holes * -35;
  
  // c. Bumpiness
  let bumpiness = 0;
  for (let col = 0; col < BOARD_WIDTH - 1; col++) {
    bumpiness += Math.abs(heights[col] - heights[col + 1]);
  }
  score += bumpiness * -2;
  
  // d. Complete lines
  let completeLines = 0;
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    let isComplete = true;
    for (let col = 0; col < BOARD_WIDTH; col++) {
      if (tempBoard[row][col] === null) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      completeLines++;
    }
  }
  score += completeLines * 100;
  
  return score;
}

export function findBestMove(board: Board, piece: Tetromino): MoveEvaluation | null {
  let bestMove: MoveEvaluation | null = null;
  let bestScore = -Infinity;
  
  // Try all 4 rotations
  let currentPiece = piece;
  
  for (let rotation = 0; rotation < 4; rotation++) {
    // Try all horizontal positions
    for (let x = -2; x <= BOARD_WIDTH + 2; x++) {
      // Drop piece down until collision
      let y = 0;
      
      // Find the lowest valid position
      while (y < BOARD_HEIGHT && !checkCollision(board, currentPiece, { x, y })) {
        y++;
      }
      
      // Step back to last valid position
      y--;
      
      // If we found a valid position
      if (y >= 0 && !checkCollision(board, currentPiece, { x, y })) {
        const finalPosition: Position = { x, y };
        const score = evaluatePosition(board, currentPiece, finalPosition);
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = {
            position: finalPosition,
            rotation,
            score
          };
        }
      }
    }
    
    // Rotate piece for next iteration (use the rotatePiece function from gameLogic)
    currentPiece = rotatePiece(currentPiece);
  }
  
  return bestMove;
}