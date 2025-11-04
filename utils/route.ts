import { point, lineString } from '@turf/helpers';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { Coordinates, RouteData } from '@/types';
import { decodePolyline } from './polyline';

/**
 * Calculate progress along a route based on current position
 */
export function calculateRouteProgress(
  currentPosition: Coordinates,
  routeData: RouteData
): {
  progress: number; // 0-100
  distanceTraveled: number; // meters
  distanceRemaining: number; // kilometers
  isOffRoute: boolean;
  distanceFromRoute: number; // meters
} {
  const { decodedPath, totalDistance } = routeData;

  // Convert route to GeoJSON LineString
  const line = lineString(decodedPath.map((coord) => [coord.lng, coord.lat]));

  // Find nearest point on route to current position
  const currentPoint = point([currentPosition.lng, currentPosition.lat]);
  const snapped = nearestPointOnLine(line, currentPoint);

  // Distance from route (in kilometers, convert to meters)
  const distanceFromRoute = snapped.properties.dist! * 1000;

  // Determine if user is off route (more than 50 meters away)
  const OFF_ROUTE_THRESHOLD = 50; // meters
  const isOffRoute = distanceFromRoute > OFF_ROUTE_THRESHOLD;

  // Distance traveled along route (in kilometers, convert to meters)
  const distanceTraveled = snapped.properties.location! * 1000;

  // Calculate remaining distance
  const distanceRemaining = (totalDistance - distanceTraveled) / 1000; // Convert to km

  // Calculate progress percentage
  const progress = Math.min(Math.max((distanceTraveled / totalDistance) * 100, 0), 100);

  // If remaining distance is very small (< 100 meters), consider it as 0
  const DESTINATION_THRESHOLD_KM = 0.1; // 100 meters
  const adjustedDistanceRemaining =
    distanceRemaining < DESTINATION_THRESHOLD_KM ? 0 : distanceRemaining;

  return {
    progress,
    distanceTraveled,
    distanceRemaining: Math.max(adjustedDistanceRemaining, 0),
    isOffRoute,
    distanceFromRoute,
  };
}

/**
 * Fetch route from Google Maps Directions API
 */
export async function fetchRoute(
  origin: Coordinates,
  destination: Coordinates
): Promise<RouteData | null> {
  try {
    const directionsService = new google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: new google.maps.LatLng(origin.lat, origin.lng),
      destination: new google.maps.LatLng(destination.lat, destination.lng),
      travelMode: google.maps.TravelMode.DRIVING,
    });

    if (!result.routes[0]?.legs[0]) {
      console.error('No route found');
      return null;
    }

    const route = result.routes[0];
    const leg = route.legs[0];
    // @ts-expect-error - Google Maps types are inconsistent for overview_polyline
    const polylineEncoded = route.overview_polyline?.points || route.overview_polyline;

    return {
      polyline: polylineEncoded,
      decodedPath: decodePolyline(polylineEncoded),
      totalDistance: leg.distance!.value,
      duration: leg.duration!.value,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address
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
