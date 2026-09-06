"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { GlassCard } from "@/components/glass/GlassCard";
import { SynapsesLogo } from "@/components/brand/SynapsesLogo";
import { useAuth, OnboardingData, TraderProfile } from "@/context/AuthContext";
import { useTrades } from "@/context/TradeContext";
import { BrokerAccount } from "@/lib/types";
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
  Layers,
  Award,
  Upload,
  Server,
  FileText,
  AlertCircle,
  Copy,
  Radio,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, completeOnboarding } = useAuth();
  const { connectBroker, importFromCSV } = useTrades();

  const [step, setStep] = useState<OnboardingStep>(1);

  // Step 1: Identity & Persona
  const [callsign, setCallsign] = useState(
    profile?.callsign || user?.user_metadata?.full_name || "APEX_OPERATOR"
  );
  const [traderPersona, setTraderPersona] = useState<TraderProfile["trader_persona"]>(
    profile?.trader_persona || "PROP_OPERATOR"
  );
  const [experienceLevel, setExperienceLevel] = useState<TraderProfile["experience_level"]>(
    profile?.experience_level || "INTERMEDIATE"
  );

  // Step 2: Setups
  const [selectedSetups, setSelectedSetups] = useState<string[]>([
    "Fair Value Gap (FVG)",
    "Order Block (OB)",
    "London Sweep",
  ]);

  // Step 3: Capital & Risk
  const [startingCapital, setStartingCapital] = useState<number>(
    profile?.starting_capital || 100000
  );
  const [customCapital, setCustomCapital] = useState<string>("");
  const [maxRiskPct, setMaxRiskPct] = useState<number>(profile?.max_risk_pct || 1.0);
  const [dailyDrawdownLimitPct, setDailyDrawdownLimitPct] = useState<number>(
    profile?.daily_drawdown_limit_pct || 4.0
  );
  const [primaryPlatform, setPrimaryPlatform] = useState<string>("MetaTrader 5");

  // Step 4: Actual Account Connection & Statement Ingestion
  const [accountPlatform, setAccountPlatform] = useState<BrokerAccount["platform"]>("MetaTrader 5");
  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [accountServer, setAccountServer] = useState<string>("");
  const [accountCurrency, setAccountCurrency] = useState<string>("USD");
  const [accountPassword, setAccountPassword] = useState<string>("");
  const [isSkippingAccount, setIsSkippingAccount] = useState<boolean>(false);
  const [connectedAccountInfo, setConnectedAccountInfo] = useState<BrokerAccount | null>(null);

  // CSV Drag and drop statement import
  const [importedTradesCount, setImportedTradesCount] = useState<number>(0);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // General loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCopiedWebhook, setHasCopiedWebhook] = useState(false);

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

  const capitalOptions = [25000, 50000, 100000, 150000, 200000];
  const riskOptions = [0.25, 0.5, 1.0, 2.0];
  const drawdownOptions = [3.0, 4.0, 5.0];

  const accountPlatforms: { id: BrokerAccount["platform"]; label: string; desc: string }[] = [
    { id: "MetaTrader 5", label: "MetaTrader 5", desc: "MT5 hedge/netting terminal" },
    { id: "MetaTrader 4", label: "MetaTrader 4", desc: "MT4 classic broker feed" },
    { id: "cTrader", label: "cTrader", desc: "cTrader Open API & FIX" },
    { id: "TradingView", label: "TradingView Webhook", desc: "Direct pine script alert ingestion" },
    { id: "Prop Firm Account", label: "Prop Firm (Apex / TopStep)", desc: "Rithmic / Tradovate prop gateway" },
    { id: "Interactive Brokers", label: "Interactive Brokers", desc: "IBKR TWS / Client Portal" },
    { id: "Manual Gateway", label: "Manual Statement", desc: "Offline CSV & manual trade logging" },
  ];

  const toggleSetup = (setupId: string) => {
    setSelectedSetups((prev) =>
      prev.includes(setupId) ? prev.filter((s) => s !== setupId) : [...prev, setupId]
    );
  };

  // CSV Statement Parsing Handler
  const handleFileProcess = (file: File) => {
    setImportError(null);
    setImportStatus("Parsing statement data...");

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (!csvText) {
        setImportError("Unable to read uploaded file.");
        setImportStatus(null);
        return;
      }

      const activeAccName =
        accountName.trim() ||
        `${accountPlatform} ${accountNumber ? `#${accountNumber}` : "Account"}`;

      const res = importFromCSV(csvText, activeAccName);
      if (res.success && res.count > 0) {
        setImportedTradesCount((prev) => prev + res.count);
        setImportStatus(`Successfully ingested ${res.count} executions from ${file.name}`);
      } else if (res.success && res.count === 0) {
        setImportStatus(`File parsed, but 0 valid trade rows found. Check column headers.`);
      } else {
        setImportError(res.error || "Failed to parse trade history format.");
        setImportStatus(null);
      }
    };
    reader.onerror = () => {
      setImportError("Error processing statement file.");
      setImportStatus(null);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Step 4: Handle account connection before moving to Step 5
  const handleConnectAndProceed = () => {
    const finalCapital = customCapital ? parseFloat(customCapital) : startingCapital;
    const resolvedName =
      accountName.trim() ||
      `${accountPlatform} ${accountNumber ? `#${accountNumber}` : "Account"}`;

    const newAcc = connectBroker(
      accountPlatform,
      resolvedName,
      accountNumber.trim() || `ACC-${Date.now().toString().slice(-5)}`,
      accountServer.trim() || "Live-Server",
      finalCapital,
      accountCurrency,
      "Connected"
    );

    setConnectedAccountInfo(newAcc);
    setStep(5);
  };

  const handleSkipAccount = () => {
    setIsSkippingAccount(true);
    setStep(5);
  };

  const handleNextStep = () => {
    if (step === 3) {
      // Pre-fill account name if empty based on selected platform
      if (!accountName) {
        setAccountName(`${primaryPlatform} Primary`);
        setAccountPlatform(
          accountPlatforms.find((p) => p.label === primaryPlatform)?.id || "MetaTrader 5"
        );
      }
      setStep(4);
    } else if (step === 4) {
      handleConnectAndProceed();
    } else if (step < 4) {
      setStep((prev) => (prev + 1) as OnboardingStep);
    } else {
      handleFinalize();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as OnboardingStep);
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
      primary_platform: accountPlatform || primaryPlatform,
    };

    // Trigger celebratory particle animation
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ffffff", "#22c55e", "#06b6d4", "#a1a1aa"],
    });

    await completeOnboarding(data);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/journal");
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
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? "bg-white shadow-[0_0_10px_#FFFFFF]"
                      : i < step
                      ? "bg-emerald-400"
                      : "bg-white/15"
                  }`}
                />
              ))}
              <span className="text-[11px] font-mono text-zinc-400 ml-2 font-bold">
                {step}/5
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 1: TRADER PERSONA & IDENTITY */}
          {/* ========================================================================= */}
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

          {/* ========================================================================= */}
          {/* STEP 2: QUANTITATIVE PLAYBOOK CONFLUENCES */}
          {/* ========================================================================= */}
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

          {/* ========================================================================= */}
          {/* STEP 3: CAPITAL ALLOCATION & RISK GOVERNANCE */}
          {/* ========================================================================= */}
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
                  INITIAL CAPITAL ALLOCATION ($ USD)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2.5">
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
                      ${cap >= 1000 ? `${cap / 1000}K` : cap}
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

              {/* Execution Gateway Platform */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase">
                  PRIMARY EXECUTION PLATFORM
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "MetaTrader 5",
                    "cTrader",
                    "TradingView",
                    "Prop Firm (Apex/Topstep)",
                    "Interactive Brokers",
                    "Manual Journal",
                  ].map((p) => (
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

          {/* ========================================================================= */}
          {/* STEP 4: CONNECT ACTUAL TRADING ACCOUNT & STATEMENT INGESTION */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                    PHASE 04 • LIVE FEED & DATA SYNC
                  </span>
                  <button
                    type="button"
                    onClick={handleSkipAccount}
                    className="text-[11px] font-mono text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Skip for now (Manual Mode)
                  </button>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                  Connect Actual Trading Account
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Connect your live broker or prop firm to ingest real execution telemetry and auto-sync performance.
                </p>
              </div>

              {/* Platform Selector Tabs */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase">
                  SELECT ACCOUNT PLATFORM / BROKER PROTOCOL
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {accountPlatforms.map((plat) => (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setAccountPlatform(plat.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        accountPlatform === plat.id
                          ? "bg-white/[0.08] border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-mono font-bold">{plat.label}</div>
                      <div className="text-[10px] text-zinc-500 truncate mt-0.5">{plat.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Credential Inputs */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
                      Account Label / Prop Alias
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g. Apex 150K Express #1"
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
                      Account Login / Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="e.g. 5184920"
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
                      Broker Server / Host
                    </label>
                    <input
                      type="text"
                      value={accountServer}
                      onChange={(e) => setAccountServer(e.target.value)}
                      placeholder={accountPlatform.includes("MetaTrader") ? "e.g. ICMarketsSC-Live02" : "e.g. Rithmic01-Live"}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
                      Base Currency
                    </label>
                    <select
                      value={accountCurrency}
                      onChange={(e) => setAccountCurrency(e.target.value)}
                      className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono text-white bg-black/80"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="AUD">AUD ($)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>

                {/* TradingView Webhook Helper if selected */}
                {accountPlatform === "TradingView" && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>TradingView Real-Time Alert Ingestion Endpoint</span>
                    </div>
                    <div className="p-2 rounded bg-black/60 border border-cyan-500/20 flex items-center justify-between text-[11px] text-zinc-300">
                      <code className="truncate">https://api.synapses.trade/v1/webhook/tv</code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("https://api.synapses.trade/v1/webhook/tv");
                          setHasCopiedWebhook(true);
                          setTimeout(() => setHasCopiedWebhook(false), 2000);
                        }}
                        className="ml-2 text-cyan-400 hover:text-cyan-200 cursor-pointer"
                      >
                        {hasCopiedWebhook ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Synapses will auto-parse <code>{`{ "ticker": "{{ticker}}", "action": "{{strategy.order.action}}", "price": {{close}} }`}</code> payloads.
                    </p>
                  </div>
                )}
              </div>

              {/* Drag-and-Drop Statement Ingestion Dropzone */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2 uppercase flex items-center justify-between">
                  <span>IMPORT TRADE HISTORY / STATEMENT (.CSV)</span>
                  <span className="text-[10px] text-zinc-500">MT4/MT5, TradeZilla, cTrader, NinjaTrader</span>
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                    isDraggingFile
                      ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                      : importedTradesCount > 0
                      ? "border-emerald-500/50 bg-emerald-500/[0.04]"
                      : "border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.04]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  {importedTradesCount > 0 ? (
                    <div className="space-y-1.5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="text-sm font-mono font-bold text-white">
                        {importedTradesCount} Trades Loaded & Ready
                      </div>
                      <p className="text-xs text-zinc-400">
                        Drop another CSV or click to import more history
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                      <div className="text-sm font-mono text-zinc-300">
                        Drop broker CSV statement here, or <span className="text-white underline">browse file</span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500">
                        Supports date, ticker, direction, entry/exit prices, position size, and P&L
                      </p>
                    </div>
                  )}
                </div>

                {importStatus && (
                  <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{importStatus}</span>
                  </div>
                )}
                {importError && (
                  <div className="mt-2 text-xs font-mono text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{importError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: VERIFICATION & TERMINAL LAUNCH */}
          {/* ========================================================================= */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">
                  PHASE 05 • SYSTEM INITIALIZATION
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase">
                  Ready For Institutional Deployment
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Review your calibrated operator profile and connected feeds. Launch to access your live quantitative journal.
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
                  <span className="text-xs font-mono text-zinc-400">CONNECTED FEED / ACCOUNT</span>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-emerald-400 block">
                      {connectedAccountInfo
                        ? `${connectedAccountInfo.name} (${connectedAccountInfo.platform})`
                        : isSkippingAccount
                        ? "Manual Execution Mode (No Broker)"
                        : `${accountPlatform} Feed`}
                    </span>
                    {importedTradesCount > 0 && (
                      <span className="text-[11px] font-mono text-zinc-400">
                        {importedTradesCount} Historical Trades Ingested
                      </span>
                    )}
                  </div>
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

          {/* ========================================================================= */}
          {/* NAVIGATION CONTROLS */}
          {/* ========================================================================= */}
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
                  <Server className="w-4 h-4 text-black" />
                  <span>Connect & Proceed</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              ) : step === 5 ? (
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
