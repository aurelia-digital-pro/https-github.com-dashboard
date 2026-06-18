/**
 * Calculates Average True Range (ATR) over a specified period (default 14).
 * True Range is the maximum of: (High - Low), |High - Prev Close|, |Low - Prev Close|
 */
export function calculateATR(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): number[] {
  const length = closes.length;
  if (length === 0) return [];

  const tr: number[] = Array(length).fill(0);
  const atr: number[] = Array(length).fill(0);

  // First candle's TR is High - Low
  if (length > 0) {
    tr[0] = highs[0] - lows[0];
  }

  for (let i = 1; i < length; i++) {
    const hL = highs[i] - lows[i];
    const hPC = Math.abs(highs[i] - closes[i - 1]);
    const lPC = Math.abs(lows[i] - closes[i - 1]);
    tr[i] = Math.max(hL, hPC, lPC);
  }

  if (length <= period) {
    const sum = tr.reduce((acc, val) => acc + val, 0);
    const avg = sum / length;
    return Array(length).fill(avg);
  }

  // First ATR is simple SMA of first 'period' True Ranges
  let sumTR = 0;
  for (let i = 0; i < period; i++) {
    sumTR += tr[i];
  }
  const initialATR = sumTR / period;
  atr[period - 1] = initialATR;

  // Fill in before
  for (let i = 0; i < period - 1; i++) {
    atr[i] = tr[i];
  }

  // Smooth the remaining values using Wilder's formula
  for (let i = period; i < length; i++) {
    atr[i] = (atr[i - 1] * (period - 1) + tr[i]) / period;
  }

  return atr;
}
