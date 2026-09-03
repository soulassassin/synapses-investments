import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FeatureLayout } from "@/components/marketing/FeatureLayout";
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Target,
  Scale,
  PieChart,
  ArrowRight,
  Flame,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Deep-Dive Performance Analytics & Expectancy Engine",
  description:
    "Institutional statistical breakdown: R-multiple distributions, session expectancy, Sharpe ratios, win streaks, and automated behavioral leak quantification.",
  alternates: {
    canonical: "https://synapses-investments.vercel.app/features/analytics",
  },
  openGraph: {
    title: "Deep-Dive Performance Analytics | Synapses Investments",
    description: "Statistical alpha, R-multiple expectancy, and psychological trade leakage audits.",
    url: "https://synapses-investments.vercel.app/features/analytics",
  },
};

export default function AnalyticsFeaturePage() {
  const stats = [
    { label: "Expectancy Engine", value: "+1.68R", desc: "Mean Historical Edge" },
    { label: "Profit Factor", value: "3.42", desc: "Gross Gains / Losses" },
    { label: "Sharpe Ratio", value: "2.81", desc: "Risk-Adjusted Alpha" },
    { label: "Sample Universe", value: "1,200+", desc: "Executions Quantified" },
  ];

  const pillars = [
    {
      icon: <PieChart className="w-5 h-5 text-emerald-400" />,
      title: "Win/Loss Distribution & R-Histograms",
      desc: "Deconstruct your payoff asymmetry. Visualize exactly how your outlier +3R and +5R runners subsidize controlled 1R losses.",
    },
    {
      icon: <Target className="w-5 h-5 text-white" />,
      title: "Asset & Session Expectancy Curves",
      desc: "Isolate whether your edge is generated in London or NY AM. Discover which pairs yield the highest Sharpe ratios.",
    },
    {
      icon: <Flame className="w-5 h-5 text-amber-400" />,
      title: "Psychological Leak Attribution",
      desc: "Calculate the exact dollar cost of FOMO entries and early profit-taking with institutional mistake tag quantification.",
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-white" />,
      title: "Peak-to-Trough Drawdown Analysis",
      desc: "Stress-test equity curves against historical maximum adverse excursion and consecutive losing streaks.",
    },
  ];

  return (
    <FeatureLayout
      badge="Telemetry & Edge Quantification"
      title="Mathematical Proof of Your Trading Edge"
      tagline="Mathematical Proof of Your Edge. Zero Latency Analytics."
      description="Trading is an odds game played over hundreds of iterations. Synapses Analytics breaks down every execution into mathematical telemetry, revealing the exact parameters where your alpha thrives."
      primaryCtaText="Inspect Deep-Dive Analytics"
      primaryCtaHref="/dashboard/analytics"
      stats={stats}
    >
      {/* Visual Telemetry Breakdown Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              ALPHA QUANTIFICATION MATRIX
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            Real-Time Engine Sync • Zero Latency
          </span>
        </div>

        {/* Mock Analytics Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase">SESSION WIN RATE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-emerald-400">76.4%</span>
              <span className="text-xs font-mono text-zinc-400">NY AM Macro</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[76%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase">SETUP EXPECTANCY</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-white">+2.45R</span>
              <span className="text-xs font-mono text-zinc-400">Silver Bullet</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full w-[85%]" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase">REWARD TO RISK</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-emerald-400">3.12 : 1</span>
              <span className="text-xs font-mono text-zinc-400">Average Winner</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full w-[90%]" />
            </div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link href="/dashboard/analytics">
            <button className="text-xs font-mono font-bold text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5">
              <span>View your personal edge distribution in the live dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            EMPIRICAL EDGE VERIFICATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider [word-spacing:0.15em]">
            DEEP TELEMETRY DESIGNED FOR ASYMMETRIC ALPHA
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
