'use client';

import { useMemo } from 'react';
import { Candle, IndicatorsState, MarketStructure, SignalAnalysis } from '../types';
import { scoreSignal } from '../lib/signals/scorer';
import { generateAIReasoning, AIReasoningReport } from '../lib/signals/reasoning';

export interface SignalPackage {
  analysis: SignalAnalysis;
  reasoning: AIReasoningReport;
}

/**
 * Hook to execute predictive signal scoring and diagnostic narrative generation under the active symbol.
 */
export function useSignalEngine(
  candles: Candle[],
  indicators: IndicatorsState,
  structure: MarketStructure
): SignalPackage {
  return useMemo(() => {
    const length = candles.length;
    
    // Default fallback state
    const fallbackAnalysis: SignalAnalysis = {
      confidence: 0,
      tier: 'NO TRADE',
      state: 'WAITING',
      reasons: ['Downloading enough candlestick units to initialize structural models'],
      invalidators: [],
      setupType: null,
      direction: 'NEUTRAL',
      riskLevel: 'MEDIUM',
      sessionQuality: 'LOW LIQUIDITY',
      volatilityRegime: 'BALANCED',
      breakdown: { structure: 0, liquidity: 0, volatility: 0, session: 0, trend: 0, momentum: 0 },
    };

    const fallbackReasoning: AIReasoningReport = {
      whyNow: 'Analyzing baseline market feeds. Please wait for enough historical logs to populate algorithms.',
      triggerFactors: [],
      invalidationTrigger: 'Wating for initial setup boundary checks.',
      bestFitEnvironment: 'Calibrating volatility filters.',
      confidenceBreakdownText: 'Calibrating scoring weights.',
    };

    if (length < 20) {
      return { analysis: fallbackAnalysis, reasoning: fallbackReasoning };
    }

    const currentIdx = length - 1;
    const lastClose = candles[currentIdx].close;

    // Detect if order block or FVG mitigations occurred inside the last 3 candles
    const recentBlocks = structure.orderBlocks.filter(ob => ob.index >= length - 5);
    const hasOrderBlockBounce = recentBlocks.length > 0;
    
    const recentFVGs = structure.fvgs.filter(f => f.index >= length - 5);
    const hasFVGMitigation = recentFVGs.length > 0;

    // Check if any recent swings look swept
    const recentSwings = structure.swings.filter(s => s.index >= length - 10);
    const hasLiquiditySweep = recentSwings.some(s => {
      // swept if low crossed below standard price support boundary
      return s.type === 'LOW' ? candles[currentIdx].low < s.price * 1.001 && lastClose > s.price : candles[currentIdx].high > s.price * 0.999 && lastClose < s.price;
    });

    const currentRSI = indicators.rsi[currentIdx] || 50;
    const currentADX = indicators.adx[currentIdx] || 25;
    const currentChop = indicators.choppiness[currentIdx] || 50;

    // Estimate session quality based on local time or hardcoded average
    const currentHours = new Date().getHours();
    let sessionName = 'ASIA';
    let sessionQuality = 4; // 1-15 scale
    if (currentHours >= 7 && currentHours <= 11) {
      sessionName = 'LONDON';
      sessionQuality = 11;
    } else if (currentHours >= 12 && currentHours <= 17) {
      sessionName = 'OVERLAP';
      sessionQuality = 15;
    } else if (currentHours >= 18 && currentHours <= 23) {
      sessionName = 'NEWYORK';
      sessionQuality = 12;
    }

    // Determine setups
    let activeSetup: 'BOS' | 'CHOCH' | 'OB' | 'FVG' | null = null;
    const lastBreak = structure.breaks[structure.breaks.length - 1];
    if (lastBreak && lastBreak.index >= length - 4) {
      activeSetup = lastBreak.type;
    } else if (hasOrderBlockBounce) {
      activeSetup = 'OB';
    } else if (hasFVGMitigation) {
      activeSetup = 'FVG';
    }

    const analysis = scoreSignal({
      trend: structure.trend,
      activeSetup,
      rsi: currentRSI,
      adx: currentADX,
      choppiness: currentChop,
      sessionQuality,
      sessionName,
      hasLiquiditySweep,
      hasFVGMitigation,
      hasOrderBlockBounce,
      atrChangePct: 1.0,
    });

    const reasoning = generateAIReasoning(
      'BTC/USDT',
      analysis,
      lastClose
    );

    return {
      analysis,
      reasoning,
    };
  }, [candles, indicators, structure]);
}
