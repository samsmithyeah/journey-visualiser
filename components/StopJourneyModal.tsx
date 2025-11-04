'use client';

interface StopJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function StopJourneyModal({ isOpen, onClose, onConfirm }: StopJourneyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-purple-400 p-8 max-w-md w-full">
        <h2 className="text-3xl font-black text-purple-600 mb-4 text-center flex items-center justify-center gap-2">
          Stop journey?
        </h2>
        <p className="text-lg font-semibold text-gray-700 mb-6 text-center">
          Are you sure you want to stop tracking your journey?
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-lg rounded-full hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-xl border-4 border-white"
          >
            Keep going
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-black text-lg rounded-full hover:from-red-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl border-4 border-white"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
