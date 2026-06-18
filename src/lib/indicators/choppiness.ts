/**
 * Calculates the Choppiness Index.
 * Formula: 100 * LOG10( Sum(ATR(1), P) / (MaxHigh(P) - MinLow(P)) ) / LOG10(P)
 * Output ranges from 0 to 100, where values > 61.8 indicate ranging listlessness and < 38.2 indicate strong breakout expansion.
 */
export function calculateChoppiness(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): number[] {
  const length = closes.length;
  if (length <= period) {
    return Array(length).fill(50); // Default neutral
  }

  const chop: number[] = Array(length).fill(50);

  // 1. Calculate True Ranges (ATR(1))
  const tr: number[] = Array(length).fill(0);
  tr[0] = highs[0] - lows[0];
  for (let i = 1; i < length; i++) {
    const hL = highs[i] - lows[i];
    const hPC = Math.abs(highs[i] - closes[i - 1]);
    const lPC = Math.abs(lows[i] - closes[i - 1]);
    tr[i] = Math.max(hL, hPC, lPC);
  }

  // 2. Compute Chop
  const logPeriod = Math.log10(period);

  for (let i = period - 1; i < length; i++) {
    // Sum of True Ranges over lookback
    let sumTR = 0;
    let maxHigh = -Infinity;
    let minLow = Infinity;

    for (let j = i - period + 1; j <= i; j++) {
      sumTR += tr[j];
      if (highs[j] > maxHigh) maxHigh = highs[j];
      if (lows[j] < minLow) minLow = lows[j];
    }

    const priceRange = maxHigh - minLow;
    if (priceRange === 0) {
      chop[i] = 50;
    } else {
      const value = sumTR / priceRange;
      chop[i] = (100 * Math.log10(value)) / logPeriod;
    }
  }

  // Backfill first period
  const firstValidChop = chop[period - 1];
  for (let i = 0; i < period - 1; i++) {
    chop[i] = firstValidChop;
  }

  return chop;
}
