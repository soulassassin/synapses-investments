"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import {
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Activity,
  ChevronRight,
  Target,
  BarChart3,
  TrendingUp,
  Clock,
  Compass,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Binary,
  Cpu,
} from "lucide-react";

interface QuantModel {
  id: string;
  name: string;
  code: string;
  category: "Index Futures" | "FX Major" | "Crypto Delivery";
  regime: "Trend Expansion" | "Reversal / Sweep" | "Session Macro";
  session: string;
  winRate: string;
  sharpeRatio: string;
  profitFactor: string;
  mae: string;
  avgRR: string;
  description: string;
  confluences: string[];
}

const QUANT_MODELS: QuantModel[] = [
  {
    id: "model-alpha",
    name: "Model Alpha: NY AM Silver Bullet",
    code: "ALPHA-NYAM-01",
    category: "Index Futures",
    regime: "Session Macro",
    session: "10:00 - 11:00 AM EST",
    winRate: "71.4%",
    sharpeRatio: "2.85",
    profitFactor: "2.94",
    mae: "0.32R",
    avgRR: "1 : 3.20",
    description:
      "Exploits the high-velocity algorithmic liquidity delivery window between 10:00 and 11:00 AM EST following the New York equities open. Enters on 1m/5m Fair Value Gap mitigations after a 15m structural liquidity purge.",
    confluences: ["15m MSS (Market Structure Shift)", "5m BISI/SIBI Inefficiency", "Relative Equal Highs/Lows Target"],
  },
  {
    id: "model-delta",
    name: "Model Delta: Liquidity Sweep Reversal",
    code: "DELTA-SWEEP-02",
    category: "FX Major",
    regime: "Reversal / Sweep",
    session: "London Open & NY AM",
    winRate: "68.2%",
    sharpeRatio: "2.41",
    profitFactor: "2.65",
    mae: "0.45R",
    avgRR: "1 : 2.80",
    description:
      "Captures rapid institutional buy-stop (BSL) or sell-stop (SSL) purges into major higher-timeframe order blocks. Requires immediate energetic displacement and displacement candle closes back inside the prior range.",
    confluences: ["HTF Buy-Side / Sell-Side Sweep", "Aggressive Displacement Candle", "1m Bearish/Bullish Order Block"],
  },
  {
    id: "model-gamma",
    name: "Model Gamma: London Judas Swing Trap",
    code: "GAMMA-JUDAS-03",
    category: "FX Major",
    regime: "Trend Expansion",
    session: "02:00 - 05:00 AM EST",
    winRate: "64.8%",
    sharpeRatio: "2.15",
    profitFactor: "2.30",
    mae: "0.50R",
    avgRR: "1 : 2.65",
    description:
      "Fades the false breakout of the Asian session high or low during the Frankfurt/London open crossover. Exploits early retail breakout traps to capture the primary true daily expansion move.",
    confluences: ["Asian Consolidation High/Low Run", "Judas Swing Reversal", "London Killzone Timing Matrix"],
  },
  {
    id: "model-omega",
    name: "Model Omega: Daily Imbalance Fill",
    code: "OMEGA-DAILY-04",
    category: "Crypto Delivery",
    regime: "Trend Expansion",
    session: "All Sessions / NY PM",
    winRate: "62.1%",
    sharpeRatio: "1.95",
    profitFactor: "2.10",
    mae: "0.40R",
    avgRR: "1 : 3.50",
    description:
      "High-timeframe systematic continuation engine entering on the retest of daily virgin Fair Value Gaps (FVG) and institutional Breaker Blocks during low-volume crypto delivery periods.",
    confluences: ["Daily Unmitigated BISI/SIBI", "4h Structural Break of Structure", "Volume Profile Point of Control"],
  },
];

const MICROSTRUCTURE_ELEMENTS = [
  {
    id: "sweeps",
    title: "Liquidity Sweeps (BSL / SSL)",
    tag: "LIQUIDITY MIGRATION",
    color: "emerald",
    summary:
      "Central Bank algorithms do not buy in uptrends or sell in downtrends. They engineer liquidity above prior swing highs (Buy-Side Liquidity) and below swing lows (Sell-Side Liquidity) to accumulate inventory before energetic displacement.",
    telemetry: "Average Slippage Deviation: < 0.15 Ticks • Sweep Reversal Alpha: +2.8R",
  },
  {
    id: "fvg",
    title: "Fair Value Gaps (BISI & SIBI)",
    tag: "MARKET INEFFICIENCY",
    color: "cyan",
    summary:
      "A Fair Value Gap represents a 3-candle price delivery imbalance where one side of the order book was unfilled. The algorithm frequently returns to rebalance this vacuum (Buyside Imbalance Sellside Inefficiency or vice versa) before continuing.",
    telemetry: "Rebalance Fill Probability: 78.4% • Optimal Trade Entry: 50% Consequent Encroachment",
  },
  {
    id: "ob",
    title: "Institutional Order Blocks (OB)",
    tag: "CAPITAL FOOTPRINT",
    color: "amber",
    summary:
      "The final up-close or down-close candle prior to aggressive displacement. Order blocks mark the exact price levels where smart money accumulated large positions that must be defended on subsequent pullbacks.",
    telemetry: "Mitigation Defense Rate: 82.1% • Risk Boundary: Invalidation below Open/Low",
  },
  {
    id: "mss",
    title: "Market Structure Shifts (MSS)",
    tag: "STRUCTURAL REGIME CHANGE",
    color: "white",
    summary:
      "A confirmed displacement candle closing decisively beyond a key swing high or low with an accompanied Fair Value Gap. Differentiates true structural trend shifts from mere liquidity purges.",
    telemetry: "Confirmation Filter: Displacement Body Close (Wicks Excluded)",
  },
];

