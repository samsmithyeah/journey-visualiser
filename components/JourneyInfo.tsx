'use client';

import { Navigation, StopCircle } from 'lucide-react';

interface JourneyInfoProps {
  remainingDistance: number | null;
  onStopJourney: () => void;
}

export default function JourneyInfo({ remainingDistance, onStopJourney }: JourneyInfoProps) {
  return (
    <div className="text-center mt-6">
      {remainingDistance !== null && (
        <p className="text-2xl font-black text-white drop-shadow-lg mb-6 bg-gradient-to-r from-orange-400 to-pink-400 inline-flex items-center gap-2 px-6 py-3 rounded-full border-4 border-white shadow-2xl">
          <Navigation className="w-7 h-7" /> {remainingDistance.toFixed(1)} km remaining
        </p>
      )}

      <button
        onClick={onStopJourney}
        className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-xl rounded-full hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-110 shadow-2xl border-4 border-white inline-flex items-center gap-2"
      >
        <StopCircle className="w-6 h-6" /> Stop journey
      </button>
    </div>
  );
}
