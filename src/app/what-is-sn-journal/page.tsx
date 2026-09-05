import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Flame,
  Layers,
  Check,
  X,
  ChevronRight,
  Cpu,
  Target,
  Image as ImageIcon,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "What is Synapses Journal? | The Algorithmic Execution Black Box",
  description:
    "Discover Synapses Journal: not a passive spreadsheet, but a mechanical feedback terminal engineered to audit strategy confluences, track behavioral psychology, and eliminate emotional trading leaks.",
  alternates: {
    canonical: "https://synapses-investments.vercel.app/what-is-sn-journal",
  },
  openGraph: {
    title: "What is Synapses Journal? | The Algorithmic Execution Black Box",
    description:
      "Audit confluences, track behavioral psychology, and eliminate emotional leakage with local encrypted storage.",
    url: "https://synapses-investments.vercel.app/what-is-sn-journal",
  },
};

export default function WhatIsSnJournalPage() {
  const comparisonItems = [
    {
      feature: "Local-First Encryption (Zero Third-Party Storage)",
      excel: false,
      notion: false,
      synapses: true,
      notes: "Saved in client-side localStorage vault (synapses_journal_v1)",
    },
    {
      feature: "Instant 1-Click Screenshot Drag-and-Drop",
      excel: false,
      notion: "Slow / Clunky",
      synapses: true,
      notes: "Embedded as base64 with instant thumbnail lightbox",
    },
    {
      feature: "Live Dynamic R:R & Sizing Calculations",
      excel: "Requires manual formulas",
      notion: false,
      synapses: true,
      notes: "Auto-computed live as entry, SL, and TP are keyed in",
    },
    {
      feature: "Custom Playbook & Quantitative Array Tagging",
      excel: false,
      notion: "Manual tagging",
      synapses: true,
      notes: "FVG, OB, Breakers, Liquidity Sweeps, MSS confluences",
    },
    {
      feature: "Session Matrix Slicing (London, NY AM/PM, Asia)",
      excel: false,
      notion: false,
      synapses: true,
      notes: "Automatic macro window attribution",
    },
    {
      feature: "Behavioral State Leak Audit (FOMO/Revenge Tagging)",
      excel: false,
      notion: false,
      synapses: true,
      notes: "Quantifies the exact dollar cost of emotional breaches",
    },
    {
      feature: "Prop Firm Drawdown & Evaluation Compliance Alerts",
      excel: false,
      notion: false,
      synapses: true,
      notes: "Built-in guardrails against trailing drawdown limits",
    },
  ];

  const deepDives = [
    {
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      title: "1. Algorithmic Setup Tagging",
      subtitle: "Cataloging Institutional Liquidity Arrays",
      desc: "Retail journals record vague indicators like 'RSI oversold'. Synapses Journal tracks structural institutional mechanics: Liquidity Sweeps (BSL/SSL), Fair Value Gaps (BISI/SIBI), Order Block Mitigations, Breaker Blocks, and Market Structure Shifts (MSS).",
    },
    {
      icon: <Clock className="w-6 h-6 text-cyan-400" />,
      title: "2. Session Matrix Telemetry",
      subtitle: "Time-of-Day Algorithmic Precision",
      desc: "Price delivery is dictated by time first, price second. The journal categorizes every execution across the London Judas Swing, New York AM Silver Bullet (10:00 - 11:00 AM EST), New York PM Power Hour, and Asian consolidation ranges to identify your true session alpha.",
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-400" />,
      title: "3. Psychological & Behavioral Audit",
      subtitle: "Isolating Model Error from Human Error",
      desc: "Most trading losses do not stem from bad setups; they stem from cognitive failure. By tagging your emotional state (Disciplined, FOMO, Hesitant, Greedy, Revenge), Synapses mathematically quantifies how much capital emotional leakage cost you each month.",
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-white" />,
      title: "4. Multi-Timeframe Playbook Catalog",
      subtitle: "Visual Proof of Flawless Execution",
      desc: "Maintain an interactive visual archive of chart screenshots before and after execution. Review your highest-conviction executions bar-by-bar in the Visual Playbook to reinforce subconscious pattern recognition.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-black text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Cybernetic Background */}
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
            <span className="text-white font-semibold">SN Journal Product Manifesto</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>THE ALGORITHMIC EXECUTION BLACK BOX</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider [word-spacing:0.15em] text-white uppercase leading-[1.15]">
            WHAT IS SYNAPSES JOURNAL?
          </h1>

          <p className="text-lg sm:text-xl font-medium text-zinc-200 max-w-2xl mx-auto italic">
            &ldquo;Not a passive spreadsheet. A mechanical feedback terminal engineered to audit confluences, track behavioral psychology, and quantify true statistical edge.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Professional prop operators and institutional desks do not rely on static notebooks. They log executions into algorithmic black boxes to eliminate cognitive bias and systematically protect capital.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard/journal" className="group">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-wide [word-spacing:0.1em] transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.55)] cursor-pointer">
                <span>Access Live Terminal Journal</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
          </div>
        </section>

        {/* 4 Feature Deep Dives */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              MECHANICAL DISCIPLINE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider [word-spacing:0.15em]">
              FOUR PILLARS OF MECHANICAL LOGGING
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {deepDives.map((d, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-zinc-950/90 border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 space-y-3 flex flex-col justify-between group cursor-default"
              >
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 w-fit group-hover:scale-110 group-hover:border-white/25 transition-all duration-200">
                    {d.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-wide">{d.title}</h3>
                    <span className="text-xs font-mono text-emerald-400 block mt-0.5">{d.subtitle}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* High-Contrast Comparison Matrix Table */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              COMPETITIVE ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider [word-spacing:0.15em]">
              SPREADSHEETS & NOTION VS. SYNAPSES JOURNAL
            </h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-white/10 rounded-2xl bg-black/85 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  <th className="p-4">CAPABILITY / SPECIFICATION</th>
                  <th className="p-4 text-center">EXCEL / SHEETS</th>
                  <th className="p-4 text-center">NOTION</th>
                  <th className="p-4 text-center bg-white/[0.05] text-white">SYNAPSES JOURNAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="text-sm font-semibold text-white block">{item.feature}</span>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">{item.notes}</span>
                    </td>

                    <td className="p-4 text-center text-zinc-400">
                      {typeof item.excel === "boolean" ? (
                        item.excel ? (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-[11px] text-zinc-500">{item.excel}</span>
                      )}
                    </td>

                    <td className="p-4 text-center text-zinc-400">
                      {typeof item.notion === "boolean" ? (
                        item.notion ? (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-[11px] text-zinc-500">{item.notion}</span>
                      )}
                    </td>

                    <td className="p-4 text-center bg-white/[0.02] text-emerald-400 font-bold">
                      <div className="flex items-center justify-center gap-1">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-white">Native</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/15 text-center relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-radial from-white/[0.05] to-transparent pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider [word-spacing:0.15em] uppercase">
            STOP TRADING BLIND. START QUANTIFYING YOUR EDGE.
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Open the live trade journal terminal and record your next execution with instant strategy confluences, automatic R:R metrics, and screenshot vaulting.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/journal">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 tracking-wide [word-spacing:0.1em] transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Open Terminal Journal</span>
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
          SYNAPSES JOURNAL PROTOCOL • LOCAL-FIRST ZERO-KNOWLEDGE
        </span>
        <span className="mt-2 sm:mt-0">v3.4 PRO PRODUCTION ENGINE</span>
      </footer>
    </div>
  );
}
