"use client";

import React, { useState } from "react";
import { Trade } from "@/lib/types";
import { GlassCard } from "../glass/GlassCard";
import { GlowBadge } from "../glass/GlowBadge";
import { GlassButton } from "../glass/GlassButton";
import { useTrades } from "@/context/TradeContext";
import {
  Search,
  ArrowUpDown,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface TradeTableProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onOpenImportModal: () => void;
}

export function TradeTable({
  trades,
  onSelectTrade,
  onEditTrade,
  onOpenImportModal,
}: TradeTableProps) {
  const { deleteTrade, filters, setFilters, exportToCSV, resetSampleData } = useTrades();
  const [sortField, setSortField] = useState<keyof Trade>("entryDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedTrades = [...trades].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === "string") {
      return sortOrder === "asc"
        ? (aVal as string).localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal as string);
    }
    if (typeof aVal === "number") {
      return sortOrder === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    }
    return 0;
  });

  return (
    <GlassCard className="p-5 sm:p-6 bg-black/85 backdrop-blur-2xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-wide">
              EXECUTION LOGS & PLAYBOOK
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              {sortedTrades.length} Trades Filtered
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Institutional journal entries, multi-timeframe setups, mistake tracking, and execution metrics.
          </p>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <GlassButton
            variant="outline"
            size="sm"
            onClick={onOpenImportModal}
            icon={<Upload className="w-3.5 h-3.5 text-zinc-300" />}
          >
            Import CSV
          </GlassButton>

          <GlassButton
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            icon={<Download className="w-3.5 h-3.5 text-zinc-300" />}
          >
            Export CSV
          </GlassButton>

          <GlassButton
            variant="ghost"
            size="sm"
            onClick={resetSampleData}
            icon={<RotateCcw className="w-3.5 h-3.5 text-zinc-400" />}
            title="Reset sample trades"
          >
            Reset
          </GlassButton>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
        {/* Search Ticker */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.ticker || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, ticker: e.target.value }))}
            placeholder="Search symbol (NAS100)"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
          />
        </div>

        {/* Asset Class Filter */}
        <select
          value={filters.assetClass || "ALL"}
          onChange={(e) => setFilters((prev) => ({ ...prev, assetClass: e.target.value as any }))}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Asset Classes</option>
          <option value="Indices">Indices</option>
          <option value="Forex">Forex</option>
          <option value="Crypto">Crypto</option>
          <option value="Commodities">Commodities</option>
        </select>

        {/* Direction Filter */}
        <select
          value={filters.direction || "ALL"}
          onChange={(e) => setFilters((prev) => ({ ...prev, direction: e.target.value as any }))}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Directions</option>
          <option value="LONG">Long Only</option>
          <option value="SHORT">Short Only</option>
        </select>

        {/* Setup Filter */}
        <select
          value={filters.setup || "ALL"}
          onChange={(e) => setFilters((prev) => ({ ...prev, setup: e.target.value }))}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Setups</option>
          <option value="Fair Value Gap">Fair Value Gap (FVG)</option>
          <option value="Liquidity Sweep">Liquidity Sweep</option>
          <option value="Order Block Bounce">Order Block Bounce</option>
          <option value="Breakout & Retest">Breakout & Retest</option>
        </select>

        {/* Session Filter */}
        <select
          value={filters.session || "ALL"}
          onChange={(e) => setFilters((prev) => ({ ...prev, session: e.target.value as any }))}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Sessions</option>
          <option value="London">London (08:00 - 16:00 GMT)</option>
          <option value="New York">New York (13:00 - 21:00 GMT)</option>
          <option value="Asia / Tokyo">Asia / Tokyo (00:00 - 08:00 GMT)</option>
          <option value="London/NY Overlap">London/NY Overlap</option>
        </select>

        {/* Outcome Filter */}
        <select
          value={filters.outcome || "ALL"}
          onChange={(e) => setFilters((prev) => ({ ...prev, outcome: e.target.value as any }))}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Outcomes</option>
          <option value="WIN">Winners Only (+P&L)</option>
          <option value="LOSS">Losses Only (-P&L)</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar border border-white/10 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              <th
                onClick={() => handleSort("entryDate")}
                className="p-3 font-semibold cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>DATE & TIME</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort("ticker")}
                className="p-3 font-semibold cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>SYMBOL</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 font-semibold">DIR</th>
              <th className="p-3 font-semibold">SETUP & STRATEGY</th>
              <th
                onClick={() => handleSort("netPnL")}
                className="p-3 font-semibold cursor-pointer hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>NET P&L ($)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort("rMultiple")}
                className="p-3 font-semibold cursor-pointer hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>R:R</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3 font-semibold">MISTAKE TAGS</th>
              <th className="p-3 font-semibold">SESSION</th>
              <th className="p-3 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedTrades.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-zinc-400">
                  No trades match the current filter criteria.
                </td>
              </tr>
            ) : (
              sortedTrades.map((trade) => {
                const isWin = trade.netPnL >= 0;
                return (
                  <tr
                    key={trade.id}
                    className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                    onClick={() => onSelectTrade(trade)}
                  >
                    {/* Date */}
                    <td className="p-3 font-mono text-zinc-300 whitespace-nowrap">
                      {trade.entryDate}
                    </td>

                    {/* Symbol */}
                    <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{trade.ticker}</span>
                        <span className="text-[10px] font-normal text-zinc-400">
                          {trade.timeframe || "5m"}
                        </span>
                      </div>
                    </td>

                    {/* Direction */}
                    <td className="p-3 whitespace-nowrap">
                      <GlowBadge
                        variant={trade.direction === "LONG" ? "emerald" : "rose"}
                        size="sm"
                      >
                        {trade.direction}
                      </GlowBadge>
                    </td>

                    {/* Setup & Strategy */}
                    <td className="p-3 whitespace-nowrap">
                      <div>
                        <span className="font-semibold text-zinc-200 block">
                          {trade.setup || "Standard"}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          {trade.strategy || "Manual"}
                        </span>
                      </div>
                    </td>

                    {/* Net P&L */}
                    <td className="p-3 text-right font-mono font-bold whitespace-nowrap">
                      <span className={`text-sm ${isWin ? "text-emerald-400" : "text-red-400"}`}>
                        {isWin ? "+" : ""}${trade.netPnL.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* R Multiple */}
                    <td className="p-3 text-right font-mono font-semibold whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          trade.rMultiple > 0
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-400/30"
                            : "bg-red-500/15 text-red-400 border border-red-400/30"
                        }`}
                      >
                        {trade.rMultiple > 0 ? "+" : ""}
                        {trade.rMultiple?.toFixed(2)}R
                      </span>
                    </td>

                    {/* Mistake Tags */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {trade.mistakeTags && trade.mistakeTags.length > 0 ? (
                          trade.mistakeTags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-mono flex items-center gap-1"
                            >
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-white" /> Disciplined
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Session */}
                    <td className="p-3 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                      {trade.session}
                    </td>

                    {/* Actions */}
                    <td
                      className="p-3 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectTrade(trade)}
                          title="View Trade Deep-Dive"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditTrade(trade)}
                          title="Edit Trade"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTrade(trade.id)}
                          title="Delete Trade"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
    </GlassCard>
  );
}
