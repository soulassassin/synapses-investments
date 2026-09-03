"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Trade, FilterOptions, BrokerAccount, MetricStats } from "@/lib/types";
import { initialTrades, initialBrokerAccounts } from "@/lib/mockTrades";
import { useTradeMetrics, PnLPoint } from "@/hooks/useTradeMetrics";

export interface CurrentMetrics extends MetricStats {
  pnlCurve: PnLPoint[];
  mistakeFrequency: Record<string, number>;
  disciplineScore: number;
}

interface TradeContextType {
  trades: Trade[];
  filteredTrades: Trade[];
  currentMetrics: CurrentMetrics;
  metrics: ReturnType<typeof useTradeMetrics>;
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;
  addTrade: (trade: Omit<Trade, "id">) => void;
  updateTrade: (id: string, updated: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  importTrades: (newTrades: Trade[]) => void;
  importFromCSV: (csvText: string) => void;
  resetSampleData: () => void;
  brokerAccounts: BrokerAccount[];
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  connectBroker: (platform: BrokerAccount["platform"], name: string, accountNumber: string) => void;
  exportToCSV: () => void;
}

const defaultFilters: FilterOptions = {
  ticker: "",
  assetClass: "ALL",
  direction: "ALL",
  strategy: "ALL",
  setup: "ALL",
  session: "ALL",
  mistakeTag: "ALL",
  outcome: "ALL",
};

const TradeContext = createContext<TradeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "synapses_journal_trades_v1";
const LOCAL_STORAGE_ACCOUNTS_KEY = "synapses_journal_accounts_v1";

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>(initialBrokerAccounts);
  const [selectedAccount, setSelectedAccount] = useState<string>("ALL");
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage (with legacy key fallback)
  useEffect(() => {
    try {
      const savedTrades = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem("synapses_tradezilla_trades_v1");
      if (savedTrades) {
        setTrades(JSON.parse(savedTrades));
      }
      const savedAccounts = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY) || localStorage.getItem("synapses_tradezilla_accounts_v1");
      if (savedAccounts) {
        setBrokerAccounts(JSON.parse(savedAccounts));
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trades));
      } catch (e) {
        console.warn("Could not save trades to localStorage", e);
      }
    }
  }, [trades, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(brokerAccounts));
      } catch (e) {
        console.warn("Could not save accounts to localStorage", e);
      }
    }
  }, [brokerAccounts, isLoaded]);

  const addTrade = (tradeData: Omit<Trade, "id">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: `TRD-${Date.now().toString().slice(-4)}`,
    };
    setTrades((prev) => [newTrade, ...prev]);
  };

  const updateTrade = (id: string, updated: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  const importTrades = (newTrades: Trade[]) => {
    setTrades((prev) => [...newTrades, ...prev]);
  };

  const importFromCSV = (csvText: string) => {
    const lines = csvText.trim().split("\n");
    if (lines.length <= 1) return;

    const parsed: Trade[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",");
      if (parts.length >= 7) {
        parsed.push({
          id: `CSV-${Date.now().toString().slice(-4)}-${i}`,
          ticker: parts[0]?.trim() || "NAS100",
          assetClass: (parts[1]?.trim() as any) || "Indices",
          direction: (parts[2]?.trim() as any) || "LONG",
          entryDate: parts[3]?.trim() || new Date().toISOString().slice(0, 16),
          exitDate: parts[4]?.trim() || new Date().toISOString().slice(0, 16),
          session: (parts[5]?.trim() as any) || "New York",
          entryPrice: parseFloat(parts[6]) || 0,
          exitPrice: parseFloat(parts[7]) || 0,
          stopLoss: parseFloat(parts[8]) || 0,
          takeProfit: parseFloat(parts[9]) || undefined,
          positionSize: parseFloat(parts[10]) || 1,
          grossPnL: parseFloat(parts[11]) || 0,
          netPnL: parseFloat(parts[12]) || 0,
          commission: parseFloat(parts[13]) || 0,
          swap: parseFloat(parts[14]) || 0,
          slippagePips: 0.5,
          spreadPips: 1.0,
          rMultiple: parseFloat(parts[15]) || 0,
          strategy: parts[16]?.trim() || "Imported",
          setup: parts[17]?.trim() || "General",
          mistakeTags: parts[18] ? parts[18].split(";").map((s) => s.trim()) : [],
          marketCondition: "Trending Bullish",
          emotion: {
            confidence: 5,
            stress: 1,
            discipline: 5,
            preTradeState: "Focused",
            postTradeState: "Satisfied",
          },
          notes: parts[23]?.trim() || "",
          account: parts[24]?.trim() || "Apex Prop 100K Fund",
        });
      }
    }
    if (parsed.length > 0) {
      setTrades((prev) => [...parsed, ...prev]);
    }
  };

  const resetSampleData = () => {
    setTrades(initialTrades);
    setBrokerAccounts(initialBrokerAccounts);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const connectBroker = (platform: BrokerAccount["platform"], name: string, accountNumber: string) => {
    const newAccount: BrokerAccount = {
      id: `acc-${Date.now()}`,
      name: name || `${platform} Sync Account`,
      platform,
      accountNumber: accountNumber || `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
      server: `${platform}-Live-Server`,
      status: "Connected",
      balance: 100000,
      equity: 100000,
      lastSync: "Just now",
    };
    setBrokerAccounts((prev) => [newAccount, ...prev]);
  };

  const exportToCSV = () => {
    if (trades.length === 0) return;
    const headers = [
      "ID",
      "Ticker",
      "AssetClass",
      "Direction",
      "EntryDate",
      "ExitDate",
      "Session",
      "EntryPrice",
      "ExitPrice",
      "StopLoss",
      "TakeProfit",
      "PositionSize",
      "GrossPnL",
      "NetPnL",
      "Commission",
      "Swap",
      "RMultiple",
      "Strategy",
      "Setup",
      "MistakeTags",
      "Account",
    ];

    const rows = trades.map((t) => [
      t.id,
      t.ticker,
      t.assetClass,
      t.direction,
      t.entryDate,
      t.exitDate,
      t.session,
      t.entryPrice,
      t.exitPrice,
      t.stopLoss,
      t.takeProfit || "",
      t.positionSize,
      t.grossPnL,
      t.netPnL,
      t.commission || 0,
      t.swap || 0,
      t.rMultiple || 0,
      `"${t.strategy || ""}"`,
      `"${t.setup || ""}"`,
      `"${(t.mistakeTags || []).join(";")}"`,
      `"${t.account || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `synapses_trades_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered trades based on UI criteria
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      if (selectedAccount !== "ALL" && trade.account !== selectedAccount) {
        return false;
      }
      if (filters.ticker && !trade.ticker.toLowerCase().includes(filters.ticker.toLowerCase())) {
        return false;
      }
      if (filters.assetClass && filters.assetClass !== "ALL" && trade.assetClass !== filters.assetClass) {
        return false;
      }
      if (filters.direction && filters.direction !== "ALL" && trade.direction !== filters.direction) {
        return false;
      }
      if (filters.strategy && filters.strategy !== "ALL" && trade.strategy !== filters.strategy) {
        return false;
      }
      if (filters.setup && filters.setup !== "ALL" && trade.setup !== filters.setup) {
        return false;
      }
      if (filters.session && filters.session !== "ALL" && trade.session !== filters.session) {
        return false;
      }
      if (filters.mistakeTag && filters.mistakeTag !== "ALL") {
        if (!trade.mistakeTags || !trade.mistakeTags.includes(filters.mistakeTag)) {
          return false;
        }
      }
      if (filters.outcome && filters.outcome !== "ALL") {
        if (filters.outcome === "WIN" && trade.netPnL <= 0) return false;
        if (filters.outcome === "LOSS" && trade.netPnL >= 0) return false;
      }
      return true;
    });
  }, [trades, filters, selectedAccount]);

  const metrics = useTradeMetrics(filteredTrades);

  const currentMetrics = useMemo(() => {
    const mistakeFrequency: Record<string, number> = {};
    let disciplinedTrades = 0;

    filteredTrades.forEach((t) => {
      if (t.mistakeTags && t.mistakeTags.length > 0) {
        t.mistakeTags.forEach((tag) => {
          mistakeFrequency[tag] = (mistakeFrequency[tag] || 0) + 1;
        });
      } else {
        disciplinedTrades += 1;
      }
    });

    const disciplineScore =
      filteredTrades.length > 0
        ? Math.round((disciplinedTrades / filteredTrades.length) * 100)
        : 100;

    return {
      ...metrics.stats,
      pnlCurve: metrics.pnlCurve,
      mistakeFrequency,
      disciplineScore,
    };
  }, [metrics, filteredTrades]);

  return (
    <TradeContext.Provider
      value={{
        trades,
        filteredTrades,
        currentMetrics,
        metrics,
        filters,
        setFilters,
        resetFilters,
        addTrade,
        updateTrade,
        deleteTrade,
        importTrades,
        importFromCSV,
        resetSampleData,
        brokerAccounts,
        selectedAccount,
        setSelectedAccount,
        connectBroker,
        exportToCSV,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
}

export function useTrades() {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error("useTrades must be used within a TradeProvider");
  }
  return context;
}
