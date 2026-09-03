"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function MiniPositionSizer() {
  const [balance, setBalance] = useState(100000);
  const [riskPct, setRiskPct] = useState(1.0);
  const [stopPts, setStopPts] = useState(25);

  const dollarRisk = (balance * riskPct) / 100;
  const calculatedLots = stopPts > 0 ? Number((dollarRisk / (stopPts * 20)).toFixed(2)) : 0;

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            INTERACTIVE POSITION SIZER PREVIEW (NAS100)
          </span>
        </div>
        <span className="text-xs font-mono text-zinc-400">Fixed Point Value: $20.00 / pt</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400">Account Balance ($)</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="w-full bg-black/60 border border-white/15 focus:border-white/40 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400">Risk Percentage (%)</label>
          <input
            type="number"
            step="0.25"
            value={riskPct}
            onChange={(e) => setRiskPct(Number(e.target.value))}
            className="w-full bg-black/60 border border-white/15 focus:border-white/40 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-zinc-400">Stop Loss (Points)</label>
          <input
            type="number"
            value={stopPts}
            onChange={(e) => setStopPts(Number(e.target.value))}
            className="w-full bg-black/60 border border-white/15 focus:border-white/40 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
          />
        </div>
      </div>

      {/* Calculated Result Output */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 font-mono">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Total Dollar Risk</span>
          <span className="text-lg sm:text-xl font-bold text-red-400">
            ${dollarRisk.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Recommended Sizing</span>
          <span className="text-lg sm:text-xl font-bold text-white">
            {calculatedLots} <span className="text-xs text-zinc-400">Lots</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Max Daily Cushion</span>
          <span className="text-lg sm:text-xl font-bold text-emerald-400">4 Executions</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 uppercase block">Rule Status</span>
          <span className="text-lg sm:text-xl font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Compliant
          </span>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link href="/dashboard/calculator">
          <button className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-2 mx-auto hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer">
            <span>Launch Full Risk Suite with Multi-Account Sync</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </section>
  );
}
