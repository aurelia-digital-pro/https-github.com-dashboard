import { StructureBreak, SwingPoint } from '../../types';

/**
 * Detects Breaks of Structure (BOS).
 * A Bullish BOS occurs when price closes above a previous Swing High in an uptrend.
 * A Bearish BOS occurs when price closes below a previous Swing Low in a downtrend.
 */
export function detectBOS(
  closes: number[],
  highs: number[],
  lows: number[],
  swingPoints: SwingPoint[],
  times: number[]
): StructureBreak[] {
  const breaks: StructureBreak[] = [];
  const length = closes.length;

  let lastHigh: SwingPoint | null = null;
  let lastLow: SwingPoint | null = null;

  // Track the sequence of swing points to find immediate structures
  for (let i = 0; i < length; i++) {
    // Check if a swing point was formed at or before this index
    const activeSwings = swingPoints.filter(s => s.index <= i);
    const highsPrior = activeSwings.filter(s => s.type === 'HIGH');
    const lowsPrior = activeSwings.filter(s => s.type === 'LOW');

    if (highsPrior.length > 0) {
      lastHigh = highsPrior[highsPrior.length - 1];
    }
    if (lowsPrior.length > 0) {
      lastLow = lowsPrior[lowsPrior.length - 1];
    }

    // Check for standard Break of Structure
    if (lastHigh && closes[i] > lastHigh.price && i > lastHigh.index) {
      // Confirmed Bullish BOS
      const alreadyLogged = breaks.some(b => b.index === i || (b.type === 'BOS' && b.breakPrice === lastHigh?.price));
      if (!alreadyLogged) {
        breaks.push({
          type: 'BOS',
          direction: 'BULLISH',
          breakPrice: lastHigh.price,
          triggerPrice: closes[i],
          index: i,
          time: times[i] || i,
          confirmed: true,
        });
      }
    }

    if (lastLow && closes[i] < lastLow.price && i > lastLow.index) {
      // Confirmed Bearish BOS
      const alreadyLogged = breaks.some(b => b.index === i || (b.type === 'BOS' && b.breakPrice === lastLow?.price));
      if (!alreadyLogged) {
        breaks.push({
          type: 'BOS',
          direction: 'BEARISH',
          breakPrice: lastLow.price,
          triggerPrice: closes[i],
          index: i,
          time: times[i] || i,
          confirmed: true,
        });
      }
    }
  }

  return breaks;
}
