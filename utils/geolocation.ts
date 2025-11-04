/**
 * Check geolocation permission status
 * @returns Promise resolving to permission state
 */
export async function checkLocationPermission(): Promise<PermissionState | null> {
  if (!navigator.permissions) {
    return null;
  }

  try {
    const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    return permissionStatus.state;
  } catch (error) {
    console.warn('Could not check location permission:', error);
    return null;
  }
}

/**
 * Get human-readable error message from geolocation error
 * @param error GeolocationPositionError
 * @returns User-friendly error message
 */
export function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case 1:
      return 'Location permission denied. Please enable location access and try again.';
    case 2:
      return 'Location unavailable. Please check your device settings and ensure location services are enabled.';
    case 3:
      return 'Location request timed out. Please try again.';
    default:
      return error.message || 'Unknown location error';
  }
}
