'use client';

import { useMemo } from 'react';
import { Candle, MarketStructure, TrendDirection, MarketPhase } from '../types';
import { detectSwingPoints } from '../lib/structure/swingPoints';
import { detectBOS } from '../lib/structure/bos';
import { detectCHoCH } from '../lib/structure/choch';
import { detectLiquidity } from '../lib/structure/liquidity';
import { detectOrderBlocks } from '../lib/structure/orderBlocks';
import { detectFVGs } from '../lib/structure/fvg';

/**
 * Hook to execute comprehensive Smart Money Concepts (SMC) market structure analysis.
 */
export function useMarketStructure(candles: Candle[]): MarketStructure {
  return useMemo(() => {
    const defaultStructure: MarketStructure = {
      swings: [],
      breaks: [],
      trend: 'NEUTRAL',
      phase: 'ACCUMULATION',
      fvgs: [],
      orderBlocks: [],
    };

    if (candles.length < 20) return defaultStructure;

    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);
    const closes = candles.map(c => c.close);
    const opens = candles.map(c => c.open);
    const volumes = candles.map(c => c.volume);
    const times = candles.map(c => c.time);

    // 1. Detect Swing Points (radius 3)
    const swings = detectSwingPoints(highs, lows, times, 3);

    // 2. Classify dominant trend direction
    // Look at the sequence of the last 4 swing points
    let trend: TrendDirection = 'NEUTRAL';
    if (swings.length >= 4) {
      const lastHighs = swings.filter(s => s.type === 'HIGH').slice(-2);
      const lastLows = swings.filter(s => s.type === 'LOW').slice(-2);

      if (lastHighs.length === 2 && lastLows.length === 2) {
        const h2 = lastHighs[1].price;
        const h1 = lastHighs[0].price;
        const l2 = lastLows[1].price;
        const l1 = lastLows[0].price;

        if (h2 > h1 && l2 > l1) {
          trend = 'BULLISH'; // Higher Highs, Higher Lows
        } else if (h2 < h1 && l2 < l1) {
          trend = 'BEARISH'; // Lower Highs, Lower Lows
        }
      }
    }

    // 3. Detect Break of Structure (BOS)
    const bosBreaks = detectBOS(closes, highs, lows, swings, times);

    // 4. Detect Change of Character (CHoCH)
    const chochBreaks = detectCHoCH(closes, highs, lows, swings, trend, times);

    // Combine breaks into a single list
    const breaks = [...bosBreaks, ...chochBreaks].sort((a, b) => a.index - b.index);

    // 5. Detect Fair Value Gaps (FVGs)
    const fvgs = detectFVGs(highs, lows, closes);

    // 6. Detect Order Blocks (OBs)
    const orderBlocks = detectOrderBlocks(opens, highs, lows, closes, volumes, breaks);

    // Determine Market Phase (heuristic based on trend and structural breaks)
    let phase: MarketPhase = 'ACCUMULATION';
    if (trend === 'BULLISH') {
      phase = 'EXPANSION';
    } else if (trend === 'BEARISH') {
      phase = 'REVERSAL';
      const hasBearishCHoCH = breaks.some(b => b.type === 'CHOCH' && b.direction === 'BEARISH');
      if (!hasBearishCHoCH) {
        phase = 'DISTRIBUTION';
      }
    } else {
      phase = 'ACCUMULATION';
    }

    return {
      swings,
      breaks,
      trend,
      phase,
      fvgs,
      orderBlocks,
    };
  }, [candles]);
}
