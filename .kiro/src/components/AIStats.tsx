import React from 'react';

interface AIStatsProps {
  movesFollowed: number;
  totalMoves: number;
  aiScore: number;
  currentScore: number;
}

export const AIStats: React.FC<AIStatsProps> = ({ movesFollowed, totalMoves, aiScore, currentScore }) => {
  const accuracy = totalMoves > 0 ? Math.round((movesFollowed / totalMoves) * 100) : 0;
  const scoreDiff = currentScore - aiScore;

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <h3 className="text-lg font-bold text-white">AI Assistant Stats</h3>
      </div>

      <div className="space-y-3">
        {/* AI Follow Rate */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">AI Follow Rate</span>
            <span className="text-green-400 font-bold">{accuracy}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {movesFollowed} / {totalMoves} suggestions followed
          </div>
        </div>

        {/* Score Comparison */}
        <div>
          <div className="text-sm text-gray-300 mb-1">Score Difference</div>
          <div className={`text-2xl font-bold ${scoreDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {scoreDiff >= 0 ? '+' : ''}{scoreDiff}
          </div>
          <div className="text-xs text-gray-400">
            {scoreDiff >= 0 ? 'You\'re ahead!' : 'AI would be ahead'}
          </div>
        </div>

        {/* AI Confidence */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-xs text-gray-400">Your Score</div>
            <div className="text-lg font-bold text-white">{currentScore}</div>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <div className="text-xs text-gray-400">AI Score</div>
            <div className="text-lg font-bold text-blue-400">{aiScore}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStats;