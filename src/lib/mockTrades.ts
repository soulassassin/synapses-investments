import { Trade, BrokerAccount, PlaybookStrategy } from "./types";

export const initialPlaybookStrategies: PlaybookStrategy[] = [
  {
    id: "strat-001",
    name: "Macro Range Expansion",
    description: "Systematic entry capturing opening volatility expansion and directional trend continuity into unfilled imbalances.",
    setupCategory: "Breakout",
    targetRR: 3.2,
    rules: [
      "Higher timeframe trend alignment confirmed on 1H/4H chart",
      "Morning session volatility expansion triggered",
      "Defined invalidation stop loss placed beyond structural swing point",
    ],
    timeframes: ["1m", "5m", "15m"],
    confluenceTags: ["Volume Expansion", "Imbalance Fill", "Session Open"],
    createdAt: "2026-08-01",
    isDefault: true,
  },
  {
    id: "strat-002",
    name: "Session Extreme Sweep",
    description: "Exploits false price runs beyond previous session highs or lows followed by rapid reversal displacement.",
    setupCategory: "Mean Reversion",
    targetRR: 2.8,
    rules: [
      "Clear sweep of previous session high/low liquidity pool",
      "Immediate market structure shift on lower timeframe",
      "Order block mitigation entry with tight invalidation",
    ],
    timeframes: ["5m", "15m"],
    confluenceTags: ["Liquidity Sweep", "Structure Shift", "Order Block"],
    createdAt: "2026-08-01",
    isDefault: true,
  },
  {
    id: "strat-003",
    name: "Fair Value Imbalance",
    description: "Capitalizes on 3-candle price imbalances and rapid rebalancing during high-volume windows.",
    setupCategory: "Order Flow",
    targetRR: 3.0,
    rules: [
      "Well-defined 3-candle imbalance (BISI/SIBI) formed with high volume",
      "Limit entry set at the 50% equilibrium or boundary of the gap",
      "Target placed at major opposing structural liquidity target",
    ],
    timeframes: ["5m", "15m", "1h"],
    confluenceTags: ["Fair Value Gap", "Equilibrium 50%", "High Volume"],
    createdAt: "2026-08-01",
    isDefault: true,
  },
  {
    id: "strat-004",
    name: "Order Block Retest",
    description: "Executes on the first clean retest of institutional supply/demand accumulation blocks.",
    setupCategory: "Order Flow",
    targetRR: 3.5,
    rules: [
      "Strong impulsive displacement candle initiating from consolidation block",
      "Clean return and mitigation into the origin order block",
      "Risk capped at strictly ≤ 1.0% of account equity",
    ],
    timeframes: ["15m", "1h"],
    confluenceTags: ["Order Block", "Mitigation", "Discount Array"],
    createdAt: "2026-08-01",
    isDefault: true,
  },
  {
    id: "strat-005",
    name: "Breaker Block Reversal",
    description: "Trades failed structural order blocks that flip from support to resistance (or vice versa).",
    setupCategory: "Momentum",
    targetRR: 2.5,
    rules: [
      "Price sweeps liquidity to create higher high / lower low, then breaks origin structure",
      "Retest of the violated order block (now a breaker)",
      "Target opposing liquidity pool with 1:2.5+ minimum R:R",
    ],
    timeframes: ["5m", "15m"],
    confluenceTags: ["Breaker Block", "Market Shift", "Liquidity Pool"],
    createdAt: "2026-08-01",
    isDefault: true,
  },
  {
    id: "strat-006",
    name: "False Breakout Purge",
    description: "Fades failed range breakouts when price extends beyond key levels but fails to hold closes.",
    setupCategory: "Mean Reversion",
    targetRR: 2.0,
    rules: [
      "Wick rejection above key resistance or below key support",
      "Candle closes back inside range boundaries",
      "Immediate target at midpoint or opposing boundary of range",
    ],
    timeframes: ["15m", "1h"],
    confluenceTags: ["Range Bound", "Failed Breakout", "Mean Reversion"],
    createdAt: "2026-08-01",
    isDefault: true,
  },
];

export const initialBrokerAccounts: BrokerAccount[] = [];

export const initialTrades: Trade[] = [];

// Known legacy mock IDs and labels used to automatically purge old cached demo data from browser storage
export const LEGACY_MOCK_TRADE_IDS = new Set([
  "TRD-101", "TRD-102", "TRD-103", "TRD-104", "TRD-105",
  "TRD-106", "TRD-107", "TRD-108", "TRD-109", "TRD-110",
  "TRD-111", "TRD-112", "TRD-113", "TRD-114", "TRD-115",
  "TRD-116", "TRD-117", "TRD-118", "TRD-119", "TRD-120",
  "TRD-121", "TRD-122", "TRD-123", "TRD-124", "TRD-125"
]);

export const isLegacyMockTrade = (trade: any): boolean => {
  if (!trade || !trade.id) return false;
  return (
    LEGACY_MOCK_TRADE_IDS.has(trade.id) ||
    trade.account === "Apex Prop 100K Fund" ||
    trade.account === "IC Markets Raw ECN" ||
    trade.account === "Interactive Brokers LLC"
  );
};
