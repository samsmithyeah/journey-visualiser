'use client';

import { useState } from 'react';
import DestinationSearch from '@/components/DestinationSearch';
import JourneyVisualizer from '@/components/JourneyVisualizer';
import DebugPanel from '@/components/DebugPanel';
import { useJourneyTracking } from '@/hooks/useJourneyTracking';

export default function Home() {
  const [destinationName, setDestinationName] = useState<string>('');
  const [originName, setOriginName] = useState<string>('Current Location');
  const {
    progress,
    isTracking,
    startJourney,
    stopJourney,
    error,
    remainingDistance,
    origin,
    destination,
    currentPosition,
    setMockPosition,
    simulateJourney,
    isSimulating
  } = useJourneyTracking();

  const handleDestinationSelect = async (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setDestinationName(place.name || place.formatted_address || 'Destination');
      const originCoords = await startJourney(coords);

      // Reverse geocode the origin to get its address
      if (originCoords && window.google) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: originCoords.lat, lng: originCoords.lng } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              // Try to get a short, readable name
              const address = results[0].formatted_address;
              // Extract just the city/area if possible (remove country, full details)
              const shortAddress = address.split(',').slice(0, 2).join(',');
              setOriginName(shortAddress || address);
            }
          }
        );
      }
    }
  };

  const handleStopJourney = () => {
    stopJourney();
    setDestinationName('');
    setOriginName('Current Location');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🚗 Journey Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Track your journey in real-time!
          </p>
        </div>

        {/* Destination Search */}
        {!isTracking && (
          <div className="flex justify-center mb-8">
            <DestinationSearch onDestinationSelect={handleDestinationSelect} />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-1">Please ensure location permissions are enabled.</p>
          </div>
        )}

        {/* Journey Visualizer */}
        {isTracking && (
          <div className="mb-8">
            <JourneyVisualizer
              progress={progress}
              originName={originName}
              destinationName={destinationName}
            />

            {/* Additional Info */}
            <div className="text-center mt-6">
              {remainingDistance !== null && (
                <p className="text-lg text-gray-600 mb-4">
                  {remainingDistance.toFixed(1)} km remaining
                </p>
              )}

              <button
                onClick={handleStopJourney}
                className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Stop Journey
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isTracking && (
          <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">How to use:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Enter your destination address in the search box above</li>
              <li>Allow location permissions when prompted</li>
              <li>Watch the progress indicator update as you travel!</li>
              <li>The blob on the line shows your current journey progress</li>
            </ol>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Make sure you have added your Google Maps API key to the <code className="bg-gray-200 px-1 rounded">.env.local</code> file.
              </p>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700">
                <strong>🔧 Testing Tip:</strong> Click the &quot;Debug Mode&quot; button in the bottom right to test the journey visualizer without actually traveling!
              </p>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {isTracking && (
          <DebugPanel
            currentPosition={currentPosition}
            origin={origin}
            destination={destination}
            onSetMockLocation={setMockPosition}
            onSimulateMovement={simulateJourney}
            isSimulating={isSimulating}
          />
        )}
      </main>
    </div>
  );
}