export default function IntelligencePage() {
  const [selectedRegime, setSelectedRegime] = useState<string>("All");
  const [selectedModel, setSelectedModel] = useState<QuantModel>(QUANT_MODELS[0]);
  const [activeMicroTab, setActiveMicroTab] = useState<number>(0);

  const filteredModels = QUANT_MODELS.filter(
    (m) => selectedRegime === "All" || m.regime === selectedRegime || m.category === selectedRegime
  );

  return (
    <div className="min-h-screen relative bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Cybernetic Background */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-25 z-0" />
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-32 left-10 w-[500px] h-[500px] bg-emerald-500/[0.025] rounded-full blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 sm:space-y-24">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Quantitative Research & Lab</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Binary className="w-3.5 h-3.5 text-cyan-400" />
            <span>QUANTITATIVE RESEARCH & STRATEGY LAB</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider [word-spacing:0.15em] text-white uppercase leading-[1.12]">
            MARKET INTELLIGENCE DERIVED FROM COLD, HARD DATA.
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-sans font-light">
            Deconstructing institutional order flow, decoding Central Bank algorithmic delivery arrays, and engineering high-Sharpe execution models.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/journal" className="group w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-widest [word-spacing:0.18em] transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.35)] cursor-pointer">
                <span>TEST IN TRADE JOURNAL DEMO</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link href="/dashboard/backtesting" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-semibold text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                <span>Launch Replay Simulator</span>
              </button>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MICROSTRUCTURE DECONSTRUCTION */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
                <Layers className="w-4 h-4" />
                <span>ANATOMY OF ALGORITHMIC ORDER FLOW</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider font-mono mt-1">
                MICROSTRUCTURE DECONSTRUCTION
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Institutional Delivery Mechanics
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left selector tabs */}
            <div className="lg:col-span-4 space-y-2.5">
              {MICROSTRUCTURE_ELEMENTS.map((el, idx) => (
                <button
                  key={el.id}
                  onClick={() => setActiveMicroTab(idx)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex flex-col gap-1 ${
                    activeMicroTab === idx
                      ? "bg-[#0d0f14] border-white/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                      : "bg-[#08090c]/60 border-white/5 hover:border-white/15 text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      {el.tag}
                    </span>
                    {activeMicroTab === idx && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-sm font-bold font-mono text-white block">
                    {el.title}
                  </span>
                </button>
              ))}
            </div>

            {/* Right Detailed breakdown pane */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#0d0f14]/90 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block">
                    {MICROSTRUCTURE_ELEMENTS[activeMicroTab].tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-mono text-white uppercase mt-0.5">
                    {MICROSTRUCTURE_ELEMENTS[activeMicroTab].title}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300">
                  SM-ARRAY 0{activeMicroTab + 1}
                </span>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans font-light">
                {MICROSTRUCTURE_ELEMENTS[activeMicroTab].summary}
              </p>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  EMPIRICAL BENCHMARK TELEMETRY
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 block">
                  {MICROSTRUCTURE_ELEMENTS[activeMicroTab].telemetry}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* QUANTITATIVE MODEL CARDS */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
                <Cpu className="w-4 h-4" />
                <span>INSTITUTIONAL STRATEGY MATRIX</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider font-mono mt-1">
                QUANTITATIVE MODEL CARDS
              </h2>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              {["All", "Index Futures", "FX Major", "Trend Expansion", "Reversal / Sweep"].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedRegime(f)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                    selectedRegime === f
                      ? "bg-white text-black font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                      : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                className="p-7 rounded-3xl bg-[#0d0f14]/85 border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-all duration-300 space-y-6 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      {model.code}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {model.session}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black font-mono text-white tracking-wide">
                      {model.name}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500 block mt-0.5">
                      {model.category} • {model.regime}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                    {model.description}
                  </p>
                </div>

                {/* Empirical Telemetry Grid */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[9px] text-zinc-500 block uppercase">WIN RATE</span>
                      <span className="text-sm font-black text-white block mt-0.5">{model.winRate}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[9px] text-zinc-500 block uppercase">SHARPE</span>
                      <span className="text-sm font-black text-emerald-400 block mt-0.5">{model.sharpeRatio}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[9px] text-zinc-500 block uppercase">PROFIT FACTOR</span>
                      <span className="text-sm font-black text-cyan-400 block mt-0.5">{model.profitFactor}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                      <span className="text-[9px] text-zinc-500 block uppercase">MAX MAE</span>
                      <span className="text-sm font-black text-zinc-300 block mt-0.5">{model.mae}</span>
                    </div>
                  </div>

                  {/* Confluence tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {model.confluences.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-zinc-400 border border-white/5"
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RESEARCH PUBLICATION CTA */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#0d0f14]/90 border border-white/15 text-center relative overflow-hidden space-y-6">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-wider [word-spacing:0.15em]">
              ACCESS THE COMPLETE RESEARCH ARCHIVE
            </h2>
            <p className="text-sm text-zinc-400 font-sans">
              Read our peer-reviewed technical articles on liquidity void dynamics, risk-of-ruin equations, and neurochemical trade psychology.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/blog">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 tracking-wide [word-spacing:0.1em] transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Explore Research Publications</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          SYNAPSES QUANT LAB • MICROSTRUCTURE RESEARCH ENGINE
        </span>
        <span className="mt-2 sm:mt-0">v3.4 PRO PRODUCTION RELEASE</span>
      </footer>
    </div>
  );
}
