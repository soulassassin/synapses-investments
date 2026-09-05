import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import { InteractiveDemo } from "@/components/journal/InteractiveDemo";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Flame,
  Layers,
  ChevronRight,
  Cpu,
  Target,
  Image as ImageIcon,
  Zap,
  Activity,
  CheckCircle2,
  Lock,
  BarChart3,
  Sliders,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The Trade Journal | Execution Black Box & Interactive Demo",
  description:
    "The institutional black box for proprietary trade executions. Audit ICT/SMC confluences, track behavioral psychology, and quantify statistical edge with zero latency.",
  alternates: {
    canonical: "https://synapses-investments.vercel.app/journal",
  },
  openGraph: {
    title: "Synapses Trade Journal | Institutional Execution Black Box",
    description:
      "Where trading intuition transforms into quantified telemetry. Test the live interactive execution demo.",
    url: "https://synapses-investments.vercel.app/journal",
  },
};

export default function JournalMarketingPage() {
  const technicalPillars = [
    {
      icon: <Flame className="w-6 h-6 text-amber-400" />,
      badge: "BEHAVIORAL AUDITING",
      title: "Psychological Leak & Tilt Isolation",
      desc: "Isolate structural strategy losses from emotional execution breaches. Tag trades as Disciplined, High-Conviction, FOMO, Hesitant, or Revenge to uncover the exact mathematical dollar cost of emotional leakage across every trading cycle.",
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-cyan-400" />,
      badge: "PLAYBOOK CHART VAULT",
      title: "Multi-Timeframe Visual Replay Archive",
      desc: "Instantly vault multi-timeframe chart captures before execution, during live fill, and after target delivery. Build an unshakeable subconscious pattern recognition library of A+ ICT/SMC algorithmic setups.",
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      badge: "PROP COMPLIANCE GUARDRAILS",
      title: "Drawdown Risk & Capital Preservation",
      desc: "Automated real-time monitoring of trailing drawdown limits, maximum daily risk thresholds, and asymmetric position sizing rules engineered to ensure prop firm evaluation longevity and institutional capital safety.",
    },
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Identify Algorithmic Confluence",
      desc: "Map Higher Timeframe Liquidity Pools, Fair Value Gaps (BISI/SIBI), and Order Blocks inside the active Killzone session.",
    },
    {
      step: "02",
      title: "Key In Risk Boundaries",
      desc: "Dynamic live calculations auto-compute precise lot sizes, dollar risk units, and target reward-to-risk (R:R) expectancy.",
    },
    {
      step: "03",
      title: "Log Mechanical Execution",
      desc: "Vault execution telemetry, screenshot evidence, and behavioral mindset tags with 0.2ms local-first latency.",
    },
    {
      step: "04",
      title: "Audit Statistical Edge",
      desc: "Review session matrix analytics, Sharpe distribution, and model-specific win rates to scale position sizes systematically.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Cybernetic Background & Ambient Halos */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-25 z-0" />
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed top-1/2 right-10 w-[500px] h-[500px] bg-cyan-500/[0.025] rounded-full blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 sm:space-y-24">
        {/* ========================================================================= */}
        {/* SECTION A: Hero & Institutional Context */}
        {/* ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Institutional Trade Journal</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE EXECUTION BLACK BOX FOR INSTITUTIONAL OPERATORS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider [word-spacing:0.15em] text-white uppercase leading-[1.12]">
            THE BLACK BOX FOR EVERY PROPRIETARY EXECUTION.
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-sans font-light">
            Where trading intuition transforms into quantified telemetry. Log executions, audit behavioral psychological leaks, and test the live interactive sandbox below.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/dashboard/journal" className="group w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-widest [word-spacing:0.18em] transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_45px_rgba(255,255,255,0.55)] cursor-pointer">
                <span>LAUNCH FULL QUANTUM TERMINAL</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link href="#interactive-demo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-semibold text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                <span>Test Live Interactive Demo</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </button>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION B: Embedded Interactive Live Demo Component */}
        {/* ========================================================================= */}
        <section id="interactive-demo" className="space-y-5 scroll-mt-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
                <Activity className="w-4 h-4" />
                <span>HANDS-ON CLIENT-SIDE SANDBOX</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider [word-spacing:0.12em] font-mono mt-1">
                LIVE PROPRIETARY EXECUTION INTERFACE
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              Interactive State Engine • Client-Side Simulation
            </span>
          </div>

          {/* Interactive Demo Sandbox */}
          <InteractiveDemo />
        </section>

        {/* ========================================================================= */}
        {/* SECTION C: Technical Feature Breakdown */}
        {/* ========================================================================= */}
        <section className="space-y-10">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              INSTITUTIONAL GRADE CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider [word-spacing:0.15em]">
              ENGINEERED FOR SERIOUS OPERATORS
            </h2>
            <p className="text-sm text-zinc-400">
              Transform qualitative chart reading into a high-signal mathematical feedback loop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {technicalPillars.map((p, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0d0f14]/80 border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.85)] transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 w-fit group-hover:scale-110 group-hover:border-white/25 transition-all duration-200">
                      {p.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] text-zinc-400 border border-white/10 uppercase tracking-wider">
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white tracking-wide">{p.title}</h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-Time Telemetry Synchronization</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The 4-Step Mechanical Feedback Workflow */}
        <section className="p-8 sm:p-12 rounded-3xl bg-[#0d0f14]/90 border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.9)] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                EXECUTION PIPELINE
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-wider font-mono mt-0.5">
                THE 4-STAGE MECHANICAL CYCLE
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Systematic Edge Multiplication
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/60 border border-white/5 hover:border-white/20 transition-all space-y-2.5"
              >
                <span className="text-2xl font-black font-mono text-white/30 block">
                  {step.step}
                </span>
                <h4 className="text-sm font-bold text-white tracking-wide">{step.title}</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION D: Terminal CTA */}
        {/* ========================================================================= */}
        <section className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#0e121a] to-[#08090c] border border-white/20 text-center relative overflow-hidden space-y-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          <div className="absolute inset-0 bg-radial from-emerald-500/[0.08] to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>PRODUCTION TERMINAL READY</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-wider [word-spacing:0.15em] uppercase font-mono">
              READY TO LOG WITH INSTITUTIONAL PRECISION?
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              Enter the full Synapses Terminal workspace. Unlock custom tag taxonomies, tick replay backtesting, multi-asset portfolio heatmaps, and local-first cryptographic security.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/dashboard/journal">
              <button className="px-9 py-4 rounded-2xl bg-white text-black font-black text-sm flex items-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-widest [word-spacing:0.18em] transition-all shadow-[0_0_35px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.65)] cursor-pointer">
                <span>LAUNCH FULL QUANTUM TERMINAL</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>
            <Link href="/risk-calculator">
              <button className="px-6 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-bold text-xs sm:text-sm tracking-wider transition-all cursor-pointer">
                Risk Calculator Guardrails
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES TRADE JOURNAL • PROPRIETARY EXECUTION BLACK BOX
        </span>
        <span className="mt-2 sm:mt-0">DMA PROTOCOL v3.4 PRO • ZERO-KNOWLEDGE ENGINE</span>
      </footer>
    </div>
  );
}
