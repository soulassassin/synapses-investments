"use client";

import React, { useState, useMemo } from "react";
import { Trade } from "@/lib/types";
import {
  ShieldAlert,
  Flame,
  Brain,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Eye,
  Percent,
  DollarSign,
  Award,
  Zap,
} from "lucide-react";

interface JournalMistakeAuditorProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
}

const ALL_MISTAKE_TAGS = [
  { id: "FOMO", label: "FOMO Entry", desc: "Entered late out of fear of missing displacement." },
  { id: "Moved Stop Loss", label: "Moved Stop Loss", desc: "Widened stop loss mid-trade in violation of risk parameters." },
  { id: "Revenge Trade", label: "Revenge Trade", desc: "Forced execution immediately after a losing trade." },
  { id: "Overleveraged", label: "Overleveraged", desc: "Exceeded max allowed risk percentage on single execution." },
  { id: "Early Exit", label: "Early Exit", desc: "Cut winning trade manually before reaching algorithmic target." },
  { id: "Chased Entry", label: "Chased Entry", desc: "Market bought into extended premium / discount array." },
  { id: "Traded Red Folder News", label: "Traded Red Folder News", desc: "Held open position into high-impact FOMC / CPI release." },
  { id: "No Clear Confluence", label: "No Clear Confluence", desc: "Executed setup without prerequisite HTF bias or sweep." },
];

