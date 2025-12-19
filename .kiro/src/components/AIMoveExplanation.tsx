import React from 'react';
import { MoveEvaluation } from '../utils/aiHelper';

interface AIMoveExplanationProps {
  aiMove: MoveEvaluation | null;
}

 const AIMoveExplanation: React.FC<AIMoveExplanationProps> = ({ aiMove }) => {
  if (!aiMove) {
    return (
      <div className="backdrop-blur-md bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">💡</span>
          <h3 className="text-sm font-bold text-white">AI Suggestion</h3>
        </div>
        <p className="text-xs text-gray-400">Enable AI to see suggestions</p>
      </div>
    );
  }

  const getRotationText = (rotation: number) => {
    const rotations = ['No rotation', '90° clockwise', '180°', '270° clockwise'];
    return rotations[rotation] || 'Unknown';
  };

  const getScoreColor = (score: number) => {
    if (score > 50) return 'text-green-400';
    if (score > 0) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">💡</span>
        <h3 className="text-sm font-bold text-white">AI Recommendation</h3>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Position:</span>
          <span className="text-white font-mono">
            X: {aiMove.position.x}, Y: {aiMove.position.y}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">Rotation:</span>
          <span className="text-white">{getRotationText(aiMove.rotation)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">AI Score:</span>
          <span className={`font-bold ${getScoreColor(aiMove.score)}`}>
            {aiMove.score.toFixed(1)}
          </span>
        </div>

        <div className="mt-3 p-2 bg-gray-900/50 rounded">
          <div className="text-gray-400 text-xs mb-1">Why this move?</div>
          <ul className="text-xs text-gray-300 space-y-1">
            {aiMove.score > 50 && <li>✓ Creates line clear opportunity</li>}
            {aiMove.score > 0 && <li>✓ Minimizes holes</li>}
            {aiMove.score > 20 && <li>✓ Keeps stack low</li>}
            {aiMove.score < 0 && <li>⚠ Limited options available</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIMoveExplanation;