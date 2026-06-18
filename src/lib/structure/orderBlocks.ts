import { OrderBlock, StructureBreak } from '../../types';

/**
 * Detects Order Blocks (OB).
 * A Bullish OB is defined as the last bearish candle prior to a strong bullish breakout (often creating a BOS).
 * A Bearish OB is defined as the last bullish candle prior to a strong bearish breakout.
 */
export function detectOrderBlocks(
  opens: number[],
  highs: number[],
  lows: number[],
  closes: number[],
  volumes: number[],
  breaks: StructureBreak[]
): OrderBlock[] {
  const orderBlocks: OrderBlock[] = [];
  const length = closes.length;
  if (length < 5) return [];

  // 1. Analyze Breaks of Structure to identify valid trigger milestones
  for (const brk of breaks) {
    const breakIndex = brk.index;
    
    if (brk.direction === 'BULLISH') {
      // Look backward from the break index to find the last bearish candlestick
      for (let i = breakIndex - 1; i > Math.max(0, breakIndex - 15); i--) {
        const isBearishCandle = closes[i] < opens[i];
        if (isBearishCandle) {
          // Found Last Bearish Candle! This is our Bullish Order Block.
          const strength = volumes[breakIndex] > (volumes[i] || 1) * 1.5 ? 'STRONG' : 'MEDIUM';
          
          const alreadyLinked = orderBlocks.some(ob => ob.index === i && ob.type === 'BULLISH');
          if (!alreadyLinked) {
            orderBlocks.push({
              type: 'BULLISH',
              high: highs[i],
              low: lows[i],
              volume: volumes[i] || 0,
              index: i,
              mitigated: false,
              strength,
            });
          }
          break;
        }
      }
    } else {
      // Look backward for the last bullish candlestick
      for (let i = breakIndex - 1; i > Math.max(0, breakIndex - 15); i--) {
        const isBullishCandle = closes[i] > opens[i];
        if (isBullishCandle) {
          // Found Last Bullish Candle! This is our Bearish Order Block.
          const strength = volumes[breakIndex] > (volumes[i] || 1) * 1.5 ? 'STRONG' : 'MEDIUM';

          const alreadyLinked = orderBlocks.some(ob => ob.index === i && ob.type === 'BEARISH');
          if (!alreadyLinked) {
            orderBlocks.push({
              type: 'BEARISH',
              high: highs[i],
              low: lows[i],
              volume: volumes[i] || 0,
              index: i,
              mitigated: false,
              strength,
            });
          }
          break;
        }
      }
    }
  }

  // 2. Resolve Mitigation status
  // An Order Block is mitigated when future price action touches its zone (retests it)
  for (const ob of orderBlocks) {
    const startIndex = ob.index + 2;
    for (let j = startIndex; j < length; j++) {
      if (ob.type === 'BULLISH') {
        if (lows[j] < ob.low) {
          ob.mitigated = true;
          break;
        }
      } else {
        if (highs[j] > ob.high) {
          ob.mitigated = true;
          break;
        }
      }
    }
  }

  return orderBlocks;
}
