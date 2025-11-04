'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Coordinates, JourneyState } from '@/types';
import { calculateProgress } from '@/utils/progress';
import { getRouteDistance } from '@/utils/googleMaps';
import { checkLocationPermission, getGeolocationErrorMessage } from '@/utils/geolocation';
import { GEOLOCATION_CONFIG, ERROR_THRESHOLDS, SIMULATION_CONFIG } from '@/constants';

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
  const errorCountRef = useRef(0);

  // Set destination and start tracking
  const startJourney = useCallback(
    async (destinationCoords: Coordinates): Promise<Coordinates | null> => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setJourneyState((prev) => ({ ...prev, error: 'Geolocation not supported' }));
        return null;
      }

      // Check for location permission first
      const permissionState = await checkLocationPermission();
      if (permissionState === 'denied') {
        setJourneyState((prev) => ({
          ...prev,
          error:
            'Location permission denied. Please enable location access in your browser settings.',
        }));
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

            setJourneyState((prev) => ({
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
            const errorMessage = getGeolocationErrorMessage(error);
            setJourneyState((prev) => ({ ...prev, error: errorMessage }));
            resolve(null);
          },
          GEOLOCATION_CONFIG
        );
      });
    },
    []
  );

  // Update current position and calculate progress
  useEffect(() => {
    if (
      !journeyState.isTracking ||
      !journeyState.origin ||
      !journeyState.destination ||
      !journeyState.totalDistance
    ) {
      return;
    }

    // If using mock location, calculate progress
    if (mockLocation) {
      calculateProgress(mockLocation, journeyState.destination!, journeyState.totalDistance!).then(
        ({ progress, remainingDistance }) => {
          setJourneyState((prev) => ({
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
        // Reset error count on successful position update
        errorCountRef.current = 0;

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

        setJourneyState((prev) => ({
          ...prev,
          currentPosition: currentPos,
          progress,
          remainingDistance,
          error: null, // Clear any previous errors
        }));
      },
      (error) => {
        // Handle geolocation errors with proper messages
        errorCountRef.current++;

        const errorMessage = getGeolocationErrorMessage(error);

        // Only log every nth error to avoid console spam
        if (errorCountRef.current % ERROR_THRESHOLDS.LOG_FREQUENCY === 1) {
          console.warn(`GPS position error (${errorCountRef.current} errors):`, errorMessage);
          console.log(
            'Tip: GPS errors are common indoors or with poor sky visibility. The app will keep trying.'
          );
        }

        // Only show error to user after many consecutive failures
        if (errorCountRef.current > ERROR_THRESHOLDS.DISPLAY_THRESHOLD) {
          setJourneyState((prev) => ({
            ...prev,
            error:
              'Having trouble getting GPS signal. Please ensure you have a clear view of the sky.',
          }));
        }
      },
      GEOLOCATION_CONFIG
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [
    journeyState.isTracking,
    journeyState.origin,
    journeyState.destination,
    journeyState.totalDistance,
    mockLocation,
  ]);

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

    const interval = setInterval(() => {
      if (!journeyState.origin || !journeyState.destination) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
        return;
      }

      step++;
      const progress = step / SIMULATION_CONFIG.TOTAL_STEPS;

      // Interpolate between origin and destination
      const currentLat =
        journeyState.origin.lat +
        (journeyState.destination.lat - journeyState.origin.lat) * progress;
      const currentLng =
        journeyState.origin.lng +
        (journeyState.destination.lng - journeyState.origin.lng) * progress;

      setMockLocation({ lat: currentLat, lng: currentLng });

      if (step >= SIMULATION_CONFIG.TOTAL_STEPS) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
      }
    }, SIMULATION_CONFIG.UPDATE_INTERVAL);

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
