import { RiskMetrics } from '../../types';

/**
 * Validates whether trading rules are satisfied, or if a "NO TRADE" state must activate.
 */
export function validateRiskThresholds(params: {
  currentDailyTrades: number;
  maxDailyTrades: number;
  dailyDrawdownPercent: number;
  maxDailyDrawdownAllowedPercent: number;
  isVolatilityExtreme: boolean; // e.g., if news is running or ATR is spiked x3
  isSessionDead: boolean;
}): { isValid: boolean; reason: string | null } {
  // 1. Max Trades Per Day Check
  if (params.currentDailyTrades >= params.maxDailyTrades) {
    return {
      isValid: false,
      reason: `Daily trade limit reached (${params.currentDailyTrades}/${params.maxDailyTrades}). Halt further risk.`,
    };
  }

  // 2. Max Daily Drawdown Check (Protects accounts from blowing up)
  if (params.dailyDrawdownPercent >= params.maxDailyDrawdownAllowedPercent) {
    return {
      isValid: false,
      reason: `Drawdown limit reached (${params.dailyDrawdownPercent.toFixed(1)}% / ${params.maxDailyDrawdownAllowedPercent}%). Trading terminal locked to protect capital.`,
    };
  }

  // 3. Volatility Outlier Check
  if (params.isVolatilityExtreme) {
    return {
      isValid: false,
      reason: 'Extreme Volatility spike detected. Market conditions are unstable.',
    };
  }

  // 4. Session Viability Check
  if (params.isSessionDead) {
    return {
      isValid: false,
      reason: 'Low liquidity session drift. Spread risk high.',
    };
  }

  return {
    isValid: true,
    reason: null,
  };
}
