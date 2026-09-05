import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Layers,
  Check,
  X,
  ChevronRight,
  Cpu,
  Target,
  Zap,
  Activity,
  Award,
  Terminal,
} from "lucide-react";

export const metadata: Metadata = {
  title: "The Synapses Manifesto | Probability Over Prediction",
  description:
    "The Quantitative Trading Doctrine: Markets Are Algorithmic, Risk Precedes Return, Quantify True Edge, and Execution Is a Biological Weakness.",
  alternates: {
    canonical: "https://synapses-investments.vercel.app/manifesto",
  },
  openGraph: {
    title: "The Synapses Manifesto | The Quantitative Trading Doctrine",
    description:
      "Four immutable tenets governing institutional proprietary trading, mechanical feedback, and mathematical edge.",
    url: "https://synapses-investments.vercel.app/manifesto",
  },
};

export default function ManifestoPage() {
  const tenets = [
    {
      number: "TENET I",
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: "Markets Are Algorithmic, Not Chaotic",
      axiom: "Price does not move randomly; it delivers between institutional liquidity voids and imbalanced order books.",
      body: "Retail market theory claims prices fluctuate purely on fundamental supply/demand news. In reality, over 80% of daily global volume is executed by Central Bank algorithms with strict time-of-day protocols. The algorithm targets liquidity above old highs (Buy-Side Liquidity) and below old lows (Sell-Side Liquidity), rebalancing Fair Value Gaps with mathematical precision. To profit, you must trade the delivery algorithm, not the news.",
    },
    {
      number: "TENET II",
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: "Risk Precedes Return",
      axiom: "Capital preservation is the absolute prerequisite for mathematical expectancy to manifest.",
      body: "Amateur traders obsess over how much they can make; proprietary desks obsess over what they can lose. An edge with a 65% win rate is completely destroyed if position sizing violates risk-of-ruin thresholds during an inevitable 5-trade drawdown sequence. Maximum daily loss limits, fixed fractional risk (0.5% - 1.0%), and asymmetric reward-to-risk (minimum 1:2.5R) are non-negotiable laws.",
    },
    {
      number: "TENET III",
      icon: <Activity className="w-6 h-6 text-white" />,
      title: "If You Can't Quantify It, You Don't Have An Edge",
      axiom: "Subjective intuition without recorded data distributions is indistinguishable from casino gambling.",
      body: "Intuition without empirical feedback is an illusion. A true edge is defined by a measurable sample distribution: Sharpe Ratio > 2.0, Profit Factor > 2.2, Maximum Adverse Excursion < 0.5R, and positive session expectancy. If you cannot produce tick-level execution data verifying your edge across 200+ samples, you do not have a strategy—you have a belief.",
    },
    {
      number: "TENET IV",
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Execution Is a Biological Weakness",
      axiom: "Human neurochemistry is hardwired to fear loss and take profit prematurely. Mechanical systems eliminate the biological defect.",
      body: "Dopamine, cortisol, and amygdala activation trigger revenge trading, FOMO entries, and stop-loss moving. Mechanical logging into an execution black box forces cognitive accountability. By measuring the exact dollar cost of psychological tilt, traders transition from emotional operators into disciplined quantitative executioners.",
    },
  ];

  const doctrineComparison = [
    {
      concept: "Market Driver",
      retail: "Chaotic news headlines and retail indicators (RSI, MACD)",
      institutional: "Algorithmic liquidity delivery seeking BSL/SSL pools & FVGs",
    },
    {
      concept: "Risk Allocation",
      retail: "Arbitrary lot sizing based on account balance or greed",
      institutional: "Mathematical position sizing constrained to ≤1.0% risk-of-ruin limit",
    },
    {
      concept: "Execution Process",
      retail: "Subjective gut-feel entries chased during high volatility",
      institutional: "Pre-defined rule-based trigger inside specific Killzone session windows",
    },
    {
      concept: "Trade Logging",
      retail: "None or disorganized sporadic spreadsheet entries",
      institutional: "Tick-level execution black box auditing behavioral tilt & setup taxonomy",
    },
    {
      concept: "Loss Handling",
      retail: "Emotional distress, revenge sizing, and shifting stop losses",
      institutional: "Accepted as an operating expense of the quantitative distribution",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Background Cybernetic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-25 z-0" />
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-white/[0.03] rounded-full blur-[180px] pointer-events-none z-0" />

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
            <span className="text-white font-semibold">The Synapses Manifesto</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE QUANTITATIVE TRADING DOCTRINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider [word-spacing:0.15em] text-white uppercase leading-[1.12]">
            THE SYNAPSES MANIFESTO: PROBABILITY OVER PREDICTION.
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-sans font-light">
            We reject subjective opinions, retail candlestick myths, and emotional trading. We engineer edge through empirical microstructure data, algorithmic liquidity delivery, and mathematical capital preservation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/journal" className="group w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-widest [word-spacing:0.18em] transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.35)] cursor-pointer">
                <span>TEST THE INTERACTIVE JOURNAL DEMO</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link href="/risk-calculator" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-semibold text-xs sm:text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2">
                <span>View Risk Guardrails</span>
              </button>
            </Link>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* THE FOUR CORE TENETS */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-3xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              THE DOCTRINAL PILLARS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider [word-spacing:0.15em] font-mono">
              THE FOUR IMMUTABLE TENETS
            </h2>
            <p className="text-sm text-zinc-400">
              The mathematical and philosophical foundation that separates proprietary operators from market casualties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tenets.map((t, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#0d0f14]/85 border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.85)] transition-all duration-300 space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/10 w-fit group-hover:scale-110 group-hover:border-white/25 transition-all duration-200">
                      {t.icon}
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-400 tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {t.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white tracking-wide font-mono">
                      {t.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-300 mt-2 p-3 rounded-xl bg-black/60 border border-white/5 italic">
                      &ldquo;{t.axiom}&rdquo;
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans font-light">
                    {t.body}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Synapses Core Doctrine Protocol</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* DOCTRINE COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              PARADIGM SHIFT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-mono">
              RETAIL ILLUSION VS. QUANTITATIVE REALITY
            </h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-white/10 rounded-3xl bg-[#0d0f14]/90 shadow-[0_15px_50px_rgba(0,0,0,0.8)]">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] text-zinc-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">DIMENSION</th>
                  <th className="p-4 text-red-400">RETAIL TRADING ILLUSION</th>
                  <th className="p-4 pr-6 bg-white/[0.03] text-emerald-400">
                    SYNAPSES QUANTITATIVE EDGE
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {doctrineComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6 text-white font-bold whitespace-nowrap">
                      {row.concept}
                    </td>
                    <td className="p-4 text-zinc-400 font-sans text-xs">
                      <div className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{row.retail}</span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 bg-white/[0.01] text-zinc-200 font-sans text-xs font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{row.institutional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CTA */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0e121a] to-[#08090c] border border-white/15 text-center relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-radial from-emerald-500/[0.05] to-transparent pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wider [word-spacing:0.15em] uppercase font-mono">
            ADOPT THE QUANTITATIVE DISCIPLINE TODAY
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Log your next execution inside the Synapses Trade Journal black box and let mathematics dictate your outcome.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/journal">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 tracking-wide [word-spacing:0.1em] transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Open Trade Journal Demo</span>
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
          THE SYNAPSES MANIFESTO • PROBABILITY OVER PREDICTION
        </span>
        <span className="mt-2 sm:mt-0">ESTABLISHED FOR PROP OPERATORS</span>
      </footer>
    </div>
  );
}
