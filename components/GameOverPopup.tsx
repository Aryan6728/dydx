
import React from 'react';

interface GameOverPopupProps {
  score: number;
  onRestart: () => void;
}

const GameOverPopup: React.FC<GameOverPopupProps> = ({ score, onRestart }) => {
  const referralLink = "https://dydx.trade?ref=KindUnitNDK";

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
      <div className="bg-gray-900 border border-red-500 rounded-lg p-8 text-center text-white shadow-2xl shadow-red-500/20 max-w-sm">
        <h2 className="text-4xl font-bold mb-2 text-red-400">Game Over</h2>
        <p className="text-xl mb-4 text-gray-300">Your Score: <span className="font-bold text-white">{score}</span></p>
        <div className="bg-gray-800 p-4 rounded-lg my-6">
          <p className="mb-2 text-lg text-gray-200">Try the real game on dYdX!</p>
          <a
            href={`https://${referralLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-mono break-all text-sm"
          >
            {referralLink}
          </a>
        </div>
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverPopup;
