"use client";

import React, { useState } from "react";
import { useTrades } from "@/context/TradeContext";
import { Trade } from "@/lib/types";
import {
  BookOpen,
  PlusCircle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Table,
  Search,
  Calendar as CalendarIcon,
  Layers,
  Award,
  Percent,
  Zap,
  ShieldAlert,
  Brain,
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassModal } from "@/components/glass/GlassModal";
import { TradeTable } from "@/components/trading/TradeTable";
import { TradeLogModal } from "@/components/trading/TradeLogModal";
import { TradeDetailModal } from "@/components/trading/TradeDetailModal";
import { CSVImportModal } from "@/components/trading/CSVImportModal";
import { SpotDMAQuickEntry } from "@/components/journal/SpotDMAQuickEntry";
import { JournalCalendarView } from "@/components/journal/JournalCalendarView";
import { JournalPlaybookView } from "@/components/journal/JournalPlaybookView";
import { JournalMistakeAuditor } from "@/components/journal/JournalMistakeAuditor";
import { JournalAnalyticsView } from "@/components/journal/JournalAnalyticsView";

type JournalViewMode = "MATRIX" | "CALENDAR" | "PLAYBOOK" | "PSYCHOLOGY" | "ANALYTICS";

export default function JournalPage() {
  const {
    trades,
    filteredTrades,
    currentMetrics,
    deleteTrade,
    exportToCSV,
    resetSampleData,
    brokerAccounts,
    selectedAccount,
    setSelectedAccount,
    connectBroker,
  } = useTrades();

  // Active View Tab State (default to MATRIX for daily execution workflow)
  const [viewMode, setViewMode] = useState<JournalViewMode>("MATRIX");
  const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(true);

  // Modals state
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConnectAccountOpen, setIsConnectAccountOpen] = useState(false);
  const [newBrokerPlatform, setNewBrokerPlatform] = useState<any>("MetaTrader 5");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");

  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(null);
    setTradeToEdit(trade);
    setIsLogModalOpen(true);
  };

  const handleConnectNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;
    connectBroker(newBrokerPlatform, newAccountName.trim(), newAccountNumber.trim());
    setSelectedAccount(newAccountName.trim());
    setIsConnectAccountOpen(false);
    setNewAccountName("");
    setNewAccountNumber("");
  };

  const winRate = currentMetrics.winRate || 0;
  const netPnL = currentMetrics.netPnL || 0;
  const profitFactor = currentMetrics.profitFactor || 1;
  const disciplineScore = currentMetrics.disciplineScore ?? 92;
  const maxDD = currentMetrics.maxDrawdownAmount || 0;

  // Calculate cumulative net R
  const cumulativeR = Number(
    trades.reduce((acc, t) => acc + (t.rMultiple || 0), 0).toFixed(2)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 1. TOP CONTROL BAR & FAST ACTIONS */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-black/85 border border-white/10 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider font-mono uppercase">
              QUANTITATIVE EXECUTION JOURNAL & PLAYBOOK
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-mono text-zinc-400">
            <span>Zero-G Execution Black Box • Encrypted Local Vault</span>
            <span className="text-zinc-600">•</span>
            {/* Active Account Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Filtering: <strong className="text-white">{selectedAccount === "ALL" ? "All Accounts Combined" : selectedAccount}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Multi-Account Selector */}
          <div className="relative">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/20 text-xs font-mono font-bold text-white focus:outline-none focus:border-white/50 cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-950 text-white">ALL Accounts ({trades.length} Trades)</option>
              {(brokerAccounts || []).map((acc) => (
                <option key={acc.id} value={acc.name} className="bg-zinc-950 text-white">
                  {acc.name} ({acc.platform})
                </option>
              ))}
            </select>
          </div>

          {/* Connect Account Button */}
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => setIsConnectAccountOpen(true)}
            icon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
            title="Connect a new broker or prop firm account"
          >
            + Account
          </GlassButton>

          {/* Toggle Spot DMA Quick Entry */}
          <button
            onClick={() => setIsQuickEntryOpen(!isQuickEntryOpen)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              isQuickEntryOpen
                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                : "bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spot DMA Order</span>
            {isQuickEntryOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Import CSV */}
          <GlassButton
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            icon={<Upload className="w-3.5 h-3.5 text-zinc-300" />}
          >
            Import CSV
          </GlassButton>

          {/* Export CSV */}
          <GlassButton
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            icon={<Download className="w-3.5 h-3.5 text-zinc-300" />}
          >
            Export CSV
          </GlassButton>

          {/* Reset Sample Data */}
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={resetSampleData}
            icon={<RotateCcw className="w-3.5 h-3.5 text-zinc-400" />}
            title="Reset to standard institutional sample trades"
          >
            Reset
          </GlassButton>

          {/* Primary High-Contrast + LOG NEW EXECUTION Button */}
          <button
            onClick={() => {
              setTradeToEdit(null);
              setIsLogModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs sm:text-sm font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:bg-zinc-100 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer shrink-0 border border-white"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>+ LOG EXECUTION</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SPOT DMA FAST ORDER ENTRY STRIP (COLLAPSIBLE) */}
      {/* ========================================================================= */}
      {isQuickEntryOpen && (
        <SpotDMAQuickEntry
          onTradeLogged={() => {
            // Optional callback
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. CORE TELEMETRY KPI STATS RIBBON (6 TILES) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Trades */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">TOTAL TRADES</span>
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <span className="text-2xl font-black font-mono text-white">{trades.length}</span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Logged Executions</span>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">WIN RATE</span>
            <Percent className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-2xl font-black font-mono text-emerald-400">{winRate}%</span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">
            {currentMetrics.winningTrades || 0}W / {currentMetrics.losingTrades || 0}L
          </span>
        </div>

        {/* Cumulative R */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">CUMULATIVE R</span>
            <Award className="w-3.5 h-3.5 text-white" />
          </div>
          <span className={`text-2xl font-black font-mono ${cumulativeR >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {cumulativeR >= 0 ? "+" : ""}{cumulativeR}R
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Realized Multiples</span>
        </div>

        {/* Realized Net P&L */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">NET REALIZED</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className={`text-2xl font-black font-mono ${netPnL >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {netPnL >= 0 ? "+" : ""}${netPnL.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Total P&L ($)</span>
        </div>

        {/* Profit Factor */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">PROFIT FACTOR</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-2xl font-black font-mono text-white">
            {profitFactor > 50 ? "∞" : profitFactor.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Gross Win / Loss</span>
        </div>

        {/* Discipline Score */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">DISCIPLINE</span>
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-2xl font-black font-mono text-cyan-400">{disciplineScore}%</span>
          <span className="text-[10px] font-mono text-zinc-500 mt-1">Rule Integrity</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RANKED USAGE WORKSPACE NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/80 border border-white/10 overflow-x-auto custom-scrollbar">
        {/* Tier 1: Execution Matrix */}
        <button
          onClick={() => setViewMode("MATRIX")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === "MATRIX"
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.35)]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Execution Matrix (Table)</span>
          <span className={`px-1.5 py-0.2 text-[10px] rounded ${viewMode === "MATRIX" ? "bg-black/20 text-black font-black" : "bg-white/10 text-zinc-400"}`}>
            {filteredTrades.length}
          </span>
        </button>

        {/* Tier 2: PnL Calendar */}
        <button
          onClick={() => setViewMode("CALENDAR")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === "CALENDAR"
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.35)]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>PnL Calendar & Heatmap</span>
        </button>

        {/* Tier 3: Visual Playbook */}
        <button
          onClick={() => setViewMode("PLAYBOOK")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === "PLAYBOOK"
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.35)]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Visual Playbook & Vault</span>
        </button>

        {/* Tier 4: Psychology & Mistake Auditor */}
        <button
          onClick={() => setViewMode("PSYCHOLOGY")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === "PSYCHOLOGY"
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.35)]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <Brain className="w-4 h-4 text-cyan-400" />
          <span>Mistakes & Psychology</span>
        </button>

        {/* Tier 5: Session & Setup Analytics */}
        <button
          onClick={() => setViewMode("ANALYTICS")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            viewMode === "ANALYTICS"
              ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.35)]"
              : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Quant Analytics</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. ACTIVE TAB WORKSPACE CONTENT */}
      {/* ========================================================================= */}
      {viewMode === "MATRIX" && (
        <TradeTable
          trades={filteredTrades}
          onSelectTrade={(trade) => setSelectedTrade(trade)}
          onEditTrade={(trade) => handleEditTrade(trade)}
          onOpenImportModal={() => setIsImportModalOpen(true)}
        />
      )}

      {viewMode === "CALENDAR" && (
        <JournalCalendarView
          trades={trades}
          onSelectTrade={(trade) => setSelectedTrade(trade)}
          onEditTrade={(trade) => handleEditTrade(trade)}
        />
      )}

      {viewMode === "PLAYBOOK" && (
        <JournalPlaybookView
          trades={filteredTrades}
          onSelectTrade={(trade) => setSelectedTrade(trade)}
          onEditTrade={(trade) => handleEditTrade(trade)}
          onDeleteTrade={(id) => deleteTrade(id)}
        />
      )}

      {viewMode === "PSYCHOLOGY" && (
        <JournalMistakeAuditor
          trades={trades}
          onSelectTrade={(trade) => setSelectedTrade(trade)}
        />
      )}

      {viewMode === "ANALYTICS" && (
        <JournalAnalyticsView
          trades={trades}
        />
      )}

      {/* ========================================================================= */}
      {/* 6. ROOT MODALS MOUNTED */}
      {/* ========================================================================= */}
      {/* Trade Detail Inspector Modal */}
      <TradeDetailModal
        trade={selectedTrade}
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        onEdit={(trade) => handleEditTrade(trade)}
      />

      {/* Trade Log / Edit Modal */}
      <TradeLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setTradeToEdit(null);
        }}
        tradeToEdit={tradeToEdit}
      />

      {/* CSV Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      {/* Connect Broker / Prop Account Modal */}
      <GlassModal
        isOpen={isConnectAccountOpen}
        onClose={() => setIsConnectAccountOpen(false)}
        title="Connect Broker / Prop Firm Account"
        subtitle="Add a dedicated execution account to isolate telemetry, risk guardrails, and metrics"
        maxWidth="md"
      >
        <form onSubmit={handleConnectNewAccount} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">
              Trading Platform / Protocol
            </label>
            <select
              value={newBrokerPlatform}
              onChange={(e) => setNewBrokerPlatform(e.target.value as any)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono text-white bg-black/60 border border-white/20"
            >
              <option value="MetaTrader 5">MetaTrader 5 (MT5)</option>
              <option value="MetaTrader 4">MetaTrader 4 (MT4)</option>
              <option value="cTrader">cTrader FIX API</option>
              <option value="Interactive Brokers">Interactive Brokers (IBKR)</option>
              <option value="NinjaTrader">NinjaTrader 8</option>
              <option value="Tradeovate">Tradovate REST/WS</option>
              <option value="Custom Sync">Custom Manual Vault</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">
              Account Display Name (e.g. Apex 100K Funded)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Topstep 50K Express #1"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono text-white bg-black/60 border border-white/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1">
              Login ID / Account Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 5109842"
              value={newAccountNumber}
              onChange={(e) => setNewAccountNumber(e.target.value)}
              className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono text-white bg-black/60 border border-white/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <GlassButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConnectAccountOpen(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="pill" size="sm">
              Connect Account
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
