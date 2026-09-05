"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDMAContext } from "@/context/DMAContext";
import { useTrades } from "@/context/TradeContext";
import { Trade, AssetClass, TradeDirection, SessionName, MarketCondition } from "@/lib/types";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Percent,
} from "lucide-react";

interface SpotDMAQuickEntryProps {
  onTradeLogged?: () => void;
  onClose?: () => void;
}

const SUPPORTED_ASSETS: { symbol: string; name: string; assetClass: AssetClass; defaultSLOffset: number; defaultTPOffset: number }[] = [
  { symbol: "NAS100", name: "Nasdaq 100", assetClass: "Indices", defaultSLOffset: 35, defaultTPOffset: 105 },
  { symbol: "US30", name: "Dow Jones 30", assetClass: "Indices", defaultSLOffset: 75, defaultTPOffset: 225 },
  { symbol: "SPX500", name: "S&P 500", assetClass: "Indices", defaultSLOffset: 12, defaultTPOffset: 36 },
  { symbol: "XAUUSD", name: "Gold Spot", assetClass: "Commodities", defaultSLOffset: 6, defaultTPOffset: 18 },
  { symbol: "EURUSD", name: "Euro / USD", assetClass: "Forex", defaultSLOffset: 0.0015, defaultTPOffset: 0.0045 },
  { symbol: "GBPUSD", name: "Pound / USD", assetClass: "Forex", defaultSLOffset: 0.0020, defaultTPOffset: 0.0060 },
  { symbol: "BTCUSD", name: "Bitcoin", assetClass: "Crypto", defaultSLOffset: 450, defaultTPOffset: 1350 },
  { symbol: "SOLUSD", name: "Solana", assetClass: "Crypto", defaultSLOffset: 1.5, defaultTPOffset: 4.5 },
];

const DEFAULT_SETUPS = [
  "Macro Range Expansion",
  "Session Extreme Sweep",
  "Fair Value Imbalance",
  "Order Block Retest",
  "Breaker Block Reversal",
  "False Breakout Purge",
];

