'use client';

import { useEffect, useRef, useState } from 'react';
import { Coordinates } from '@/types';
import { MAP_CONFIG } from '@/constants';

interface DebugMapProps {
  origin: Coordinates | null;
  destination: Coordinates | null;
  currentPosition: Coordinates | null;
  onMapClick: (lat: number, lng: number) => void;
}

export default function DebugMap({
  origin,
  destination,
  currentPosition,
  onMapClick,
}: DebugMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const originMarkerRef = useRef<google.maps.Marker | null>(null);
  const destinationMarkerRef = useRef<google.maps.Marker | null>(null);
  const currentMarkerRef = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!window.google || !mapRef.current || googleMapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
      center: origin || currentPosition || MAP_CONFIG.DEFAULT_CENTER,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add click listener to set mock location
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onMapClick(e.latLng.lat(), e.latLng.lng());
      }
    });

    googleMapRef.current = map;
    queueMicrotask(() => setIsLoaded(true));
  }, [origin, currentPosition, onMapClick]);

  // Update origin marker
  useEffect(() => {
    if (!googleMapRef.current || !origin) return;

    if (originMarkerRef.current) {
      originMarkerRef.current.setPosition(origin);
    } else {
      originMarkerRef.current = new google.maps.Marker({
        position: origin,
        map: googleMapRef.current,
        title: 'Origin',
        label: 'A',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#22c55e',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
    }
  }, [origin, isLoaded]);

  // Update destination marker
  useEffect(() => {
    if (!googleMapRef.current || !destination) return;

    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.setPosition(destination);
    } else {
      destinationMarkerRef.current = new google.maps.Marker({
        position: destination,
        map: googleMapRef.current,
        title: 'Destination',
        label: 'B',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
    }
  }, [destination, isLoaded]);

  // Update current position marker
  useEffect(() => {
    if (!googleMapRef.current || !currentPosition) return;

    if (currentMarkerRef.current) {
      currentMarkerRef.current.setPosition(currentPosition);
    } else {
      currentMarkerRef.current = new google.maps.Marker({
        position: currentPosition,
        map: googleMapRef.current,
        title: 'Current Position',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
      });
    }
  }, [currentPosition, isLoaded]);

  // Update polyline (route line)
  useEffect(() => {
    if (!googleMapRef.current || !origin || !destination) return;

    const path = [origin, destination];

    if (polylineRef.current) {
      polylineRef.current.setPath(path);
    } else {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#9333ea',
        strokeOpacity: 0.6,
        strokeWeight: 3,
        map: googleMapRef.current,
      });
    }
  }, [origin, destination, isLoaded]);

  // Fit bounds to show all markers
  useEffect(() => {
    if (!googleMapRef.current || !origin || !destination) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(origin);
    bounds.extend(destination);
    if (currentPosition) {
      bounds.extend(currentPosition);
    }

    googleMapRef.current.fitBounds(bounds);
  }, [origin, destination, currentPosition, isLoaded]);

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-64 rounded-lg border-2 border-gray-300" />
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
          <span>Origin</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          <span>Destination</span>
        </div>
      </div>
      <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow text-xs font-medium">
        💡 Click map to set location
      </div>
    </div>
  );
}
