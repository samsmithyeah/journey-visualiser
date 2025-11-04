// Core coordinate interface used throughout the app
export interface Coordinates {
  lat: number;
  lng: number;
}

// Journey state management
export interface JourneyState {
  origin: Coordinates | null;
  destination: Coordinates | null;
  currentPosition: Coordinates | null;
  progress: number;
  totalDistance: number | null;
  remainingDistance: number | null;
  isTracking: boolean;
  error: string | null;
}

// Google Maps autocomplete prediction
export interface Prediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Progress calculation result
export interface ProgressResult {
  progress: number;
  remainingDistance: number;
}
