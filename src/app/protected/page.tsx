'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ProtectedPage() {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;

    const confettiInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(confettiInterval);
        return;
      }

      const particleCount = 50;

      // Launch confetti from both sides
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
      });
    }, 250);

    return () => clearInterval(confettiInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
        <div className="relative w-full aspect-square mb-8 rounded-xl overflow-hidden flex justify-center">
          <img
            src="https://static.wikia.nocookie.net/00b0d5c1-e08e-490c-8823-b02bba1daf9b/scale-to-width/755"
            alt="Legendary Tung Sahur"
            className="max-h-[500px] object-contain animate-shake-grow hover:animate-shake"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-center text-yellow-300 animate-bounce mb-6">
          🎉 Congratulations! 🎉
        </h1>
        
        <p className="text-2xl text-center text-white animate-pulse">
          You have entered the correct API key and has met the legendary
        </p>
        
        <p className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-gradient mt-4">
          TUNG TUNG TUNG TUNG TUNG TUNG Sahurrrrrrrrrrrrrrrrrrrr
        </p>
      </div>
    </div>
  );
} 