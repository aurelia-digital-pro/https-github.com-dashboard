import { calculateEMA } from './ema';
import { MACDResult } from '../../types';

/**
 * Calculates MACD (Moving Average Convergence Divergence) with default 12, 26, 9 periods.
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): MACDResult[] {
  if (prices.length === 0) {
    return [];
  }

  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  const macdLine: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i]);
  }

  const signalLine = calculateEMA(macdLine, signalPeriod);
  const results: MACDResult[] = [];

  for (let i = 0; i < prices.length; i++) {
    results.push({
      macd: macdLine[i],
      signal: signalLine[i],
      histogram: macdLine[i] - signalLine[i],
    });
  }

  return results;
}
