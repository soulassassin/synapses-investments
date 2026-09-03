import React from "react";
import type { Metadata } from "next";
import { FeatureLayout } from "@/components/marketing/FeatureLayout";
import { MiniPositionSizer } from "@/components/marketing/MiniPositionSizer";
import {
  Calculator,
  ShieldCheck,
  Percent,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dynamic Risk & Lot Calculator | Prop Firm Capital Protection",
  description:
    "Pre-trade position sizing calculator engineered for prop firm evaluations and live accounts. Calculate exact contract sizing for NAS100, US30, and Gold.",
  alternates: {
    canonical: "https://synapses-investments.vercel.app/features/risk-calculator",
  },
  openGraph: {
    title: "Dynamic Risk & Lot Calculator | Synapses Investments",
    description: "Capital preservation, exact tick-value lot sizing, and drawdown guardrails.",
    url: "https://synapses-investments.vercel.app/features/risk-calculator",
  },
};

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
      <MiniPositionSizer />

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
