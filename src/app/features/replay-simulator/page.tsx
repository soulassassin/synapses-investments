import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FeatureLayout } from "@/components/marketing/FeatureLayout";
import {
  History,
  Play,
  FastForward,
  EyeOff,
  Terminal,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Bar Replay Simulator | Zero-Lookahead Backtesting Engine",
  description:
    "Replay past market sessions tick-by-tick without foresight bias. Forward test your ICT model against years of historical institutional order flow.",
  alternates: {
    canonical: "https://synapses-investments.vercel.app/features/replay-simulator",
  },
  openGraph: {
    title: "Bar Replay Simulator | Synapses Investments",
    description: "Zero-lookahead backtesting with variable speed playback and direct journal sync.",
    url: "https://synapses-investments.vercel.app/features/replay-simulator",
  },
};

export default function ReplaySimulatorFeaturePage() {
  const stats = [
    { label: "Replay Speeds", value: "1x - 10x", desc: "Variable Tick Progression" },
    { label: "Lookahead Bias", value: "0.0%", desc: "Strict Blind Testing Mode" },
    { label: "Historical Depth", value: "5+ Years", desc: "Minute-by-Minute Data" },
    { label: "Direct Sync", value: "Instant", desc: "One-Click Playbook Export" },
  ];

  const pillars = [
    {
      icon: <FastForward className="w-5 h-5 text-white" />,
      title: "Variable Speed Bar-by-Bar Playback",
      desc: "Advance bar-by-bar or stream market data at 2x, 5x, or 10x speed to simulate live execution pressure without sitting through dead hours.",
    },
    {
      icon: <EyeOff className="w-5 h-5 text-emerald-400" />,
      title: "Lookahead Bias Elimination",
      desc: "Blind testing masks future candles and prevents psychological hindsight. Make execution decisions strictly on available candle closes.",
    },
    {
      icon: <Terminal className="w-5 h-5 text-white" />,
      title: "Simulated Order Execution Engine",
      desc: "Place limit, stop, and market orders inside the replay simulator with live trailing stops and realistic slippage simulation.",
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      title: "Seamless Playbook Integration",
      desc: "Log completed backtested executions directly into your Synapses Journal with one click, capturing exact chart frames.",
    },
  ];

  return (
    <FeatureLayout
      badge="Bar-by-Bar Replay Engine"
      title="Tick-Level Market Reconstruction"
      tagline="Tick-Level Market Reconstruction Without Lookahead Bias."
      description="Static backtesting on historical charts breeds false confidence. Synapses Market Replay reconstructs price action tick-by-tick, forcing you to execute under dynamic conditions with zero hindsight bias."
      primaryCtaText="Launch Replay Simulator"
      primaryCtaHref="/dashboard/backtesting"
      stats={stats}
    >
      {/* Interactive Replay Simulator Showcase */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              TICK SIMULATION CONSOLE PREVIEW
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Engine: Synapses TickReplay v3.4 PRO
          </span>
        </div>

        {/* Console Preview Graphic */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">REPLAY: NAS100 5m</span>
              <span className="text-zinc-500">• 2026-08-28 09:30:00 EST</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">SPEED: 5x</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">ACTIVE</span>
            </div>
          </div>

          <div className="h-44 rounded-xl bg-black flex items-center justify-center border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-dot-matrix opacity-20" />
            <div className="relative text-center space-y-2">
              <History className="w-8 h-8 text-zinc-400 mx-auto animate-pulse" />
              <span className="text-xs font-mono text-zinc-300 block">
                Tick Engine Running: 19,842.25 &rarr; 19,878.50 (+36.25 pts)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 block">
                [ ORDER ACTIVE: LONG 2.0 LOTS • SL 19,815.00 • TP 19,920.00 ]
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link href="/dashboard/backtesting">
            <button className="text-xs font-mono font-bold text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
              <span>Enter Bar-by-Bar Replay Simulator in the live terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            HISTORICAL REALISM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            WHY TICK-LEVEL REPLAY OUTPERFORMS STATIC CHARTS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-black/80 border border-white/10 hover:border-white/25 transition-all space-y-3"
            >
              <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 w-fit">
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">{p.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </FeatureLayout>
  );
}
