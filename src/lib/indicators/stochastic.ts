import { StochasticResult } from '../../types';

/**
 * Calculates Stochastic Oscillator (%K, %D). Default (14, 3, 3).
 */
export function calculateStochastic(
  highs: number[],
  lows: number[],
  closes: number[],
  kPeriod: number = 14,
  kSlowing: number = 3,
  dPeriod: number = 3
): StochasticResult[] {
  const length = closes.length;
  if (length === 0) return [];

  const rawK: number[] = Array(length).fill(50);
  const smoothedK: number[] = Array(length).fill(50);
  const results: StochasticResult[] = [];

  // 1. Calculate raw %K
  for (let i = 0; i < length; i++) {
    if (i < kPeriod - 1) {
      continue;
    }

    let lowestLow = Infinity;
    let highestHigh = -Infinity;

    for (let j = i - kPeriod + 1; j <= i; j++) {
      if (lows[j] < lowestLow) lowestLow = lows[j];
      if (highs[j] > highestHigh) highestHigh = highs[j];
    }

    const denom = highestHigh - lowestLow;
    rawK[i] = denom === 0 ? 50 : ((closes[i] - lowestLow) / denom) * 100;
  }

  // 2. Smooth %K with simple moving average
  for (let i = 0; i < length; i++) {
    if (i < kPeriod - 1) {
      continue;
    }

    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - kSlowing + 1); j <= i; j++) {
      sum += rawK[j];
      count++;
    }
    smoothedK[i] = count > 0 ? sum / count : 50;
  }

  // 3. Smooth %D as SMA of %K
  for (let i = 0; i < length; i++) {
    let sumD = 0;
    let countD = 0;
    for (let j = Math.max(0, i - dPeriod + 1); j <= i; j++) {
      sumD += smoothedK[j];
      countD++;
    }
    
    results.push({
      k: smoothedK[i],
      d: countD > 0 ? sumD / countD : 50,
    });
  }

  return results;
}
