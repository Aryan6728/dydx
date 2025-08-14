
import React from 'react';

interface IntroPopupProps {
  onStart: () => void;
}

const IntroPopup: React.FC<IntroPopupProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-30">
      <div className="bg-gray-900 border border-blue-500 rounded-lg p-8 text-center text-white shadow-2xl shadow-blue-500/20 max-w-sm">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Welcome!</h2>
        <p className="mb-6 text-lg text-gray-300">
          This game is just for fun, enjoy!
        </p>
        <button
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default IntroPopup;
