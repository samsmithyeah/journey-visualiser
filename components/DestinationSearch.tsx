'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Prediction } from '@/types';

interface DestinationSearchProps {
  onDestinationSelect: (place: google.maps.places.PlaceResult) => void;
}

export default function DestinationSearch({ onDestinationSelect }: DestinationSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    // Load Google Maps script with async loading pattern
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      // Using queueMicrotask to defer state update until after render
      queueMicrotask(() => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);

    if (!value.trim()) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    if (!isLoaded) return;

    try {
      // Use the new AutocompleteSuggestion API
      const { AutocompleteSuggestion } = (await google.maps.importLibrary(
        'places'
      )) as google.maps.PlacesLibrary;

      const request = {
        input: value,
        // Note: Can only specify one type when using type collections like (regions)
        // Omitting includedPrimaryTypes to get all place types (addresses, businesses, landmarks, etc.)
      };

      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

      console.log('Autocomplete suggestions:', suggestions);

      if (suggestions && suggestions.length > 0) {
        // Convert suggestions to our Prediction format
        const convertedPredictions: Prediction[] = suggestions.map((suggestion) => {
          // Access the properties directly (they're getters, not methods)
          const placePrediction = suggestion.placePrediction;
          const text = placePrediction?.text;
          const mainText = placePrediction?.mainText;
          const secondaryText = placePrediction?.secondaryText;

          console.log('Text:', text?.text);
          console.log('Main text:', mainText?.text);
          console.log('Secondary text:', secondaryText?.text);

          return {
            description: text?.text || '',
            place_id: placePrediction?.placeId || '',
            structured_formatting: {
              main_text: mainText?.text || '',
              secondary_text: secondaryText?.text || '',
            },
          };
        });

        console.log('Converted predictions:', convertedPredictions);
        setPredictions(convertedPredictions);
        setShowDropdown(true);
      } else {
        console.log('No suggestions returned');
        setPredictions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectPrediction = async (placeId: string, description: string) => {
    setInputValue(description);
    setShowDropdown(false);
    setPredictions([]);

    // Get place details using the new Place API
    try {
      const { Place } = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
      const place = new Place({
        id: placeId,
      });

      // Fetch the place details we need
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location', 'id'],
      });

      // Convert to PlaceResult format for compatibility
      const placeResult: google.maps.places.PlaceResult = {
        name: place.displayName ?? undefined,
        formatted_address: place.formattedAddress ?? undefined,
        place_id: place.id,
        geometry: place.location
          ? {
              location: place.location,
            }
          : undefined,
      };

      onDestinationSelect(placeResult);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && predictions[selectedIndex]) {
          handleSelectPrediction(
            predictions[selectedIndex].place_id,
            predictions[selectedIndex].description
          );
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="w-full max-w-md relative">
      <input
        ref={inputRef}
        id="destination"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (predictions.length > 0) setShowDropdown(true);
        }}
        placeholder="Enter destination address..."
        className="w-full px-6 py-4 text-xl font-semibold border-4 border-purple-400 rounded-3xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 outline-none shadow-2xl bg-white/90 backdrop-blur-sm"
        autoComplete="off"
      />

      {/* Custom Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-purple-300 overflow-hidden"
        >
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              onClick={() => handleSelectPrediction(prediction.place_id, prediction.description)}
              className={`w-full text-left px-6 py-4 transition-all border-b-2 border-purple-100 last:border-b-0 ${
                index === selectedIndex
                  ? 'bg-gradient-to-r from-purple-200 to-pink-200'
                  : 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 mt-1 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-lg">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="font-semibold text-gray-600 text-sm">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
