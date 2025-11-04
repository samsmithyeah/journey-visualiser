import { Coordinates } from '@/types';

/**
 * Get route distance using Google Directions API
 * @param origin Starting coordinates
 * @param destination Ending coordinates
 * @returns Distance in kilometers or null if failed
 */
export async function getRouteDistance(
  origin: Coordinates,
  destination: Coordinates
): Promise<number | null> {
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
}

/**
 * Get remaining route distance from current position to destination
 * @param current Current coordinates
 * @param destination Destination coordinates
 * @returns Distance in kilometers or null if failed
 */
export async function getRemainingRouteDistance(
  current: Coordinates,
  destination: Coordinates
): Promise<number | null> {
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
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
 * @param coords Coordinates to reverse geocode
 * @returns Promise resolving to formatted address or null
 */
export async function reverseGeocode(coords: Coordinates): Promise<string | null> {
  if (!window.google) return null;

  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat: coords.lat, lng: coords.lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address;
        // Extract just the city/area if possible (remove country, full details)
        const shortAddress = address.split(',').slice(0, 2).join(',');
        resolve(shortAddress || address);
      } else {
        resolve(null);
      }
    });
  });
}
