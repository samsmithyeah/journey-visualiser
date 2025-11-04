'use client';

import { MapPin } from 'lucide-react';
import { Coordinates } from '@/types';

interface CurrentPositionDisplayProps {
  currentPosition: Coordinates | null;
}

export default function CurrentPositionDisplay({ currentPosition }: CurrentPositionDisplayProps) {
  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl text-sm border-3 border-blue-300 shadow-lg">
      <div className="font-black mb-2 text-blue-600 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Current position:
      </div>
      {currentPosition ? (
        <div className="font-mono text-gray-700 font-semibold">
          <div>Lat: {currentPosition.lat.toFixed(6)}</div>
          <div>Lng: {currentPosition.lng.toFixed(6)}</div>
        </div>
      ) : (
        <div className="text-gray-500 font-semibold">No position set</div>
      )}
    </div>
  );
}
