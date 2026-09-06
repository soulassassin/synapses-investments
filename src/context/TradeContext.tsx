"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Trade, FilterOptions, BrokerAccount, MetricStats, PlaybookStrategy } from "@/lib/types";
import { initialTrades, initialBrokerAccounts, initialPlaybookStrategies, isLegacyMockTrade } from "@/lib/mockTrades";
import { useTradeMetrics, PnLPoint } from "@/hooks/useTradeMetrics";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

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
  importFromCSV: (csvText: string, targetAccount?: string) => { success: boolean; count: number; error?: string };
  resetSampleData: () => void;
  clearAllTrades: () => void;
  clearAllData: () => void;
  brokerAccounts: BrokerAccount[];
  selectedAccount: string;
  setSelectedAccount: (acc: string) => void;
  connectBroker: (
    platform: BrokerAccount["platform"],
    name: string,
    accountNumber: string,
    server?: string,
    balance?: number,
    currency?: string,
    status?: "Connected" | "Syncing" | "Disconnected"
  ) => BrokerAccount;
  disconnectBroker: (id: string) => void;
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
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [brokerAccounts, setBrokerAccounts] = useState<BrokerAccount[]>(initialBrokerAccounts);
  const [playbookStrategies, setPlaybookStrategies] = useState<PlaybookStrategy[]>(initialPlaybookStrategies);
  const [selectedAccount, setSelectedAccount] = useState<string>("ALL");
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage and Supabase, filtering out any legacy placeholder mock data
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedTrades = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem("synapses_tradezilla_trades_v1");
        if (savedTrades) {
          const parsed = JSON.parse(savedTrades);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Filter out any legacy mock trades so user starts with a clean slate
            const realTradesOnly = parsed.filter((t: any) => !isLegacyMockTrade(t));
            if (realTradesOnly.length > 0) {
              const sanitized: Trade[] = realTradesOnly.map((t: any, idx: number) => ({
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
                strategy: t.strategy || "Discretionary Model",
                setup: t.setup || "Market Structure",
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
                account: t.account || "Primary Account",
              }));
              setTrades(sanitized);
            } else {
              setTrades([]);
              localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
          }
        } else {
          setTrades([]);
        }

        const savedAccounts = localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY) || localStorage.getItem("synapses_tradezilla_accounts_v1");
        if (savedAccounts) {
          const parsedAccs = JSON.parse(savedAccounts);
          if (Array.isArray(parsedAccs) && parsedAccs.length > 0) {
            // Remove mock accounts (Apex Prop 100K Fund, IC Markets, Interactive Brokers with acc-1/2/3)
            const realAccountsOnly = parsedAccs.filter(
              (acc: any) =>
                acc.id !== "acc-1" &&
                acc.id !== "acc-2" &&
                acc.id !== "acc-3" &&
                acc.name !== "Apex Prop 100K Fund"
            );
            if (realAccountsOnly.length > 0) {
              setBrokerAccounts(realAccountsOnly);
            } else {
              setBrokerAccounts([]);
              localStorage.removeItem(LOCAL_STORAGE_ACCOUNTS_KEY);
            }
          }
        } else {
          setBrokerAccounts([]);
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
    const fallbackAcc = selectedAccount !== "ALL" ? selectedAccount : (brokerAccounts[0]?.name || "Primary Account");
    const newTrade: Trade = {
      ...tradeData,
      id: `TRD-${Date.now().toString().slice(-6)}`,
      account: tradeData.account || fallbackAcc,
    };
    setTrades((prev) => [newTrade, ...prev]);

    // Async sync to Supabase if session active
    if (user) {
      const supabase = createClient();
      if (supabase) {
        supabase.from("trades").insert({
          user_id: user.id,
          ticker: newTrade.ticker,
          asset_class: (newTrade.assetClass || "Indices").toUpperCase(),
          direction: newTrade.direction,
          entry_price: newTrade.entryPrice,
          exit_price: newTrade.exitPrice,
          stop_loss: newTrade.stopLoss,
          take_profit: newTrade.takeProfit,
          quantity: newTrade.positionSize,
          pnl: newTrade.netPnL,
          pnl_r: newTrade.rMultiple,
          outcome: newTrade.netPnL >= 0 ? "WIN" : "LOSS",
          strategy: newTrade.strategy,
          setup: newTrade.setup,
          session: newTrade.session,
          notes: newTrade.notes,
        }).then(({ error }) => {
          if (error) console.warn("Supabase trade sync:", error);
        });
      }
    }
  };

  const updateTrade = (id: string, updated: Partial<Trade>) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
    if (user) {
      const supabase = createClient();
      if (supabase) {
        supabase.from("trades").delete().eq("user_id", user.id).eq("id", id).then();
      }
    }
  };

  const clearAllTrades = () => {
    setTrades([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem("synapses_tradezilla_trades_v1");
    }
    if (user) {
      const supabase = createClient();
      if (supabase) {
        supabase.from("trades").delete().eq("user_id", user.id).then();
      }
    }
  };

  const clearAllData = () => {
    setTrades([]);
    setBrokerAccounts([]);
    setSelectedAccount("ALL");
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ACCOUNTS_KEY);
      localStorage.removeItem("synapses_tradezilla_trades_v1");
      localStorage.removeItem("synapses_tradezilla_accounts_v1");
    }
  };

  const importTrades = (newTrades: Trade[]) => {
    setTrades((prev) => [...newTrades, ...prev]);
  };

  const importFromCSV = (csvText: string, targetAccount?: string): { success: boolean; count: number; error?: string } => {
    const lines = csvText.trim().split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length <= 1) {
      return { success: false, count: 0, error: "CSV statement is empty or missing data rows" };
    }

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

    const fallbackAccount = targetAccount || (selectedAccount !== "ALL" ? selectedAccount : (brokerAccounts[0]?.name || "Primary Account"));
    const parsed: Trade[] = [];

    for (let i = 1; i < lines.length; i++) {
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
      const strategy = strategyIdx !== -1 && row[strategyIdx] ? row[strategyIdx] : "Discretionary Model";
      const setup = setupIdx !== -1 && row[setupIdx] ? row[setupIdx] : "Market Structure";
      const mistakeTags = mistakeTagsIdx !== -1 && row[mistakeTagsIdx] ? row[mistakeTagsIdx].split(";").map((s) => s.trim()).filter(Boolean) : [];
      const notes = notesIdx !== -1 ? row[notesIdx] : "";
      const account = accountIdx !== -1 && row[accountIdx] ? row[accountIdx] : fallbackAccount;

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
      return { success: true, count: parsed.length };
    }

    return { success: true, count: 0, error: "No valid trades recognized in statement file" };
  };

  const resetSampleData = () => {
    setTrades([]);
    setBrokerAccounts([]);
    setSelectedAccount("ALL");
    setPlaybookStrategies(initialPlaybookStrategies);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ACCOUNTS_KEY);
      localStorage.removeItem("synapses_tradezilla_trades_v1");
      localStorage.removeItem("synapses_tradezilla_accounts_v1");
    }
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

  const connectBroker = (
    platform: BrokerAccount["platform"],
    name: string,
    accountNumber: string,
    server?: string,
    balance?: number,
    currency?: string,
    status?: "Connected" | "Syncing" | "Disconnected"
  ): BrokerAccount => {
    const cleanName = name?.trim() || `${platform} Sync Account`;
    const startingBal = typeof balance === "number" && !isNaN(balance) ? balance : 100000;
    const newAccount: BrokerAccount = {
      id: `acc-${Date.now()}`,
      name: cleanName,
      platform,
      accountNumber: accountNumber?.trim() || `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
      server: server?.trim() || `${platform}-Live-Feed`,
      status: status || "Connected",
      balance: startingBal,
      equity: startingBal,
      currency: currency || "USD",
      lastSync: "Just now (Live)",
      webhookUrl: platform === "TradingView" ? `https://synapses-investments.vercel.app/api/webhook/trade?acc=${encodeURIComponent(cleanName)}` : undefined,
      webhookSecret: platform === "TradingView" ? `sn_wh_${Math.random().toString(36).substring(2, 12)}` : undefined,
    };

    setBrokerAccounts((prev) => {
      const existingIdx = prev.findIndex((a) => a.name.toLowerCase() === newAccount.name.toLowerCase());
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newAccount;
        return updated;
      }
      return [newAccount, ...prev];
    });
    setSelectedAccount(newAccount.name);

    if (user) {
      const supabase = createClient();
      if (supabase) {
        supabase.from("broker_accounts").insert({
          user_id: user.id,
          name: newAccount.name,
          platform: newAccount.platform,
          account_number: newAccount.accountNumber,
          balance: newAccount.balance,
          initial_balance: newAccount.balance,
          currency: newAccount.currency || "USD",
          status: newAccount.status,
        }).then(({ error }) => {
          if (error) console.warn("Supabase broker_accounts sync:", error);
        });
      }
    }

    return newAccount;
  };

  const disconnectBroker = (id: string) => {
    const accToDelete = brokerAccounts.find((a) => a.id === id);
    setBrokerAccounts((prev) => prev.filter((a) => a.id !== id));
    if (accToDelete && selectedAccount === accToDelete.name) {
      setSelectedAccount("ALL");
    }
    if (user && accToDelete) {
      const supabase = createClient();
      if (supabase) {
        supabase.from("broker_accounts").delete().eq("user_id", user.id).eq("name", accToDelete.name).then();
      }
    }
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
        clearAllTrades,
        clearAllData,
        brokerAccounts,
        selectedAccount,
        setSelectedAccount,
        connectBroker,
        disconnectBroker,
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
