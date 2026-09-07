"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import { useDMA } from "@/context/DMAContext";
import {
  Calculator,
  ShieldCheck,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Scale,
  Zap,
  RotateCcw,
  SlidersHorizontal,
  Radio,
  Copy,
  Check,
  TrendingUp,
} from "lucide-react";

interface AssetSpec {
  symbol: string;
  name: string;
  category: string;
  pointValue: number; // Dollar value per 1.0 point price move per 1.0 standard lot
  defaultEntry: number;
  defaultSL: number;
  defaultTP: number;
  step: number;
}

const ASSET_SPECS: Record<string, AssetSpec> = {
  NAS100: {
    symbol: "NAS100",
    name: "Nasdaq 100 E-mini Futures",
    category: "Indices",
    pointValue: 20.0,
    defaultEntry: 29544.15,
    defaultSL: 29470.0,
    defaultTP: 29750.0,
    step: 0.25,
  },
  US30: {
    symbol: "US30",
    name: "Dow Jones Industrial Average",
    category: "Indices",
    pointValue: 5.0,
    defaultEntry: 53414.25,
    defaultSL: 53280.0,
    defaultTP: 53750.0,
    step: 1.0,
  },
  EURUSD: {
    symbol: "EURUSD",
    name: "Euro / US Dollar",
    category: "Forex",
    pointValue: 100000,
    defaultEntry: 1.1621,
    defaultSL: 1.1595,
    defaultTP: 1.1690,
    step: 0.0001,
  },
  BTCUSD: {
    symbol: "BTCUSD",
    name: "Bitcoin Perpetual",
    category: "Crypto",
    pointValue: 1.0,
    defaultEntry: 79924.0,
    defaultSL: 79200.0,
    defaultTP: 81800.0,
    step: 10.0,
  },
  XAUUSD: {
    symbol: "XAUUSD",
    name: "Gold / US Dollar",
    category: "Commodities",
    pointValue: 100.0,
    defaultEntry: 4476.6,
    defaultSL: 4455.0,
    defaultTP: 4530.0,
    step: 0.1,
  },
};

