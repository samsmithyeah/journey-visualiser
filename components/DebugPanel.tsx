'use client';

import { useState, useEffect } from 'react';
import DebugMap from './DebugMap';

interface DebugPanelProps {
  currentPosition: { lat: number; lng: number } | null;
  origin: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | null;
  onSetMockLocation: (lat: number, lng: number) => void;
  onSimulateMovement: () => void;
  isSimulating: boolean;
}

export default function DebugPanel({
  currentPosition,
  origin,
  destination,
  onSetMockLocation,
  onSimulateMovement,
  isSimulating
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mockLat, setMockLat] = useState('');
  const [mockLng, setMockLng] = useState('');
  const [showMap, setShowMap] = useState(true);

  // Update input fields when current position changes
  useEffect(() => {
    if (currentPosition) {
      setMockLat(currentPosition.lat.toFixed(6));
      setMockLng(currentPosition.lng.toFixed(6));
    }
  }, [currentPosition]);

  const handleSetLocation = () => {
    const lat = parseFloat(mockLat);
    const lng = parseFloat(mockLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      onSetMockLocation(lat, lng);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMockLat(lat.toFixed(6));
    setMockLng(lng.toFixed(6));
    onSetMockLocation(lat, lng);
  };

  const handleQuickSet = (type: 'origin' | 'destination' | 'halfway') => {
    if (!origin || !destination) return;

    if (type === 'origin') {
      setMockLat(origin.lat.toFixed(6));
      setMockLng(origin.lng.toFixed(6));
      onSetMockLocation(origin.lat, origin.lng);
    } else if (type === 'destination') {
      setMockLat(destination.lat.toFixed(6));
      setMockLng(destination.lng.toFixed(6));
      onSetMockLocation(destination.lat, destination.lng);
    } else if (type === 'halfway') {
      const halfLat = (origin.lat + destination.lat) / 2;
      const halfLng = (origin.lng + destination.lng) / 2;
      setMockLat(halfLat.toFixed(6));
      setMockLng(halfLng.toFixed(6));
      onSetMockLocation(halfLat, halfLng);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors font-medium"
      >
        {isExpanded ? '🔧 Hide Debug' : '🔧 Debug Mode'}
      </button>

      {/* Debug Panel */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-2xl p-4 w-96 border-2 border-purple-600 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-purple-600">Debug Panel</h3>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              {showMap ? '📍 Hide Map' : '🗺️ Show Map'}
            </button>
          </div>

          {/* Map View */}
          {showMap && origin && destination && (
            <div className="mb-4">
              <DebugMap
                origin={origin}
                destination={destination}
                currentPosition={currentPosition}
                onMapClick={handleMapClick}
              />
            </div>
          )}

          {/* Current Position Display */}
          <div className="mb-4 p-3 bg-gray-50 rounded text-xs">
            <div className="font-semibold mb-1">Current Position:</div>
            {currentPosition ? (
              <div className="font-mono">
                <div>Lat: {currentPosition.lat.toFixed(6)}</div>
                <div>Lng: {currentPosition.lng.toFixed(6)}</div>
              </div>
            ) : (
              <div className="text-gray-500">No position set</div>
            )}
          </div>

          {/* Manual Location Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Set Mock Location:</label>
            <input
              type="number"
              step="0.000001"
              placeholder="Latitude"
              value={mockLat}
              onChange={(e) => setMockLat(e.target.value)}
              className="w-full px-2 py-1 border rounded mb-2 text-sm"
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Longitude"
              value={mockLng}
              onChange={(e) => setMockLng(e.target.value)}
              className="w-full px-2 py-1 border rounded mb-2 text-sm"
            />
            <button
              onClick={handleSetLocation}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
            >
              Set Location
            </button>
          </div>

          {/* Quick Set Buttons */}
          {origin && destination && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Quick Set:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickSet('origin')}
                  className="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                >
                  Origin
                </button>
                <button
                  onClick={() => handleQuickSet('halfway')}
                  className="flex-1 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                >
                  50%
                </button>
                <button
                  onClick={() => handleQuickSet('destination')}
                  className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                >
                  Dest
                </button>
              </div>
            </div>
          )}

          {/* Simulate Movement */}
          <div className="mb-2">
            <button
              onClick={onSimulateMovement}
              disabled={!origin || !destination || isSimulating}
              className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isSimulating ? '⏸️ Stop Simulation' : '▶️ Simulate Journey'}
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            💡 Tip: Use Chrome DevTools Sensors panel for easier testing
          </div>
        </div>
      )}
    </div>
  );
}
