import { FairValueGap } from '../../types';

/**
 * Detects Fair Value Gaps (FVG / Imbalances) or 3-candle gaps.
 * Also checks if they have been subsequentely filled / mitigated.
 */
export function detectFVGs(
  highs: number[],
  lows: number[],
  closes: number[]
): FairValueGap[] {
  const fvgs: FairValueGap[] = [];
  const length = closes.length;
  if (length < 3) return [];

  // 1. Detect FVGs
  for (let i = 2; i < length; i++) {
    const highC1 = highs[i - 2];
    const lowC1 = lows[i - 2];
    
    const highC2 = highs[i - 1];
    const lowC2 = lows[i - 1];

    const highC3 = highs[i];
    const lowC3 = lows[i];

    // Bullish FVG (Gap created by explosive upward movement)
    // Candle 1 High is less than Candle 3 Low
    if (lowC3 > highC1 && closes[i - 1] > closes[i - 2]) {
      // Keep only high quality gaps with large body for Candle 2
      const body2 = Math.abs(closes[i - 1] - (closes[i - 2] || closes[i - 1]));
      if (body2 > (highC2 - lowC2) * 0.4) {
        fvgs.push({
          index: i - 1,
          type: 'BULLISH',
          high: lowC3,
          low: highC1,
          mitigated: false,
        });
      }
    }

    // Bearish FVG (Gap created by explosive downward movement)
    // Candle 1 Low is greater than Candle 3 High
    if (highC3 < lowC1 && closes[i - 1] < closes[i - 2]) {
      const body2 = Math.abs(closes[i - 1] - (closes[i - 2] || closes[i - 1]));
      if (body2 > (highC2 - lowC2) * 0.4) {
        fvgs.push({
          index: i - 1,
          type: 'BEARISH',
          high: lowC1,
          low: highC3,
          mitigated: false,
        });
      }
    }
  }

  // 2. Resolve Mitigation / Fill status
  // A gap is mitigated when subsequent candle's wick traverses the gap territory completely
  for (let i = 0; i < fvgs.length; i++) {
    const gap = fvgs[i];
    const startIndex = gap.index + 2;

    for (let j = startIndex; j < length; j++) {
      if (gap.type === 'BULLISH') {
        // Mitigated if any subsequent candle low drops below the gap high or fills it
        if (lows[j] <= gap.low) {
          gap.mitigated = true;
          gap.mitigatedPrice = lows[j];
          break;
        }
      } else {
        // Mitigated if any subsequent candle high climbs above the gap low or fills it
        if (highs[j] >= gap.high) {
          gap.mitigated = true;
          gap.mitigatedPrice = highs[j];
          break;
        }
      }
    }
  }

  return fvgs;
}
