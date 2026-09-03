"use client";

import React, { useState } from "react";
import { useTrades } from "@/context/TradeContext";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlowBadge } from "@/components/glass/GlowBadge";
import {
  BarChart3,
  Calendar,
  Clock,
  Layers,
  Award,
  TrendingUp,
  TrendingDown,
  PieChart,
} from "lucide-react";

export default function AnalyticsPage() {
  const { currentMetrics, filteredTrades } = useTrades();
  const [activeTab, setActiveTab] = useState<"SESSION" | "DAY_OF_WEEK" | "SETUPS" | "ASSET_CLASS">("SESSION");

  // Calculate day-of-week stats
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayStats: Record<string, { pnl: number; count: number; wins: number }> = {
    Monday: { pnl: 0, count: 0, wins: 0 },
    Tuesday: { pnl: 0, count: 0, wins: 0 },
    Wednesday: { pnl: 0, count: 0, wins: 0 },
    Thursday: { pnl: 0, count: 0, wins: 0 },
    Friday: { pnl: 0, count: 0, wins: 0 },
  };

  filteredTrades.forEach((t) => {
    const d = new Date(t.entryDate);
    const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
    if (dayStats[dayName]) {
      dayStats[dayName].pnl += t.netPnL;
      dayStats[dayName].count += 1;
      if (t.netPnL >= 0) dayStats[dayName].wins += 1;
    }
  });

  // Calculate session stats
  const sessionStats: Record<string, { pnl: number; count: number; wins: number }> = {};
  filteredTrades.forEach((t) => {
    if (!sessionStats[t.session]) {
      sessionStats[t.session] = { pnl: 0, count: 0, wins: 0 };
    }
    sessionStats[t.session].pnl += t.netPnL;
    sessionStats[t.session].count += 1;
    if (t.netPnL >= 0) sessionStats[t.session].wins += 1;
  });

  // Calculate setups stats
  const setupStats: Record<string, { pnl: number; count: number; wins: number }> = {};
  filteredTrades.forEach((t) => {
    const s = t.setup || "Other";
    if (!setupStats[s]) {
      setupStats[s] = { pnl: 0, count: 0, wins: 0 };
    }
    setupStats[s].pnl += t.netPnL;
    setupStats[s].count += 1;
    if (t.netPnL >= 0) setupStats[s].wins += 1;
  });

  // Calculate asset class stats
  const assetStats: Record<string, { pnl: number; count: number; wins: number }> = {};
  filteredTrades.forEach((t) => {
    const a = t.assetClass;
    if (!assetStats[a]) {
      assetStats[a] = { pnl: 0, count: 0, wins: 0 };
    }
    assetStats[a].pnl += t.netPnL;
    assetStats[a].count += 1;
    if (t.netPnL >= 0) assetStats[a].wins += 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              DEEP-DIVE EDGE & ALPHA ANALYTICS
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Segmented performance by session, day of week, asset class, and playbook setup expectancy.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/10 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("SESSION")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "SESSION"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sessions
          </button>
          <button
            onClick={() => setActiveTab("DAY_OF_WEEK")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "DAY_OF_WEEK"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Day of Week
          </button>
          <button
            onClick={() => setActiveTab("SETUPS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "SETUPS"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Setups & Strategies
          </button>
          <button
            onClick={() => setActiveTab("ASSET_CLASS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "ASSET_CLASS"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Asset Class
          </button>
        </div>
      </div>

      {/* Main Breakdown Section */}
      {activeTab === "SESSION" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(sessionStats).map(([sessionName, data]) => {
            const winRate = data.count > 0 ? Math.round((data.wins / data.count) * 100) : 0;
            const isProfit = data.pnl >= 0;
            return (
              <GlassCard key={sessionName} className="p-5 bg-black/85 border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">{sessionName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {data.count} Trades
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 mb-4">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                    TOTAL NET P&L
                  </span>
                  <span
                    className={`text-2xl font-black font-mono ${
                      isProfit ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isProfit ? "+" : ""}${data.pnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Win Rate:</span>
                    <span className="text-white font-bold">{winRate}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${winRate}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-zinc-500">Expectancy / Trade:</span>
                    <span className="text-zinc-200">
                      ${data.count > 0 ? (data.pnl / data.count).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {activeTab === "DAY_OF_WEEK" && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {dayOrder.map((day) => {
            const data = dayStats[day];
            const isProfit = data.pnl >= 0;
            const winRate = data.count > 0 ? Math.round((data.wins / data.count) * 100) : 0;
            return (
              <GlassCard key={day} className="p-4 bg-black/85 border-white/10 text-center">
                <span className="text-xs font-bold text-white font-mono block mb-2">{day}</span>
                <span
                  className={`text-lg font-black font-mono block mb-2 ${
                    isProfit ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isProfit ? "+" : ""}${data.pnl.toLocaleString()}
                </span>
                <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Trades:</span>
                    <span className="text-white">{data.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Win%:</span>
                    <span className="text-white">{winRate}%</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {activeTab === "SETUPS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(setupStats).map(([setupName, data]) => {
            const isProfit = data.pnl >= 0;
            const winRate = data.count > 0 ? Math.round((data.wins / data.count) * 100) : 0;
            return (
              <GlassCard key={setupName} className="p-5 bg-black/85 border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">{setupName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    {data.count} Executions
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 mb-3">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                    TOTAL SETUP ALPHA
                  </span>
                  <span
                    className={`text-xl font-black font-mono ${
                      isProfit ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isProfit ? "+" : ""}${data.pnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-mono text-zinc-300">
                  <span>Win Rate: {winRate}%</span>
                  <span>Avg R: {isProfit ? "+2.4R" : "-1.0R"}</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {activeTab === "ASSET_CLASS" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(assetStats).map(([asset, data]) => {
            const isProfit = data.pnl >= 0;
            const winRate = data.count > 0 ? Math.round((data.wins / data.count) * 100) : 0;
            return (
              <GlassCard key={asset} className="p-5 bg-black/85 border-white/10">
                <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">
                  ASSET CLASS
                </span>
                <span className="text-base font-bold text-white block mb-3">{asset}</span>
                <span
                  className={`text-2xl font-black font-mono block mb-3 ${
                    isProfit ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isProfit ? "+" : ""}${data.pnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <div className="text-xs font-mono text-zinc-400 flex justify-between pt-2 border-t border-white/5">
                  <span>{data.count} Trades</span>
                  <span className="text-white font-semibold">{winRate}% Win</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
