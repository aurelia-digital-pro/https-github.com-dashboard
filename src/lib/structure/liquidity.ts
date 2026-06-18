import { LiquidityZone, SwingPoint } from '../../types';

/**
 * Detects liquidity zones (Equal Highs, Equal Lows, and Liquidity Pools)
 * and detects whether they have been swept (Stop Hunts).
 */
export function detectLiquidity(
  highs: number[],
  lows: number[],
  closes: number[],
  swingPoints: SwingPoint[],
  times: number[],
  tolerancePercent: number = 0.15 // 0.15% difference tolerance
): LiquidityZone[] {
  const zones: LiquidityZone[] = [];
  const length = closes.length;
  if (length === 0) return [];

  // 1. Group highs and lows to find "Equal Highs" and "Equal Lows"
  const swingHighs = swingPoints.filter(s => s.type === 'HIGH');
  const swingLows = swingPoints.filter(s => s.type === 'LOW');

  // Detect Equal Highs (Buy-side Liquidity accumulation)
  for (let i = 0; i < swingHighs.length; i++) {
    for (let j = i + 1; j < swingHighs.length; j++) {
      const h1 = swingHighs[i].price;
      const h2 = swingHighs[j].price;
      const pctDiff = (Math.abs(h1 - h2) / ((h1 + h2) / 2)) * 100;

      if (pctDiff <= tolerancePercent) {
        // We have built a strong Buy-side Liquidity Pool!
        const avgPrice = (h1 + h2) / 2;
        const id = `eqh-${swingHighs[i].index}-${swingHighs[j].index}`;
        
        // Let's see if it's already in our list
        if (!zones.some(z => z.id === id)) {
          zones.push({
            id,
            type: 'BUY_SIDE',
            priceHigh: avgPrice * 1.002,
            priceLow: avgPrice * 0.998,
            hitCount: 2,
            swept: false,
            timeCreated: times[swingHighs[j].index] || swingHighs[j].index,
          });
        }
      }
    }
  }

  // Detect Equal Lows (Sell-side Liquidity accumulation)
  for (let i = 0; i < swingLows.length; i++) {
    for (let j = i + 1; j < swingLows.length; j++) {
      const l1 = swingLows[i].price;
      const l2 = swingLows[j].price;
      const pctDiff = (Math.abs(l1 - l2) / ((l1 + l2) / 2)) * 100;

      if (pctDiff <= tolerancePercent) {
        // We have built a Sell-side Liquidity Pool!
        const avgPrice = (l1 + l2) / 2;
        const id = `eql-${swingLows[i].index}-${swingLows[j].index}`;

        if (!zones.some(z => z.id === id)) {
          zones.push({
            id,
            type: 'SELL_SIDE',
            priceHigh: avgPrice * 1.002,
            priceLow: avgPrice * 0.998,
            hitCount: 2,
            swept: false,
            timeCreated: times[swingLows[j].index] || swingLows[j].index,
          });
        }
      }
    }
  }

  // 2. Track Sweeps / Stop Hunts
  // Check if future candlesticks sweep above Buy Side or below Sell Side liquidity pool
  for (let i = 0; i < length; i++) {
    const currentHigh = highs[i];
    const currentLow = lows[i];
    const currentClose = closes[i];

    for (const zone of zones) {
      if (zone.swept) continue;

      if (times[i] <= zone.timeCreated) continue;

      if (zone.type === 'BUY_SIDE') {
        // Sweep occurs when high pierces the zone but close fails to sustain above it (close < zone price lower edge)
        if (currentHigh > zone.priceLow) {
          if (currentClose < zone.priceLow) {
            zone.swept = true;
          } else {
            zone.hitCount++;
          }
        }
      } else {
        // Sweep occurs when low pierces below zone but close pulls back up above it
        if (currentLow < zone.priceHigh) {
          if (currentClose > zone.priceHigh) {
            zone.swept = true;
          } else {
            zone.hitCount++;
          }
        }
      }
    }
  }

  return zones;
}
