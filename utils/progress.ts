import { Coordinates, ProgressResult } from '@/types';
import { calculateDistance } from './distance';
import { getRemainingRouteDistance } from './googleMaps';

/**
 * Calculate progress percentage using actual route distances
 * @param current Current position
 * @param destination Destination coordinates
 * @param totalRouteDistance Total route distance in kilometers
 * @returns Progress percentage and remaining distance
 */
export async function calculateProgress(
  current: Coordinates,
  destination: Coordinates,
  totalRouteDistance: number
): Promise<ProgressResult> {
  console.log('\n📊 [calculateProgress] Starting calculation...');
  console.log('  Total route distance:', totalRouteDistance, 'km');

  // Get remaining route distance from current position to destination
  const remainingDistance = await getRemainingRouteDistance(current, destination);

  if (remainingDistance === null) {
    // Fallback to straight-line calculation if API fails
    console.log('⚠️ [calculateProgress] Using FALLBACK calculation (straight-line)');
    const straightLineRemaining = calculateDistance(current, destination);
    const progress = Math.min(
      Math.max(((totalRouteDistance - straightLineRemaining) / totalRouteDistance) * 100, 0),
      100
    );
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
  console.log(
    '  Clamped:',
    progress !== clampedProgress
      ? `Yes (${progress.toFixed(2)}% → ${clampedProgress.toFixed(2)}%)`
      : 'No'
  );
  console.log('─────────────────────────────────\n');

  return { progress: clampedProgress, remainingDistance };
}
