"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlowBadge } from "@/components/glass/GlowBadge";
import {
  Calculator,
  ShieldCheck,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function CalculatorPage() {
  const [accountBalance, setAccountBalance] = useState(100000);
  const [riskPercentage, setRiskPercentage] = useState(1.0);
  const [entryPrice, setEntryPrice] = useState(19820.00);
  const [stopLossPrice, setStopLossPrice] = useState(19780.00);
  const [takeProfitPrice, setTakeProfitPrice] = useState(19940.00);
  const [pointValue, setPointValue] = useState(1.0); // e.g. $1 or $10 per point/lot

  // Checklist states
  const [checklist, setChecklist] = useState({
    sessionAligned: true,
    riskUnderTwoPct: true,
    fvgConfirmed: true,
    noRedFolderNews: true,
    disciplineChecked: true,
  });

  const dollarRisk = (accountBalance * riskPercentage) / 100;
  const stopDistance = Math.abs(entryPrice - stopLossPrice);
  const tpDistance = Math.abs(takeProfitPrice - entryPrice);

  const calculatedLots = stopDistance > 0 ? Number((dollarRisk / (stopDistance * pointValue)).toFixed(2)) : 0;
  const rewardRiskRatio = stopDistance > 0 ? Number((tpDistance / stopDistance).toFixed(2)) : 0;
  const projectedReward = Number((dollarRisk * rewardRiskRatio).toFixed(2));

  const allChecklistPassed = Object.values(checklist).every(Boolean);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              DYNAMIC POSITION SIZE & RISK CALCULATOR
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Institutional lot sizing engine with built-in risk guardrails, pre-trade checklists, and R:R optimization.
          </p>
        </div>

        <GlowBadge variant="white" size="sm">
          Risk Management Guardrail
        </GlowBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Parameters */}
        <div className="lg:col-span-7 space-y-5">
          <GlassCard className="p-6 bg-black/85 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)] space-y-4">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block border-b border-white/10 pb-2">
              POSITION INPUT PARAMETERS
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Account Balance ($)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Risk Percentage (%)</label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.1"
                    value={riskPercentage}
                    onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Entry Price</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Stop Loss Price</label>
                <input
                  type="number"
                  step="any"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-zinc-400 block mb-1">Target Take Profit Price</label>
                <input
                  type="number"
                  step="any"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono"
                />
              </div>
            </div>
          </GlassCard>

          {/* Pre-Trade Guardrail Checklist */}
          <GlassCard className="p-6 bg-black/85 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
                PRE-TRADE DISCIPLINE CHECKLIST
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  allChecklistPassed
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {allChecklistPassed ? "All Guardrails Passed" : "Action Blocked"}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { id: "sessionAligned", label: "Trade executed strictly within active Killzone session (London/NY)" },
                { id: "riskUnderTwoPct", label: "Account capital risk is ≤ 2.0% maximum allowable risk per play" },
                { id: "fvgConfirmed", label: "Higher-timeframe liquidity sweep or order block confirmed" },
                { id: "noRedFolderNews", label: "No High-Impact (CPI/FOMC/NFP) red folder news in next 15 mins" },
                { id: "disciplineChecked", label: "Emotional state is calm, focused, and free from revenge sentiment" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 cursor-pointer select-none transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={(checklist as any)[item.id]}
                    onChange={(e) =>
                      setChecklist((prev) => ({ ...prev, [item.id]: e.target.checked }))
                    }
                    className="rounded bg-black border-white/20 text-white focus:ring-0 w-4 h-4"
                  />
                  <span className="text-zinc-300">{item.label}</span>
                </label>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Output Card */}
        <div className="lg:col-span-5 space-y-5">
          <GlassCard className="p-6 bg-black/90 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-4">
              CALCULATED EXECUTION ORDER
            </span>

            {/* Primary Recommended Lot Size */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/20 text-center mb-6">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                RECOMMENDED POSITION SIZE
              </span>
              <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                {calculatedLots} <span className="text-base text-zinc-400 font-sans font-normal">LOTS</span>
              </h2>
            </div>

            {/* Breakdown Grid */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Total Dollar Risk:</span>
                <span className="text-red-400 font-bold">${dollarRisk.toLocaleString()}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Stop Loss Distance:</span>
                <span className="text-white font-bold">{stopDistance.toFixed(2)} pts</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Reward-to-Risk (R:R):</span>
                <span className="text-white font-bold">1 : {rewardRiskRatio.toFixed(2)}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Projected Take Profit:</span>
                <span className="text-emerald-400 font-bold">+${projectedReward.toLocaleString()}</span>
              </div>
            </div>

            {/* Guardrail Status */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono">
                {allChecklistPassed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400">
                      Approved: Trade adheres to all institutional risk parameters.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-red-400">
                      Caution: Incomplete checklist items detected.
                    </span>
                  </>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
