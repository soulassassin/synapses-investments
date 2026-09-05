"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { GlassCard } from "@/components/glass/GlassCard";
import { SynapsesLogo } from "@/components/brand/SynapsesLogo";
import { useAuth, OnboardingData, TraderProfile } from "@/context/AuthContext";
import {
  User,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  TrendingUp,
  Sliders,
  DollarSign,
  Briefcase,
  Activity,
  Layers,
  Award,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, completeOnboarding } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [callsign, setCallsign] = useState(
    profile?.callsign || user?.user_metadata?.full_name || "APEX_OPERATOR"
  );
  const [traderPersona, setTraderPersona] = useState<TraderProfile["trader_persona"]>(
    profile?.trader_persona || "PROP_OPERATOR"
  );
  const [experienceLevel, setExperienceLevel] = useState<TraderProfile["experience_level"]>(
    profile?.experience_level || "INTERMEDIATE"
  );
  const [selectedSetups, setSelectedSetups] = useState<string[]>([
    "Fair Value Gap (FVG)",
    "Order Block (OB)",
    "London Sweep",
  ]);
  const [startingCapital, setStartingCapital] = useState<number>(
    profile?.starting_capital || 100000
  );
  const [customCapital, setCustomCapital] = useState<string>("");
  const [maxRiskPct, setMaxRiskPct] = useState<number>(profile?.max_risk_pct || 1.0);
  const [dailyDrawdownLimitPct, setDailyDrawdownLimitPct] = useState<number>(
    profile?.daily_drawdown_limit_pct || 4.0
  );
  const [primaryPlatform, setPrimaryPlatform] = useState<string>("MetaTrader 5");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSetups = [
    {
      id: "Fair Value Gap (FVG)",
      title: "Fair Value Gap (FVG)",
      desc: "3-candle price imbalance and displacement inefficiency",
    },
    {
      id: "Order Block (OB)",
      title: "Order Block (OB)",
      desc: "Institutional accumulation/distribution footprint",
    },
    {
      id: "London Sweep",
      title: "London/NY Liquidity Sweep",
      desc: "Purging session highs/lows prior to real expansion",
    },
    {
      id: "Silver Bullet",
      title: "Silver Bullet (10 AM NY)",
      desc: "High-probability algorithmic macro time window",
    },
    {
      id: "Breaker Block",
      title: "Breaker Block",
      desc: "Failed order block inverted into dynamic support/resistance",
    },
    {
      id: "Judas Swing",
      title: "Judas Swing Trap",
      desc: "Pre-market false breakout engineered to trap retail liquidity",
    },
  ];

  const capitalOptions = [25000, 50000, 100000, 200000];
  const riskOptions = [0.25, 0.5, 1.0, 2.0];
  const drawdownOptions = [3.0, 4.0, 5.0];
  const platforms = ["MetaTrader 5", "cTrader", "TradingView", "Interactive Brokers", "Manual Journal"];

  const toggleSetup = (setupId: string) => {
    setSelectedSetups((prev) =>
      prev.includes(setupId)
        ? prev.filter((s) => s !== setupId)
        : [...prev, setupId]
    );
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
      handleFinalize();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleFinalize = async () => {
    setIsSubmitting(true);

    const finalCapital = customCapital ? parseFloat(customCapital) : startingCapital;

    const data: OnboardingData = {
      callsign: callsign.trim() || "SYNAPSE_OPERATOR",
      trader_persona: traderPersona,
      experience_level: experienceLevel,
      preferred_setups: selectedSetups,
      starting_capital: finalCapital,
      max_risk_pct: maxRiskPct,
      daily_drawdown_limit_pct: dailyDrawdownLimitPct,
      primary_platform: primaryPlatform,
    };

    // Trigger celebratory particle animation
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffffff", "#22c55e", "#a1a1aa"],
    });

    await completeOnboarding(data);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-12 select-none">
      {/* Centered Frosted Onboarding Card */}
      <div className="w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-300">
        <div className="absolute -inset-1 rounded-3xl bg-white/[0.06] blur-xl opacity-75 -z-10" />

        <GlassCard className="p-6 sm:p-10 bg-black/90 backdrop-blur-3xl border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
          {/* Header Progress Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-3">
              <SynapsesLogo theme="white" size="sm" />
              <div className="hidden sm:block h-4 w-[1px] bg-white/20" />
              <span className="text-xs font-mono text-zinc-400 tracking-wider uppercase hidden sm:block">
                OPERATOR CALIBRATION WIZARD
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-7 h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "bg-white shadow-[0_0_10px_#FFFFFF]"
                      : i < step
                      ? "bg-emerald-400"
                      : "bg-white/15"
                  }`}
                />
              ))}
              <span className="text-[11px] font-mono text-zinc-400 ml-2 font-bold">
                {step}/4
              </span>
            </div>
          </div>

          {/* STEP 1: TRADER PERSONA & IDENTITY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  PHASE 01 • IDENTITY MATRIX
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                  Calibrate Your Trader Callsign
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Designate your terminal handle and execution archetype to customize telemetry benchmarks.
                </p>
              </div>

              {/* Callsign Input */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1.5 uppercase">
                  TERMINAL CALLSIGN / HANDLE
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="e.g. APEX_ALPHA"
                    className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-sm font-mono text-white"
                    required
                  />
                </div>
              </div>

              {/* Persona Grid */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase">
                  OPERATING ARCHETYPE
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: "PROP_OPERATOR",
                      title: "Prop Firm Operator",
                      desc: "Strict drawdown discipline (Apex, FTMO, Topstep)",
                      icon: <Briefcase className="w-4 h-4 text-white" />,
                    },
                    {
                      id: "DISCRETIONARY",
                      title: "Discretionary Day Trader",
                      desc: "Intraday session scalper & market structure reader",
                      icon: <TrendingUp className="w-4 h-4 text-white" />,
                    },
                    {
                      id: "QUANT",
                      title: "Systematic Quant / Algo",
                      desc: "Rule-based mechanical executor & confluence tester",
                      icon: <Sliders className="w-4 h-4 text-white" />,
                    },
                    {
                      id: "SWING",
                      title: "Macro Swing Specialist",
                      desc: "Multi-day HTF liquidity target hunter",
                      icon: <Layers className="w-4 h-4 text-white" />,
                    },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setTraderPersona(p.id as TraderProfile["trader_persona"])}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        traderPersona === p.id
                          ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {p.icon}
                        <span className="text-xs font-bold font-mono tracking-wider">
                          {p.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        {p.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: QUANTITATIVE PLAYBOOK CONFLUENCES */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  PHASE 02 • STRATEGY ARCHITECTURE
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                  Select Core Confluences
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Choose the setup archetypes you trade. The journal will benchmark your win rate and expectancy per model.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSetups.map((s) => {
                  const isSelected = selectedSetups.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSetup(s.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                        isSelected
                          ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <div className="pr-2">
                        <span className="text-xs font-bold font-mono tracking-wider block mb-1">
                          {s.title}
                        </span>
                        <p className="text-[11px] text-zinc-500 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-white text-black border-white"
                            : "border-white/20 text-transparent"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CAPITAL ALLOCATION & RISK GOVERNANCE */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  PHASE 03 • RISK GOVERNANCE
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                  Account Size & Guardrails
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Establish position sizing guardrails to prevent prop account blowups and revenge trades.
                </p>
              </div>

              {/* Capital Tier */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase">
                  ACCOUNT CAPITAL TIER ($ USD)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {capitalOptions.map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => {
                        setStartingCapital(cap);
                        setCustomCapital("");
                      }}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                        startingCapital === cap && !customCapital
                          ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                          : "bg-white/[0.03] border-white/10 text-zinc-300 hover:text-white hover:border-white/25"
                      }`}
                    >
                      ${cap.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={customCapital}
                  onChange={(e) => setCustomCapital(e.target.value)}
                  placeholder="Or enter custom capital (e.g. 150000)"
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs font-mono text-white"
                />
              </div>

              {/* Max Risk % & Daily Drawdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase">
                    MAX RISK PER TRADE (%)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {riskOptions.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setMaxRiskPct(r)}
                        className={`py-2 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer ${
                          maxRiskPct === r
                            ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {r}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase">
                    DAILY DRAWDOWN LIMIT (%)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {drawdownOptions.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDailyDrawdownLimitPct(d)}
                        className={`py-2 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer ${
                          dailyDrawdownLimitPct === d
                            ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {d}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary Trading Platform */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase">
                  PRIMARY EXECUTION GATEWAY
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrimaryPlatform(p)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold font-mono truncate transition-all cursor-pointer ${
                        primaryPlatform === p
                          ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: VERIFICATION & TERMINAL LAUNCH */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  PHASE 04 • SYSTEM INITIALIZATION
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                  Ready For Institutional Deployment
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Review your calibrated operator configuration. Click launch to initialize your workspace.
                </p>
              </div>

              {/* Configuration Summary Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/15 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-zinc-400">OPERATOR CALLSIGN</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {callsign || "APEX_OPERATOR"}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-zinc-400">ARCHETYPE</span>
                  <span className="text-xs font-mono text-white px-2 py-0.5 rounded bg-white/10">
                    {traderPersona}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-zinc-400">STARTING CAPITAL</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    ${(customCapital ? parseFloat(customCapital) : startingCapital).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-zinc-400">MAX RISK PER TRADE</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {maxRiskPct}%
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-zinc-400">DAILY DRAWDOWN LIMIT</span>
                  <span className="text-sm font-bold font-mono text-red-400">
                    {dailyDrawdownLimitPct}%
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono text-zinc-400 block mb-2">
                    ACTIVE CONFLUENCES ({selectedSetups.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSetups.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/10 text-white border border-white/15"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs font-mono text-zinc-500 hover:text-zinc-300"
              >
                Return to Login
              </Link>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="synapses-pill-btn py-3 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : step === 4 ? (
                <>
                  <Award className="w-4 h-4 text-black" />
                  <span>Launch Synapses Terminal</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              ) : (
                <>
                  <span>Next Phase</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
