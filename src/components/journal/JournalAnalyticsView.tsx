"use client";

import React, { useMemo } from "react";
import { Trade } from "@/lib/types";
import {
  BarChart3,
  Clock,
  Compass,
  Layers,
  TrendingUp,
  TrendingDown,
  Percent,
  Award,
  Zap,
  Shield,
  Activity,
  DollarSign,
} from "lucide-react";

interface JournalAnalyticsViewProps {
  trades: Trade[];
}

export function JournalAnalyticsView({ trades }: JournalAnalyticsViewProps) {
  // 1. Session Breakdown
  const sessionStats = useMemo(() => {
    const sessions: Record<string, { count: number; wins: number; losses: number; pnl: number; r: number }> = {
      "London": { count: 0, wins: 0, losses: 0, pnl: 0, r: 0 },
      "New York": { count: 0, wins: 0, losses: 0, pnl: 0, r: 0 },
      "Asia / Tokyo": { count: 0, wins: 0, losses: 0, pnl: 0, r: 0 },
      "London/NY Overlap": { count: 0, wins: 0, losses: 0, pnl: 0, r: 0 },
    };

    trades.forEach((t) => {
      const s = t.session || "New York";
      if (!sessions[s]) {
        sessions[s] = { count: 0, wins: 0, losses: 0, pnl: 0, r: 0 };
      }
      sessions[s].count += 1;
      sessions[s].pnl += t.netPnL;
      sessions[s].r += t.rMultiple || 0;
      if (t.netPnL > 0) sessions[s].wins += 1;
      else if (t.netPnL < 0) sessions[s].losses += 1;
    });

    return sessions;
  }, [trades]);

  // 2. Asset Class Breakdown
  const assetClassStats = useMemo(() => {
    const assets: Record<string, { count: number; wins: number; pnl: number; tickers: Record<string, number> }> = {
      Indices: { count: 0, wins: 0, pnl: 0, tickers: {} },
      Forex: { count: 0, wins: 0, pnl: 0, tickers: {} },
      Crypto: { count: 0, wins: 0, pnl: 0, tickers: {} },
      Commodities: { count: 0, wins: 0, pnl: 0, tickers: {} },
    };

    trades.forEach((t) => {
      const ac = t.assetClass || "Indices";
      if (!assets[ac]) {
        assets[ac] = { count: 0, wins: 0, pnl: 0, tickers: {} };
      }
      assets[ac].count += 1;
      assets[ac].pnl += t.netPnL;
      if (t.netPnL > 0) assets[ac].wins += 1;

      assets[ac].tickers[t.ticker] = (assets[ac].tickers[t.ticker] || 0) + t.netPnL;
    });

    return assets;
  }, [trades]);

  // 3. Direction Long vs Short
  const directionStats = useMemo(() => {
    let longCount = 0;
    let longWins = 0;
    let longPnL = 0;
    let shortCount = 0;
    let shortWins = 0;
    let shortPnL = 0;

    trades.forEach((t) => {
      if (t.direction === "LONG") {
        longCount += 1;
        longPnL += t.netPnL;
        if (t.netPnL > 0) longWins += 1;
      } else {
        shortCount += 1;
        shortPnL += t.netPnL;
        if (t.netPnL > 0) shortWins += 1;
      }
    });

    const longWR = longCount > 0 ? Number(((longWins / longCount) * 100).toFixed(1)) : 0;
    const shortWR = shortCount > 0 ? Number(((shortWins / shortCount) * 100).toFixed(1)) : 0;

    return {
      longCount,
      longWins,
      longPnL,
      longWR,
      shortCount,
      shortWins,
      shortPnL,
      shortWR,
    };
  }, [trades]);

  // 4. Streaks & Risk Ratios
  const streakStats = useMemo(() => {
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let totalCommissions = 0;

    trades.forEach((t) => {
      totalCommissions += (t.commission || 0) + (t.swap || 0);
      if (t.netPnL > 0) {
        currentWinStreak += 1;
        currentLossStreak = 0;
        if (currentWinStreak > maxWinStreak) maxWinStreak = currentWinStreak;
      } else if (t.netPnL < 0) {
        currentLossStreak += 1;
        currentWinStreak = 0;
        if (currentLossStreak > maxLossStreak) maxLossStreak = currentLossStreak;
      }
    });

    return {
      maxWinStreak,
      maxLossStreak,
      totalCommissions,
    };
  }, [trades]);

  return (
    <div className="space-y-6">
      {/* 1. Killzone Session Matrix */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black font-mono text-white tracking-wider">
              KILLZONE & SESSION PERFORMANCE MATRIX
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Algorithmic Liquidity Windows
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.entries(sessionStats).map(([sessionName, data]) => {
            const winRate = data.count > 0 ? Number(((data.wins / data.count) * 100).toFixed(1)) : 0;
            const isProfit = data.pnl >= 0;

            return (
              <div key={sessionName} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold font-mono text-white block mb-1">
                    {sessionName}
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className={`text-xl font-black font-mono ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                      {data.pnl >= 0 ? "+" : ""}${Math.round(data.pnl).toLocaleString()}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {winRate}% WR
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{data.count} executions</span>
                  <span className="text-cyan-400 font-bold">{data.r >= 0 ? "+" : ""}{data.r.toFixed(1)}R</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Directional Bias & Asset Classes Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Long vs Short Directional Bias */}
        <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black font-mono text-white tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              DIRECTIONAL BIAS EFFICIENCY (LONG VS SHORT)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Longs */}
            <div className="p-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  LONGS
                </span>
                <span className="text-xs font-mono text-zinc-400">{directionStats.longCount} trades</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {directionStats.longPnL >= 0 ? "+" : ""}${Math.round(directionStats.longPnL).toLocaleString()}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                Win Rate: <span className="text-white font-bold">{directionStats.longWR}%</span>
              </div>
            </div>

            {/* Shorts */}
            <div className="p-4 rounded-xl bg-red-500/[0.06] border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  SHORTS
                </span>
                <span className="text-xs font-mono text-zinc-400">{directionStats.shortCount} trades</span>
              </div>
              <div className="text-2xl font-black font-mono text-red-400">
                {directionStats.shortPnL >= 0 ? "+" : ""}${Math.round(directionStats.shortPnL).toLocaleString()}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1">
                Win Rate: <span className="text-white font-bold">{directionStats.shortWR}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Streaks & Operational Telemetry */}
        <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
          <h3 className="text-sm font-black font-mono text-white tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            STREAKS & OPERATIONAL OVERHEAD
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">MAX WIN STREAK</span>
              <span className="text-2xl font-black font-mono text-emerald-400 mt-1 block">
                {streakStats.maxWinStreak}W
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">MAX LOSS STREAK</span>
              <span className="text-2xl font-black font-mono text-red-400 mt-1 block">
                {streakStats.maxLossStreak}L
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">COMMISSIONS</span>
              <span className="text-2xl font-black font-mono text-zinc-300 mt-1 block">
                ${Math.round(streakStats.totalCommissions)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Asset Class Breakdown */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
        <h3 className="text-sm font-black font-mono text-white tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          ASSET CLASS CAPITAL DISTRIBUTION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Object.entries(assetClassStats).map(([assetName, data]) => {
            const winRate = data.count > 0 ? Number(((data.wins / data.count) * 100).toFixed(1)) : 0;
            const isProfit = data.pnl >= 0;

            // Find top ticker
            const topTicker = Object.entries(data.tickers).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

            return (
              <div key={assetName} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold font-mono text-white block mb-1">
                    {assetName}
                  </span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className={`text-xl font-black font-mono ${isProfit ? "text-emerald-400" : "text-red-400"}`}>
                      {data.pnl >= 0 ? "+" : ""}${Math.round(data.pnl).toLocaleString()}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {winRate}% WR
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{data.count} trades</span>
                  <span className="text-zinc-300">Top: <strong className="text-white">{topTicker}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
