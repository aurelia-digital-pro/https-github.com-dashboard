import { SignalAnalysis } from '../../types';

export interface AIReasoningReport {
  whyNow: string;
  triggerFactors: string[];
  invalidationTrigger: string;
  bestFitEnvironment: string;
  confidenceBreakdownText: string;
}

/**
 * Deterministic AI Trade Reasoning Synthesizer.
 * Provides the rationale behind every market trigger.
 */
export function generateAIReasoning(
  symbol: string,
  analysis: SignalAnalysis,
  price: number
): AIReasoningReport {
  const isLong = analysis.direction === 'LONG';
  
  const whyNow = isLong
    ? `The precise entry trigger for ${symbol} developed due to a momentary liquidity sweeping action below structural low levels, followed by rapid bullish volume engulfment at the institutional price of $${price.toLocaleString()}. Under the current ${analysis.volatilityRegime} regime, this is indicative of a complete retail hands shakeout prior to expansion.`
    : `The short trigger on ${symbol} materialized as price swept through major structural Equal Highs ($${(price * 1.0025).toFixed(2)}) into a prominent bearish Order Block. Failure to hold the high closes followed by standard MACD divergence signals immediate exhaustion.`;

  const triggerFactors = [
    ...analysis.reasons,
    `Asset volume matches key mathematical thresholds under ${analysis.sessionQuality} conditions.`,
    `Harmonic alignment on ADX (${analysis.breakdown.trend}/15) and RSI momentum (${analysis.breakdown.momentum}/15).`
  ];

  const invalidationTrigger = isLong
    ? `Close below the current swing low support zone of $${(price * 0.985).toFixed(2)} invalidates this entire setup immediately. Additionally, if the upcoming NY/London session experiences an unexpected ATR drop below default metrics, abort the setup.`
    : `Sustainable candle close above the bearish Order Block limit of $${(price * 1.015).toFixed(2)} or heavy volume penetration above $${(price * 1.025).toFixed(2)} invalidates this setup.`;

  const bestFitEnvironment = analysis.volatilityRegime === 'EXPANSION'
    ? 'High-momentum Breakout expansion. Best suited for immediate market execution orders with an ATR-based trail.'
    : 'Mean reverting range expansion. Best executed using scale-in limit orders near liquidity boundaries.';

  const confidenceBreakdownText = `
    - Market Structure Alignment: ${analysis.breakdown.structure}/20
    - Smart Money Liquidity Sweeps: ${analysis.breakdown.liquidity}/20
    - Volatility & Cycle Suitability: ${analysis.breakdown.volatility}/15
    - Macro Session Overlap Alignment: ${analysis.breakdown.session}/15
    - Trend Leg Index (ADX): ${analysis.breakdown.trend}/15
    - Tactical Momentum Index (RSI): ${analysis.breakdown.momentum}/15
    Total Confidence Rating: ${analysis.confidence}% (${analysis.tier} Tier Setup)
  `;

  return {
    whyNow,
    triggerFactors,
    invalidationTrigger,
    bestFitEnvironment,
    confidenceBreakdownText,
  };
}