export function SpotDMAQuickEntry({ onTradeLogged, onClose }: SpotDMAQuickEntryProps) {
  const { getTicker } = useDMAContext();
  const { addTrade, brokerAccounts, playbookStrategies } = useTrades();

  const [symbol, setSymbol] = useState("NAS100");
  const [direction, setDirection] = useState<TradeDirection>("LONG");
  const [setup, setSetup] = useState("Macro Range Expansion");
  const [session, setSession] = useState<SessionName>("New York");

  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [positionSize, setPositionSize] = useState<number>(2.0);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [isLiveSynced, setIsLiveSynced] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const selectedAssetMeta = useMemo(() => {
    return SUPPORTED_ASSETS.find((a) => a.symbol === symbol) || SUPPORTED_ASSETS[0];
  }, [symbol]);

  const activeTicker = getTicker(symbol);
  const livePrice = activeTicker?.price || 0;

  // Auto-sync entry price with live DMA price when live sync is enabled
  useEffect(() => {
    if (isLiveSynced && livePrice > 0) {
      setEntryPrice(livePrice);
      const isLong = direction === "LONG";
      const slOffset = selectedAssetMeta.defaultSLOffset;
      const tpOffset = selectedAssetMeta.defaultTPOffset;

      const sl = isLong ? livePrice - slOffset : livePrice + slOffset;
      const tp = isLong ? livePrice + tpOffset : livePrice - tpOffset;

      const decimals = activeTicker?.decimals || 2;
      setStopLoss(Number(sl.toFixed(decimals)));
      setTakeProfit(Number(tp.toFixed(decimals)));
    }
  }, [symbol, direction, isLiveSynced, livePrice, selectedAssetMeta, activeTicker?.decimals]);

  // Quick R-Multiple Target setter
  const applyTargetMultiple = (multiple: number) => {
    const isLong = direction === "LONG";
    const riskDistance = Math.abs(entryPrice - stopLoss);
    if (riskDistance <= 0) return;
    const rewardDistance = riskDistance * multiple;
    const newTP = isLong ? entryPrice + rewardDistance : entryPrice - rewardDistance;
    const decimals = activeTicker?.decimals || 2;
    setTakeProfit(Number(newTP.toFixed(decimals)));
  };

  // Calculations
  const isLong = direction === "LONG";
  const riskDist = Math.abs(entryPrice - stopLoss);
  const rewardDist = Math.abs(takeProfit - entryPrice);
  const calculatedRR = riskDist > 0 ? Number((rewardDist / riskDist).toFixed(2)) : 0;
  const isRewardValid = isLong ? takeProfit > entryPrice : takeProfit < entryPrice;
  const isSLValid = isLong ? stopLoss < entryPrice : stopLoss > entryPrice;

  const estimatedDollarRisk = useMemo(() => {
    const mult = selectedAssetMeta.assetClass === "Forex" ? 10 : 1;
    return Number((riskDist * positionSize * mult).toFixed(2));
  }, [riskDist, positionSize, selectedAssetMeta.assetClass]);

  const estimatedDollarReward = useMemo(() => {
    const mult = selectedAssetMeta.assetClass === "Forex" ? 10 : 1;
    return Number((rewardDist * positionSize * mult).toFixed(2));
  }, [rewardDist, positionSize, selectedAssetMeta.assetClass]);

  const handleExecuteTrade = () => {
    if (entryPrice <= 0 || stopLoss <= 0 || takeProfit <= 0) {
      setFeedbackToast("Please enter valid price levels.");
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toISOString().replace("T", " ").slice(0, 16);
    const accountName = brokerAccounts[0]?.name || "Apex Prop 100K Fund";

    // Create trade log
    const newTrade: Omit<Trade, "id"> = {
      ticker: symbol,
      assetClass: selectedAssetMeta.assetClass,
      direction,
      entryDate: dateStr,
      exitDate: dateStr,
      session,
      entryPrice,
      exitPrice: takeProfit, // Target fill
      stopLoss,
      takeProfit,
      positionSize,
      grossPnL: estimatedDollarReward,
      netPnL: Number((estimatedDollarReward - 35).toFixed(2)), // standard comm
      commission: 35.0,
      swap: 0.0,
      slippagePips: 0.4,
      spreadPips: 0.6,
      rMultiple: calculatedRR,
      strategy: setup,
      setup: setup,
      mistakeTags: [],
      marketCondition: "Trending Bullish",
      emotion: {
        confidence: 5,
        stress: 1,
        discipline: 5,
        preTradeState: "Focused",
        postTradeState: "Satisfied",
        notes: `Spot DMA instant fill at ${entryPrice}. Setup: ${setup}`,
      },
      notes: `Institutional Spot DMA execution on ${symbol} via zero-latency feed. Targeted 1:${calculatedRR} R:R.`,
      timeframe: "5m",
      account: accountName,
    };

    addTrade(newTrade);

    setFeedbackToast(`Logged ${symbol} ${direction} (+${calculatedRR}R) execution to Journal!`);
    setIsSubmitting(false);

    if (onTradeLogged) onTradeLogged();

    setTimeout(() => {
      setFeedbackToast(null);
    }, 3000);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#08080C] border border-white/15 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-300">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-black text-white tracking-wider font-mono">
                SPOT DMA FAST ORDER ENTRY
              </h3>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE DMA SYNC
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">
              1-Click instant execution logging with auto-computed R:R and dollar risk.
            </p>
          </div>
        </div>

        {feedbackToast && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackToast}</span>
          </div>
        )}
      </div>

      {/* Inputs Form Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Asset Selector */}
        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            ASSET
          </label>
          <select
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value);
              setIsLiveSynced(true);
            }}
            className="w-full px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white font-bold focus:outline-none focus:border-cyan-500/50"
          >
            {SUPPORTED_ASSETS.map((a) => (
              <option key={a.symbol} value={a.symbol} className="bg-black text-white">
                {a.symbol} ({a.name})
              </option>
            ))}
          </select>
          <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
            <span className="text-zinc-500">Live Spot:</span>
            <span
              className={`font-bold ${
                activeTicker?.lastTickDir === "up"
                  ? "text-emerald-400"
                  : activeTicker?.lastTickDir === "down"
                  ? "text-red-400"
                  : "text-white"
              }`}
            >
              {livePrice > 0 ? livePrice.toLocaleString(undefined, { minimumFractionDigits: activeTicker?.decimals || 2 }) : "Loading..."}
            </span>
          </div>
        </div>

        {/* 2. Direction & Session */}
        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            DIRECTION
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setDirection("LONG")}
              className={`py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                direction === "LONG"
                  ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white"
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>LONG</span>
            </button>
            <button
              type="button"
              onClick={() => setDirection("SHORT")}
              className={`py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                direction === "SHORT"
                  ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white"
              }`}
            >
              <TrendingDown className="w-3 h-3" />
              <span>SHORT</span>
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Session:</span>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value as any)}
              className="bg-transparent text-[10px] text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="New York" className="bg-black text-white">NY AM/PM</option>
              <option value="London" className="bg-black text-white">London</option>
              <option value="Asia / Tokyo" className="bg-black text-white">Asia</option>
            </select>
          </div>
        </div>

        {/* 3. Setup Model */}
        <div>
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            STRATEGY / SETUP
          </label>
          <select
            value={setup}
            onChange={(e) => setSetup(e.target.value)}
            className="w-full px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
          >
            {(playbookStrategies && playbookStrategies.length > 0
              ? playbookStrategies.map((s) => s.name)
              : DEFAULT_SETUPS
            ).map((s) => (
              <option key={s} value={s} className="bg-black text-white">
                {s}
              </option>
            ))}
          </select>
          <div className="mt-1 text-[10px] font-mono text-zinc-500">
            Systematic Model
          </div>
        </div>


        {/* 4. Entry & Stop Loss */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              ENTRY & SL
            </label>
            <button
              type="button"
              onClick={() => setIsLiveSynced(true)}
              className="text-[9px] text-cyan-400 font-mono hover:underline flex items-center gap-0.5"
              title="Sync entry to current market price"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Sync DMA</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="number"
              step="any"
              value={entryPrice || ""}
              onChange={(e) => {
                setIsLiveSynced(false);
                setEntryPrice(parseFloat(e.target.value) || 0);
              }}
              placeholder="Entry"
              className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white text-center focus:outline-none focus:border-cyan-500"
            />
            <input
              type="number"
              step="any"
              value={stopLoss || ""}
              onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
              placeholder="SL"
              className={`w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border text-xs font-mono text-center focus:outline-none ${
                isSLValid
                  ? "border-red-500/30 text-red-300 focus:border-red-500"
                  : "border-amber-500/50 text-amber-300"
              }`}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Risk:</span>
            <span className="text-red-400 font-bold">-${estimatedDollarRisk}</span>
          </div>
        </div>

        {/* 5. Take Profit & Presets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              TAKE PROFIT
            </label>
            <div className="flex gap-1">
              {[2, 3, 5].map((mult) => (
                <button
                  key={mult}
                  type="button"
                  onClick={() => applyTargetMultiple(mult)}
                  className="px-1 py-0.2 rounded bg-white/[0.06] hover:bg-white/[0.15] text-[9px] font-mono text-zinc-300 hover:text-white"
                >
                  {mult}R
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            step="any"
            value={takeProfit || ""}
            onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
            placeholder="TP"
            className={`w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border text-xs font-mono text-center focus:outline-none ${
              isRewardValid
                ? "border-emerald-500/30 text-emerald-300 focus:border-emerald-500"
                : "border-amber-500/50 text-amber-300"
            }`}
          />
          <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Reward:</span>
            <span className="text-emerald-400 font-bold">+${estimatedDollarReward}</span>
          </div>
        </div>

        {/* 6. Execution Button & Computed Multiple */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
            <span className="text-zinc-400">REWARD:RISK</span>
            <span className="text-white font-black bg-white/10 px-1.5 py-0.5 rounded">
              1:{calculatedRR} R
            </span>
          </div>

          <button
            type="button"
            onClick={handleExecuteTrade}
            disabled={isSubmitting || entryPrice <= 0 || !isSLValid}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>+ LOG EXECUTION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
