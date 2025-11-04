'use client';

interface JourneyVisualizerProps {
  progress: number; // 0 to 100
  originName?: string;
  destinationName?: string;
}

export default function JourneyVisualizer({
  progress,
  originName = 'Start',
  destinationName = 'Destination'
}: JourneyVisualizerProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Location labels */}
      <div className="flex justify-between mb-4 text-sm font-medium text-gray-600">
        <div className="text-left max-w-[45%]">
          <span className="block truncate">{originName}</span>
        </div>
        <div className="text-right max-w-[45%]">
          <span className="block truncate">{destinationName}</span>
        </div>
      </div>

      {/* Progress line container */}
      <div className="relative w-full h-16 flex items-center">
        {/* Background line */}
        <div className="absolute w-full h-2 bg-gray-300 rounded-full"></div>

        {/* Progress line */}
        <div
          className="absolute h-2 bg-blue-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${clampedProgress}%` }}
        ></div>

        {/* Animated blob */}
        <div
          className="absolute w-12 h-12 -ml-6 transition-all duration-1000 ease-out"
          style={{ left: `${clampedProgress}%` }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress percentage */}
      <div className="text-center mt-6">
        <span className="text-4xl font-bold text-gray-800">{clampedProgress.toFixed(0)}%</span>
        <p className="text-sm text-gray-500 mt-1">of journey complete</p>
      </div>
    </div>
  );
}
