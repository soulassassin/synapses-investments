import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TradeLog, JournalFilters } from '@/types/journal';

export interface JournalState {
  trades: TradeLog[];
  activeFilter: JournalFilters;
  
  // Actions
  addTrade: (trade: Omit<TradeLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => void;
  updateTrade: (id: string, updated: Partial<TradeLog>) => void;
  deleteTrade: (id: string) => void;
  bulkImportTrades: (newTrades: TradeLog[]) => void;
  resetJournal: () => void;
  setFilter: (filter: Partial<JournalFilters>) => void;
  resetFilter: () => void;

  // Selectors / helper calculations
  getFilteredTrades: () => TradeLog[];
  getWinRate: () => number;
  getAverageRR: () => number;
  getProfitFactor: () => number;
  getNetR: () => number;
  getTotalPnL: () => number;
  getMaxDrawdown: () => number;
}

const DEFAULT_FILTERS: JournalFilters = {
  session: 'ALL',
  setup: 'ALL',
  pair: 'ALL',
  outcome: 'ALL',
  searchQuery: '',
};

export const INITIAL_SEED_TRADES: TradeLog[] = [
  {
    id: 'trade-seed-001',
    timestamp: '2026-09-02T14:32:00.000Z',
    pair: 'NAS100',
    direction: 'LONG',
    session: 'NY_AM',
    setup: 'SILVER_BULLET',
    timeframe: '5m',
    entryPrice: 19840.5,
    stopLoss: 19815.0,
    takeProfit: 19917.0,
    exitPrice: 19917.0,
    contractsOrLots: 2.0,
    riskPercentage: 1.0,
    rMultiple: 3.0,
    netPnL: 1530.0,
    status: 'WIN',
    confluenceNotes: '10:00 AM NY Open sweep of previous day high into 5m Bullish FVG. Instant displacement with high relative volume. Full target filled at London High.',
    emotionalState: 'DISCIPLINED',
    chartScreenshots: [],
  },
  {
    id: 'trade-seed-002',
    timestamp: '2026-09-01T08:15:00.000Z',
    pair: 'EURUSD',
    direction: 'SHORT',
    session: 'LONDON',
    setup: 'LIQUIDITY_SWEEP',
    timeframe: '15m',
    entryPrice: 1.0865,
    stopLoss: 1.088,
    takeProfit: 1.082,
    exitPrice: 1.082,
    contractsOrLots: 5.0,
    riskPercentage: 1.0,
    rMultiple: 3.0,
    netPnL: 2250.0,
    status: 'WIN',
    confluenceNotes: 'London open Judas swing swept Asian highs into 15m Bearish Order Block. Market Structure Shift confirmed on 1m chart.',
    emotionalState: 'DISCIPLINED',
    chartScreenshots: [],
  },
  {
    id: 'trade-seed-003',
    timestamp: '2026-08-31T15:45:00.000Z',
    pair: 'US30',
    direction: 'SHORT',
    session: 'NY_PM',
    setup: 'BREAKER',
    timeframe: '1m',
    entryPrice: 41250.0,
    stopLoss: 41320.0,
    takeProfit: 41040.0,
    exitPrice: 41320.0,
    contractsOrLots: 1.0,
    riskPercentage: 1.0,
    rMultiple: -1.0,
    netPnL: -700.0,
    status: 'LOSS',
    confluenceNotes: 'Attempted PM session continuation short after breaker block retest. Power Hour expansion reversed violently due to late macro flow.',
    emotionalState: 'HESITANT',
    chartScreenshots: [],
  },
  {
    id: 'trade-seed-004',
    timestamp: '2026-08-29T10:10:00.000Z',
    pair: 'XAUUSD',
    direction: 'LONG',
    session: 'NY_AM',
    setup: 'FVG',
    timeframe: '5m',
    entryPrice: 2502.4,
    stopLoss: 2496.8,
    takeProfit: 2520.0,
    exitPrice: 2520.0,
    contractsOrLots: 3.0,
    riskPercentage: 1.0,
    rMultiple: 3.14,
    netPnL: 5280.0,
    status: 'WIN',
    confluenceNotes: 'CPI retraced directly into 1h discount Fair Value Gap with clean SMT divergence against DXY. Hit 1:3.14 R target with no drawdown.',
    emotionalState: 'DISCIPLINED',
    chartScreenshots: [],
  },
  {
    id: 'trade-seed-005',
    timestamp: '2026-08-28T02:30:00.000Z',
    pair: 'BTCUSD',
    direction: 'LONG',
    session: 'ASIA',
    setup: 'TURTLE_SOUP',
    timeframe: '15m',
    entryPrice: 58200.0,
    stopLoss: 57600.0,
    takeProfit: 60000.0,
    exitPrice: 58200.0,
    contractsOrLots: 0.5,
    riskPercentage: 0.5,
    rMultiple: 0.0,
    netPnL: 0.0,
    status: 'BREAKEVEN',
    confluenceNotes: 'Asia range low purge. Shifted SL to breakeven after +1.5R partial. Re-swept before continuing upward.',
    emotionalState: 'DISCIPLINED',
    chartScreenshots: [],
  },
  {
    id: 'trade-seed-006',
    timestamp: '2026-08-27T14:40:00.000Z',
    pair: 'SPX500',
    direction: 'LONG',
    session: 'NY_AM',
    setup: 'ORDER_BLOCK',
    timeframe: '5m',
    entryPrice: 5610.0,
    stopLoss: 5598.0,
    takeProfit: 5646.0,
    exitPrice: 5646.0,
    contractsOrLots: 4.0,
    riskPercentage: 1.0,
    rMultiple: 3.0,
    netPnL: 3600.0,
    status: 'WIN',
    confluenceNotes: 'Clean re-accumulation at NY 10:30 macro. Mitigated unmitigated bullish order block with premium liquidity target at equal highs.',
    emotionalState: 'DISCIPLINED',
    chartScreenshots: [],
  },
];

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      trades: INITIAL_SEED_TRADES,
      activeFilter: DEFAULT_FILTERS,

