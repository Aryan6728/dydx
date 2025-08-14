
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, type Pipe } from './types';
import * as C from './constants';
import IntroPopup from './components/IntroPopup';
import GameOverPopup from './components/GameOverPopup';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Ready);
  const [spriteY, setSpriteY] = useState<number>(C.INITIAL_SPRITE_Y);
  const [velocityY, setVelocityY] = useState<number>(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState<number>(0);
  const lastPipeX = useRef<number>(C.GAME_WIDTH);

  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    setSpriteY(C.INITIAL_SPRITE_Y);
    setVelocityY(0);
    setPipes([]);
    setScore(0);
    lastPipeX.current = C.GAME_WIDTH;
  }, []);

  const startGame = () => {
    resetGame();
    setGameState(GameState.Playing);
  };

  const handleUserAction = useCallback(() => {
    if (gameState === GameState.Playing) {
      setVelocityY(C.JUMP_STRENGTH);
    }
  }, [gameState]);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Update sprite position
    setVelocityY(prev => prev + C.GRAVITY);
    setSpriteY(prev => prev + velocityY);

    // Update pipe positions and generate new pipes
    let newScore = score;
    const newPipes = pipes
      .map(pipe => ({ ...pipe, x: pipe.x + C.PIPE_SPEED }))
      .filter(pipe => pipe.x > -C.PIPE_WIDTH);
    
    let scoredThisFrame = false;
    newPipes.forEach(pipe => {
      if (!pipe.passed && pipe.x + C.PIPE_WIDTH < C.INITIAL_SPRITE_X) {
        pipe.passed = true;
        if (!scoredThisFrame) {
            newScore++;
            scoredThisFrame = true;
        }
      }
    });

    setScore(newScore);

    // Add new pipe if needed
    const lastPipe = newPipes[newPipes.length - 1];
    if (!lastPipe || C.GAME_WIDTH - lastPipe.x >= C.PIPE_SPAWN_INTERVAL) {
        const newPipeGapY = C.PIPE_GAP / 2 + Math.random() * (C.GAME_HEIGHT - C.PIPE_GAP * 2) + C.PIPE_GAP / 2;
        newPipes.push({
            x: C.GAME_WIDTH,
            gapY: newPipeGapY,
            passed: false,
        });
    }

    setPipes(newPipes);

    // Collision detection
    const spriteBottom = spriteY + C.SPRITE_HEIGHT;
    const spriteRight = C.INITIAL_SPRITE_X + C.SPRITE_WIDTH;

    // Ground collision
    if (spriteBottom > C.GAME_HEIGHT) {
      setGameState(GameState.GameOver);
      return;
    }
     // Sky collision (optional, but good for gameplay)
    if (spriteY < 0) {
      setSpriteY(0);
      setVelocityY(0);
    }

    // Pipe collision
    for (const pipe of newPipes) {
      const pipeTopEnd = pipe.gapY - C.PIPE_GAP / 2;
      const pipeBottomStart = pipe.gapY + C.PIPE_GAP / 2;

      if (spriteRight > pipe.x && C.INITIAL_SPRITE_X < pipe.x + C.PIPE_WIDTH) {
        if (spriteY < pipeTopEnd || spriteBottom > pipeBottomStart) {
          setGameState(GameState.GameOver);
          return;
        }
      }
    }

    lastTimeRef.current = timestamp;
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [velocityY, spriteY, pipes, score]);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      lastTimeRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
       if(gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, gameLoop]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            handleUserAction();
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleUserAction);
    window.addEventListener('mousedown', handleUserAction);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('touchstart', handleUserAction);
        window.removeEventListener('mousedown', handleUserAction);
    };
  }, [handleUserAction]);


  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white font-sans select-none">
      <div
        style={{ width: C.GAME_WIDTH, height: C.GAME_HEIGHT }}
        className="relative overflow-hidden bg-gray-900 border-2 border-blue-800 shadow-lg shadow-blue-500/10"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.05) 2px, transparent 2px)', backgroundSize: '40px 40px'}}></div>


        {/* Game State Modals */}
        {gameState === GameState.Ready && <IntroPopup onStart={startGame} />}
        {gameState === GameState.GameOver && <GameOverPopup score={score} onRestart={startGame} />}
        
        {/* Score */}
        {gameState === GameState.Playing && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl font-bold text-white opacity-50 z-20" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {score}
            </div>
        )}

        {/* Sprite */}
        <div
          style={{
            left: C.INITIAL_SPRITE_X,
            top: spriteY,
            width: C.SPRITE_WIDTH,
            height: C.SPRITE_HEIGHT,
            transform: `translateY(${spriteY}px)`,
          }}
          className="absolute bg-blue-500 rounded-full transition-transform duration-100 ease-linear z-10"
        >
           <div className="w-full h-full rounded-full bg-blue-400 animate-pulse shadow-[0_0_15px_5px_rgba(59,130,246,0.7)]"></div>
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index} style={{ transform: `translateX(${pipe.x}px)` }} className="absolute h-full top-0">
            {/* Top Pipe */}
            <div
              style={{
                left: 0,
                top: 0,
                width: C.PIPE_WIDTH,
                height: pipe.gapY - C.PIPE_GAP / 2,
              }}
              className="absolute bg-gradient-to-b from-gray-600 to-gray-800 border-x-4 border-gray-500"
            ></div>
            {/* Bottom Pipe */}
            <div
              style={{
                left: 0,
                top: pipe.gapY + C.PIPE_GAP / 2,
                width: C.PIPE_WIDTH,
                height: C.GAME_HEIGHT - (pipe.gapY + C.PIPE_GAP / 2),
              }}
              className="absolute bg-gradient-to-t from-gray-600 to-gray-800 border-x-4 border-gray-500"
            ></div>
          </div>
        ))}
      </div>
      <footer className="w-full text-center py-4">
        <a href="https://x.com/Mahakal95" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">
          x.com/Mahakal95
        </a>
      </footer>
    </div>
  );
};

export default App;
