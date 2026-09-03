export type SessionType = 'LONDON' | 'NY_AM' | 'NY_PM' | 'ASIA';

export type SetupModel =
  | 'FVG'
  | 'ORDER_BLOCK'
  | 'LIQUIDITY_SWEEP'
  | 'BREAKER'
  | 'TURTLE_SOUP'
  | 'SILVER_BULLET';

export type TradeOutcome = 'WIN' | 'LOSS' | 'BREAKEVEN' | 'OPEN';

export type AssetPair =
  | 'NAS100'
  | 'US30'
  | 'SPX500'
  | 'BTCUSD'
  | 'EURUSD'
  | 'GBPUSD'
  | 'XAUUSD';

export type EmotionalState =
  | 'DISCIPLINED'
  | 'FOMO'
  | 'REVENGE'
  | 'HESITANT'
  | 'GREEDY';

export interface TradeLog {
  id: string;
  timestamp: string;
  pair: AssetPair | string;
  direction: 'LONG' | 'SHORT';
  session: SessionType;
  setup: SetupModel;
  timeframe: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  exitPrice?: number;
  contractsOrLots: number;
  riskPercentage: number;
  rMultiple?: number;
  netPnL?: number;
  status: TradeOutcome;
  confluenceNotes: string;
  emotionalState: EmotionalState;
  chartScreenshots: string[];
}

export interface JournalFilters {
  session?: SessionType | 'ALL';
  setup?: SetupModel | 'ALL';
  pair?: AssetPair | 'ALL' | string;
  outcome?: TradeOutcome | 'ALL';
  searchQuery?: string;
}