export function JournalMistakeAuditor({ trades, onSelectTrade }: JournalMistakeAuditorProps) {
  const [selectedMistakeTag, setSelectedMistakeTag] = useState<string | null>(null);

  // Behavioral & Psychological Breakdown
  const auditData = useMemo(() => {
    let cleanTradesCount = 0;
    let breachedTradesCount = 0;
    let cleanTradesPnL = 0;
    let breachedTradesPnL = 0;
    let cleanTradesR = 0;
    let breachedTradesR = 0;
    const tagFrequency: Record<string, { count: number; totalLoss: number; totalR: number }> = {};

    ALL_MISTAKE_TAGS.forEach((tag) => {
      tagFrequency[tag.id] = { count: 0, totalLoss: 0, totalR: 0 };
    });

    trades.forEach((t) => {
      const hasMistakes = t.mistakeTags && t.mistakeTags.length > 0;
      if (hasMistakes) {
        breachedTradesCount += 1;
        breachedTradesPnL += t.netPnL;
        breachedTradesR += t.rMultiple || 0;

        t.mistakeTags.forEach((tag) => {
          if (!tagFrequency[tag]) {
            tagFrequency[tag] = { count: 0, totalLoss: 0, totalR: 0 };
          }
          tagFrequency[tag].count += 1;
          if (t.netPnL < 0) {
            tagFrequency[tag].totalLoss += Math.abs(t.netPnL);
          }
          tagFrequency[tag].totalR += t.rMultiple || 0;
        });
      } else {
        cleanTradesCount += 1;
        cleanTradesPnL += t.netPnL;
        cleanTradesR += t.rMultiple || 0;
      }
    });

    const total = trades.length;
    const disciplineScore = total > 0 ? Number(((cleanTradesCount / total) * 100).toFixed(1)) : 100;
    const avgCleanPnL = cleanTradesCount > 0 ? Number((cleanTradesPnL / cleanTradesCount).toFixed(2)) : 0;
    const avgBreachedPnL = breachedTradesCount > 0 ? Number((breachedTradesPnL / breachedTradesCount).toFixed(2)) : 0;

    return {
      disciplineScore,
      cleanTradesCount,
      breachedTradesCount,
      cleanTradesPnL,
      breachedTradesPnL,
      cleanTradesR: Number(cleanTradesR.toFixed(2)),
      breachedTradesR: Number(breachedTradesR.toFixed(2)),
      avgCleanPnL,
      avgBreachedPnL,
      tagFrequency,
    };
  }, [trades]);

  // Emotional State Performance Matrix
  const emotionPerformance = useMemo(() => {
    const states: Record<string, { count: number; wins: number; pnl: number }> = {
      Focused: { count: 0, wins: 0, pnl: 0 },
      "Calm & Neutral": { count: 0, wins: 0, pnl: 0 },
      Anxious: { count: 0, wins: 0, pnl: 0 },
      Overconfident: { count: 0, wins: 0, pnl: 0 },
      "Revenge Mode": { count: 0, wins: 0, pnl: 0 },
    };

    trades.forEach((t) => {
      const state = t.emotion?.preTradeState || "Focused";
      if (!states[state]) {
        states[state] = { count: 0, wins: 0, pnl: 0 };
      }
      states[state].count += 1;
      states[state].pnl += t.netPnL;
      if (t.netPnL > 0) states[state].wins += 1;
    });

    return states;
  }, [trades]);

  // Filtered trades by selected mistake
  const mistakeFilteredTrades = useMemo(() => {
    if (!selectedMistakeTag) {
      return trades.filter((t) => t.mistakeTags && t.mistakeTags.length > 0);
    }
    return trades.filter((t) => t.mistakeTags && t.mistakeTags.includes(selectedMistakeTag));
  }, [trades, selectedMistakeTag]);

  return (
    <div className="space-y-6">
      {/* 1. Top Discipline Gauge & Cost of Leaks Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Discipline Rating Card */}
        <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              DISCIPLINE INTEGRITY INDEX
            </span>
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono text-white">
                {auditData.disciplineScore}%
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {auditData.disciplineScore >= 80 ? "INSTITUTIONAL GRADE A" : "RULE BREACH WARNING"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  auditData.disciplineScore >= 80 ? "bg-emerald-400" : "bg-amber-400"
                }`}
                style={{ width: `${auditData.disciplineScore}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/5 pt-2">
            <span>{auditData.cleanTradesCount} Clean Trades</span>
            <span className="text-red-400">{auditData.breachedTradesCount} Breached Rules</span>
          </div>
        </div>

        {/* Cost of Emotional Mistakes Card */}
        <div className="p-5 rounded-2xl bg-black/85 border border-red-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              TOTAL COST OF EMOTIONAL LEAKS
            </span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>

          <div className="my-4">
            <span className="text-3xl font-black font-mono text-red-400">
              {auditData.breachedTradesPnL >= 0 ? "+" : ""}${auditData.breachedTradesPnL.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-zinc-400 block mt-1">
              {auditData.breachedTradesR >= 0 ? "+" : ""}{auditData.breachedTradesR} R leaked to impulsive behavior
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/5 pt-2">
            <span>Avg Breached Loss:</span>
            <span className="text-red-400 font-bold">${auditData.avgBreachedPnL}</span>
          </div>
        </div>

        {/* Clean Trades Edge Comparison */}
        <div className="p-5 rounded-2xl bg-black/85 border border-emerald-500/20 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              DISCIPLINED EXECUTION EDGE
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="my-4">
            <span className="text-3xl font-black font-mono text-emerald-400">
              +${auditData.cleanTradesPnL.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-zinc-400 block mt-1">
              +{auditData.cleanTradesR} R generated on 100% rule-compliant setups
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-white/5 pt-2">
            <span>Avg Clean Win:</span>
            <span className="text-emerald-400 font-bold">+${auditData.avgCleanPnL}</span>
          </div>
        </div>
      </div>

      {/* 2. Specific Mistake Tags Breakdown */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black font-mono text-white tracking-wider">
              MISTAKE FREQUENCY & DAMAGE AUDIT
            </h3>
          </div>
          {selectedMistakeTag && (
            <button
              onClick={() => setSelectedMistakeTag(null)}
              className="text-xs font-mono text-zinc-400 hover:text-white underline"
            >
              Clear Filter (Showing {selectedMistakeTag})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ALL_MISTAKE_TAGS.map((tag) => {
            const data = auditData.tagFrequency[tag.id] || { count: 0, totalLoss: 0, totalR: 0 };
            const isSelected = selectedMistakeTag === tag.id;

            return (
              <div
                key={tag.id}
                onClick={() => {
                  if (isSelected) setSelectedMistakeTag(null);
                  else setSelectedMistakeTag(tag.id);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-red-500/20 border-red-400 ring-1 ring-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                    : data.count > 0
                    ? "bg-white/[0.03] border-white/10 hover:border-red-500/40 hover:bg-white/[0.06]"
                    : "bg-white/[0.01] border-white/5 opacity-50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold font-mono text-white">
                      {tag.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-black ${
                        data.count > 0 ? "bg-red-500/20 text-red-300" : "bg-white/5 text-zinc-600"
                      }`}
                    >
                      {data.count}x
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2">
                    {tag.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">Loss:</span>
                  <span className={data.totalLoss > 0 ? "text-red-400 font-bold" : "text-zinc-500"}>
                    -${Math.round(data.totalLoss).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Pre-Trade Psychological Mindset vs Outcome Table */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-3">
        <h3 className="text-sm font-black font-mono text-white tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4 text-cyan-400" />
          PRE-TRADE PSYCHOLOGICAL STATE CORRELATION
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(emotionPerformance).map(([state, data]) => {
            const winRate = data.count > 0 ? Number(((data.wins / data.count) * 100).toFixed(0)) : 0;
            const isGood = data.pnl >= 0;

            return (
              <div key={state} className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                  {state}
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className={`text-base font-black font-mono ${isGood ? "text-emerald-400" : "text-red-400"}`}>
                    {data.pnl >= 0 ? "+" : ""}${Math.round(data.pnl).toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {winRate}% WR
                  </span>
                </div>
                <div className="text-[9px] font-mono text-zinc-500 mt-1">
                  {data.count} executions
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Breached Executions List for Deep Inspection */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black font-mono text-white tracking-wider">
            {selectedMistakeTag ? `EXECUTIONS FLAGGED FOR: ${selectedMistakeTag}` : "ALL RULE-VIOLATING EXECUTIONS"}
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            {mistakeFilteredTrades.length} Trades Found
          </span>
        </div>

        {mistakeFilteredTrades.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 font-mono text-xs bg-white/[0.01] rounded-xl border border-white/5">
            No executions found matching the active mistake criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {mistakeFilteredTrades.map((trade) => (
              <div
                key={trade.id}
                onClick={() => onSelectTrade(trade)}
                className="p-4 rounded-xl bg-black/70 border border-red-500/20 hover:border-red-500/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black font-mono text-white">
                      {trade.ticker} • {trade.direction}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {new Date(trade.entryDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono text-red-300">REALIZED LOSS:</span>
                    <span className="text-xs font-black font-mono text-red-400">
                      ${trade.netPnL.toLocaleString()} ({trade.rMultiple}R)
                    </span>
                  </div>

                  {trade.mistakeTags && trade.mistakeTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {trade.mistakeTags.map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[9px] font-mono font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {trade.notes && (
                    <p className="text-[11px] text-zinc-400 italic line-clamp-2 bg-white/[0.02] p-2 rounded">
                      &ldquo;{trade.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>{trade.account || "Apex Prop 100K"}</span>
                  <span className="text-red-400 group-hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Inspect Leak
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
