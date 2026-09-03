"use client";

import React from "react";
import { GlassCard } from "../glass/GlassCard";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { useTrades } from "@/context/TradeContext";

export function RiskGuardrailWidget() {
  const { currentMetrics } = useTrades();

  const maxDailyLossLimit = 2500;
  const currentDailyLoss = Math.abs(Math.min(0, currentMetrics.netPnL));
  const dailyLossPct = Math.min(100, Math.round((currentDailyLoss / maxDailyLossLimit) * 100));

  const maxDrawdownLimit = 5000;
  const currentMaxDrawdown = currentMetrics.maxDrawdownAmount;
  const ddPct = Math.min(100, Math.round((currentMaxDrawdown / maxDrawdownLimit) * 100));

  return (
    <GlassCard className="p-5 sm:p-6 bg-black/85 backdrop-blur-2xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-white" />
          <h3 className="text-base font-bold text-white tracking-wide">
            RISK & PROP GUARDRAILS
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Account Safe
        </span>
      </div>

      <div className="space-y-4">
        {/* Daily Max Loss Guardrail */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-zinc-300 font-semibold">DAILY MAX LOSS BUFFER</span>
            <span className="text-white font-bold">
              ${currentDailyLoss.toLocaleString()} / ${maxDailyLossLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                dailyLossPct > 75 ? "bg-red-400" : "bg-white"
              }`}
              style={{ width: `${dailyLossPct}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">
            {100 - dailyLossPct}% buffer remaining before daily circuit breaker
          </span>
        </div>

        {/* Max Trailing Drawdown Guardrail */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-zinc-300 font-semibold">MAX TRAILING DRAWDOWN</span>
            <span className="text-white font-bold">
              ${currentMaxDrawdown.toLocaleString()} / ${maxDrawdownLimit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                ddPct > 70 ? "bg-red-400" : "bg-white"
              }`}
              style={{ width: `${ddPct}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 mt-1 block">
            Max allowable drawdown for Apex 100K Evaluation
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
