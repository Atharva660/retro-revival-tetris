import React, { useState, useEffect, useCallback } from 'react';
import { Board, Tetromino, Position } from './types/tetris';
import {
  createEmptyBoard,
  generateRandomPiece,
  isValidMove,
  mergePieceToBoard,
  clearLines,
  rotatePiece,
  checkCollision
} from './utils/gameLogic';
import { findBestMove } from './utils/aiHelper';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import AIStats from './components/AIStats';
import AIMoveExplanation from './components/AIMoveExplanation';

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [currentPosition, setCurrentPosition] = useState<Position>({ x: 3, y: 0 });
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
  const [ghostPosition, setGhostPosition] = useState<Position | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<Position | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [aiEnabled, setAiEnabled] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [movesFollowed, setMovesFollowed] = useState(0);
const [totalMoves, setTotalMoves] = useState(0);
const [aiScore, setAiScore] = useState(0);
const [lastAISuggestion, setLastAISuggestion] = useState<Position | null>(null);

  const executeAIMove = useCallback(() => {
  if (!currentPiece || !aiSuggestion) return;

  const bestMove = findBestMove(board, currentPiece);
  if (!bestMove) return;

  // Rotate to match AI rotation
  let rotatedPiece = currentPiece;
  for (let i = 0; i < bestMove.rotation; i++) {
    rotatedPiece = rotatePiece(rotatedPiece);
  }

  // Move to AI position and drop
  const newPosition = bestMove.position;
  if (!checkCollision(board, rotatedPiece, newPosition)) {
    const newBoard = mergePieceToBoard(board, rotatedPiece, newPosition);
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);
    
    setBoard(clearedBoard);
    setScore(prev => prev + linesCleared * 100 + 10);
    setLines(prev => prev + linesCleared);
    spawnNewPiece();
  }
}, [currentPiece, board, aiSuggestion]);

  const newGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(generateRandomPiece());
    setNextPiece(generateRandomPiece());
    setCurrentPosition({ x: 3, y: 0 });
    setGhostPosition(null);
    setAiSuggestion(null);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
  }, []);

  const spawnNewPiece = useCallback(() => {
    const newPiece = nextPiece;
    const newNext = generateRandomPiece();
    const newPosition = { x: 3, y: 0 };

    if (newPiece && !isValidMove(board, newPiece, newPosition)) {
      setGameOver(true);
      return;
    }

    setCurrentPiece(newPiece);
    setNextPiece(newNext);
    setCurrentPosition(newPosition);
  }, [board, nextPiece]);

  const calculateGhostPosition = useCallback((piece: Tetromino, position: Position): Position => {
    let ghostPos = { ...position };
    while (isValidMove(board, piece, { x: ghostPos.x, y: ghostPos.y + 1 })) {
      ghostPos.y++;
    }
    return ghostPos;
  }, [board]);

  const moveLeft = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPosition = { x: currentPosition.x - 1, y: currentPosition.y };
    if (isValidMove(board, currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
    }
  }, [board, currentPiece, currentPosition, gameOver, isPaused]);

  const moveRight = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPosition = { x: currentPosition.x + 1, y: currentPosition.y };
    if (isValidMove(board, currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
    }
  }, [board, currentPiece, currentPosition, gameOver, isPaused]);

  const moveDown = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const newPosition = { x: currentPosition.x, y: currentPosition.y + 1 };
    
    if (isValidMove(board, currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
    } else {
      const newBoard = mergePieceToBoard(board, currentPiece, currentPosition);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor((lines + linesCleared) / 10) + 1);
      
      spawnNewPiece();
    }
  }, [board, currentPiece, currentPosition, gameOver, isPaused, level, lines, spawnNewPiece]);

  const rotate = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    const rotatedPiece = rotatePiece(currentPiece);
    if (isValidMove(board, rotatedPiece, currentPosition)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [board, currentPiece, currentPosition, gameOver, isPaused]);

const hardDrop = useCallback(() => {
  if (!currentPiece || !ghostPosition || gameOver || isPaused) return;

  // Check if player followed AI suggestion
  if (aiSuggestion && lastAISuggestion) {
    const followedAI = 
      ghostPosition.x === aiSuggestion.x && 
      ghostPosition.y === aiSuggestion.y;
    
    if (followedAI) {
      setMovesFollowed(prev => prev + 1);
    }
    setTotalMoves(prev => prev + 1);
  }

  setCurrentPosition(ghostPosition);
  setTimeout(moveDown, 0);
}, [currentPiece, ghostPosition, gameOver, isPaused, moveDown, aiSuggestion, lastAISuggestion]);

  useEffect(() => {
  if (autoPlay && aiEnabled && !isPaused && !gameOver) {
    const timer = setTimeout(() => {
      executeAIMove();
    }, 500); // AI moves every 500ms
    return () => clearTimeout(timer);
  }
}, [autoPlay, aiEnabled, isPaused, gameOver, currentPiece, executeAIMove]);
  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      moveDown();
    }, 1000 / level);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, level, moveDown]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
          event.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          event.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          event.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          event.preventDefault();
          rotate();
          break;
        case 'Space':
          event.preventDefault();
          hardDrop();
          break;
        case 'KeyP':
          event.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop]);

  // AI calculation
  useEffect(() => {
    if (aiEnabled && currentPiece && board) {
      const bestMove = findBestMove(board, currentPiece);
      setAiSuggestion(bestMove ? bestMove.position : null);
    } else {
      setAiSuggestion(null);
    }
  }, [aiEnabled, currentPiece, board]);

  // Ghost position calculation
  useEffect(() => {
    if (currentPiece && currentPosition) {
      const ghost = calculateGhostPosition(currentPiece, currentPosition);
      setGhostPosition(ghost);
    } else {
      setGhostPosition(null);
    }
  }, [currentPiece, currentPosition, calculateGhostPosition]);

  // Initialize game on mount
  useEffect(() => {
    newGame();
  }, [newGame]);

  
return (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
    <div className="flex gap-6 flex-wrap justify-center">
      {/* Left Panel - AI Stats */}
      <div className="flex flex-col gap-4" style={{ width: '280px' }}>
        <AIStats 
          movesFollowed={movesFollowed}
          totalMoves={totalMoves}
          aiScore={aiScore}
          currentScore={score}
        />
        <AIMoveExplanation aiMove={aiSuggestion ? { position: aiSuggestion, rotation: 0, score: 75 } : null} />
        
        {/* Auto-Play Toggle */}
        {aiEnabled && (
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-4 py-3 rounded-lg font-bold transition-all ${
              autoPlay
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white`}
          >
            {autoPlay ? '⏹️ STOP AUTO-PLAY' : '▶️ WATCH AI PLAY'}
          </button>
        )}
      </div>

      {/* Center - Game Board */}
      <GameBoard
        board={board}
        currentPiece={currentPiece}
        currentPosition={currentPosition}
        ghostPosition={ghostPosition}
        aiSuggestion={aiEnabled ? aiSuggestion : null}
      />

      {/* Right Panel - Controls */}
      <div style={{ width: '280px' }}>
        <GameControls
          score={score}
          lines={lines}
          level={level}
          nextPiece={nextPiece}
          aiEnabled={aiEnabled}
          isPaused={isPaused}
          gameOver={gameOver}
          onToggleAI={() => setAiEnabled(!aiEnabled)}
          onTogglePause={() => setIsPaused(!isPaused)}
          onNewGame={newGame}
        />
      </div>
    </div>
  </div>
);
};

export default App;
