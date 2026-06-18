/**
 * Calculates rolling Volume Weighted Average Price (VWAP).
 * Typical Price = (High + Low + Close) / 3
 * VWAP = Cum(Typical Price * Volume) / Cum(Volume)
 */
export function calculateVWAP(
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[]
): number[] {
  const length = closes.length;
  if (length === 0) return [];

  const vwap: number[] = Array(length).fill(0);
  let cumTypicalVolume = 0;
  let cumVolume = 0;

  for (let i = 0; i < length; i++) {
    const typicalPrice = (highs[i] + lows[i] + closes[i]) / 3;
    cumTypicalVolume += typicalPrice * (volumes[i] || 1);
    cumVolume += (volumes[i] || 1);

    vwap[i] = cumVolume === 0 ? typicalPrice : cumTypicalVolume / cumVolume;
  }

  return vwap;
}