      addTrade: (tradeData) => {
        const id = tradeData.id || `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = tradeData.timestamp || new Date().toISOString();
        
        // Auto-calculate R:R if not manually provided
        let rMultiple = tradeData.rMultiple;
        const entry = tradeData.entryPrice;
        const sl = tradeData.stopLoss;
        const tp = tradeData.takeProfit;
        const riskDist = Math.abs(entry - sl);
        
        if (riskDist > 0 && rMultiple === undefined) {
          if (tradeData.status === 'WIN') {
            const rewardDist = Math.abs(tp - entry);
            rMultiple = Number((rewardDist / riskDist).toFixed(2));
          } else if (tradeData.status === 'LOSS') {
            rMultiple = -1.0;
          } else if (tradeData.status === 'BREAKEVEN') {
            rMultiple = 0.0;
          }
        }

        const newTrade: TradeLog = {
          ...tradeData,
          id,
          timestamp,
          rMultiple: rMultiple ?? 0,
        };

        set((state) => ({
          trades: [newTrade, ...state.trades],
        }));
      },

      updateTrade: (id, updated) => {
        set((state) => ({
          trades: state.trades.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }));
      },

      deleteTrade: (id) => {
        set((state) => ({
          trades: state.trades.filter((t) => t.id !== id),
        }));
      },

      bulkImportTrades: (newTrades) => {
        set((state) => ({
          trades: [...newTrades, ...state.trades],
        }));
      },

      resetJournal: () => {
        set({ trades: INITIAL_SEED_TRADES });
      },

      setFilter: (filter) => {
        set((state) => ({
          activeFilter: { ...state.activeFilter, ...filter },
        }));
      },

      resetFilter: () => {
        set({ activeFilter: DEFAULT_FILTERS });
      },

      getFilteredTrades: () => {
        const { trades, activeFilter } = get();
        return trades.filter((trade) => {
          if (activeFilter.session && activeFilter.session !== 'ALL' && trade.session !== activeFilter.session) {
            return false;
          }
          if (activeFilter.setup && activeFilter.setup !== 'ALL' && trade.setup !== activeFilter.setup) {
            return false;
          }
          if (activeFilter.pair && activeFilter.pair !== 'ALL' && trade.pair !== activeFilter.pair) {
            return false;
          }
          if (activeFilter.outcome && activeFilter.outcome !== 'ALL' && trade.status !== activeFilter.outcome) {
            return false;
          }
          if (activeFilter.searchQuery && activeFilter.searchQuery.trim() !== '') {
            const query = activeFilter.searchQuery.toLowerCase();
            const pairMatch = trade.pair.toLowerCase().includes(query);
            const setupMatch = trade.setup.toLowerCase().includes(query);
            const notesMatch = trade.confluenceNotes.toLowerCase().includes(query);
            const sessionMatch = trade.session.toLowerCase().includes(query);
            if (!pairMatch && !setupMatch && !notesMatch && !sessionMatch) {
              return false;
            }
          }
          return true;
        });
      },

      getWinRate: () => {
        const trades = get().trades.filter((t) => t.status !== 'OPEN');
        if (trades.length === 0) return 0;
        const wins = trades.filter((t) => t.status === 'WIN').length;
        return Number(((wins / trades.length) * 100).toFixed(1));
      },

      getAverageRR: () => {
        const closed = get().trades.filter((t) => t.status !== 'OPEN');
        if (closed.length === 0) return 0;
        const sum = closed.reduce((acc, t) => acc + (t.rMultiple || 0), 0);
        return Number((sum / closed.length).toFixed(2));
      },

      getProfitFactor: () => {
        const trades = get().trades;
        let grossProfit = 0;
        let grossLoss = 0;

        trades.forEach((t) => {
          if (t.netPnL !== undefined) {
            if (t.netPnL > 0) grossProfit += t.netPnL;
            if (t.netPnL < 0) grossLoss += Math.abs(t.netPnL);
          } else if (t.rMultiple !== undefined) {
            if (t.rMultiple > 0) grossProfit += t.rMultiple;
            if (t.rMultiple < 0) grossLoss += Math.abs(t.rMultiple);
          }
        });

        if (grossLoss === 0) return grossProfit > 0 ? 99.9 : 1.0;
        return Number((grossProfit / grossLoss).toFixed(2));
      },

      getNetR: () => {
        const trades = get().trades;
        const total = trades.reduce((acc, t) => acc + (t.rMultiple || 0), 0);
        return Number(total.toFixed(2));
      },

      getTotalPnL: () => {
        const trades = get().trades;
        return trades.reduce((acc, t) => acc + (t.netPnL || 0), 0);
      },

      getMaxDrawdown: () => {
        const trades = [...get().trades].reverse(); // chronological order
        let peak = 0;
        let maxDD = 0;
        let runningPnL = 0;

        trades.forEach((t) => {
          runningPnL += (t.netPnL || 0);
          if (runningPnL > peak) {
            peak = runningPnL;
          }
          const dd = peak - runningPnL;
          if (dd > maxDD) {
            maxDD = dd;
          }
        });

        return maxDD;
      },
    }),
    {
      name: 'synapses_journal_v1',
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({ trades: state.trades }),
    }
  )
);
