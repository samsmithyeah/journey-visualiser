'use client';

import { useState } from 'react';
import DestinationSearch from '@/components/DestinationSearch';
import JourneyVisualizer from '@/components/JourneyVisualizer';
import DebugPanel from '@/components/DebugPanel';
import ErrorDisplay from '@/components/ErrorDisplay';
import JourneyInfo from '@/components/JourneyInfo';
import StopJourneyModal from '@/components/StopJourneyModal';
import { useJourneyTracking } from '@/hooks/useJourneyTracking';
import { reverseGeocode } from '@/utils/route';

export default function Home() {
  const [destinationName, setDestinationName] = useState<string>('');
  const [originName, setOriginName] = useState<string>('Current Location');
  const [showStopModal, setShowStopModal] = useState<boolean>(false);
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
    isSimulating,
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
      if (originCoords) {
        const address = await reverseGeocode(originCoords);
        if (address) {
          setOriginName(address);
        }
      }
    }
  };

  const handleStopJourney = () => {
    setShowStopModal(false);
    stopJourney();
    setDestinationName('');
    setOriginName('Current Location');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background SVG */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/journey-background.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-4 drop-shadow-lg">
            Are we nearly there?
          </h1>
          <p className="text-2xl font-bold text-white drop-shadow-md">
            Kid-friendly journey progress tracking
          </p>
        </div>

        {/* Destination Search */}
        {!isTracking && (
          <div className="flex justify-center mb-8">
            <DestinationSearch onDestinationSelect={handleDestinationSelect} />
          </div>
        )}

        {/* Error Display */}
        <ErrorDisplay error={error} />

        {/* Journey Visualizer */}
        {isTracking && (
          <div className="mb-8">
            <JourneyVisualizer
              progress={progress}
              originName={originName}
              destinationName={destinationName}
            />

            <JourneyInfo
              remainingDistance={remainingDistance}
              onStopJourney={() => setShowStopModal(true)}
            />
          </div>
        )}

        {/* Debug Panel */}
        {isTracking && process.env.NODE_ENV === 'development' && (
          <DebugPanel
            currentPosition={currentPosition}
            origin={origin}
            destination={destination}
            onSetMockLocation={setMockPosition}
            onSimulateMovement={simulateJourney}
            isSimulating={isSimulating}
          />
        )}

        {/* Stop Journey Confirmation Modal */}
        <StopJourneyModal
          isOpen={showStopModal}
          onClose={() => setShowStopModal(false)}
          onConfirm={handleStopJourney}
        />
      </main>
    </div>
  );
}
