import React from 'react';
import { Tetromino } from '../types/tetris';

interface GameControlsProps {
  score: number;
  lines: number;
  level: number;
  nextPiece: Tetromino | null;
  aiEnabled: boolean;
  isPaused: boolean;
  gameOver: boolean;
  onToggleAI: () => void;
  onTogglePause: () => void;
  onNewGame: () => void;
}
console.log("GAME CONTROLS LOADED");
export const GameControls: React.FC<GameControlsProps> = ({
  score,
  lines,
  level,
  nextPiece,
  aiEnabled,
  isPaused,
  gameOver,
  onToggleAI,
  onTogglePause,
  onNewGame,
}) => {
  const renderNextPiece = () => {
    if (!nextPiece) return null;

    const grid = Array(4).fill(null).map(() => Array(4).fill(false));
    
    nextPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          grid[y][x] = true;
        }
      });
    });

    return (
      <div className="grid grid-cols-4 gap-1 w-16 h-16">
        {grid.flat().map((filled, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-sm ${
              filled
                ? 'bg-blue-500'
                : 'bg-white/5'
            }`}
            style={filled && nextPiece ? { backgroundColor: nextPiece.color } : {}}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-6 space-y-6">
      {gameOver && (
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">GAME OVER</div>
        </div>
      )}

      {/* Score Section */}
      <div className="text-center">
        <div className="text-sm text-white/70 mb-1">SCORE</div>
        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {score.toLocaleString()}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-xs text-white/70">LINES</div>
          <div className="text-xl font-bold text-white">{lines}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-white/70">LEVEL</div>
          <div className="text-xl font-bold text-white">{level}</div>
        </div>
      </div>

      {/* Next Piece Preview */}
      <div className="text-center">
        <div className="text-sm text-white/70 mb-2">NEXT</div>
        <div className="flex justify-center">
          {renderNextPiece()}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        <button
          onClick={onToggleAI}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            aiEnabled
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}
        >
          🤖 AI: {aiEnabled ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={onTogglePause}
          className="w-full py-2 px-4 rounded-lg font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>

        <button
          onClick={onNewGame}
          className="w-full py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600 transition-colors"
        >
          NEW GAME
        </button>
      </div>

      {/* Controls Instructions */}
      <div className="text-xs text-white/60 space-y-1">
        <div className="text-center text-white/80 font-medium mb-2">CONTROLS</div>
        <div>← → : Move</div>
        <div>↑ : Rotate</div>
        <div>↓ : Soft Drop</div>
        <div>SPACE : Hard Drop</div>
        <div>P : Pause</div>
      </div>
    </div>
  );
};

export default GameControls;