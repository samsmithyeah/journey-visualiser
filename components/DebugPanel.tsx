'use client';

import { useState, useEffect } from 'react';
import DebugMap from './DebugMap';
import CurrentPositionDisplay from './debug/CurrentPositionDisplay';
import LocationInput from './debug/LocationInput';
import QuickSetButtons from './debug/QuickSetButtons';
import SimulationControls from './debug/SimulationControls';
import { Wrench, MapPin, Map } from 'lucide-react';
import { Coordinates } from '@/types';

interface DebugPanelProps {
  currentPosition: Coordinates | null;
  origin: Coordinates | null;
  destination: Coordinates | null;
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
  isSimulating,
}: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mockLat, setMockLat] = useState('');
  const [mockLng, setMockLng] = useState('');
  const [showMap, setShowMap] = useState(true);

  // Update input fields when current position changes
  useEffect(() => {
    if (currentPosition) {
      queueMicrotask(() => {
        setMockLat(currentPosition.lat.toFixed(6));
        setMockLng(currentPosition.lng.toFixed(6));
      });
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
        className="mb-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-110 font-black text-lg border-4 border-white inline-flex items-center gap-2"
      >
        <Wrench className="w-5 h-5" />
        {isExpanded ? 'Hide debug' : 'Debug mode'}
      </button>

      {/* Debug Panel */}
      {isExpanded && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 w-96 border-4 border-purple-400 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-2xl text-purple-600 flex items-center gap-2">
              <Wrench className="w-6 h-6" />
              Debug panel
            </h3>
            <button
              onClick={() => setShowMap(!showMap)}
              className="text-sm px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full hover:from-yellow-500 hover:to-orange-500 font-bold border-2 border-white shadow-lg inline-flex items-center gap-1"
            >
              {showMap ? (
                <>
                  <MapPin className="w-4 h-4" /> Hide map
                </>
              ) : (
                <>
                  <Map className="w-4 h-4" /> Show map
                </>
              )}
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

          <CurrentPositionDisplay currentPosition={currentPosition} />

          <LocationInput
            mockLat={mockLat}
            mockLng={mockLng}
            onLatChange={setMockLat}
            onLngChange={setMockLng}
            onSetLocation={handleSetLocation}
          />

          <QuickSetButtons origin={origin} destination={destination} onQuickSet={handleQuickSet} />

          <SimulationControls
            origin={origin}
            destination={destination}
            isSimulating={isSimulating}
            onSimulate={onSimulateMovement}
          />
        </div>
      )}
    </div>
  );
}
