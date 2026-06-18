/**
 * Calculates the Average Directional Index (ADX).
 * Measures standard trend strength over a 14-period lookback.
 */
export function calculateADX(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number = 14
): number[] {
  const length = closes.length;
  if (length <= period * 2) {
    return Array(length).fill(25); // Default neutral ADX
  }

  const adxList: number[] = Array(length).fill(25);
  const plusDM: number[] = Array(length).fill(0);
  const minusDM: number[] = Array(length).fill(0);
  const tr: number[] = Array(length).fill(0);

  // 1. Calculate +DM, -DM, and TR
  for (let i = 1; i < length; i++) {
    const highDiff = highs[i] - highs[i - 1];
    const lowDiff = lows[i - 1] - lows[i];

    if (highDiff > lowDiff && highDiff > 0) {
      plusDM[i] = highDiff;
    } else {
      plusDM[i] = 0;
    }

    if (lowDiff > highDiff && lowDiff > 0) {
      minusDM[i] = lowDiff;
    } else {
      minusDM[i] = 0;
    }

    const hL = highs[i] - lows[i];
    const hPC = Math.abs(highs[i] - closes[i - 1]);
    const lPC = Math.abs(lows[i] - closes[i - 1]);
    tr[i] = Math.max(hL, hPC, lPC);
  }

  // 2. Smooth +DM, -DM, and TR using Wilder's technique
  const smoothedPlusDM: number[] = Array(length).fill(0);
  const smoothedMinusDM: number[] = Array(length).fill(0);
  const smoothedTR: number[] = Array(length).fill(0);

  let initialPlusDM = 0;
  let initialMinusDM = 0;
  let initialTR = 0;

  for (let i = 1; i <= period; i++) {
    initialPlusDM += plusDM[i];
    initialMinusDM += minusDM[i];
    initialTR += tr[i];
  }

  smoothedPlusDM[period] = initialPlusDM;
  smoothedMinusDM[period] = initialMinusDM;
  smoothedTR[period] = initialTR;

  for (let i = period + 1; i < length; i++) {
    smoothedPlusDM[i] = smoothedPlusDM[i - 1] - (smoothedPlusDM[i - 1] / period) + plusDM[i];
    smoothedMinusDM[i] = smoothedMinusDM[i - 1] - (smoothedMinusDM[i - 1] / period) + minusDM[i];
    smoothedTR[i] = smoothedTR[i - 1] - (smoothedTR[i - 1] / period) + tr[i];
  }

  // 3. Compute +DI, -DI, DX
  const dxList: number[] = Array(length).fill(0);
  for (let i = period; i < length; i++) {
    const trVal = smoothedTR[i];
    if (trVal === 0) continue;

    const plusDI = (smoothedPlusDM[i] / trVal) * 100;
    const minusDI = (smoothedMinusDM[i] / trVal) * 100;

    const diff = Math.abs(plusDI - minusDI);
    const sum = plusDI + minusDI;

    dxList[i] = sum === 0 ? 0 : (diff / sum) * 100;
  }

  // 4. Smooth DX to get ADX
  let initialDXSum = 0;
  for (let i = period; i < period * 2; i++) {
    initialDXSum += dxList[i];
  }
  
  let currentADX = initialDXSum / period;
  adxList[period * 2 - 1] = currentADX;

  // Fill preceding ADX indices
  for (let i = 0; i < period * 2 - 1; i++) {
    adxList[i] = currentADX;
  }

  for (let i = period * 2; i < length; i++) {
    currentADX = (adxList[i - 1] * (period - 1) + dxList[i]) / period;
    adxList[i] = currentADX;
  }

  return adxList;
}
