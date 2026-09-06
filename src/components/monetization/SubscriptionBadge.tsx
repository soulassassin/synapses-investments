"use client";

import React from "react";
import { Sparkles, ShieldCheck, AlertCircle, Clock, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTrades } from "@/context/TradeContext";

interface SubscriptionBadgeProps {
  variant?: "pill" | "card" | "compact";
  className?: string;
}

export function SubscriptionBadge({ variant = "pill", className = "" }: SubscriptionBadgeProps) {
  const { subscription } = useAuth();
  const { trades, maxDemoTrades, openPaywall } = useTrades();

  const isPro = subscription.isPro;
  const isTrial = subscription.isTrialActive;
  const daysLeft = subscription.trialDaysRemaining;
  const tradesCount = trades.length;

  if (variant === "compact") {
    if (isPro) {
      return (
        <button
          onClick={() => openPaywall("You are an active Institutional Pro member.")}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold tracking-wide hover:bg-emerald-500/20 transition-all ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>PRO</span>
        </button>
      );
    }

    if (isTrial) {
      return (
        <button
          onClick={() => openPaywall()}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono tracking-wide hover:bg-emerald-500/20 transition-all ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>TRIAL: {daysLeft}D</span>
        </button>
      );
    }

    return (
      <button
        onClick={() => openPaywall("Demo tier limit reached or trial expired. Upgrade to unlock full access.")}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono tracking-wide hover:bg-amber-500/20 transition-all ${className}`}
      >
        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        <span>{tradesCount}/{maxDemoTrades} DEMO</span>
      </button>
    );
  }

  if (variant === "card") {
    return (
      <div className={`p-3.5 rounded-xl bg-[#08090c] border border-white/10 shadow-lg ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPro ? "bg-emerald-400 shadow-[0_0_8px_#10b981]" : isTrial ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              {isPro ? "INSTITUTIONAL PRO" : isTrial ? "7-WEEK FULL TRIAL" : "DEMO SANDBOX"}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-400">
            {isPro ? "UNLIMITED" : isTrial ? `${daysLeft}D LEFT` : `${tradesCount}/${maxDemoTrades}`}
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">
          {isPro
            ? "Full access to live broker scanner, replay simulator, and unlimited cloud journal."
            : isTrial
            ? "Enjoy unrestricted institutional features during your 49-day complimentary trial."
            : `Free tier capped at ${maxDemoTrades} trade logs. Upgrade for unlimited execution telemetry.`}
        </p>

        {!isPro && (
          <button
            onClick={() => openPaywall()}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTrial ? "Extend / Lock In Pro" : "Upgrade to Pro"}</span>
          </button>
        )}
      </div>
    );
  }

  // Default "pill" variant for headers & sidebars
  return (
    <button
      onClick={() => openPaywall()}
      className={`group flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-[#08090c] hover:bg-[#0d0f14] border transition-all ${
        isPro
          ? "border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
          : isTrial
          ? "border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.12)]"
          : "border-amber-500/30 hover:border-amber-500/60"
      } ${className}`}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="relative shrink-0">
          <span
            className={`block w-2 h-2 rounded-full ${
              isPro
                ? "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                : isTrial
                ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]"
                : "bg-amber-400"
            }`}
          />
        </div>
        <div className="text-left truncate">
          <div className="text-[11px] font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
            <span>{isPro ? "PRO OPERATOR" : isTrial ? "7-WEEK TRIAL" : "DEMO TIER"}</span>
            {isTrial && (
              <span className="text-[10px] text-emerald-400 font-mono">
                ({daysLeft}d left)
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 block truncate">
            {isPro
              ? "All Systems Unlocked"
              : isTrial
              ? "Full Access Active"
              : `${tradesCount}/${maxDemoTrades} Trades Logged`}
          </span>
        </div>
      </div>

      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 group-hover:text-white group-hover:bg-white/10 transition-colors shrink-0">
        {isPro ? "STATUS" : "UPGRADE"}
      </span>
    </button>
  );
}
