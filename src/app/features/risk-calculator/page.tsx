"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FeatureLayout } from "@/components/marketing/FeatureLayout";
import {
  Calculator,
  ShieldCheck,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Lock,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function RiskCalculatorFeaturePage() {
  const stats = [
    { label: "Lot Calculation", value: "Exact", desc: "Per-Tick Point Valuation" },
    { label: "Prop Firm Rules", value: "100%", desc: "Max Daily & Trailing Guardrails" },
    { label: "R:R Optimization", value: "Real-Time", desc: "Dynamic Risk-Reward Projection" },
    { label: "Slippage Buffer", value: "Configurable", desc: "Pre-Execution Padding" },
  ];

  const pillars = [
    {
      icon: <Calculator className="w-5 h-5 text-white" />,
      title: "Instrument-Specific Tick Sizing",
      desc: "Instantly translate dollar risk into exact lots or contract counts across NAS100 ($20/pt), US30 ($5/pt), XAUUSD ($100/pt), or Forex pips.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Prop Firm Daily Loss Guardrails",
      desc: "Lock in strict adherence to FTMO, Apex, and Topstep rules with live alerts when position sizes approach daily drawdown thresholds.",
    },
    {
      icon: <Percent className="w-5 h-5 text-white" />,
      title: "Pre-Trade Checklist Enforcement",
      desc: "Enforce pre-flight verification: high-impact news check, higher timeframe trend alignment, and session killzone confirmation.",
    },
    {
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      title: "Overleveraging & Revenge Lockouts",
      desc: "Prevent blowups before placing the order. System calculates maximum safe lot size based on current equity drawdowns.",
    },
  ];

  // Mini interactive demo on this landing page
  const [balance, setBalance] = useState(100000);
  const [riskPct, setRiskPct] = useState(1.0);
  const [stopPts, setStopPts] = useState(25);

  const dollarRisk = (balance * riskPct) / 100;
  const calculatedLots = stopPts > 0 ? Number((dollarRisk / (stopPts * 20)).toFixed(2)) : 0;

  return (
    <FeatureLayout
      badge="Dynamic Capital Guardrails"
      title="Pre-Trade Capital Preservation & Position Sizing"
      tagline="Pre-Trade Capital Preservation & Dynamic Position Sizer."
      description="Capital preservation is the foundation of longevity in proprietary trading. Synapses Risk Calculator determines exact contract sizing based on point stop distances, account equity, and strict drawdown limits."
      primaryCtaText="Launch Live Risk Calculator"
      primaryCtaHref="/dashboard/calculator"
      stats={stats}
    >
      {/* Interactive Sizing Engine Preview */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              INTERACTIVE POSITION SIZER PREVIEW (NAS100)
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Formula: Dollar Risk ÷ (Stop Pts × Instrument Point Value)
          </span>
        </div>

        {/* Live Interactive Mini Widget */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">ACCOUNT BALANCE ($)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">RISK PERCENTAGE (%)</label>
            <input
              type="number"
              step="0.1"
              value={riskPct}
              onChange={(e) => setRiskPct(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">STOP LOSS DISTANCE (PTS)</label>
            <input
              type="number"
              value={stopPts}
              onChange={(e) => setStopPts(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
            />
          </div>
        </div>

        {/* Results Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 font-mono">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase block">MAX ALLOWABLE DOLLAR RISK</span>
            <span className="text-xl font-bold text-red-400">${dollarRisk.toLocaleString()}</span>
          </div>
          <div className="text-right sm:text-right">
            <span className="text-[10px] text-zinc-400 uppercase block">RECOMMENDED CONTRACTS (LOTS)</span>
            <span className="text-2xl font-black text-emerald-400">{calculatedLots} Contracts</span>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link href="/dashboard/calculator">
            <button className="text-xs font-mono font-bold text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
              <span>Open full risk calculator with prop firm guardrails</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            PROPRIETARY CAPITAL PRESERVATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            BUILT TO PROTECT EVALUATION & FUNDED ACCOUNTS
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
