'use client';

import { useState, useEffect, useCallback } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface JourneyState {
  origin: Coordinates | null;
  destination: Coordinates | null;
  currentPosition: Coordinates | null;
  progress: number;
  totalDistance: number | null;
  remainingDistance: number | null;
  isTracking: boolean;
  error: string | null;
}

export function useJourneyTracking() {
  const [journeyState, setJourneyState] = useState<JourneyState>({
    origin: null,
    destination: null,
    currentPosition: null,
    progress: 0,
    totalDistance: null,
    remainingDistance: null,
    isTracking: false,
    error: null,
  });

  const [mockLocation, setMockLocation] = useState<Coordinates | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout | null>(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = useCallback((point1: Coordinates, point2: Coordinates): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Get route distance using Google Directions API
  const getRouteDistance = useCallback(async (origin: Coordinates, destination: Coordinates): Promise<number | null> => {
    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (result.routes[0]?.legs[0]?.distance?.value) {
        return result.routes[0].legs[0].distance.value / 1000; // Convert meters to km
      }
      return null;
    } catch (error) {
      console.error('Error getting route distance:', error);
      return null;
    }
  }, []);

  // Get remaining route distance from current position to destination
  const getRemainingRouteDistance = useCallback(async (current: Coordinates, destination: Coordinates): Promise<number | null> => {
    console.log('🔍 [getRemainingRouteDistance] Calling Directions API...');
    console.log('  Current:', current);
    console.log('  Destination:', destination);

    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: new google.maps.LatLng(current.lat, current.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (result.routes[0]?.legs[0]?.distance?.value) {
        const distanceKm = result.routes[0].legs[0].distance.value / 1000;
        console.log('✅ [getRemainingRouteDistance] API Success - Route distance:', distanceKm, 'km');
        return distanceKm;
      }
      console.log('⚠️ [getRemainingRouteDistance] API returned no distance, returning null');
      return null;
    } catch (error) {
      console.error('❌ [getRemainingRouteDistance] API Error:', error);
      const straightLineDistance = calculateDistance(current, destination);
      console.log('🔄 [getRemainingRouteDistance] Fallback to straight-line:', straightLineDistance, 'km');
      return straightLineDistance;
    }
  }, [calculateDistance]);

  // Calculate progress percentage using actual route distances
  const calculateProgress = useCallback(async (current: Coordinates, destination: Coordinates, totalRouteDistance: number): Promise<{ progress: number; remainingDistance: number }> => {
    console.log('\n📊 [calculateProgress] Starting calculation...');
    console.log('  Total route distance:', totalRouteDistance, 'km');

    // Get remaining route distance from current position to destination
    const remainingDistance = await getRemainingRouteDistance(current, destination);

    if (remainingDistance === null) {
      // Fallback to straight-line calculation if API fails
      console.log('⚠️ [calculateProgress] Using FALLBACK calculation (straight-line)');
      const straightLineRemaining = calculateDistance(current, destination);
      const progress = Math.min(Math.max(((totalRouteDistance - straightLineRemaining) / totalRouteDistance) * 100, 0), 100);
      console.log('  Method: STRAIGHT-LINE FALLBACK');
      console.log('  Remaining (straight-line):', straightLineRemaining, 'km');
      console.log('  Progress:', progress.toFixed(2), '%');
      console.log('─────────────────────────────────\n');
      return { progress, remainingDistance: straightLineRemaining };
    }

    // Calculate distance traveled along route
    const distanceTraveled = totalRouteDistance - remainingDistance;

    // Calculate progress as percentage
    const progress = (distanceTraveled / totalRouteDistance) * 100;

    // Ensure progress is between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    console.log('✅ [calculateProgress] Using ROUTE-BASED calculation');
    console.log('  Method: GOOGLE DIRECTIONS API');
    console.log('  Total route distance:', totalRouteDistance, 'km');
    console.log('  Remaining route distance:', remainingDistance, 'km');
    console.log('  Distance traveled:', distanceTraveled, 'km');
    console.log('  Progress:', clampedProgress.toFixed(2), '%');
    console.log('  Clamped:', progress !== clampedProgress ? `Yes (${progress.toFixed(2)}% → ${clampedProgress.toFixed(2)}%)` : 'No');
    console.log('─────────────────────────────────\n');

    return { progress: clampedProgress, remainingDistance };
  }, [getRemainingRouteDistance, calculateDistance]);

  // Set destination and start tracking
  const startJourney = useCallback(async (destinationCoords: Coordinates): Promise<Coordinates | null> => {
    // Get current position as origin
    if (!navigator.geolocation) {
      setJourneyState(prev => ({ ...prev, error: 'Geolocation not supported' }));
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const origin: Coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Get route distance
          const distance = await getRouteDistance(origin, destinationCoords);

          setJourneyState(prev => ({
            ...prev,
            origin,
            destination: destinationCoords,
            currentPosition: origin,
            totalDistance: distance,
            isTracking: true,
            error: null,
          }));

          resolve(origin);
        },
        (error) => {
          setJourneyState(prev => ({ ...prev, error: error.message }));
          resolve(null);
        }
      );
    });
  }, [getRouteDistance]);

  // Update current position and calculate progress
  useEffect(() => {
    if (!journeyState.isTracking || !journeyState.origin || !journeyState.destination || !journeyState.totalDistance) {
      return;
    }

    // If using mock location, calculate progress
    if (mockLocation) {
      calculateProgress(mockLocation, journeyState.destination!, journeyState.totalDistance!).then(
        ({ progress, remainingDistance }) => {
          setJourneyState(prev => ({
            ...prev,
            currentPosition: mockLocation,
            progress,
            remainingDistance,
          }));
        }
      );
      return;
    }

    // Watch position with high accuracy
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const currentPos: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Calculate progress using actual route distance
        const { progress, remainingDistance } = await calculateProgress(
          currentPos,
          journeyState.destination!,
          journeyState.totalDistance!
        );

        setJourneyState(prev => ({
          ...prev,
          currentPosition: currentPos,
          progress,
          remainingDistance,
        }));
      },
      (error) => {
        // Handle geolocation errors with proper messages
        let errorMessage = 'Unknown location error';
        if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.code) {
          switch (error.code) {
            case 1:
              errorMessage = 'Location permission denied';
              break;
            case 2:
              errorMessage = 'Location unavailable';
              break;
            case 3:
              errorMessage = 'Location request timeout';
              break;
          }
        }
        console.error('Error watching position:', errorMessage, error);
        // Don't stop tracking on every error, just log it
        // setJourneyState(prev => ({ ...prev, error: errorMessage }));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [journeyState.isTracking, journeyState.origin, journeyState.destination, journeyState.totalDistance, mockLocation, calculateProgress, calculateDistance]);

  const stopJourney = useCallback(() => {
    setJourneyState({
      origin: null,
      destination: null,
      currentPosition: null,
      progress: 0,
      totalDistance: null,
      remainingDistance: null,
      isTracking: false,
      error: null,
    });
    setMockLocation(null);
    setIsSimulating(false);
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
  }, [simulationInterval]);

  // Set mock location for testing
  const setMockPosition = useCallback((lat: number, lng: number) => {
    setMockLocation({ lat, lng });
  }, []);

  // Simulate journey by gradually moving from origin to destination
  const simulateJourney = useCallback(() => {
    if (!journeyState.origin || !journeyState.destination) return;

    if (isSimulating) {
      // Stop simulation
      setIsSimulating(false);
      if (simulationInterval) {
        clearInterval(simulationInterval);
        setSimulationInterval(null);
      }
      return;
    }

    // Start simulation
    setIsSimulating(true);
    let step = 0;
    const totalSteps = 100; // Number of steps to reach destination

    const interval = setInterval(() => {
      if (!journeyState.origin || !journeyState.destination) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
        return;
      }

      step++;
      const progress = step / totalSteps;

      // Interpolate between origin and destination
      const currentLat = journeyState.origin.lat + (journeyState.destination.lat - journeyState.origin.lat) * progress;
      const currentLng = journeyState.origin.lng + (journeyState.destination.lng - journeyState.origin.lng) * progress;

      setMockLocation({ lat: currentLat, lng: currentLng });

      if (step >= totalSteps) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
      }
    }, 500); // Update every 500ms

    setSimulationInterval(interval);
  }, [journeyState.origin, journeyState.destination, isSimulating, simulationInterval]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  return {
    ...journeyState,
    startJourney,
    stopJourney,
    setMockPosition,
    simulateJourney,
    isSimulating,
  };
}
