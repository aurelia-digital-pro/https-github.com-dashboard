/**
 * Calculates the Exponential Moving Average (EMA) for a given lookback period.
 */
export function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length === 0) {
    return [];
  }

  const ema: number[] = Array(prices.length).fill(0);
  
  if (prices.length < period) {
    // Return standard average or match prices if insufficient length
    const sum = prices.reduce((acc, val) => acc + val, 0);
    const avg = sum / prices.length;
    return Array(prices.length).fill(avg);
  }

  // Calculate first value as simple moving average (SMA)
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += prices[i];
  }
  const sma = sum / period;
  ema[period - 1] = sma;

  // Smoothing multiplier
  const multiplier = 2 / (period + 1);

  // Fill in before the period
  for (let i = 0; i < period - 1; i++) {
    ema[i] = prices[i];
  }

  // Calculate EMA
  for (let i = period; i < prices.length; i++) {
    ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
  }

  return ema;
}
