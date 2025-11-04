'use client';

import { useEffect, useRef, useState } from 'react';

interface DestinationSearchProps {
  onDestinationSelect: (place: google.maps.places.PlaceResult) => void;
}

export default function DestinationSearch({ onDestinationSelect }: DestinationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
      });

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.geometry) {
          onDestinationSelect(place);
        }
      });
    }
  }, [isLoaded, onDestinationSelect]);

  return (
    <div className="w-full max-w-md">
      <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
        Where are we going?
      </label>
      <input
        ref={inputRef}
        id="destination"
        type="text"
        placeholder="Enter destination address..."
        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
}
