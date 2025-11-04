'use client';

import { Target, Pin } from 'lucide-react';

interface LocationInputProps {
  mockLat: string;
  mockLng: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  onSetLocation: () => void;
}

export default function LocationInput({
  mockLat,
  mockLng,
  onLatChange,
  onLngChange,
  onSetLocation,
}: LocationInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-base font-black mb-2 text-purple-600 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Set mock location:
      </label>
      <input
        type="number"
        step="0.000001"
        placeholder="Latitude"
        value={mockLat}
        onChange={(e) => onLatChange(e.target.value)}
        className="w-full px-3 py-2 border-3 border-purple-300 rounded-xl mb-2 text-sm font-semibold shadow-md"
      />
      <input
        type="number"
        step="0.000001"
        placeholder="Longitude"
        value={mockLng}
        onChange={(e) => onLngChange(e.target.value)}
        className="w-full px-3 py-2 border-3 border-purple-300 rounded-xl mb-2 text-sm font-semibold shadow-md"
      />
      <button
        onClick={onSetLocation}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 text-base font-black border-3 border-white shadow-lg inline-flex items-center justify-center gap-2"
      >
        <Pin className="w-5 h-5" />
        Set location
      </button>
    </div>
  );
}
