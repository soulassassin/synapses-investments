"use client";

import React, { useState } from "react";
import {
  BookOpen,
  PlusCircle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Table,
  Search,
  Calendar,
  Layers,
  Award,
  Percent,
  Zap,
  ShieldAlert,
  Trash2,
  Edit2,
  Eye,
  Filter,
  RotateCcw,
} from "lucide-react";
import { useJournalStore } from "@/store/useJournalStore";
import { TradeLog, SessionType, SetupModel, TradeOutcome, AssetPair } from "@/types/journal";
import { TradeModal } from "@/components/journal/TradeModal";
import { TradeDetailModal } from "@/components/journal/TradeDetailModal";
import { GlassCard } from "@/components/glass/GlassCard";

const SESSIONS: { value: SessionType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Sessions" },
  { value: "LONDON", label: "London Open" },
  { value: "NY_AM", label: "NY AM Macro" },
  { value: "NY_PM", label: "NY PM Power Hour" },
  { value: "ASIA", label: "Asia Session" },
];

const SETUPS: { value: SetupModel | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Setups" },
  { value: "SILVER_BULLET", label: "ICT Silver Bullet" },
  { value: "FVG", label: "Fair Value Gap" },
  { value: "ORDER_BLOCK", label: "Order Block" },
  { value: "LIQUIDITY_SWEEP", label: "Liquidity Sweep" },
  { value: "BREAKER", label: "Breaker Block" },
  { value: "TURTLE_SOUP", label: "Turtle Soup" },
];

const OUTCOMES: { value: TradeOutcome | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Outcomes" },
  { value: "WIN", label: "Wins (+R)" },
  { value: "LOSS", label: "Losses (-1R)" },
  { value: "BREAKEVEN", label: "Breakeven (0R)" },
  { value: "OPEN", label: "Active Open" },
];

