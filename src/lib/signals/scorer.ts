import { SignalAnalysis, SignalTier, SignalState, TradeDirection, RiskLevel } from '../../types';

/**
 * Probabilistic Signal Scoring Engine.
 * Takes indicators, structure, sessions, risk factors, and calculates a professional 0-100 rating.
 */
export function scoreSignal(params: {
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  activeSetup: 'BOS' | 'CHOCH' | 'OB' | 'FVG' | null;
  rsi: number;
  adx: number;
  choppiness: number;
  sessionQuality: number; // 0-15
  sessionName: string;
  hasLiquiditySweep: boolean;
  hasFVGMitigation: boolean;
  hasOrderBlockBounce: boolean;
  atrChangePct: number; // volatility change representation
}): SignalAnalysis {
  let structureScore = 0;
  let liquidityScore = 0;
  let volatilityScore = 0;
  let sessionScore = 0;
  let trendScore = 0;
  let momentumScore = 0;

  const reasons: string[] = [];
  const invalidators: string[] = [];
  let direction: TradeDirection = 'NEUTRAL';
  let setupType = params.activeSetup;

  // 1. Structure Score (0-20)
  if (params.trend !== 'NEUTRAL') {
    structureScore += 10;
    reasons.push(`Aligned with general market trend: ${params.trend}`);
  } else {
    invalidators.push('Market structure is currently flat / consolidating');
  }

  if (params.activeSetup === 'CHOCH') {
    structureScore += 10;
    reasons.push('High-conviction Change of Character structure shift identified');
  } else if (params.activeSetup === 'BOS') {
    structureScore += 8;
    reasons.push('Break of Structure confirms trend continuation impulse');
  } else if (params.activeSetup === 'OB') {
    structureScore += 7;
    reasons.push('Price mitigation within active institutional Order Block');
  } else if (params.activeSetup === 'FVG') {
    structureScore += 5;
    reasons.push('Fair Value Gap imbalance zone retested');
  }

  // Set trade direction based on structure alignment
  if (params.trend === 'BULLISH') {
    direction = 'LONG';
  } else if (params.trend === 'BEARISH') {
    direction = 'SHORT';
  } else if (params.activeSetup === 'CHOCH') {
    // If CHOCH is Bullish, trade LONG
    direction = 'LONG';
  }

  // 2. Liquidity Confirmation (0-20)
  if (params.hasLiquiditySweep) {
    liquidityScore += 15;
    reasons.push('Stop-hunt liquidity sweep complete (retail hands flushed)');
  }
  if (params.hasOrderBlockBounce) {
    liquidityScore += 5;
    reasons.push('Order Block bounce confirmed with high buying/selling pressure');
  }

  // 3. Volatility Suitability (0-15)
  // Optimal choppiness is between 35 and 55 for clean trade expansion
  if (params.choppiness < 38) {
    volatilityScore += 15;
    reasons.push(`Clean breakout volatility profile: Choppines Index is low (${params.choppiness.toFixed(1)})`);
  } else if (params.choppiness >= 38 && params.choppiness <= 58) {
    volatilityScore += 10;
    reasons.push(`Steady directional trend volatility profile (Chop Index: ${params.choppiness.toFixed(1)})`);
  } else {
    volatilityScore += 2;
    invalidators.push(`Extreme range choppiness: Chop Index is high (${params.choppiness.toFixed(1)})`);
  }

  // 4. Session Quality (0-15)
  sessionScore = Math.min(15, params.sessionQuality);
  if (params.sessionQuality >= 10) {
    reasons.push(`Optimal volume window: Executing in high liquidity ${params.sessionName} session`);
  } else if (params.sessionQuality >= 5) {
    reasons.push(`Moderate volume session window: ${params.sessionName}`);
  } else {
    invalidators.push(`Low liquidity session window: ${params.sessionName} is prone to random spikes`);
  }

  // 5. Trend Strength ADX-based (0-15)
  if (params.adx > 25) {
    trendScore += 15;
    reasons.push(`Strong directional trend confirmed: ADX is ${params.adx.toFixed(1)}`);
  } else if (params.adx > 18) {
    trendScore += 10;
    reasons.push(`Emerging trend phase tracked: ADX is ${params.adx.toFixed(1)}`);
  } else {
    trendScore += 3;
    invalidators.push(`Extremely weak trend profile: ADX is sluggish (${params.adx.toFixed(1)})`);
  }

  // 6. Momentum Score (0-15)
  // For long, we want RSI to be rising, or oversold (<35) rebounding.
  // For short, we want RSI to be falling, or overbought (>65) reversing.
  if (direction === 'LONG') {
    if (params.rsi < 35) {
      momentumScore += 15;
      reasons.push(`Bullish deep value rebound: RSI oversold (${params.rsi.toFixed(1)})`);
    } else if (params.rsi >= 45 && params.rsi <= 65) {
      momentumScore += 10;
      reasons.push(`Healthy bullish momentum continuation (RSI: ${params.rsi.toFixed(1)})`);
    } else if (params.rsi > 70) {
      momentumScore += 3;
      invalidators.push(`Overextended bullish momentum: RSI indicates overbought (${params.rsi.toFixed(1)})`);
    } else {
      momentumScore += 6;
    }
  } else if (direction === 'SHORT') {
    if (params.rsi > 65) {
      momentumScore += 15;
      reasons.push(`Bearish peak reversion setup: RSI overbought (${params.rsi.toFixed(1)})`);
    } else if (params.rsi >= 35 && params.rsi <= 55) {
      momentumScore += 10;
      reasons.push(`Bearish momentum cycle continuation (RSI: ${params.rsi.toFixed(1)})`);
    } else if (params.rsi < 30) {
      momentumScore += 3;
      invalidators.push(`Bearish sell exhaustion: RSI oversold (${params.rsi.toFixed(1)})`);
    } else {
      momentumScore += 6;
    }
  } else {
    momentumScore += 5;
  }

  const confidence = structureScore + liquidityScore + volatilityScore + sessionScore + trendScore + momentumScore;

  // Signal Tier Classification
  let tier: SignalTier = 'NO TRADE';
  if (confidence >= 85) {
    tier = 'A+';
  } else if (confidence >= 70) {
    tier = 'A';
  } else if (confidence >= 55) {
    tier = 'B';
  } else if (confidence >= 40) {
    tier = 'C';
  }

  // State Decision Machine
  let state: SignalState = 'WAITING';
  if (tier === 'A+' || tier === 'A') {
    state = 'READY';
  } else if (tier === 'B') {
    state = 'WATCHING';
  } else if (invalidators.length > 3) {
    state = 'INVALID';
  } else if (params.choppiness > 62) {
    state = 'RISK';
    invalidators.push('Extremely choppy market state risk filter triggered');
  }

  // Dynamic Risk Level
  let riskLevel: RiskLevel = 'MEDIUM';
  if (confidence > 80 && params.choppiness < 40) {
    riskLevel = 'LOW';
  } else if (confidence < 50 || params.choppiness > 58) {
    riskLevel = 'HIGH';
  }

  return {
    confidence,
    tier,
    state,
    reasons,
    invalidators: invalidators.slice(0, 4),
    setupType,
    direction,
    riskLevel,
    sessionQuality: params.sessionQuality >= 10 ? 'VIP' : params.sessionQuality >= 6 ? 'STANDARD' : 'LOW LIQUIDITY',
    volatilityRegime: params.choppiness < 38 ? 'EXPANSION' : params.choppiness > 61.8 ? 'CHOPPY RANGE' : 'BALANCED',
    breakdown: {
      structure: structureScore,
      liquidity: liquidityScore,
      volatility: volatilityScore,
      session: sessionScore,
      trend: trendScore,
      momentum: momentumScore,
    },
  };
}
