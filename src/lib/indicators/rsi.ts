/**
 * Calculates the Relative Strength Index (RSI) for a given set of close prices.
 * Standard RSI uses Wilder's smoothing technique.
 */
export function calculateRSI(prices: number[], period: number = 14): number[] {
  if (prices.length <= period) {
    return Array(prices.length).fill(50);
  }

  const rsi: number[] = Array(prices.length).fill(50);
  let avgGain = 0;
  let avgLoss = 0;

  // First RSI value calculations
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      avgGain += change;
    } else {
      avgLoss -= change;
    }
  }

  avgGain /= period;
  avgLoss /= period;

  rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  // Remaining RSI values
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    let gain = 0;
    let loss = 0;

    if (change > 0) {
      gain = change;
    } else {
      loss = -change;
    }

    // Wilder's smoothing
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }

  // Backfill the initial period
  for (let i = 0; i < period; i++) {
    rsi[i] = rsi[period];
  }

  return rsi;
}