export default function JournalPage() {
  const {
    trades,
    activeFilter,
    setFilter,
    resetFilter,
    resetJournal,
    deleteTrade,
    getFilteredTrades,
    getWinRate,
    getAverageRR,
    getProfitFactor,
    getNetR,
    getTotalPnL,
    getMaxDrawdown,
  } = useJournalStore();

  const [viewMode, setViewMode] = useState<"MATRIX" | "PLAYBOOK">("PLAYBOOK");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeLog | null>(null);
  const [tradeToEdit, setTradeToEdit] = useState<TradeLog | null>(null);

  // Computed metrics from store
  const filteredTrades = getFilteredTrades();
  const winRate = getWinRate();
  const averageRR = getAverageRR();
  const profitFactor = getProfitFactor();
  const netR = getNetR();
  const totalPnL = getTotalPnL();
  const maxDD = getMaxDrawdown();

  const handleEdit = (trade: TradeLog) => {
    setSelectedTrade(null);
    setTradeToEdit(trade);
    setIsLogModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP TELEMETRY BAR & STAT COUNTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-black/85 border border-white/10 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ICT / SMC TRADE JOURNAL & PLAYBOOK
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Zero-G Execution Tracking • LocalStorage Encrypted • High Probability Setups
          </p>
        </div>

        {/* Live Action: LOG NEW EXECUTION Button with Glowing Neon Border */}
        <button
          onClick={() => {
            setTradeToEdit(null);
            setIsLogModalOpen(true);
          }}
          className="relative group px-6 py-3 rounded-2xl bg-white text-black font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:bg-zinc-100 active:scale-95 cursor-pointer shrink-0 border border-white"
        >
          <PlusCircle className="w-4 h-4 text-black" />
          <span>+ LOG NEW EXECUTION</span>
        </button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Trades */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">TOTAL TRADES</span>
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <span className="text-2xl font-black font-mono text-white">{trades.length}</span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Logged in Playbook</span>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">WIN RATE</span>
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-2xl font-black font-mono text-emerald-400">{winRate}%</span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Closed Executions</span>
        </div>

        {/* Cumulative R */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">CUMULATIVE R</span>
            <Award className="w-3.5 h-3.5 text-white" />
          </div>
          <span className={`text-2xl font-black font-mono ${netR >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {netR >= 0 ? "+" : ""}{netR}R
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Realized Multiples</span>
        </div>

        {/* Profit Factor */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">PROFIT FACTOR</span>
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-2xl font-black font-mono text-white">
            {profitFactor > 50 ? "∞" : profitFactor.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Gross Win / Loss</span>
        </div>

        {/* Current Drawdown / Total P&L */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">MAX DRAWDOWN</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-2xl font-black font-mono text-amber-400">
            -${maxDD.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Peak-to-Trough Equity</span>
        </div>
      </div>

      {/* 2. FILTER HEADER & VIEW SWITCHER */}
      <div className="p-4 rounded-2xl bg-black/80 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={activeFilter.searchQuery || ""}
            onChange={(e) => setFilter({ searchQuery: e.target.value })}
            placeholder="Search pair, setup, notes..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
          {/* Session Dropdown */}
          <select
            value={activeFilter.session || "ALL"}
            onChange={(e) => setFilter({ session: e.target.value as any })}
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-200 focus:outline-none focus:border-white/50"
          >
            {SESSIONS.map((s) => (
              <option key={s.value} value={s.value} className="bg-black text-white">
                {s.label}
              </option>
            ))}
          </select>

          {/* Setup Dropdown */}
          <select
            value={activeFilter.setup || "ALL"}
            onChange={(e) => setFilter({ setup: e.target.value as any })}
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-200 focus:outline-none focus:border-white/50"
          >
            {SETUPS.map((m) => (
              <option key={m.value} value={m.value} className="bg-black text-white">
                {m.label}
              </option>
            ))}
          </select>

          {/* Outcome Dropdown */}
          <select
            value={activeFilter.outcome || "ALL"}
            onChange={(e) => setFilter({ outcome: e.target.value as any })}
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-zinc-200 focus:outline-none focus:border-white/50"
          >
            {OUTCOMES.map((o) => (
              <option key={o.value} value={o.value} className="bg-black text-white">
                {o.label}
              </option>
            ))}
          </select>

          {/* Reset Filters */}
          <button
            onClick={resetFilter}
            className="px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-400 hover:text-white flex items-center justify-center gap-1 transition-all"
            title="Clear all active filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* View Mode Toggle: Matrix vs Playbook */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10 shrink-0 w-full sm:w-auto justify-center">
          <button
            onClick={() => setViewMode("PLAYBOOK")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "PLAYBOOK"
                ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Playbook</span>
          </button>
          <button
            onClick={() => setViewMode("MATRIX")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "MATRIX"
                ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Matrix Table</span>
          </button>
        </div>
      </div>

      {/* 3. VIEWS & DISPLAYS */}
      {viewMode === "PLAYBOOK" ? (
        /* TAB 2: VISUAL PLAYBOOK (CARD GRID) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrades.length === 0 ? (
            <div className="col-span-full p-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-zinc-400 font-mono text-xs">
              No executions found matching your current filter criteria.
            </div>
          ) : (
            filteredTrades.map((trade) => {
              const isWin = trade.status === "WIN";
              const hasScreenshots = trade.chartScreenshots && trade.chartScreenshots.length > 0;
              return (
                <div
                  key={trade.id}
                  onClick={() => setSelectedTrade(trade)}
                  className="p-5 rounded-2xl bg-black/85 border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.9)] hover:scale-[1.01]"
                >
                  <div>
                    {/* Top Row: Symbol, Direction, Session */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black font-mono text-white group-hover:text-zinc-200">
                          {trade.pair}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                            trade.direction === "LONG"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {trade.direction}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {trade.session.replace("_", " ")}
                      </span>
                    </div>

                    {/* Screenshot Thumbnail (if present) */}
                    {hasScreenshots ? (
                      <div className="mb-3 rounded-xl overflow-hidden border border-white/10 aspect-video bg-black relative">
                        <img
                          src={trade.chartScreenshots[0]}
                          alt="Chart Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {trade.chartScreenshots.length > 1 && (
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white border border-white/20">
                            +{trade.chartScreenshots.length - 1} more
                          </span>
                        )}
                      </div>
                    ) : null}

                    {/* Realized P&L & R-Multiple */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                          NET REALIZED
                        </span>
                        <span
                          className={`text-lg font-black font-mono ${
                            isWin
                              ? "text-emerald-400"
                              : trade.status === "LOSS"
                              ? "text-red-400"
                              : "text-white"
                          }`}
                        >
                          {trade.netPnL !== undefined
                            ? `${trade.netPnL >= 0 ? "+" : ""}$${trade.netPnL.toLocaleString()}`
                            : `${trade.rMultiple}R`}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                          OUTCOME
                        </span>
                        <span
                          className={`text-xs font-bold font-mono px-2 py-0.5 rounded border inline-block ${
                            trade.rMultiple && trade.rMultiple > 0
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : trade.rMultiple && trade.rMultiple < 0
                              ? "bg-red-500/15 text-red-400 border-red-500/30"
                              : "bg-white/10 text-white border-white/20"
                          }`}
                        >
                          {trade.rMultiple && trade.rMultiple > 0 ? "+" : ""}
                          {trade.rMultiple?.toFixed(2)}R
                        </span>
                      </div>
                    </div>

                    {/* Setup & Timeframe */}
                    <div className="text-xs font-mono space-y-1 mb-3">
                      <div className="flex justify-between text-zinc-400">
                        <span>Setup:</span>
                        <span className="text-white font-semibold">{trade.setup.replace("_", " ")}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Entry / SL:</span>
                        <span className="text-zinc-300">
                          {trade.entryPrice} • SL: {trade.stopLoss}
                        </span>
                      </div>
                    </div>

                    {/* Notes Snippet */}
                    {trade.confluenceNotes && (
                      <p className="text-xs text-zinc-400 line-clamp-2 italic bg-black/40 p-2.5 rounded-lg border border-white/5 mb-3 font-sans">
                        &ldquo;{trade.confluenceNotes}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Card Footer: Emotional Discipline */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(trade.timestamp).toLocaleDateString()}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {trade.emotionalState}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* TAB 1: MATRIX VIEW (DATA TABLE) */
        <div className="overflow-x-auto custom-scrollbar border border-white/10 rounded-2xl bg-black/85">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                <th className="p-3.5">DATE & TIME</th>
                <th className="p-3.5">ASSET</th>
                <th className="p-3.5">DIR</th>
                <th className="p-3.5">SESSION</th>
                <th className="p-3.5">SETUP MODEL</th>
                <th className="p-3.5 text-right">RISK %</th>
                <th className="p-3.5 text-right">R:R</th>
                <th className="p-3.5 text-right">NET P&L</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-zinc-400 font-mono">
                    No executions match the active filters.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => {
                  const isWin = trade.status === "WIN";
                  return (
                    <tr
                      key={trade.id}
                      className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                      onClick={() => setSelectedTrade(trade)}
                    >
                      <td className="p-3.5 font-mono text-zinc-400 whitespace-nowrap">
                        {new Date(trade.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="p-3.5 font-mono font-bold text-white whitespace-nowrap">
                        {trade.pair}
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            trade.direction === "LONG"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {trade.direction}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-zinc-400 whitespace-nowrap">
                        {trade.session.replace("_", " ")}
                      </td>

                      <td className="p-3.5 font-mono text-zinc-300 whitespace-nowrap">
                        {trade.setup.replace("_", " ")}
                      </td>

                      <td className="p-3.5 font-mono text-zinc-400 text-right">
                        {trade.riskPercentage}%
                      </td>

                      <td className="p-3.5 font-mono font-bold text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            trade.rMultiple && trade.rMultiple > 0
                              ? "text-emerald-400 bg-emerald-500/15"
                              : trade.rMultiple && trade.rMultiple < 0
                              ? "text-red-400 bg-red-500/15"
                              : "text-zinc-400"
                          }`}
                        >
                          {trade.rMultiple && trade.rMultiple > 0 ? "+" : ""}
                          {trade.rMultiple?.toFixed(2)}R
                        </span>
                      </td>

                      <td className="p-3.5 font-mono font-black text-right whitespace-nowrap">
                        <span
                          className={
                            isWin
                              ? "text-emerald-400"
                              : trade.status === "LOSS"
                              ? "text-red-400"
                              : "text-white"
                          }
                        >
                          {trade.netPnL !== undefined
                            ? `${trade.netPnL >= 0 ? "+" : ""}$${trade.netPnL.toLocaleString()}`
                            : "-"}
                        </span>
                      </td>

                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            trade.status === "WIN"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : trade.status === "LOSS"
                              ? "bg-red-500/20 text-red-300 border border-red-500/40"
                              : trade.status === "BREAKEVEN"
                              ? "bg-white/10 text-zinc-200 border border-white/20"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          }`}
                        >
                          {trade.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedTrade(trade)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            title="View Full Execution"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(trade)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete ${trade.pair} execution?`)) {
                                deleteTrade(trade.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Trade Modals */}
      <TradeModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setTradeToEdit(null);
        }}
        tradeToEdit={tradeToEdit}
      />

      <TradeDetailModal
        trade={selectedTrade}
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        onEdit={(trade) => handleEdit(trade)}
      />
    </div>
  );
}
