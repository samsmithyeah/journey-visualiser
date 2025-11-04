'use client';

import { Home, Star, Target, Zap } from 'lucide-react';
import { Coordinates } from '@/types';

interface QuickSetButtonsProps {
  origin: Coordinates | null;
  destination: Coordinates | null;
  onQuickSet: (type: 'origin' | 'destination' | 'halfway') => void;
}

export default function QuickSetButtons({ origin, destination, onQuickSet }: QuickSetButtonsProps) {
  if (!origin || !destination) return null;

  return (
    <div className="mb-4">
      <label className="block text-base font-black mb-2 text-purple-600 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        Quick set:
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onQuickSet('origin')}
          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 text-sm font-bold border-2 border-white shadow-lg inline-flex items-center justify-center gap-1"
        >
          <Home className="w-4 h-4" />
          Origin
        </button>
        <button
          onClick={() => onQuickSet('halfway')}
          className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 text-sm font-bold border-2 border-white shadow-lg inline-flex items-center justify-center gap-1"
        >
          <Star className="w-4 h-4" />
          50%
        </button>
        <button
          onClick={() => onQuickSet('destination')}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm font-bold border-2 border-white shadow-lg inline-flex items-center justify-center gap-1"
        >
          <Target className="w-4 h-4" />
          Dest
        </button>
      </div>
    </div>
  );
}
