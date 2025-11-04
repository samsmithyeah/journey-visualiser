'use client';

import { useState } from 'react';
import { PartyPopper, Trophy, Star, Sparkles } from 'lucide-react';

interface DestinationCelebrationProps {
  onClose: () => void;
  onStartNewJourney: () => void;
}

export default function DestinationCelebration({
  onClose,
  onStartNewJourney,
}: DestinationCelebrationProps) {
  const [confetti] = useState<
    Array<{ id: number; left: number; delay: number; color: string; rotation: number }>
  >(() =>
    // Generate confetti particles once during initialization
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFA07A',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E2',
      ][Math.floor(Math.random() * 8)],
      rotation: Math.random() * 360,
    }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 w-3 h-3 animate-confettiFall"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}

      {/* Celebration Card */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-yellow-400 p-12 max-w-2xl mx-4 transform animate-bounceIn">
        {/* Celebration Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <PartyPopper className="w-16 h-16 text-pink-500 animate-bounce" />
          <Trophy className="w-20 h-20 text-yellow-500 animate-bounce delay-100" />
          <Star className="w-16 h-16 text-purple-500 animate-bounce delay-200" />
        </div>

        {/* Main Message */}
        <h2 className="text-6xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
          We&apos;re here!
        </h2>

        <div className="text-center space-y-4 mb-8">
          <p className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            You made it to your destination!
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </p>
          <p className="text-2xl font-semibold text-gray-600">Great job on the journey! 🎉</p>
        </div>

        {/* Animated Success Checkmark */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <svg
                className="w-20 h-20 text-white animate-checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={4}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Sparkle effects */}
            <Star className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-spin" />
            <Star className="absolute -bottom-2 -left-2 w-6 h-6 text-pink-400 animate-spin delay-200" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-white text-purple-600 text-xl font-black py-4 px-8 rounded-2xl hover:scale-105 transition-transform shadow-lg border-4 border-purple-400"
          >
            Keep viewing
          </button>
          <button
            onClick={onStartNewJourney}
            className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-xl font-black py-4 px-8 rounded-2xl hover:scale-105 transition-transform shadow-lg border-4 border-white"
          >
            Start new journey
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes checkmark {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }

        .animate-confettiFall {
          animation: confettiFall 3s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-checkmark {
          animation: checkmark 0.8s ease-in-out 0.3s forwards;
          stroke-dasharray: 0, 100;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
