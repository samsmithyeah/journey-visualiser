// Geolocation configuration
export const GEOLOCATION_CONFIG = {
  enableHighAccuracy: true,
  timeout: 60000, // 60 seconds timeout - very generous for GPS acquisition
  maximumAge: 30000, // Allow cached positions up to 30 seconds old for better reliability
};

// Error handling thresholds
export const ERROR_THRESHOLDS = {
  LOG_FREQUENCY: 10, // Log every nth error to avoid console spam
  DISPLAY_THRESHOLD: 20, // Show error to user after this many consecutive failures
};

// Simulation configuration
export const SIMULATION_CONFIG = {
  TOTAL_STEPS: 100, // Number of steps to reach destination
  UPDATE_INTERVAL: 500, // Update every 500ms
};

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 51.5074, lng: -0.1278 }, // London
  DEFAULT_ZOOM: 10,
};
