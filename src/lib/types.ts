export type AssetClass = "Forex" | "Indices" | "Crypto" | "Commodities";

export type TradeDirection = "LONG" | "SHORT";

export type MarketCondition = "Trending Bullish" | "Trending Bearish" | "Range-Bound / Choppy" | "High Volatility (News)" | "Consolidation";

export type SessionName = "London" | "New York" | "Asia / Tokyo" | "London/NY Overlap";

export interface EmotionLog {
  confidence: number; // 1 - 5
  stress: number;     // 1 - 5
  discipline: number; // 1 - 5
  notes?: string;
  preTradeState?: "Focused" | "Anxious" | "Overconfident" | "Revenge Mode" | "Calm & Neutral";
  postTradeState?: "Satisfied" | "Frustrated" | "Relieved" | "Disciplined" | "Regretful";
}

export interface Trade {
  id: string;
  ticker: string;
  assetClass: AssetClass;
  direction: TradeDirection;
  entryDate: string; // ISO string or YYYY-MM-DD HH:mm
  exitDate: string;
  session: SessionName;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit?: number;
  positionSize: number; // Lots or contracts or units
  grossPnL: number;
  netPnL: number;
  commission: number;
  swap: number;
  slippagePips: number;
  spreadPips: number;
  rMultiple: number;
  strategy: string;
  setup: string; // e.g., "Liquidity Sweep", "Fair Value Gap", "Breakout & Retest", "Order Block Bounce"
  mistakeTags: string[]; // e.g., "FOMO", "Early Exit", "Overleveraged", "Chased Entry", "Moved Stop Loss"
  marketCondition: MarketCondition;
  emotion: EmotionLog;
  chartScreenshot?: string;
  notes?: string;
  timeframe?: string;
  account: string;
}

export interface MetricStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  winRate: number; // percentage
  grossProfit: number;
  grossLoss: number;
  netPnL: number;
  profitFactor: number;
  expectancy: number; // dollar per trade
  expectancyR: number; // R per trade
  sharpeRatio: number;
  avgWin: number;
  avgLoss: number;
  avgWinLossRatio: number;
  maxDrawdownAmount: number;
  maxDrawdownPercent: number;
  currentStreak: { type: "WIN" | "LOSS"; count: number };
  maxWinStreak: number;
  maxLossStreak: number;
  avgHoldTimeMinutes: number;
  totalCommissions: number;
  disciplineScore?: number;
  mistakeFrequency?: Record<string, number>;
}

export interface DayOfWeekStat {
  day: string;
  shortDay: string;
  pnl: number;
  trades: number;
  winRate: number;
}

export interface SessionStat {
  session: SessionName;
  pnl: number;
  trades: number;
  winRate: number;
  profitFactor: number;
}

export interface AssetStat {
  assetClass: AssetClass;
  pnl: number;
  trades: number;
  winRate: number;
  topTicker: string;
}

export interface SetupStat {
  setup: string;
  trades: number;
  winRate: number;
  netPnL: number;
  avgR: number;
}

export interface MistakeStat {
  tag: string;
  count: number;
  totalCostPnL: number;
}

export interface FilterOptions {
  ticker?: string;
  assetClass?: AssetClass | "ALL";
  direction?: TradeDirection | "ALL";
  strategy?: string | "ALL";
  setup?: string | "ALL";
  session?: SessionName | "ALL";
  mistakeTag?: string | "ALL";
  startDate?: string;
  endDate?: string;
  outcome?: "ALL" | "WIN" | "LOSS";
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ReplayScenario {
  id: string;
  name: string;
  ticker: string;
  timeframe: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Master";
  candles: CandleData[];
  initialBalance: number;
}

export interface BacktestPosition {
  id: string;
  direction: TradeDirection;
  entryIndex: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
  size: number;
  exitIndex?: number;
  exitPrice?: number;
  pnl?: number;
  status: "OPEN" | "CLOSED";
}

export interface BrokerAccount {
  id: string;
  name: string;
  platform: "MetaTrader 5" | "MetaTrader 4" | "cTrader" | "TradingView" | "NinjaTrader" | "Interactive Brokers";
  accountNumber: string;
  server: string;
  status: "Connected" | "Syncing" | "Disconnected";
  balance: number;
  equity: number;
  lastSync: string;
}
