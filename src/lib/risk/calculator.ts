/**
 * Dynamic Risk & Stop Loss Calculator.
 * Computes ATR-based stop levels and target take-profits.
 */
export function calculateDynamicRiskMetrics(params: {
  entryPrice: number;
  direction: 'LONG' | 'SHORT';
  atr: number;
  multiplierSL?: number; // default: 2.0 * ATR
  desiredRR?: number;     // default: 3.0 (1:3 Risk Reward)
  accountBalance?: number;
  riskPercent?: number;   // default: 1% account risk
}) {
  const {
    entryPrice,
    direction,
    atr,
    multiplierSL = 2.0,
    desiredRR = 3.0,
    accountBalance = 10000,
    riskPercent = 1.0,
  } = params;

  // Stop loss distance
  const stopLossDistance = atr * multiplierSL;
  
  let stopLoss = 0;
  let takeProfit = 0;

  if (direction === 'LONG') {
    stopLoss = entryPrice - stopLossDistance;
    takeProfit = entryPrice + stopLossDistance * desiredRR;
  } else {
    stopLoss = entryPrice + stopLossDistance;
    takeProfit = entryPrice - stopLossDistance * desiredRR;
  }

  // Position sizing based on account risk
  // Risk Amount = Balance * riskPercent / 100
  // Sizing = Risk Amount / Stop Loss Distance (in price unit)
  const riskAmount = accountBalance * (riskPercent / 100);
  const size = stopLossDistance > 0 ? riskAmount / stopLossDistance : 0;

  return {
    stopLoss,
    takeProfit,
    stopLossPercent: (stopLossDistance / entryPrice) * 100,
    riskAmount,
    suggestedUnits: size,
    notionalValue: size * entryPrice,
  };
}
