"use client";

import React from "react";
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
  Compass,
} from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "SIMULATED VOLUME AUDITED", value: "$480M+", desc: "Over 25,000+ Verified Trades" },
    { label: "DMA TELEMETRY LATENCY", value: "0.2ms", desc: "Local-First Real-Time Slicing" },
    { label: "PROP EVALUATION PASS RATE", value: "84.2%", desc: "Traders Adhering to 0.5% Rule" },
    { label: "ICT/SMC ALGORITHMIC MODELS", value: "8 Arrays", desc: "FVG, OB, Breakers, Sweeps" },
  ];

  const pillars = [
    {
      icon: <Orbit className="w-6 h-6 text-white" />,
      title: "Zero-G Execution Engine",
      subtitle: "Physics-Inspired Risk Boundaries",
      desc: "Markets fluctuate like physical bodies in zero gravity. When momentum expands outside statistical equilibrium, our terminal dynamically maps the gravitational pull toward liquidity voids and fair value gaps.",
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      title: "Algorithmic Market Structure",
      subtitle: "Grounded in ICT & SMC Mechanics",
      desc: "We reject traditional retail indicators. Prices are delivered by Central Bank algorithms balancing buy-side and sell-side books. Every tool we build decodes this exact institutional liquidity cycle.",
    },
    {
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      title: "Asymmetric Capital Preservation",
      subtitle: "Designed for Prop Firm Allocations",
      desc: "Evaluating for six-figure prop accounts requires defensive architecture. Our pre-trade risk calculators and drawdown guardrails guarantee you never violate a trailing drawdown rule again.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-black text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Cybernetic Grid Background */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-30 z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">About Institutional Vision</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>INSTITUTIONAL QUANTUM PHILOSOPHY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
            ENGINEERING EDGE IN ZERO-G MARKET DYNAMICS
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Synapses Investments builds high-frequency execution tools, mathematical risk models, and institutional telemetry for independent prop and systematic operators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard" className="group">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.55)] cursor-pointer">
                <span>Enter Synapses Terminal</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link href="/what-is-sn-journal">
              <button className="px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-semibold text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer">
                Read Journal Manifesto
              </button>
            </Link>
          </div>
        </section>

        {/* Telemetry Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1 p-2 rounded-xl hover:bg-white/[0.02] transition-colors">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                {s.label}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight block">
                {s.value}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono block">
                {s.desc}
              </span>
            </div>
          ))}
        </section>

        {/* The Institutional Thesis */}
        <section className="p-8 sm:p-12 rounded-3xl bg-zinc-950/90 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>THE FOUNDATIONAL THESIS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            THE MARKET IS NOT RANDOM. IT IS ALGORITHMICALLY DELIVERED.
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            <p>
              More than 80% of daily volume across FX, index futures, and equities is transacted by high-frequency algorithmic liquidity models. These algorithms do not trade on hope, feelings, or retail candlestick patterns. They execute on strict time-of-day protocols, balancing order flow between buy-side liquidity pools above old highs and sell-side liquidity pools below old lows.
            </p>
            <p>
              Retail traders fail not because they lack intelligence, but because they trade against the institutional delivery algorithm. They enter during low-probability consolidation, chase emotional breakouts, and risk unquantified capital.
            </p>
            <p>
              Synapses Investments was engineered to reverse this asymmetry. We provide serious operators with the same precision telemetry, execution tracking, and risk boundaries utilized on proprietary trading desks.
            </p>
          </div>
        </section>

        {/* Core Engineering Pillars */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              SYSTEM SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              THE THREE ENGINEERING PILLARS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((p, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-black/80 border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 space-y-4 flex flex-col justify-between group cursor-default"
              >
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 w-fit group-hover:scale-110 group-hover:border-white/25 transition-all duration-200">
                    {p.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-wide">{p.title}</h3>
                    <span className="text-xs font-mono text-emerald-400 block mt-0.5">{p.subtitle}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/15 text-center relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-radial from-white/[0.05] to-transparent pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            UPGRADE YOUR EXECUTION WORKFLOW
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Experience millisecond trade journaling, live risk guardrails, and algorithmic replay simulations.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/journal">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Access Trade Journal</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES INVESTMENTS • QUANTUM TRADING SUITE
        </span>
        <span className="mt-2 sm:mt-0">ZERO-G DMA PROTOCOL v3.4 PRO</span>
      </footer>
    </div>
  );
}
