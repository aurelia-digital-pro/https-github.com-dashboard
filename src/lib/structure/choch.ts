import { StructureBreak, SwingPoint } from '../../types';

/**
 * Detects Change of Character (CHoCH).
 * CHoCH occurs when price reverses and breaks the opposite structure of the current trend direction.
 */
export function detectCHoCH(
  closes: number[],
  highs: number[],
  lows: number[],
  swingPoints: SwingPoint[],
  currentTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL',
  times: number[]
): StructureBreak[] {
  const breaks: StructureBreak[] = [];
  const length = closes.length;

  let lastHigh: SwingPoint | null = null;
  let lastLow: SwingPoint | null = null;

  for (let i = 0; i < length; i++) {
    const activeSwings = swingPoints.filter(s => s.index <= i);
    const highsPrior = activeSwings.filter(s => s.type === 'HIGH');
    const lowsPrior = activeSwings.filter(s => s.type === 'LOW');

    if (highsPrior.length > 0) lastHigh = highsPrior[highsPrior.length - 1];
    if (lowsPrior.length > 0) lastLow = lowsPrior[lowsPrior.length - 1];

    if (currentTrend === 'BEARISH' && lastHigh && closes[i] > lastHigh.price && i > lastHigh.index) {
      // Bearish to Bullish Reversal → Bullish CHoCH
      const alreadyLogged = breaks.some(b => b.index === i || (b.type === 'CHOCH' && b.breakPrice === lastHigh?.price));
      if (!alreadyLogged) {
        breaks.push({
          type: 'CHOCH',
          direction: 'BULLISH',
          breakPrice: lastHigh.price,
          triggerPrice: closes[i],
          index: i,
          time: times[i] || i,
          confirmed: true,
        });
      }
    }

    if (currentTrend === 'BULLISH' && lastLow && closes[i] < lastLow.price && i > lastLow.index) {
      // Bullish to Bearish Reversal → Bearish CHoCH
      const alreadyLogged = breaks.some(b => b.index === i || (b.type === 'CHOCH' && b.breakPrice === lastLow?.price));
      if (!alreadyLogged) {
        breaks.push({
          type: 'CHOCH',
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
