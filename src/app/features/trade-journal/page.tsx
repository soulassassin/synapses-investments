"use client";

import React from "react";
import Link from "next/link";
import { FeatureLayout } from "@/components/marketing/FeatureLayout";
import {
  BookOpen,
  Sparkles,
  Shield,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function TradeJournalFeaturePage() {
  const stats = [
    { label: "Execution Latency", value: "0.2ms", desc: "Local-First Persistence" },
    { label: "ICT Confluences", value: "8 Models", desc: "FVG, OB, Sweeps, Breakers" },
    { label: "Chart Storage", value: "100%", desc: "Client-Side Base64 Vault" },
    { label: "Timeframe Support", value: "1s to 1M", desc: "Sub-Second Precision" },
  ];

  const pillars = [
    {
      icon: <Clock className="w-5 h-5 text-white" />,
      title: "Automatic Session Classification",
      desc: "Instant alignment with London Open (Judas swings), NY AM macro windows, NY PM power hours, and Asian consolidation ranges.",
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: "Smart Money Confluence Stacking",
      desc: "Tag Fair Value Gaps, Liquidity Sweeps, Market Structure Shifts (MSS), and Order Block mitigations with a single click.",
    },
    {
      icon: <ImageIcon className="w-5 h-5 text-white" />,
      title: "Zero-Knowledge Screenshot Vault",
      desc: "Drag and drop high-resolution TradingView / cTrader chart screenshots directly into local storage without third-party servers.",
    },
    {
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      title: "Psychology & Discipline Tracking",
      desc: "Quantify how FOMO, hesitation, greed, or revenge trading directly impacts your bottom-line realized R-multiples.",
    },
  ];

  return (
    <FeatureLayout
      badge="Trade Journal & Playbook"
      title="Precision Trade Logging Engineered for ICT & SMC"
      tagline="Precision Trade Logging Engineered for ICT & Smart Money Concepts."
      description="Ditch fragmented spreadsheets and clunky logging tools. Synapses Trade Journal is an institutional-grade playbook designed specifically for traders executing algorithmic liquidity models and Smart Money Concepts."
      primaryCtaText="Launch Live Journal Engine"
      primaryCtaHref="/dashboard/journal"
      stats={stats}
    >
      {/* Interactive Mockup Preview */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              LIVE PLAYBOOK INTERACTION PREVIEW
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Storage Engine: synapses_journal_v1 (Active)
          </span>
        </div>

        {/* Mock Sample Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-black font-mono text-white">NAS100 • 5m</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                WIN +3.00R
              </span>
            </div>
            <div className="text-xs font-mono text-zinc-400 space-y-1">
              <div>Setup: <span className="text-white">ICT Silver Bullet</span></div>
              <div>Session: <span className="text-white">NY AM Macro (10:00 - 11:00)</span></div>
              <div>Confluences: <span className="text-emerald-400">FVG • MSS • Prev Day High Sweep</span></div>
            </div>
            <p className="text-xs text-zinc-400 italic bg-black/50 p-2.5 rounded-xl border border-white/5 font-sans">
              &ldquo;Classic Judas swing into 5m discount FVG. Filled at exact tick with zero drawdown.&rdquo;
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-black font-mono text-white">EURUSD • 15m</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                WIN +3.14R
              </span>
            </div>
            <div className="text-xs font-mono text-zinc-400 space-y-1">
              <div>Setup: <span className="text-white">London Liquidity Sweep</span></div>
              <div>Session: <span className="text-white">London Open</span></div>
              <div>Confluences: <span className="text-emerald-400">Order Block • SMT Divergence</span></div>
            </div>
            <p className="text-xs text-zinc-400 italic bg-black/50 p-2.5 rounded-xl border border-white/5 font-sans">
              &ldquo;Swept Asian highs during London open, closed full position at London session target.&rdquo;
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link href="/dashboard/journal">
            <button className="text-xs font-mono font-bold text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
              <span>Open live trade journal to create your own logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* 4 Feature Pillars Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            ENGINEERED WITHOUT COMPROMISE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            THE ARCHITECTURE OF AN INSTITUTIONAL PLAYBOOK
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
