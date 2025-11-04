'use client';

import { Play, Pause, Lightbulb } from 'lucide-react';
import { Coordinates } from '@/types';

interface SimulationControlsProps {
  origin: Coordinates | null;
  destination: Coordinates | null;
  isSimulating: boolean;
  onSimulate: () => void;
}

export default function SimulationControls({
  origin,
  destination,
  isSimulating,
  onSimulate,
}: SimulationControlsProps) {
  return (
    <>
      <div className="mb-3">
        <button
          onClick={onSimulate}
          disabled={!origin || !destination || isSimulating}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-base font-black border-3 border-white shadow-lg inline-flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <Pause className="w-5 h-5" />
              Stop simulation
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Simulate journey
            </>
          )}
        </button>
      </div>

      <div className="text-sm text-gray-600 mt-3 p-2 bg-yellow-100 rounded-lg border-2 border-yellow-300 font-semibold flex items-start gap-2">
        <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>Tip: Use Chrome DevTools Sensors panel for easier testing</span>
      </div>
    </>
  );
}
