// Aurelia Pro Core Type Definitions
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export interface Candle {
  time: number; // UTC timestamp in seconds (for lightweight-charts)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketTicker {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  sparkline: number[];
  name?: string;
  category: 'crypto' | 'forex' | 'indices';
}

// Indicator Types
export interface MACDResult {
  macd: number;
  signal: number;
  histogram: number;
}

export interface BollingerBandsResult {
  upper: number;
  middle: number;
  lower: number;
}

export interface StochasticResult {
  k: number;
  d: number;
}

export interface IndicatorsState {
  rsi: number[];
  macd: MACDResult[];
  ema20: number[];
  ema50: number[];
  ema200: number[];
  bb: BollingerBandsResult[];
  stoch: StochasticResult[];
  atr: number[];
  vwap: number[];
  adx: number[];
  choppiness: number[];
}

// SMC / Market Structure Types
export type TrendDirection = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type MarketPhase = 'ACCUMULATION' | 'DISTRIBUTION' | 'EXPANSION' | 'REVERSAL';

export interface SwingPoint {
  index: number;
  type: 'HIGH' | 'LOW';
  price: number;
  time: number;
  confirmed: boolean;
}

export interface StructureBreak {
  type: 'BOS' | 'CHOCH';
  direction: 'BULLISH' | 'BEARISH';
  breakPrice: number;
  triggerPrice: number;
  index: number;
  time: number;
  confirmed: boolean;
}

export interface LiquidityZone {
  id: string;
  type: 'BUY_SIDE' | 'SELL_SIDE';
  priceHigh: number;
  priceLow: number;
  isCustom?: boolean;
  hitCount: number;
  swept: boolean;
  timeCreated: number;
}

export interface FairValueGap {
  index: number;
  type: 'BULLISH' | 'BEARISH'; // Bullish: Low of candle 3 is above high of candle 1
  high: number;
  low: number;
  mitigated: boolean;
  mitigatedPrice?: number;
}

export interface OrderBlock {
  type: 'BULLISH' | 'BEARISH';
  high: number;
  low: number;
  volume: number;
  index: number;
  mitigated: boolean;
  strength: 'STRONG' | 'MEDIUM' | 'WEAK';
}

export interface MarketStructure {
  swings: SwingPoint[];
  breaks: StructureBreak[];
  trend: TrendDirection;
  phase: MarketPhase;
  fvgs: FairValueGap[];
  orderBlocks: OrderBlock[];
}

// Volatility & Session Types
export type VolatilityRegime = 'HIGH_EXPANSION' | 'LOW_COMPRESSION' | 'RANGING' | 'TRENDING' | 'CHOPPY';

export interface MarketRegime {
  regime: VolatilityRegime;
  atrValue: number;
  breakoutReadinessScore: number; // 0-100
  falseBreakoutProbability: number; // 0-100
  choppinessIndex: number; // 0-100
}

export interface TradingSession {
  name: 'ASIA' | 'LONDON' | 'NEWYORK' | 'OVERLAP' | 'NONE';
  isActive: boolean;
  qualityScore: number; // 0-15
  color: string;
}

// Signal Analyzer & Scorer Types
export type SignalTier = 'A+' | 'A' | 'B' | 'C' | 'NO TRADE';
export type SignalState = 'WAITING' | 'WATCHING' | 'READY' | 'RISK' | 'INVALID';
export type TradeDirection = 'LONG' | 'SHORT' | 'NEUTRAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SignalAnalysis {
  confidence: number; // 0-100
  tier: SignalTier;
  state: SignalState;
  reasons: string[];
  invalidators: string[];
  setupType: string | null;
  direction: TradeDirection;
  riskLevel: RiskLevel;
  sessionQuality: string;
  volatilityRegime: string;
  breakdown: {
    structure: number;  // 0-20
    liquidity: number;  // 0-20
    volatility: number; // 0-15
    session: number;    // 0-15
    trend: number;      // 0-15
    momentum: number;   // 0-15
  };
}

// Risk Intelligence Types
export interface RiskMetrics {
  maxTradesPerDay: number;
  currentTradesCount: number;
  drawdownPercentage: number;
  atrDynamicStop: number;
  suggestedRiskReward: number; // e.g. 2.5 (1:2.5)
  isTradingSuspended: boolean;
  suspensionReason: string | null;
}

// Portfolio & Transaction Types
export interface Trade {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  direction: 'LONG' | 'SHORT';
  date: string;
  status: 'OPEN' | 'CLOSED';
  pnL: number;
  pnlPercent: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface PortfolioSummary {
  totalBalance: number;
  allocatedCapital: number;
  winRate: number;
  averageRiskReward: number;
  totalReturn: number;
  totalReturnPercent: number;
}

// Monetization & License types
export type LicenseTier = 'free' | 'pro' | 'elite';

export interface UserLicense {
  code: string;
  tier: LicenseTier;
  deviceFingerprint: string;
  activatedAt: string;
  expiry: string | null;
}
