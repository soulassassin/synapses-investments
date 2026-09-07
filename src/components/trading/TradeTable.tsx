"use client";

import React, { useState, useMemo } from "react";
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
  Camera,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  PlusCircle,
  Radio,
  BookOpen,
} from "lucide-react";

interface TradeTableProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onEditTrade: (trade: Trade) => void;
  onOpenImportModal: () => void;
  onOpenLogModal?: () => void;
  onOpenAccountModal?: () => void;
}

export function TradeTable({
  trades,
  onSelectTrade,
  onEditTrade,
  onOpenImportModal,
  onOpenLogModal,
  onOpenAccountModal,
}: TradeTableProps) {
  const {
    deleteTrade,
    filters,
    setFilters,
    exportToCSV,
    resetSampleData,
    playbookStrategies,
    brokerAccounts,
  } = useTrades();

  const [sortField, setSortField] = useState<keyof Trade>("entryDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection state for bulk operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [quickPreset, setQuickPreset] = useState<"ALL" | "WINS" | "LOSSES" | "HIGH_R" | "DISCIPLINED" | "MISTAKES">("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
    }
  };

  // Apply quick preset filter on top of base trades
  const presetFilteredTrades = useMemo(() => {
    if (quickPreset === "WINS") return trades.filter((t) => t.netPnL > 0);
    if (quickPreset === "LOSSES") return trades.filter((t) => t.netPnL < 0);
    if (quickPreset === "HIGH_R") return trades.filter((t) => (t.rMultiple || 0) >= 2.0);
    if (quickPreset === "DISCIPLINED") return trades.filter((t) => !t.mistakeTags || t.mistakeTags.length === 0);
    if (quickPreset === "MISTAKES") return trades.filter((t) => t.mistakeTags && t.mistakeTags.length > 0);
    return trades;
  }, [trades, quickPreset]);

  const sortedTrades = useMemo(() => {
    return [...presetFilteredTrades].sort((a, b) => {
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
  }, [presetFilteredTrades, sortField, sortOrder]);

  // Paginated trades
  const totalPages = pageSize === 0 ? 1 : Math.ceil(sortedTrades.length / pageSize) || 1;
  const paginatedTrades = useMemo(() => {
    if (pageSize === 0) return sortedTrades;
    const start = (currentPage - 1) * pageSize;
    return sortedTrades.slice(start, start + pageSize);
  }, [sortedTrades, currentPage, pageSize]);

  // Keyboard navigation handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing inside an input/textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      } else if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, paginatedTrades.length - 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        if (focusedIndex >= 0 && focusedIndex < paginatedTrades.length) {
          e.preventDefault();
          onSelectTrade(paginatedTrades[focusedIndex]);
        }
      } else if (e.key === "e") {
        if (focusedIndex >= 0 && focusedIndex < paginatedTrades.length) {
          e.preventDefault();
          onEditTrade(paginatedTrades[focusedIndex]);
        }
      } else if (e.key === "x" || e.key === "s") {
        if (focusedIndex >= 0 && focusedIndex < paginatedTrades.length) {
          e.preventDefault();
          toggleSelect(paginatedTrades[focusedIndex].id);
        }
      } else if (e.key === "Escape") {
        setFocusedIndex(-1);
        setShowShortcutsModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginatedTrades, focusedIndex, onSelectTrade, onEditTrade]);

  // Toggle single selection
  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle Select All on current page
  const allCurrentSelected = paginatedTrades.length > 0 && paginatedTrades.every((t) => selectedIds.has(t.id));
  const toggleSelectAllCurrent = () => {
    if (allCurrentSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedTrades.forEach((t) => next.delete(t.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginatedTrades.forEach((t) => next.add(t.id));
        return next;
      });
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} execution records?`)) {
      selectedIds.forEach((id) => deleteTrade(id));
      setSelectedIds(new Set());
    }
  };

  // Bulk Export Selected
  const handleBulkExportSelected = () => {
    const selectedList = trades.filter((t) => selectedIds.has(t.id));
    if (selectedList.length === 0) return;

    const headers = [
      "ID",
      "Ticker",
      "AssetClass",
      "Direction",
      "EntryDate",
      "ExitDate",
      "Session",
      "EntryPrice",
      "ExitPrice",
      "StopLoss",
      "TakeProfit",
      "PositionSize",
      "GrossPnL",
      "NetPnL",
      "Commission",
      "Swap",
      "RMultiple",
      "Strategy",
      "Setup",
      "MistakeTags",
      "Account",
    ];

    const rows = selectedList.map((t) => [
      t.id,
      t.ticker,
      t.assetClass,
      t.direction,
      t.entryDate,
      t.exitDate,
      t.session,
      t.entryPrice,
      t.exitPrice,
      t.stopLoss,
      t.takeProfit || "",
      t.positionSize,
      t.grossPnL,
      t.netPnL,
      t.commission || 0,
      t.swap || 0,
      t.rMultiple || 0,
      `"${t.strategy || ""}"`,
      `"${t.setup || ""}"`,
      `"${(t.mistakeTags || []).join(";")}"`,
      `"${t.account || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `synapses_selected_${selectedIds.size}_trades_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlassCard className="p-5 sm:p-6 bg-black/85 backdrop-blur-2xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white tracking-wide font-mono">
              EXECUTION LOGS & PLAYBOOK MATRIX
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              {sortedTrades.length} Trades
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Institutional journal entries, multi-timeframe setups, mistake tracking, and execution metrics.
          </p>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Keyboard Shortcuts Trigger */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            title="View keyboard shortcut navigation commands"
          >
            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-bold text-white">?</span>
            <span>Shortcuts</span>
          </button>

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
            Export All CSV
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

      {/* Quick Preset Filter Chips Strip */}
      <div className="flex items-center gap-2 mb-3.5 overflow-x-auto custom-scrollbar pb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 whitespace-nowrap mr-1">
          Quick Filters:
        </span>
        {[
          { id: "ALL", label: "All Executions", count: trades.length },
          { id: "WINS", label: "Winners Only (+P&L)", count: trades.filter((t) => t.netPnL > 0).length, color: "text-emerald-400" },
          { id: "LOSSES", label: "Losses Only (-P&L)", count: trades.filter((t) => t.netPnL < 0).length, color: "text-red-400" },
          { id: "HIGH_R", label: "High R (>2R)", count: trades.filter((t) => (t.rMultiple || 0) >= 2.0).length, color: "text-cyan-400" },
          { id: "DISCIPLINED", label: "Disciplined (0 Errors)", count: trades.filter((t) => !t.mistakeTags || t.mistakeTags.length === 0).length, color: "text-emerald-400" },
          { id: "MISTAKES", label: "Flagged Mistakes", count: trades.filter((t) => t.mistakeTags && t.mistakeTags.length > 0).length, color: "text-amber-400" },
        ].map((chip) => {
          const isActive = quickPreset === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => {
                setQuickPreset(chip.id as any);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.03] text-zinc-400 border border-white/10 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  isActive ? "bg-black/20 text-black font-black" : "bg-white/5 text-zinc-400"
                }`}
              >
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/10">
        {/* Search Ticker */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.ticker || ""}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, ticker: e.target.value }));
              setCurrentPage(1);
            }}
            placeholder="Search symbol (NAS100)"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
          />
        </div>

        {/* Asset Class Filter */}
        <select
          value={filters.assetClass || "ALL"}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, assetClass: e.target.value as any }));
            setCurrentPage(1);
          }}
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
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, direction: e.target.value as any }));
            setCurrentPage(1);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Directions</option>
          <option value="LONG">Long Only</option>
          <option value="SHORT">Short Only</option>
        </select>

        {/* Strategy / Setup Filter */}
        <select
          value={filters.strategy || "ALL"}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, strategy: e.target.value }));
            setCurrentPage(1);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Strategies</option>
          {(playbookStrategies || []).map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Session Filter */}
        <select
          value={filters.session || "ALL"}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, session: e.target.value as any }));
            setCurrentPage(1);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Sessions</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Asia / Tokyo">Asia / Tokyo</option>
          <option value="London/NY Overlap">London/NY Overlap</option>
        </select>

        {/* Outcome Filter */}
        <select
          value={filters.outcome || "ALL"}
          onChange={(e) => {
            setFilters((prev) => ({ ...prev, outcome: e.target.value as any }));
            setCurrentPage(1);
          }}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-white/50"
        >
          <option value="ALL">All Outcomes</option>
          <option value="WIN">Winners Only (+P&L)</option>
          <option value="LOSS">Losses Only (-P&L)</option>
        </select>
      </div>

      {/* Bulk Action Strip (Appears when 1+ rows selected) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-2.5 mb-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">{selectedIds.size} execution records selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkExportSelected}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected CSV</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected</span>
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-2 py-1 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar border border-white/10 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              {/* Checkbox */}
              <th className="p-3 w-10 text-center">
                <button
                  onClick={toggleSelectAllCurrent}
                  className="text-zinc-400 hover:text-white"
                  title={allCurrentSelected ? "Deselect page" : "Select all on page"}
                >
                  {allCurrentSelected ? (
                    <CheckSquare className="w-4 h-4 text-white" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
              </th>
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
              <th className="p-3 font-semibold">ACCOUNT & SESSION</th>
              <th className="p-3 font-semibold text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedTrades.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-12 text-center">
                  {trades.length === 0 ? (
                    <div className="max-w-md mx-auto space-y-4 py-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center mx-auto text-white shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                        <BookOpen className="w-7 h-7 text-zinc-300" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase block mb-1">
                          QUANTITATIVE JOURNAL • CLEAN SLATE
                        </span>
                        <h4 className="text-base font-bold font-mono text-white tracking-wider uppercase">
                          Zero Trades Currently Logged
                        </h4>
                        <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
                          Your execution vault is 100% clean of mock data. Connect an actual broker/prop firm, import your statement, or log your first setup.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                        {onOpenLogModal && (
                          <button
                            type="button"
                            onClick={onOpenLogModal}
                            className="px-4 py-2 rounded-xl bg-white text-black font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-zinc-200 transition-all cursor-pointer"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Log First Trade</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={onOpenImportModal}
                          className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-zinc-300" />
                          <span>Import Statement (.CSV)</span>
                        </button>
                        {onOpenAccountModal && (
                          <button
                            type="button"
                            onClick={onOpenAccountModal}
                            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Radio className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Connect Broker Account</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <p className="text-xs font-mono text-zinc-400">
                        No trades match the active filter criteria.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({
                            ticker: "",
                            assetClass: "ALL",
                            direction: "ALL",
                            strategy: "ALL",
                            setup: "ALL",
                            session: "ALL",
                            mistakeTag: "ALL",
                            outcome: "ALL",
                          })
                        }
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              paginatedTrades.map((trade, idx) => {
                const isWin = trade.netPnL >= 0;
                const isSelected = selectedIds.has(trade.id);
                const isFocused = focusedIndex === idx;
                const hasScreenshot = (trade.chartScreenshots && trade.chartScreenshots.length > 0) || trade.chartScreenshot;

                return (
                  <tr
                    key={trade.id}
                    className={`transition-all duration-150 group cursor-pointer ${
                      isSelected
                        ? "bg-white/[0.08] ring-1 ring-white/20"
                        : isFocused
                        ? "bg-cyan-500/10 ring-1 ring-cyan-400/40"
                        : "hover:bg-white/[0.04]"
                    }`}
                    onClick={() => {
                      setFocusedIndex(idx);
                      onSelectTrade(trade);
                    }}
                  >
                    {/* Checkbox */}
                    <td
                      className="p-3 text-center"
                      onClick={(e) => toggleSelect(trade.id, e)}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-3 font-mono text-zinc-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{trade.entryDate}</span>
                        {hasScreenshot && (
                          <span title="Screenshot attached">
                            <Camera className="w-3 h-3 text-cyan-400" />
                          </span>
                        )}
                      </div>
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

                    {/* Account & Session */}
                    <td className="p-3 font-mono text-zinc-400 text-[11px] whitespace-nowrap">
                      <span className="block text-zinc-300">{trade.account || "Apex 100K"}</span>
                      <span className="text-zinc-500 text-[10px]">{trade.session}</span>
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

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded bg-black/60 border border-white/10 text-white focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={0}>All ({sortedTrades.length})</option>
          </select>
          <span className="text-zinc-500">
            Showing {sortedTrades.length === 0 ? 0 : (currentPage - 1) * (pageSize || sortedTrades.length) + 1} -{" "}
            {pageSize === 0 ? sortedTrades.length : Math.min(currentPage * pageSize, sortedTrades.length)} of {sortedTrades.length}
          </span>
        </div>

        {pageSize > 0 && totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-white/10 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-white font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-white/10 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Helper Modal */}
      {showShortcutsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#0B0B10] border border-white/20 p-6 space-y-4 shadow-[0_20px_60px_rgba(0,0,0,0.95)] font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-white/10 text-xs font-bold text-white">⌨</span>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  KEYBOARD EXECUTION SHORTCUTS
                </h4>
              </div>
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { keys: ["j", "↓"], desc: "Move focus down to next trade execution row" },
                { keys: ["k", "↑"], desc: "Move focus up to previous trade execution row" },
                { keys: ["Enter", "Space"], desc: "Open full Deep-Dive Trade Inspector" },
                { keys: ["e"], desc: "Edit focused trade execution parameters" },
                { keys: ["x", "s"], desc: "Toggle selection checkbox on focused row" },
                { keys: ["Esc"], desc: "Clear focused row / close inspector modal" },
                { keys: ["?"], desc: "Toggle this Keyboard Shortcuts legend" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-1.5">
                    {item.keys.map((k) => (
                      <kbd key={k} className="px-2 py-0.5 rounded bg-white/10 text-white font-bold text-[11px] border border-white/20">
                        {k}
                      </kbd>
                    ))}
                  </div>
                  <span className="text-zinc-400 text-[11px] text-right">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
