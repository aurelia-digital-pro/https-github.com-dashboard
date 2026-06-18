import { SwingPoint } from '../../types';

/**
 * Detects Swing Highs and Swing Lows.
 * A Swing High is defined as a peak with lower high peaks on both sides within 'radius' bars.
 * A Swing Low is a valley with higher low valleys on both sides within 'radius' bars.
 */
export function detectSwingPoints(
  highs: number[],
  lows: number[],
  times: number[],
  radius: number = 3
): SwingPoint[] {
  const swings: SwingPoint[] = [];
  const length = highs.length;

  for (let i = radius; i < length - radius; i++) {
    const currentHigh = highs[i];
    const currentLow = lows[i];

    let isSwingHigh = true;
    let isSwingLow = true;

    for (let j = i - radius; j <= i + radius; j++) {
      if (j === i) continue;

      if (highs[j] >= currentHigh) {
        isSwingHigh = false;
      }
      if (lows[j] <= currentLow) {
        isSwingLow = false;
      }
    }

    if (isSwingHigh) {
      swings.push({
        index: i,
        type: 'HIGH',
        price: currentHigh,
        time: times[i] || i,
        confirmed: true,
      });
    }

    if (isSwingLow) {
      swings.push({
        index: i,
        type: 'LOW',
        price: currentLow,
        time: times[i] || i,
        confirmed: true,
      });
    }
  }

  return swings;
}
