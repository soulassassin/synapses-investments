"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Trade, FilterOptions, BrokerAccount, MetricStats, PlaybookStrategy } from "@/lib/types";
import { initialTrades, initialBrokerAccounts, initialPlaybookStrategies } from "@/lib/mockTrades";
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
  // Playbook Custom Strategies CRUD
  playbookStrategies: PlaybookStrategy[];
  addPlaybookStrategy: (strategy: Omit<PlaybookStrategy, "id" | "createdAt">) => void;
  updatePlaybookStrategy: (id: string, updated: Partial<PlaybookStrategy>) => void;
  deletePlaybookStrategy: (id: string) => void;
  resetDefaultStrategies: () => void;
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
const LOCAL_STORAGE_PLAYBOOK_KEY = "synapses_journal_playbook_v1";

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>(initialBrokerAccounts);
  const [playbookStrategies, setPlaybookStrategies] = useState<PlaybookStrategy[]>(initialPlaybookStrategies);
  const [selectedAccount, setSelectedAccount] = useState<string>("ALL");
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage (with legacy key fallback & safe sanitization)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedTrades = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem("synapses_tradezilla_trades_v1");
        if (savedTrades) {
          const parsed = JSON.parse(savedTrades);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const sanitized: Trade[] = parsed.map((t: any, idx: number) => ({
              id: t.id || `TRD-RESTORED-${idx}`,
              ticker: t.ticker || "NAS100",
              assetClass: t.assetClass || "Indices",
              direction: t.direction || "LONG",
              entryDate: t.entryDate || new Date().toISOString().replace("T", " ").slice(0, 16),
              exitDate: t.exitDate || t.entryDate || new Date().toISOString().replace("T", " ").slice(0, 16),
              session: t.session || "New York",
              entryPrice: Number(t.entryPrice) || 0,
              exitPrice: Number(t.exitPrice) || 0,
              stopLoss: Number(t.stopLoss) || 0,
              takeProfit: t.takeProfit !== undefined ? Number(t.takeProfit) : undefined,
              positionSize: Number(t.positionSize) || 1,
              grossPnL: Number(t.grossPnL) || 0,
              netPnL: Number(t.netPnL) || 0,
              commission: Number(t.commission) || 0,
              swap: Number(t.swap) || 0,
              slippagePips: Number(t.slippagePips) || 0,
              spreadPips: Number(t.spreadPips) || 0,
              rMultiple: Number(t.rMultiple) || 0,
              strategy: t.strategy || "Macro Range Expansion",
              setup: t.setup || "Fair Value Gap",
              mistakeTags: Array.isArray(t.mistakeTags) ? t.mistakeTags : [],
              marketCondition: t.marketCondition || "Trending Bullish",
              emotion: t.emotion || {
                confidence: 5,
                stress: 1,
                discipline: 5,
                preTradeState: "Focused",
                postTradeState: "Satisfied",
              },
              timeframe: t.timeframe || "5m",
              chartScreenshot: t.chartScreenshot || (Array.isArray(t.chartScreenshots) && t.chartScreenshots[0]) || undefined,
              chartScreenshots: Array.isArray(t.chartScreenshots) ? t.chartScreenshots : (t.chartScreenshot ? [t.chartScreenshot] : []),
              notes: t.notes || "",
              account: t.account || "Apex Prop 100K Fund",
            }));
            setTrades(sanitized);
          }
        }
        const savedAccounts = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY) || localStorage.getItem("synapses_tradezilla_accounts_v1");
        if (savedAccounts) {
          const parsedAccs = JSON.parse(savedAccounts);
          if (Array.isArray(parsedAccs) && parsedAccs.length > 0) {
            setBrokerAccounts(parsedAccs);
          }
        }
        const savedPlaybook = localStorage.getItem(LOCAL_STORAGE_PLAYBOOK_KEY);
        if (savedPlaybook) {
          const parsedPlaybook = JSON.parse(savedPlaybook);
          if (Array.isArray(parsedPlaybook) && parsedPlaybook.length > 0) {
            setPlaybookStrategies(parsedPlaybook);
          }
        }
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trades));
      } catch (e) {
        console.warn("Could not save trades to localStorage", e);
      }
    }
  }, [trades, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_ACCOUNTS_KEY, JSON.stringify(brokerAccounts));
      } catch (e) {
        console.warn("Could not save accounts to localStorage", e);
      }
    }
  }, [brokerAccounts, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_PLAYBOOK_KEY, JSON.stringify(playbookStrategies));
      } catch (e) {
        console.warn("Could not save playbook strategies to localStorage", e);
      }
    }
  }, [playbookStrategies, isLoaded]);


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
    const lines = csvText.trim().split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length <= 1) return;

    // Header row normalization
    const headerRow = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[\"\']/g, ""));

    const findIndex = (keywords: string[]): number => {
      return headerRow.findIndex((col) => keywords.some((k) => col.includes(k)));
    };

    const tickerIdx = findIndex(["ticker", "symbol", "instrument", "pair", "item"]);
    const assetClassIdx = findIndex(["asset", "class", "type"]);
    const directionIdx = findIndex(["direction", "side", "type", "action", "cmd"]);
    const entryDateIdx = findIndex(["entrydate", "open time", "time", "date", "open"]);
    const exitDateIdx = findIndex(["exitdate", "close time", "close_time", "close date"]);
    const sessionIdx = findIndex(["session", "killzone", "market"]);
    const entryPriceIdx = findIndex(["entryprice", "openprice", "open price", "entry_price", "price"]);
    const exitPriceIdx = findIndex(["exitprice", "closeprice", "close price", "exit_price"]);
    const stopLossIdx = findIndex(["stoploss", "sl", "stop_loss", "stop"]);
    const takeProfitIdx = findIndex(["takeprofit", "tp", "take_profit", "target"]);
    const positionSizeIdx = findIndex(["positionsize", "lots", "volume", "size", "contracts", "qty"]);
    const grossPnLIdx = findIndex(["grosspnl", "gross profit", "gross"]);
    const netPnLIdx = findIndex(["netpnl", "profit", "pnl", "p&l", "net profit", "net"]);
    const commissionIdx = findIndex(["commission", "comm", "fees"]);
    const swapIdx = findIndex(["swap", "rollover"]);
    const rMultipleIdx = findIndex(["rmultiple", "r:r", "r_multiple", "r multiple", "r"]);
    const strategyIdx = findIndex(["strategy", "model", "playbook"]);
    const setupIdx = findIndex(["setup", "confluence", "pattern"]);
    const mistakeTagsIdx = findIndex(["mistaketags", "mistakes", "errors", "tags"]);
    const notesIdx = findIndex(["notes", "comment", "reflections"]);
    const accountIdx = findIndex(["account", "accountnumber", "broker", "fund"]);

    const parsed: Trade[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Split with quotes support
      const row = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      if (row.length < 2) continue;

      const ticker = (tickerIdx !== -1 ? row[tickerIdx] : row[0])?.toUpperCase() || "NAS100";
      const rawDir = (directionIdx !== -1 ? row[directionIdx] : row[2])?.toUpperCase() || "BUY";
      const direction: "LONG" | "SHORT" = rawDir.includes("SELL") || rawDir.includes("SHORT") ? "SHORT" : "LONG";

      const entryPrice = parseFloat(entryPriceIdx !== -1 ? row[entryPriceIdx] : row[6]) || 0;
      const exitPrice = parseFloat(exitPriceIdx !== -1 ? row[exitPriceIdx] : row[7]) || entryPrice;
      const stopLoss = parseFloat(stopLossIdx !== -1 ? row[stopLossIdx] : row[8]) || (direction === "LONG" ? entryPrice * 0.99 : entryPrice * 1.01);
      const takeProfit = parseFloat(takeProfitIdx !== -1 ? row[takeProfitIdx] : row[9]) || undefined;
      const positionSize = parseFloat(positionSizeIdx !== -1 ? row[positionSizeIdx] : row[10]) || 1;
      
      let netPnL = parseFloat(netPnLIdx !== -1 ? row[netPnLIdx] : row[12]);
      if (isNaN(netPnL)) {
        const diff = direction === "LONG" ? exitPrice - entryPrice : entryPrice - exitPrice;
        netPnL = Number((diff * positionSize * 1).toFixed(2));
      }

      let grossPnL = parseFloat(grossPnLIdx !== -1 ? row[grossPnLIdx] : row[11]);
      if (isNaN(grossPnL)) grossPnL = netPnL;

      const commission = parseFloat(commissionIdx !== -1 ? row[commissionIdx] : row[13]) || 0;
      const swap = parseFloat(swapIdx !== -1 ? row[swapIdx] : row[14]) || 0;

      let rMultiple = parseFloat(rMultipleIdx !== -1 ? row[rMultipleIdx] : row[15]);
      if (isNaN(rMultiple)) {
        const riskDistance = Math.abs(entryPrice - stopLoss);
        const gainDistance = direction === "LONG" ? exitPrice - entryPrice : entryPrice - exitPrice;
        rMultiple = riskDistance > 0 ? Number((gainDistance / riskDistance).toFixed(2)) : 0;
      }

      const entryDate = entryDateIdx !== -1 && row[entryDateIdx] ? row[entryDateIdx] : new Date().toISOString().replace("T", " ").slice(0, 16);
      const exitDate = exitDateIdx !== -1 && row[exitDateIdx] ? row[exitDateIdx] : entryDate;
      const session = (sessionIdx !== -1 ? row[sessionIdx] : row[5]) as any || "New York";
      const assetClass = (assetClassIdx !== -1 ? row[assetClassIdx] : row[1]) as any || "Indices";
      const strategy = strategyIdx !== -1 && row[strategyIdx] ? row[strategyIdx] : "Macro Range Expansion";
      const setup = setupIdx !== -1 && row[setupIdx] ? row[setupIdx] : "Fair Value Gap";
      const mistakeTags = mistakeTagsIdx !== -1 && row[mistakeTagsIdx] ? row[mistakeTagsIdx].split(";").map((s) => s.trim()).filter(Boolean) : [];
      const notes = notesIdx !== -1 ? row[notesIdx] : "";
      const account = accountIdx !== -1 && row[accountIdx] ? row[accountIdx] : "Apex Prop 100K Fund";

      parsed.push({
        id: `CSV-${Date.now().toString().slice(-4)}-${i}`,
        ticker,
        assetClass,
        direction,
        entryDate,
        exitDate,
        session,
        entryPrice,
        exitPrice,
        stopLoss,
        takeProfit,
        positionSize,
        grossPnL,
        netPnL,
        commission,
        swap,
        slippagePips: 0.5,
        spreadPips: 1.0,
        rMultiple,
        strategy,
        setup,
        mistakeTags,
        marketCondition: "Trending Bullish",
        emotion: {
          confidence: 5,
          stress: 1,
          discipline: 5,
          preTradeState: "Focused",
          postTradeState: "Satisfied",
        },
        notes,
        account,
      });
    }

    if (parsed.length > 0) {
      setTrades((prev) => [...parsed, ...prev]);
    }
  };

  const resetSampleData = () => {
    setTrades(initialTrades);
    setBrokerAccounts(initialBrokerAccounts);
    setPlaybookStrategies(initialPlaybookStrategies);
  };

  const addPlaybookStrategy = (stratData: Omit<PlaybookStrategy, "id" | "createdAt">) => {
    const newStrategy: PlaybookStrategy = {
      ...stratData,
      id: `strat-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPlaybookStrategies((prev) => [newStrategy, ...prev]);
  };

  const updatePlaybookStrategy = (id: string, updated: Partial<PlaybookStrategy>) => {
    setPlaybookStrategies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deletePlaybookStrategy = (id: string) => {
    setPlaybookStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  const resetDefaultStrategies = () => {
    setPlaybookStrategies(initialPlaybookStrategies);
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
        if (filters.outcome === "WIN" && (Number(trade.netPnL) || 0) <= 0) return false;
        if (filters.outcome === "LOSS" && (Number(trade.netPnL) || 0) >= 0) return false;
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
        playbookStrategies,
        addPlaybookStrategy,
        updatePlaybookStrategy,
        deletePlaybookStrategy,
        resetDefaultStrategies,
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