export default function RiskCalculatorPage() {
  const { getTicker, latencyMs } = useDMA();
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [selectedAsset, setSelectedAsset] = useState<string>("NAS100");
  const [entryPrice, setEntryPrice] = useState<number>(29544.15);
  const [stopLossPrice, setStopLossPrice] = useState<number>(29470.0);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(29750.0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"calculator" | "drawdown" | "compound">("calculator");

  // Pre-Trade Discipline Checklist
  const [checklist, setChecklist] = useState({
    sessionAligned: true,
    riskUnderTwoPct: true,
    fvgConfirmed: true,
    noRedFolderNews: true,
    disciplineChecked: true,
  });

  const spec = ASSET_SPECS[selectedAsset] || ASSET_SPECS["NAS100"];
  const liveTicker = getTicker(selectedAsset);

  const handleSelectAsset = (sym: string) => {
    setSelectedAsset(sym);
    const s = ASSET_SPECS[sym];
    const live = getTicker(sym);
    if (live && live.price > 0) {
      setEntryPrice(live.price);
      const isForex = s?.category === "Forex";
      const slOffset = isForex ? 0.0025 : live.price * 0.003;
      const tpOffset = isForex ? 0.0075 : live.price * 0.009;
      setStopLossPrice(Number((live.price - slOffset).toFixed(s?.step < 1 ? 4 : 2)));
      setTakeProfitPrice(Number((live.price + tpOffset).toFixed(s?.step < 1 ? 4 : 2)));
    } else if (s) {
      setEntryPrice(s.defaultEntry);
      setStopLossPrice(s.defaultSL);
      setTakeProfitPrice(s.defaultTP);
    }
  };

  const handleSyncDMA = () => {
    const live = getTicker(selectedAsset);
    if (live && live.price > 0) {
      setEntryPrice(live.price);
      const isForex = spec.category === "Forex";
      const slOffset = isForex ? 0.0025 : live.price * 0.003;
      const tpOffset = isForex ? 0.0075 : live.price * 0.009;
      setStopLossPrice(Number((live.price - slOffset).toFixed(spec.step < 1 ? 4 : 2)));
      setTakeProfitPrice(Number((live.price + tpOffset).toFixed(spec.step < 1 ? 4 : 2)));
    }
  };

  // Computations
  const dollarRisk = useMemo(() => {
    return (accountSize * riskPercent) / 100;
  }, [accountSize, riskPercent]);

  const stopDistance = useMemo(() => {
    return Math.abs(entryPrice - stopLossPrice);
  }, [entryPrice, stopLossPrice]);

  const targetDistance = useMemo(() => {
    return Math.abs(takeProfitPrice - entryPrice);
  }, [takeProfitPrice, entryPrice]);

  const calculatedLots = useMemo(() => {
    if (stopDistance <= 0) return 0;
    // For Forex: stopDistance in pips vs pointValue
    if (spec.category === "Forex") {
      const pips = stopDistance * 10000;
      const pipValuePerLot = 10; // Standard $10/pip for EURUSD
      return pips > 0 ? Number((dollarRisk / (pips * pipValuePerLot)).toFixed(2)) : 0;
    }
    // For commodities/crypto/indices:
    const dollarRiskPerUnit = stopDistance * (spec.pointValue || 1.0);
    return dollarRiskPerUnit > 0 ? Number((dollarRisk / dollarRiskPerUnit).toFixed(2)) : 0;
  }, [dollarRisk, stopDistance, spec]);

  const rewardRiskRatio = useMemo(() => {
    if (stopDistance <= 0) return 0;
    return Number((targetDistance / stopDistance).toFixed(2));
  }, [targetDistance, stopDistance]);

  const projectedDollarReturn = useMemo(() => {
    return Number((dollarRisk * rewardRiskRatio).toFixed(2));
  }, [dollarRisk, rewardRiskRatio]);

  const isOverleveraged = riskPercent > 2.0;
  const allChecklistPassed = Object.values(checklist).every(Boolean) && !isOverleveraged;

  const handleCopyTicket = () => {
    const direction = takeProfitPrice >= entryPrice ? "LONG" : "SHORT";
    const text = `SYNAPSES EXECUTION TICKET:\nAsset: ${selectedAsset} (${spec.name})\nDirection: ${direction}\nSize: ${calculatedLots} ${spec.category === "Indices" ? "Contracts" : "Lots"}\nEntry: ${entryPrice}\nStop Loss: ${stopLossPrice} (${stopDistance.toFixed(2)} pts)\nTake Profit: ${takeProfitPrice} (${targetDistance.toFixed(2)} pts)\nRisk Allocation: $${dollarRisk.toLocaleString()} (${riskPercent}%)\nReward Target: +$${projectedDollarReturn.toLocaleString()} (1:${rewardRiskRatio.toFixed(2)} R:R)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Background Cybernetic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-25 z-0" />
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-1">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Risk & Capital Calculator</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>INSTITUTIONAL CAPITAL ALLOCATION GUARDRAILS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider [word-spacing:0.15em] text-white uppercase leading-[1.12]">
            PRE-TRADE MATHEMATICAL GUARDRAILS.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Dynamic position sizing, tick risk containment, and automated drawdown boundary calculations engineered with live DMA market pricing.
          </p>

          {/* Navigation View Switcher */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab("calculator")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "calculator"
                    ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Lot Sizing Engine
              </button>
              <button
                onClick={() => setActiveTab("drawdown")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "drawdown"
                    ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Drawdown Ruin Matrix
              </button>
              <button
                onClick={() => setActiveTab("compound")}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "compound"
                    ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Compound Scale Model
              </button>
            </div>
          </div>
        </section>

        {/* CALCULATOR TAB */}
        {activeTab === "calculator" && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Inputs & Presets */}
            <div className="lg:col-span-7 space-y-6">
              {/* Main Form Container */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0d0f14]/90 border border-white/10 shadow-[0_15px_50px_rgba(0,0,0,0.85)] space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                    <span>CAPITAL ALLOCATION PARAMETERS</span>
                  </span>
                  <button
                    onClick={handleSyncDMA}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    <span>Sync Live DMA ({latencyMs.toFixed(1)}ms)</span>
                  </button>
                </div>

                {/* Asset Selector Tabs */}
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                    SELECT INSTRUMENT
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.keys(ASSET_SPECS).map((sym) => (
                      <button
                        key={sym}
                        onClick={() => handleSelectAsset(sym)}
                        className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                          selectedAsset === sym
                            ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.35)]"
                            : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mt-1.5">
                    <span>Instrument: {spec.name} ({spec.category})</span>
                    {liveTicker && (
                      <span className="text-emerald-400 font-bold">
                        DMA Spot: ${liveTicker.price.toLocaleString()} ({liveTicker.isPositive ? "+" : ""}{liveTicker.changePercent}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Account Size & Quick Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      ACCOUNT CAPITAL SIZE ($)
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[10000, 25000, 50000, 100000, 200000].map((val) => (
                        <button
                          key={val}
                          onClick={() => setAccountSize(val)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            accountSize === val
                              ? "bg-white text-black font-bold"
                              : "bg-white/[0.05] text-zinc-400 hover:text-white"
                          }`}
                        >
                          ${val / 1000}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={accountSize}
                      onChange={(e) => setAccountSize(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Risk Percentage & Quick Presets */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                      RISK PER PLAY (%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[0.25, 0.5, 1.0, 2.0].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRiskPercent(r)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            riskPercent === r
                              ? "bg-cyan-500 text-black font-bold"
                              : "bg-white/[0.05] text-zinc-400 hover:text-white"
                          }`}
                        >
                          {r}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <Percent className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="0.05"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Entry, Stop Loss, Take Profit */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                      ENTRY PRICE
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-red-400 uppercase tracking-wider block mb-1">
                      STOP LOSS (SL)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={stopLossPrice}
                      onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                      TAKE PROFIT (TP)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={takeProfitPrice}
                      onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pre-Trade Discipline Checklist */}
              <div className="p-6 rounded-3xl bg-[#0d0f14]/90 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                    PRE-TRADE EXECUTION CHECKLIST
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                      allChecklistPassed
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {allChecklistPassed ? "✓ Guardrails Cleared" : "! Action Blocked"}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  {[
                    { id: "sessionAligned", label: "Trade timing is strictly inside active Killzone window (London / NY)" },
                    { id: "riskUnderTwoPct", label: "Account allocation is strictly ≤ 2.0% maximum risk threshold" },
                    { id: "fvgConfirmed", label: "Higher-timeframe liquidity sweep or order block confirmed on chart" },
                    { id: "noRedFolderNews", label: "No High-Impact (CPI / FOMC / NFP) red folder release in next 15 mins" },
                    { id: "disciplineChecked", label: "Mindset verified: Calm, focused, and free from revenge sentiment" },
                  ].map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 cursor-pointer select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(checklist as any)[item.id]}
                        onChange={(e) =>
                          setChecklist((prev) => ({ ...prev, [item.id]: e.target.checked }))
                        }
                        className="rounded bg-black border-white/20 text-emerald-500 focus:ring-0 w-4 h-4"
                      />
                      <span className="text-zinc-300">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Reactive Output Display */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-7 rounded-3xl bg-[#0d0f14]/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    CALCULATED EXECUTION ORDER
                  </span>
                  <button
                    onClick={handleCopyTicket}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-mono text-zinc-200 transition-colors"
                    title="Copy formatted order ticket to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied!" : "Copy Ticket"}</span>
                  </button>
                </div>

                {/* Overleveraging Warning Alert */}
                {isOverleveraged && (
                  <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 space-y-1 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-mono font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>OVERLEVERAGING VIOLATION</span>
                    </div>
                    <p className="text-[11px] font-sans text-red-300">
                      Proprietary firm rules prohibit risking &gt;2.0% on a single execution. Scale back risk percentage immediately.
                    </p>
                  </div>
                )}

                {/* Primary Recommended Lot Size */}
                <div className="p-6 rounded-2xl bg-black/60 border border-white/10 text-center space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    RECOMMENDED POSITION SIZE
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-wider text-white">
                    {calculatedLots}{" "}
                    <span className="text-sm text-zinc-400 font-sans font-normal">
                      {spec.category === "Indices" ? "CONTRACTS" : "LOTS"}
                    </span>
                  </h2>
                  <span className="text-[11px] font-mono text-zinc-500 block">
                    Constrained to ${dollarRisk.toLocaleString()} Max Risk
                  </span>
                </div>

                {/* Metric Breakdown Rows */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400">Total Dollar Risk:</span>
                    <span className="text-red-400 font-bold">
                      ${dollarRisk.toLocaleString()} ({riskPercent}%)
                    </span>
                  </div>

                  <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400">Stop Loss Distance:</span>
                    <span className="text-white font-bold">{stopDistance.toFixed(2)} pts</span>
                  </div>

                  <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400">Target R:R Expectancy:</span>
                    <span className="text-cyan-400 font-bold">1 : {rewardRiskRatio.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400">Projected Dollar Return:</span>
                    <span className="text-emerald-400 font-bold">
                      +${projectedDollarReturn.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    {allChecklistPassed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Execution Approved</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400">Guardrails Breached</span>
                      </>
                    )}
                  </div>

                  <Link href="/dashboard/journal">
                    <button className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-mono transition-colors cursor-pointer">
                      Log Trade &rarr;
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* DRAWDOWN RUIN MATRIX TAB */}
        {activeTab === "drawdown" && (
          <section className="p-7 rounded-3xl bg-[#0d0f14]/90 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  ASYMMETRIC RISK-OF-RUIN & DRAWDOWN RECOVERY
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  At {riskPercent}% capital allocation per play on a ${accountSize.toLocaleString()} portfolio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              {[
                { lossCount: 3, lossPct: (1 - Math.pow(1 - riskPercent / 100, 3)) * 100 },
                { lossCount: 5, lossPct: (1 - Math.pow(1 - riskPercent / 100, 5)) * 100 },
                { lossCount: 10, lossPct: (1 - Math.pow(1 - riskPercent / 100, 10)) * 100 },
                { lossCount: 15, lossPct: (1 - Math.pow(1 - riskPercent / 100, 15)) * 100 },
              ].map((item) => {
                const dd = item.lossPct;
                const requiredGain = (1 / (1 - dd / 100) - 1) * 100;
                const remainingEquity = accountSize * (1 - dd / 100);
                return (
                  <div key={item.lossCount} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{item.lossCount} Losses in a Row</span>
                      <span className="text-red-400 font-bold">-{dd.toFixed(1)}%</span>
                    </div>
                    <div className="text-lg font-bold text-white font-mono">
                      ${remainingEquity.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-[11px] text-zinc-500 pt-2 border-t border-white/5 flex justify-between">
                      <span>Required to Rebound:</span>
                      <span className="text-emerald-400 font-bold">+{requiredGain.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reference Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase">
                    <th className="py-2.5 px-3">Drawdown Depth</th>
                    <th className="py-2.5 px-3">Capital Lost</th>
                    <th className="py-2.5 px-3">Remaining Balance</th>
                    <th className="py-2.5 px-3 text-right">Required Gain to Recover</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {[
                    { dd: 5, gain: 5.3 },
                    { dd: 10, gain: 11.1 },
                    { dd: 20, gain: 25.0 },
                    { dd: 30, gain: 42.9 },
                    { dd: 50, gain: 100.0 },
                  ].map((row) => (
                    <tr key={row.dd} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-bold text-red-400">-{row.dd}%</td>
                      <td className="py-2.5 px-3">${((accountSize * row.dd) / 100).toLocaleString()}</td>
                      <td className="py-2.5 px-3">${(accountSize * (1 - row.dd / 100)).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400">+{row.gain}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* COMPOUND SCALE TAB */}
        {activeTab === "compound" && (
          <section className="p-7 rounded-3xl bg-[#0d0f14]/90 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  COMPOUND EQUITY TRAJECTORY MODEL (5% Monthly Target)
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Disciplined geometric scaling starting from ${accountSize.toLocaleString()} balance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
              {[1, 2, 3, 6, 9, 12].map((month) => {
                const monthlyRate = 0.05;
                const projected = accountSize * Math.pow(1 + monthlyRate, month);
                const profit = projected - accountSize;
                return (
                  <div key={month} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase block">Month {month}</span>
                    <div className="text-base font-bold text-white">
                      ${projected.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      +${profit.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES RISK GUARDRAIL SUITE • DYNAMIC POSITION ENGINE
        </span>
        <span className="mt-2 sm:mt-0">DMA PROTOCOL v3.4 PRO</span>
      </footer>
    </div>
  );
}
