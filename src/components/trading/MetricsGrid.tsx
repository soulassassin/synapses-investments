"use client";

import React from "react";
import { MetricStats } from "@/lib/types";
import { GlassCard } from "../glass/GlassCard";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Percent,
  Scale,
  ShieldAlert,
  Flame,
  Zap,
  Award,
} from "lucide-react";

interface MetricsGridProps {
  stats: MetricStats;
}

export function MetricsGrid({ stats }: MetricsGridProps) {
  const cards = [
    {
      title: "NET PROFIT / LOSS",
      value: `${stats.netPnL >= 0 ? "+" : ""}$${stats.netPnL.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      subtitle: `${stats.totalTrades} Total Trades Logged`,
      icon: <Target className="w-4 h-4 text-white" />,
      color: stats.netPnL >= 0 ? "text-emerald-400" : "text-red-400",
      badge: stats.netPnL >= 0 ? "+Alpha Positive" : "Deficit",
      badgeVariant: stats.netPnL >= 0 ? "emerald" : "rose",
    },
    {
      title: "WIN RATE %",
      value: `${stats.winRate}%`,
      subtitle: `${stats.winningTrades}W • ${stats.losingTrades}L • ${stats.breakevenTrades}BE`,
      icon: <Percent className="w-4 h-4 text-white" />,
      color: stats.winRate >= 50 ? "text-emerald-400" : "text-amber-400",
      badge: stats.winRate >= 60 ? "Exceptional" : "Target Met",
      badgeVariant: stats.winRate >= 50 ? "emerald" : "amber",
      progressBar: stats.winRate,
    },
    {
      title: "PROFIT FACTOR",
      value: stats.profitFactor > 50 ? "∞" : stats.profitFactor.toFixed(2),
      subtitle: `Gross: +$${stats.grossProfit.toLocaleString()} / -$${stats.grossLoss.toLocaleString()}`,
      icon: <Scale className="w-4 h-4 text-white" />,
      color: "text-white",
      badge: stats.profitFactor >= 2.0 ? "Tier 1 Alpha" : "Moderate",
      badgeVariant: "white",
    },
    {
      title: "EXPECTANCY",
      value: `${stats.expectancy >= 0 ? "+" : ""}$${stats.expectancy.toLocaleString()} / trade`,
      subtitle: `Expectancy R: +${stats.expectancyR.toFixed(2)}R`,
      icon: <Award className="w-4 h-4 text-white" />,
      color: "text-white",
      badge: `${stats.expectancyR >= 0.5 ? "High Edge" : "Standard"}`,
      badgeVariant: "white",
    },
    {
      title: "SHARPE RATIO",
      value: stats.sharpeRatio.toFixed(2),
      subtitle: "Annualized Risk-Adjusted Edge",
      icon: <Zap className="w-4 h-4 text-white" />,
      color: "text-white",
      badge: stats.sharpeRatio >= 2.0 ? "Institutional" : "Adequate",
      badgeVariant: "white",
    },
    {
      title: "AVG WIN / AVG LOSS",
      value: `${stats.avgWinLossRatio.toFixed(2)} : 1`,
      subtitle: `Avg Win: +$${stats.avgWin.toLocaleString()} | Loss: -$${stats.avgLoss.toLocaleString()}`,
      icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
      color: "text-white",
      badge: "Reward:Risk",
      badgeVariant: "white",
    },
    {
      title: "MAX DRAWDOWN",
      value: `-${stats.maxDrawdownPercent}%`,
      subtitle: `Deepest Drop: -$${stats.maxDrawdownAmount.toLocaleString()}`,
      icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
      color: stats.maxDrawdownPercent < 6 ? "text-emerald-400" : "text-red-400",
      badge: stats.maxDrawdownPercent < 5 ? "Protected" : "Monitored",
      badgeVariant: stats.maxDrawdownPercent < 5 ? "emerald" : "rose",
    },
    {
      title: "STREAK ANALYSIS",
      value: `${stats.currentStreak.count} ${stats.currentStreak.type}S`,
      subtitle: `Best Win Streak: ${stats.maxWinStreak}W | Max DD Streak: ${stats.maxLossStreak}L`,
      icon: <Flame className="w-4 h-4 text-white" />,
      color: stats.currentStreak.type === "WIN" ? "text-emerald-400" : "text-red-400",
      badge: `Max: ${stats.maxWinStreak} Wins`,
      badgeVariant: "white",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <GlassCard
          key={idx}
          variant="interactive"
          className="p-5 flex flex-col justify-between bg-black/85 border-white/10"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase font-semibold">
                {card.title}
              </span>
              <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10">
                {card.icon}
              </div>
            </div>

            <div className="my-1">
              <span className={`text-2xl font-black font-mono tracking-wider ${card.color}`}>
                {card.value}
              </span>
            </div>

            {card.progressBar !== undefined && (
              <div className="w-full bg-white/10 h-1.5 rounded-full my-2 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${card.progressBar}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
            <span className="text-[11px] text-zinc-400 font-mono truncate mr-2">
              {card.subtitle}
            </span>
            <span
              className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase shrink-0 font-bold ${
                card.badgeVariant === "emerald"
                  ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-400"
                  : card.badgeVariant === "rose"
                  ? "bg-red-500/15 border-red-400/30 text-red-400"
                  : card.badgeVariant === "amber"
                  ? "bg-amber-500/15 border-amber-400/30 text-amber-300"
                  : "bg-white/10 border-white/20 text-white"
              }`}
            >
              {card.badge}
            </span>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
