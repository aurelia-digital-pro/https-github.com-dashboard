import { BollingerBandsResult } from '../../types';

/**
 * Calculates Bollinger Bands (BB) using an SMA of 20 periods and standard deviation multiplier of 2.
 */
export function calculateBollingerBands(
  prices: number[],
  period: number = 20,
  multiplier: number = 2
): BollingerBandsResult[] {
  if (prices.length === 0) {
    return [];
  }

  const results: BollingerBandsResult[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      // Not enough data, fill with placeholders
      results.push({
        upper: prices[i],
        middle: prices[i],
        lower: prices[i],
      });
      continue;
    }

    // Calculate SMA
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += prices[j];
    }
    const sma = sum / period;

    // Calculate Standard Deviation
    let varianceSum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      varianceSum += Math.pow(prices[j] - sma, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);

    results.push({
      upper: sma + multiplier * stdDev,
      middle: sma,
      lower: sma - multiplier * stdDev,
    });
  }

  return results;
}
