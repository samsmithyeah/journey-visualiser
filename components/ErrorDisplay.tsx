'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  error: string | null;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="max-w-md mx-auto mb-8 p-6 bg-red-100 border-4 border-red-400 text-red-700 rounded-3xl shadow-2xl">
      <p className="font-bold text-xl flex items-center gap-2 justify-center">
        <AlertTriangle className="w-6 h-6" /> Oops! {error}
      </p>
      <p className="text-base mt-2">Please ensure location permissions are enabled.</p>
    </div>
  );
}
