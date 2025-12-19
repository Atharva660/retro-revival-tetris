import React from 'react';
import { Board, Tetromino, Position, BOARD_WIDTH, BOARD_HEIGHT } from '../types/tetris';

interface GameBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
  currentPosition: Position;
  ghostPosition: Position | null;
  aiSuggestion: Position | null;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  currentPosition,
  ghostPosition,
  aiSuggestion,
}) => {
  const getCellColor = (row: number, col: number): string => {
    // Check if this cell is part of the current piece
    if (currentPiece) {
      for (let pieceRow = 0; pieceRow < currentPiece.shape.length; pieceRow++) {
        for (let pieceCol = 0; pieceCol < currentPiece.shape[pieceRow].length; pieceCol++) {
          if (
            currentPiece.shape[pieceRow][pieceCol] &&
            currentPosition.y + pieceRow === row &&
            currentPosition.x + pieceCol === col
          ) {
            return currentPiece.color;
          }
        }
      }
    }



    // Check if this cell is part of the AI suggestion
    if (aiSuggestion && currentPiece) {
      for (let pieceRow = 0; pieceRow < currentPiece.shape.length; pieceRow++) {
        for (let pieceCol = 0; pieceCol < currentPiece.shape[pieceRow].length; pieceCol++) {
          if (
            currentPiece.shape[pieceRow][pieceCol] &&
            aiSuggestion.y + pieceRow === row &&
            aiSuggestion.x + pieceCol === col
          ) {
            return '#10b981'; // green-500
          }
        }
      }
    }

    // Check if this cell is part of the ghost piece
    if (ghostPosition && currentPiece) {
      for (let pieceRow = 0; pieceRow < currentPiece.shape.length; pieceRow++) {
        for (let pieceCol = 0; pieceCol < currentPiece.shape[pieceRow].length; pieceCol++) {
          if (
            currentPiece.shape[pieceRow][pieceCol] &&
            ghostPosition.y + pieceRow === row &&
            ghostPosition.x + pieceCol === col
          ) {
            return '#6b7280'; // gray-500
          }
        }
      }
    }

    // Return board cell color or default empty color
    return board[row][col] || '#111827'; // bg-gray-900
  };

  const getCellClasses = (row: number, col: number): string => {
    let classes = 'w-8 h-8 border border-gray-700';

    // Check if this cell is part of the AI suggestion
    if (aiSuggestion && currentPiece) {
      for (let pieceRow = 0; pieceRow < currentPiece.shape.length; pieceRow++) {
        for (let pieceCol = 0; pieceCol < currentPiece.shape[pieceRow].length; pieceCol++) {
          if (
            currentPiece.shape[pieceRow][pieceCol] &&
            aiSuggestion.y + pieceRow === row &&
            aiSuggestion.x + pieceCol === col
          ) {
            classes += ' animate-pulse shadow-lg shadow-green-500/50 border-2 border-green-400';
          }
        }
      }
    }

    // Check if this cell is part of the ghost piece
    if (ghostPosition && currentPiece) {
      for (let pieceRow = 0; pieceRow < currentPiece.shape.length; pieceRow++) {
        for (let pieceCol = 0; pieceCol < currentPiece.shape[pieceRow].length; pieceCol++) {
          if (
            currentPiece.shape[pieceRow][pieceCol] &&
            ghostPosition.y + pieceRow === row &&
            ghostPosition.x + pieceCol === col
          ) {
            classes += ' opacity-30';
          }
        }
      }
    }

    return classes;
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-2xl shadow-cyan-500/20 border border-gray-600">
      <div className="grid gap-1 p-2 bg-black rounded border-2 border-cyan-400 shadow-lg shadow-cyan-400/30" 
           style={{ gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))` }}>
        {Array.from({ length: BOARD_HEIGHT }, (_, row) =>
          Array.from({ length: BOARD_WIDTH }, (_, col) => (
            <div
              key={`${row}-${col}`}
              className={getCellClasses(row, col)}
              style={{ backgroundColor: getCellColor(row, col) }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;