import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Terminal,
  Cpu,
  Layers,
  Award,
  Orbit,
  TrendingUp,
  ChevronRight,
  Activity,
  Database,
  GitBranch,
  BarChart2,
  Lock,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Proprietary Firm Architecture & Systematic Execution",
  description:
    "Empirical Edge. Institutional Capital. Systematic Execution. Discover Synapses Investments: a private proprietary trading firm deconstructing trade execution data and deploying quantitative edge.",
  alternates: {
    canonical: "https://synapses-investments.vercel.app/about",
  },
  openGraph: {
    title: "About Synapses Investments | Proprietary Trading Firm Architecture",
    description:
      "A private proprietary trading firm deploying capital into liquid markets driven by quantitative research rather than subjective bias.",
    url: "https://synapses-investments.vercel.app/about",
  },
};

export default function AboutPage() {
  const firmTelemetry = [
    {
      label: "QUANT MODELS DEPLOYED",
      value: "14 Live",
      subtext: "Silver Bullet, FVG & Liquidity Sweeps",
      highlight: "text-white",
    },
    {
      label: "AVERAGE R:R EXPECTANCY",
      value: "1 : 2.85",
      subtext: "Validated over 45,000+ Executions",
      highlight: "text-emerald-400",
    },
    {
      label: "DMA TELEMETRY LATENCY",
      value: "0.24ms",
      subtext: "Direct Exchange Memory Bus",
      highlight: "text-cyan-400",
    },
    {
      label: "EXECUTION FILL RATE",
      value: "99.98%",
      subtext: "Zero-Slippage Simulation Bounds",
      highlight: "text-white",
    },
  ];

  const systematicEngineStages = [
    {
      number: "01",
      icon: <Database className="w-6 h-6 text-emerald-400" />,
      title: "Data Collection & Tick-Level Logging",
      subtitle: "Microsecond Execution Auditing",
      desc: "Every order fill, partial exit, and slippage deviation is logged at the millisecond tick level. We capture not just price, but spread widening, order book imbalance, and macroeconomic volatility spikes at the exact moment of execution.",
    },
    {
      number: "02",
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      title: "Microstructure Mapping",
      subtitle: "Algorithmic Delivery & Liquidity Cycles",
      desc: "Prices are delivered systematically by Central Bank algorithms balancing buy-side and sell-side books. We map the physical migration of liquidity across key time-of-day killzones, Fair Value Gaps, and institutional Order Blocks.",
    },
    {
      number: "03",
      icon: <GitBranch className="w-6 h-6 text-amber-400" />,
      title: "Quantitative Refinement",
      subtitle: "Mechanical Multi-Regime Backtesting",
      desc: "Raw algorithmic concepts undergo brutal multi-year tick backtesting across trending, consolidating, and high-volatility market regimes. Strategies that cannot sustain a Sharpe > 2.0 with strict 1% risk-of-ruin guardrails are eliminated.",
    },
  ];

  const firmPillars = [
    {
      icon: <Cpu className="w-6 h-6 text-white" />,
      title: "Private Proprietary Allocation",
      desc: "Synapses Investments operates as a private proprietary trading collective. We allocate institutional capital directly into liquid global markets including Index Futures (NAS100, US30, SPX500), Major FX pairs, and Tier-1 Crypto assets.",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Asymmetric Capital Preservation",
      desc: "Our prime mandate is capital preservation. Every deployment is governed by strict mathematical drawdown guardrails, pre-trade risk calculators, and automated risk-of-ruin defenses that prevent tail-risk liquidation.",
    },
    {
      icon: <Activity className="w-6 h-6 text-cyan-400" />,
      title: "Zero Subjective Bias",
      desc: "Human emotional bias (fear, FOMO, hesitation, greed) is the single largest destroyers of trading capital. We engineer execution black boxes and telemetry terminals that enforce mechanical, repeatable discipline.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Cybernetic Grid & Ambient Backdrops */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-25 z-0" />
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-white/[0.03] rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-20 right-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20 sm:space-y-24">
        {/* ========================================================================= */}
        {/* HERO SECTION */}
        {/* ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">About The Firm</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>PROPRIETARY TRADING FIRM ARCHITECTURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider [word-spacing:0.15em] text-white uppercase leading-[1.12]">
            EMPIRICAL EDGE. INSTITUTIONAL CAPITAL. SYSTEMATIC EXECUTION.
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-sans font-light">
            Synapses Investments is a privately-held proprietary trading firm that deconstructs trade execution data, isolates algorithmic delivery patterns, backtests quantitative strategies, and refines mathematical edge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/journal" className="group w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-widest [word-spacing:0.18em] transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_45px_rgba(255,255,255,0.55)] cursor-pointer">
                <span>TEST THE TRADE JOURNAL DEMO</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link href="/intelligence" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-semibold text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                <span>Explore Quant Lab</span>
              </button>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FIRM TELEMETRY GRID */}
        {/* ========================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE FIRM TELEMETRY</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              DMA SYSTEM STATUS: 100% OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-[#0d0f14]/90 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_15px_50px_rgba(0,0,0,0.85)]">
            {firmTelemetry.map((item, idx) => (
              <div
                key={idx}
                className="space-y-1.5 p-4 rounded-2xl bg-black/50 border border-white/5 hover:border-white/15 transition-all"
              >
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  {item.label}
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono tracking-wider block ${item.highlight}`}
                >
                  {item.value}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono block">
                  {item.subtext}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE SYSTEMATIC ENGINE */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              HOW WE GENERATE ALPHA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider [word-spacing:0.15em] font-mono">
              THE SYSTEMATIC ENGINE
            </h2>
            <p className="text-sm text-zinc-400">
              A 3-stage quantitative pipeline turning tick execution telemetry into repeatable statistical expectancy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systematicEngineStages.map((stage, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0d0f14]/80 border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.85)] transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 w-fit group-hover:scale-110 group-hover:border-white/25 transition-all duration-200">
                      {stage.icon}
                    </div>
                    <span className="text-xs font-mono font-black text-white/30 tracking-widest">
                      PHASE {stage.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white tracking-wide">{stage.title}</h3>
                    <span className="text-xs font-mono text-emerald-400 block mt-1">
                      {stage.subtitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {stage.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Quantitative Standard Verified</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FIRM DOCTRINE & ARCHITECTURE */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#0d0f14]/90 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>PROPRIETARY CAPITAL DEPLOYMENT</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider [word-spacing:0.15em] uppercase font-mono">
              QUANTITATIVE RESEARCH OVER SUBJECTIVE BIAS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {firmPillars.map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-black/60 border border-white/5 space-y-3"
              >
                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 w-fit">
                  {p.icon}
                </div>
                <h4 className="text-base font-bold text-white tracking-wide">{p.title}</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CTA */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/15 text-center relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-radial from-white/[0.05] to-transparent pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider [word-spacing:0.15em] uppercase font-mono">
            JOIN THE SYSTEMATIC TRADING REVOLUTION
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Experience tick-level trade logging, mathematical risk guardrails, and algorithmic replay simulations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/journal">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 tracking-wide [word-spacing:0.1em] transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Access Trade Journal Demo</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>
            <Link href="/manifesto">
              <button className="px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white font-semibold text-sm tracking-wide transition-all cursor-pointer">
                Read The Manifesto
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES INVESTMENTS • PROPRIETARY QUANT SUITE
        </span>
        <span className="mt-2 sm:mt-0">ZERO-G DMA PROTOCOL v3.4 PRO</span>
      </footer>
    </div>
  );
}
