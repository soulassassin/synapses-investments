"use client";

import React, { useState, useMemo } from "react";
import { Trade } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  X,
  Layers,
} from "lucide-react";

interface JournalCalendarViewProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onEditTrade?: (trade: Trade) => void;
}

export function JournalCalendarView({ trades, onSelectTrade, onEditTrade }: JournalCalendarViewProps) {
  // Calendar month state (default to August/September 2026 based on mock/live trades)
  const [currentDate, setCurrentDate] = useState(() => {
    // Pick the most recent trade date if available, else new Date()
    if (trades.length > 0) {
      const dates = trades.map((t) => new Date(t.entryDate).getTime()).filter((d) => !isNaN(d));
      if (dates.length > 0) {
        const latest = Math.max(...dates);
        return new Date(latest);
      }
    }
    return new Date();
  });

  const [selectedDayString, setSelectedDayString] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayString(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayString(null);
  };

  const handleJumpToCurrent = () => {
    setCurrentDate(new Date());
    setSelectedDayString(null);
  };

  // Group trades by "YYYY-MM-DD"
  const tradesByDate = useMemo(() => {
    const map: Record<string, Trade[]> = {};
    trades.forEach((trade) => {
      try {
        const dateObj = new Date(trade.entryDate);
        if (isNaN(dateObj.getTime())) return;
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        const key = `${y}-${m}-${d}`;
        if (!map[key]) map[key] = [];
        map[key].push(trade);
      } catch {
        // ignore
      }
    });
    return map;
  }, [trades]);

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of month weekday (0 = Sun, 1 = Mon, ..., 6 = Sat)
  // Let's align Mon = 0, Sun = 6
  const firstDayWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  // Compute month aggregate stats
  const monthStats = useMemo(() => {
    let totalPnL = 0;
    let totalTrades = 0;
    let totalWins = 0;
    let totalLosses = 0;
    let totalR = 0;
    let greenDays = 0;
    let redDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayTrades = tradesByDate[dayKey] || [];
      if (dayTrades.length > 0) {
        let dayPnL = 0;
        dayTrades.forEach((t) => {
          totalTrades += 1;
          totalPnL += t.netPnL;
          totalR += t.rMultiple || 0;
          dayPnL += t.netPnL;
          if (t.netPnL > 0) totalWins += 1;
          else if (t.netPnL < 0) totalLosses += 1;
        });

        if (dayPnL > 0) greenDays += 1;
        else if (dayPnL < 0) redDays += 1;
      }
    }

    const winRate = totalTrades > 0 ? Number(((totalWins / totalTrades) * 100).toFixed(1)) : 0;
    return {
      totalPnL,
      totalTrades,
      totalWins,
      totalLosses,
      totalR: Number(totalR.toFixed(2)),
      winRate,
      greenDays,
      redDays,
    };
  }, [tradesByDate, year, month, daysInMonth]);

  // Selected Day's Trades
  const selectedDayTrades = useMemo(() => {
    if (!selectedDayString) return [];
    return tradesByDate[selectedDayString] || [];
  }, [selectedDayString, tradesByDate]);

  // Selected Day's Summary
  const selectedDaySummary = useMemo(() => {
    if (!selectedDayTrades || selectedDayTrades.length === 0) return null;
    let pnl = 0;
    let r = 0;
    let wins = 0;
    let losses = 0;
    selectedDayTrades.forEach((t) => {
      pnl += t.netPnL;
      r += t.rMultiple || 0;
      if (t.netPnL > 0) wins += 1;
      else if (t.netPnL < 0) losses += 1;
    });
    return { pnl, r: Number(r.toFixed(2)), wins, losses, count: selectedDayTrades.length };
  }, [selectedDayTrades]);

  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="space-y-6">
      {/* 1. Header Navigation & Monthly KPIs */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        {/* Month Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-black font-mono text-white tracking-wider uppercase min-w-36 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleJumpToCurrent}
            className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
          >
            Today
          </button>
        </div>

        {/* Monthly Summary Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">MONTHLY NET P&L</span>
            <span
              className={`text-base font-black font-mono ${
                monthStats.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {monthStats.totalPnL >= 0 ? "+" : ""}${monthStats.totalPnL.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">WIN RATE</span>
            <span className="text-base font-black font-mono text-white">
              {monthStats.winRate}% <span className="text-xs text-zinc-500 font-normal">({monthStats.totalWins}W / {monthStats.totalLosses}L)</span>
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">CUMULATIVE R</span>
            <span
              className={`text-base font-black font-mono ${
                monthStats.totalR >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {monthStats.totalR >= 0 ? "+" : ""}{monthStats.totalR}R
            </span>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">DAY RATIO</span>
            <span className="text-base font-black font-mono text-white">
              <span className="text-emerald-400">{monthStats.greenDays}G</span> / <span className="text-red-400">{monthStats.redDays}R</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Calendar Grid */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-x-auto">
        {/* Weekday Column Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2 min-w-[700px]">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center py-2 text-[11px] font-mono font-bold tracking-wider text-zinc-400 bg-white/[0.02] rounded-xl border border-white/5"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 gap-2 min-w-[700px]">
          {/* Empty offset padding for days before the 1st */}
          {Array.from({ length: firstDayWeekday }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="h-24 sm:h-28 rounded-xl bg-white/[0.01] border border-white/[0.02] opacity-30 pointer-events-none"
            />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const dayTrades = tradesByDate[dayKey] || [];
            const isSelected = selectedDayString === dayKey;

            let dayPnL = 0;
            let wins = 0;
            let losses = 0;
            dayTrades.forEach((t) => {
              dayPnL += t.netPnL;
              if (t.netPnL > 0) wins += 1;
              else if (t.netPnL < 0) losses += 1;
            });

            const hasTrades = dayTrades.length > 0;
            const isProfit = dayPnL > 0;
            const isLoss = dayPnL < 0;

            // Heatmap intensity background styling
            let cellBg = "bg-white/[0.02] border-white/10 hover:border-white/30";
            if (hasTrades) {
              if (isProfit) {
                cellBg = "bg-emerald-500/[0.08] border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/[0.12]";
              } else if (isLoss) {
                cellBg = "bg-red-500/[0.08] border-red-500/30 hover:border-red-500/60 hover:bg-red-500/[0.12]";
              } else {
                cellBg = "bg-white/[0.05] border-white/20";
              }
            }

            if (isSelected) {
              cellBg = "bg-cyan-500/[0.15] border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]";
            }

            return (
              <div
                key={dayKey}
                onClick={() => {
                  if (isSelected) setSelectedDayString(null);
                  else setSelectedDayString(dayKey);
                }}
                className={`h-24 sm:h-28 p-2.5 rounded-xl border flex flex-col justify-between transition-all duration-200 cursor-pointer ${cellBg} relative group`}
              >
                {/* Day Header: Number & Trade Count Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? "text-cyan-300" : hasTrades ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {hasTrades && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/60 text-zinc-300 border border-white/10">
                      {dayTrades.length} {dayTrades.length === 1 ? "trade" : "trades"}
                    </span>
                  )}
                </div>

                {/* Day Center / Bottom: Net PnL & Win/Loss Breakdown */}
                {hasTrades ? (
                  <div className="space-y-1">
                    <div
                      className={`text-xs sm:text-sm font-black font-mono tracking-tight ${
                        isProfit ? "text-emerald-400" : isLoss ? "text-red-400" : "text-zinc-300"
                      }`}
                    >
                      {dayPnL >= 0 ? "+" : ""}${Math.round(dayPnL).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-400">
                      <span className="text-emerald-400 font-semibold">{wins}W</span>
                      <span>•</span>
                      <span className="text-red-400 font-semibold">{losses}L</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-zinc-700 select-none">
                    -
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Selected Day Drilldown Panel */}
      {selectedDayString && (
        <div className="p-5 rounded-2xl bg-[#0A0A10] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black font-mono text-white tracking-wider">
                  EXECUTIONS FOR {new Date(selectedDayString).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  {selectedDaySummary
                    ? `${selectedDaySummary.count} executions • Net Realized: ${selectedDaySummary.pnl >= 0 ? "+" : ""}$${selectedDaySummary.pnl.toLocaleString()} (${selectedDaySummary.r >= 0 ? "+" : ""}${selectedDaySummary.r}R)`
                    : "No executions logged on this date."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayString(null)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Day Filter</span>
            </button>
          </div>

          {selectedDayTrades.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs">
              No executions logged on this date. Click another day on the calendar or log an execution above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {selectedDayTrades.map((trade) => {
                const isWin = trade.netPnL >= 0;
                return (
                  <div
                    key={trade.id}
                    onClick={() => onSelectTrade(trade)}
                    className="p-4 rounded-xl bg-black/70 border border-white/10 hover:border-white/30 transition-all cursor-pointer group flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black font-mono text-white">
                            {trade.ticker}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                              trade.direction === "LONG"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {trade.direction}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {trade.session}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between mb-2">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-400 uppercase block">NET REALIZED</span>
                          <span className={`text-base font-black font-mono ${isWin ? "text-emerald-400" : "text-red-400"}`}>
                            {isWin ? "+" : ""}${trade.netPnL.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase block">R-MULTIPLE</span>
                          <span className="text-xs font-bold font-mono text-white">
                            {trade.rMultiple >= 0 ? "+" : ""}{trade.rMultiple.toFixed(2)}R
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-zinc-300 mb-2">
                        <span className="text-zinc-500">Setup: </span>
                        {trade.setup || trade.strategy}
                      </div>

                      {trade.notes && (
                        <p className="text-[11px] text-zinc-400 italic line-clamp-2 bg-black/40 p-2 rounded border border-white/5">
                          &ldquo;{trade.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>{trade.timeframe || "5m"} chart</span>
                      <span className="text-cyan-400 group-hover:underline flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Inspect Trade
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
