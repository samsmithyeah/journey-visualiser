'use client';

import { Home, Target, Car } from 'lucide-react';

interface JourneyVisualizerProps {
  progress: number; // 0 to 100
  originName?: string;
  destinationName?: string;
}

export default function JourneyVisualizer({
  progress,
  originName = 'Start',
  destinationName = 'Destination',
}: JourneyVisualizerProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-yellow-300">
      {/* Location labels */}
      <div className="flex justify-between mb-6 text-lg font-black">
        <div className="text-left max-w-[45%] bg-green-400 px-4 py-3 rounded-2xl border-3 border-green-600 shadow-lg transform -rotate-1">
          <span className="flex items-center gap-2 text-white drop-shadow">
            <Home className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{originName}</span>
          </span>
        </div>
        <div className="text-right max-w-[45%] bg-red-400 px-4 py-3 rounded-2xl border-3 border-red-600 shadow-lg transform rotate-1">
          <span className="flex items-center gap-2 justify-end text-white drop-shadow">
            <span className="truncate">{destinationName}</span>
            <Target className="w-5 h-5 flex-shrink-0" />
          </span>
        </div>
      </div>

      {/* Progress line container */}
      <div className="relative w-full h-20 flex items-center mb-6">
        {/* Background line */}
        <div className="absolute w-full h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full border-2 border-gray-500 shadow-inner"></div>

        {/* Progress line */}
        <div
          className="absolute h-4 bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 rounded-full transition-all duration-1000 ease-out border-2 border-white shadow-lg"
          style={{ width: `${clampedProgress}%` }}
        ></div>

        {/* Animated blob */}
        <div
          className="absolute w-16 h-16 -ml-8 transition-all duration-1000 ease-out z-10"
          style={{ left: `${clampedProgress}%` }}
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full shadow-2xl animate-bounce flex items-center justify-center border-4 border-white transform hover:scale-125 transition-transform">
            <Car className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Progress percentage */}
      <div className="text-center mt-8">
        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 drop-shadow-lg">
          {clampedProgress.toFixed(0)}%
        </span>
        <p className="text-xl font-bold text-gray-700 mt-2 flex items-center justify-center gap-2">
          of journey complete
        </p>
      </div>
    </div>
  );
}
