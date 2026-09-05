"use client";

import React, { useState, useMemo } from "react";
import { Trade, PlaybookStrategy } from "@/lib/types";
import { useTrades } from "@/context/TradeContext";
import {
  LayoutGrid,
  Filter,
  Eye,
  Maximize2,
  Calendar,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Percent,
  Award,
  Zap,
  Tag,
  CheckCircle2,
  X,
  Layers,
  Edit,
  Trash2,
  Plus,
  BookOpen,
  Sliders,
  Check,
} from "lucide-react";
import { GlassModal } from "@/components/glass/GlassModal";
import { GlassButton } from "@/components/glass/GlassButton";

interface JournalPlaybookViewProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onEditTrade?: (trade: Trade) => void;
  onDeleteTrade?: (id: string) => void;
}

export function JournalPlaybookView({
  trades,
  onSelectTrade,
  onEditTrade,
  onDeleteTrade,
}: JournalPlaybookViewProps) {
  const {
    playbookStrategies,
    addPlaybookStrategy,
    updatePlaybookStrategy,
    deletePlaybookStrategy,
  } = useTrades();

  const [selectedSetup, setSelectedSetup] = useState("ALL");
  const [zoomedChartTrade, setZoomedChartTrade] = useState<Trade | null>(null);
  const [subView, setSubView] = useState<"EXECUTIONS" | "STRATEGIES">("EXECUTIONS");

  // Custom Strategy Modal State
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [strategyToEdit, setStrategyToEdit] = useState<PlaybookStrategy | null>(null);
  const [stratName, setStratName] = useState("");
  const [stratDesc, setStratDesc] = useState("");
  const [stratCategory, setStratCategory] = useState("Breakout");
  const [stratTargetRR, setStratTargetRR] = useState<number>(3.0);
  const [stratRules, setStratRules] = useState<string>("");
  const [stratTags, setStratTags] = useState<string>("");

  const handleOpenCreateStrategy = () => {
    setStrategyToEdit(null);
    setStratName("");
    setStratDesc("");
    setStratCategory("Breakout");
    setStratTargetRR(3.0);
    setStratRules("1. Confirm higher timeframe market structure bias\n2. Wait for volatility expansion & clean liquidity purge\n3. Defined stop loss with risk strictly ≤ 1.0%");
    setStratTags("Order Flow, Breakout, Morning Session");
    setIsStrategyModalOpen(true);
  };

  const handleOpenEditStrategy = (strat: PlaybookStrategy) => {
    setStrategyToEdit(strat);
    setStratName(strat.name);
    setStratDesc(strat.description);
    setStratCategory(strat.setupCategory || "Breakout");
    setStratTargetRR(strat.targetRR || 3.0);
    setStratRules((strat.rules || []).join("\n"));
    setStratTags((strat.confluenceTags || []).join(", "));
    setIsStrategyModalOpen(true);
  };

  const handleSaveStrategy = () => {
    if (!stratName.trim()) return;

    const rulesArray = stratRules
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const tagsArray = stratTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (strategyToEdit) {
      updatePlaybookStrategy(strategyToEdit.id, {
        name: stratName.trim(),
        description: stratDesc.trim(),
        setupCategory: stratCategory,
        targetRR: stratTargetRR,
        rules: rulesArray,
        confluenceTags: tagsArray,
      });
    } else {
      addPlaybookStrategy({
        name: stratName.trim(),
        description: stratDesc.trim(),
        setupCategory: stratCategory,
        targetRR: stratTargetRR,
        rules: rulesArray,
        confluenceTags: tagsArray,
        timeframes: ["5m", "15m"],
      });
    }

    setIsStrategyModalOpen(false);
  };

  // Filter trades based on setup
  const filteredPlaybookTrades = useMemo(() => {
    if (selectedSetup === "ALL") return trades;
    return trades.filter((t) => {
      const s = (t.setup || "").toLowerCase();
      const st = (t.strategy || "").toLowerCase();
      const target = selectedSetup.toLowerCase();
      return s.includes(target) || st.includes(target);
    });
  }, [trades, selectedSetup]);

  // Compute metrics for the active setup
  const setupMetrics = useMemo(() => {
    const list = filteredPlaybookTrades;
    if (list.length === 0) {
      return { total: 0, wins: 0, losses: 0, winRate: 0, totalPnL: 0, avgR: 0, profitFactor: 0 };
    }
    let wins = 0;
    let losses = 0;
    let grossProfit = 0;
    let grossLoss = 0;
    let totalPnL = 0;
    let totalR = 0;

    list.forEach((t) => {
      totalPnL += t.netPnL;
      totalR += t.rMultiple || 0;
      if (t.netPnL > 0) {
        wins += 1;
        grossProfit += t.netPnL;
      } else if (t.netPnL < 0) {
        losses += 1;
        grossLoss += Math.abs(t.netPnL);
      }
    });

    const winRate = Number(((wins / list.length) * 100).toFixed(1));
    const avgR = Number((totalR / list.length).toFixed(2));
    const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? 99.9 : 1.0) : Number((grossProfit / grossLoss).toFixed(2));

    return {
      total: list.length,
      wins,
      losses,
      winRate,
      totalPnL,
      avgR,
      profitFactor,
    };
  }, [filteredPlaybookTrades]);

  // Dynamic setup filter options from registered strategies
  const dynamicSetupOptions = useMemo(() => {
    const defaultOptions = [{ id: "ALL", label: "All Setups" }];
    const stratOptions = (playbookStrategies || []).map((s) => ({
      id: s.name,
      label: s.name,
    }));
    return [...defaultOptions, ...stratOptions];
  }, [playbookStrategies]);

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar & Subview Switcher */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black font-mono text-white tracking-wider uppercase">
                QUANTITATIVE STRATEGY PLAYBOOK & VAULT
              </h3>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Define proprietary strategy models, document execution rules, and inspect historical setup edge.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sub-view toggle */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10">
              <button
                onClick={() => setSubView("EXECUTIONS")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  subView === "EXECUTIONS"
                    ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Executions Vault
              </button>
              <button
                onClick={() => setSubView("STRATEGIES")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  subView === "STRATEGIES"
                    ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Strategy Models ({playbookStrategies.length})
              </button>
            </div>

            {/* + Create Strategy Button */}
            <button
              onClick={handleOpenCreateStrategy}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Custom Strategy</span>
            </button>
          </div>
        </div>

        {/* Dynamic Strategy Filter Pills (when in Executions view) */}
        {subView === "EXECUTIONS" && (
          <>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {dynamicSetupOptions.map((setup) => {
                const isActive = selectedSetup === setup.id;
                return (
                  <button
                    key={setup.id}
                    onClick={() => setSelectedSetup(setup.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.35)]"
                        : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {setup.label}
                  </button>
                );
              })}
            </div>

            {/* Model Statistics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">MODEL WIN RATE</span>
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {setupMetrics.winRate}%
                  </span>
                </div>
                <Percent className="w-4 h-4 text-emerald-400/50" />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">REALIZED NET P&L</span>
                  <span
                    className={`text-lg font-black font-mono ${
                      setupMetrics.totalPnL >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {setupMetrics.totalPnL >= 0 ? "+" : ""}${setupMetrics.totalPnL.toLocaleString()}
                  </span>
                </div>
                <Award className="w-4 h-4 text-white/50" />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">AVERAGE R-MULTIPLE</span>
                  <span className="text-lg font-black font-mono text-white">
                    {setupMetrics.avgR >= 0 ? "+" : ""}{setupMetrics.avgR}R
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-cyan-400/50" />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">PROFIT FACTOR</span>
                  <span className="text-lg font-black font-mono text-white">
                    {setupMetrics.profitFactor > 50 ? "∞" : setupMetrics.profitFactor.toFixed(2)}
                  </span>
                </div>
                <Zap className="w-4 h-4 text-amber-400/50" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2A. SUBVIEW: STRATEGY DEFINITIONS & RULES MANAGER */}
      {/* ========================================================================= */}
      {subView === "STRATEGIES" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              CUSTOM PLAYBOOK STRATEGIES & RULES
            </h4>
            <span className="text-xs font-mono text-zinc-500">
              {playbookStrategies.length} Active Models
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {playbookStrategies.map((strat) => (
              <div
                key={strat.id}
                className="p-5 rounded-2xl bg-black/85 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-black font-mono text-white group-hover:text-cyan-300 transition-colors">
                      {strat.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {strat.setupCategory || "Model"}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 font-sans mb-4 leading-relaxed">
                    {strat.description || "No description provided."}
                  </p>

                  {/* Rules Checklist */}
                  {strat.rules && strat.rules.length > 0 && (
                    <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                        EXECUTION RULES
                      </span>
                      {strat.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {strat.confluenceTags && strat.confluenceTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {strat.confluenceTags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-zinc-400 border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold">
                    Target: 1:{strat.targetRR} R:R
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditStrategy(strat)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                      title="Edit Strategy Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {!strat.isDefault && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete custom strategy "${strat.name}"?`)) {
                            deletePlaybookStrategy(strat.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                        title="Delete Strategy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2B. SUBVIEW: HISTORICAL EXECUTIONS GALLERY & LIGHTBOX */}
      {/* ========================================================================= */}
      {subView === "EXECUTIONS" && (
        <>
          {filteredPlaybookTrades.length === 0 ? (
            <div className="p-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 text-zinc-400 font-mono text-xs">
              No playbook executions found for &ldquo;{selectedSetup}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPlaybookTrades.map((trade) => {
                const isWin = trade.netPnL >= 0;
                const hasCustomChart = !!trade.chartScreenshot;

                return (
                  <div
                    key={trade.id}
                    onClick={() => onSelectTrade(trade)}
                    className="p-5 rounded-2xl bg-black/85 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] hover:-translate-y-1"
                  >
                    <div>
                      {/* Top Row: Symbol, Direction, Session */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black font-mono text-white group-hover:text-cyan-300 transition-colors">
                            {trade.ticker}
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
                        <span className="text-[10px] font-mono text-zinc-400">
                          {trade.session} • {trade.timeframe || "5m"}
                        </span>
                      </div>

                      {/* Chart Visualizer / Screenshot Card */}
                      <div className="mb-3.5 rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#050508] relative group/chart">
                        {hasCustomChart ? (
                          <img
                            src={trade.chartScreenshot}
                            alt="Trade Execution Chart"
                            className="w-full h-full object-cover group-hover/chart:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          /* Interactive Candlestick Visualizer */
                          <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-white/[0.03] to-transparent">
                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                              <span>SYSTEMATIC EXECUTION DELIVERY</span>
                              <span>{trade.timeframe || "5m"} SESSION</span>
                            </div>

                            {/* Candlestick graphics */}
                            <div className="flex items-center justify-around h-16 px-4">
                              <div className="w-1.5 h-8 bg-zinc-600 rounded-sm" />
                              <div className="w-1.5 h-12 bg-red-400/80 rounded-sm" />
                              <div className={`w-2 h-14 rounded-sm ${isWin ? "bg-emerald-400" : "bg-red-500"} shadow-[0_0_10px_rgba(16,185,129,0.3)]`} />
                              <div className="w-1.5 h-10 bg-emerald-400/70 rounded-sm" />
                              <div className="w-1.5 h-6 bg-zinc-500 rounded-sm" />
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
                              <span>Entry: {trade.entryPrice}</span>
                              <span>TP: {trade.takeProfit || trade.exitPrice}</span>
                            </div>
                          </div>
                        )}

                        {/* Zoom Button Overlay */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedChartTrade(trade);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white border border-white/20 opacity-0 group-hover/chart:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-mono"
                          title="Zoom Chart Lightbox"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Zoom</span>
                        </button>
                      </div>

                      {/* Realized Metrics Strip */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-400 uppercase block">NET REALIZED</span>
                          <span
                            className={`text-lg font-black font-mono ${
                              isWin ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {isWin ? "+" : ""}${trade.netPnL.toLocaleString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] font-mono text-zinc-400 uppercase block">R-MULTIPLE</span>
                          <span
                            className={`text-xs font-bold font-mono px-2 py-0.5 rounded border inline-block ${
                              trade.rMultiple >= 0
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-red-500/15 text-red-400 border-red-500/30"
                            }`}
                          >
                            {trade.rMultiple >= 0 ? "+" : ""}{trade.rMultiple?.toFixed(2)}R
                          </span>
                        </div>
                      </div>

                      {/* Setup & Confluences */}
                      <div className="space-y-1.5 text-xs font-mono mb-3">
                        <div className="flex justify-between text-zinc-400">
                          <span>Strategy / Setup:</span>
                          <span className="text-white font-semibold">{trade.strategy || trade.setup}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Stop Loss:</span>
                          <span className="text-zinc-300">{trade.stopLoss}</span>
                        </div>
                      </div>

                      {/* Notes snippet */}
                      {trade.notes && (
                        <p className="text-xs text-zinc-400 line-clamp-2 italic bg-black/40 p-2.5 rounded-lg border border-white/5 mb-3 font-sans">
                          &ldquo;{trade.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    {/* Footer: Date & Discipline Tag */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(trade.entryDate).toLocaleDateString()}
                      </span>

                      <span className="text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        {trade.emotion?.preTradeState || "Disciplined"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. HIGH-RESOLUTION CHART LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {zoomedChartTrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setZoomedChartTrade(null)}
        >
          <div
            className="w-full max-w-4xl rounded-2xl bg-[#0B0B10] border border-white/20 p-6 space-y-4 shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black font-mono text-white">
                  {zoomedChartTrade.ticker} • {zoomedChartTrade.direction}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-zinc-300">
                  {zoomedChartTrade.strategy || zoomedChartTrade.setup}
                </span>
                <span
                  className={`text-sm font-black font-mono ${
                    zoomedChartTrade.netPnL >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {zoomedChartTrade.netPnL >= 0 ? "+" : ""}${zoomedChartTrade.netPnL.toLocaleString()} ({zoomedChartTrade.rMultiple >= 0 ? "+" : ""}{zoomedChartTrade.rMultiple}R)
                </span>
              </div>

              <button
                onClick={() => setZoomedChartTrade(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res chart container */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center relative">
              {zoomedChartTrade.chartScreenshot ? (
                <img
                  src={zoomedChartTrade.chartScreenshot}
                  alt="High Res Chart"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                  <div className="text-sm font-mono font-bold text-white">
                    Quantitative {zoomedChartTrade.timeframe || "5m"} Execution Model
                  </div>
                  <p className="text-xs font-mono text-zinc-400 max-w-md mx-auto">
                    Entry: {zoomedChartTrade.entryPrice} • Stop Loss: {zoomedChartTrade.stopLoss} • Target TP: {zoomedChartTrade.takeProfit || zoomedChartTrade.exitPrice}
                  </p>
                  <p className="text-xs text-zinc-300 italic bg-white/[0.04] p-3 rounded-lg border border-white/10 max-w-lg mx-auto">
                    &ldquo;{zoomedChartTrade.notes || "Execution met all rules and parameters."}&rdquo;
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-2">
              <span>Account: {zoomedChartTrade.account || "Apex Prop 100K"}</span>
              <button
                onClick={() => {
                  onSelectTrade(zoomedChartTrade);
                  setZoomedChartTrade(null);
                }}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Full Trade Inspector</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CREATE / EDIT CUSTOM STRATEGY MODAL */}
      {/* ========================================================================= */}
      <GlassModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
        title={strategyToEdit ? `Edit Strategy: ${strategyToEdit.name}` : "Create Proprietary Strategy Model"}
        subtitle="Define custom strategy name, execution rules, setup category, and target R:R"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
              STRATEGY MODEL NAME *
            </label>
            <input
              type="text"
              value={stratName}
              onChange={(e) => setStratName(e.target.value)}
              placeholder="e.g. Volatility Compression Breakout"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                CATEGORY
              </label>
              <select
                value={stratCategory}
                onChange={(e) => setStratCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Breakout">Breakout</option>
                <option value="Mean Reversion">Mean Reversion</option>
                <option value="Order Flow">Order Flow</option>
                <option value="Momentum">Momentum</option>
                <option value="Trend Continuation">Trend Continuation</option>
                <option value="Custom">Custom Alpha</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                TARGET R:R MULTIPLE
              </label>
              <input
                type="number"
                step="0.1"
                value={stratTargetRR}
                onChange={(e) => setStratTargetRR(parseFloat(e.target.value) || 2.0)}
                placeholder="3.0"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
              DESCRIPTION & THESIS
            </label>
            <textarea
              rows={2}
              value={stratDesc}
              onChange={(e) => setStratDesc(e.target.value)}
              placeholder="Describe the structural edge, price delivery mechanism, and market context..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
              EXECUTION RULES CHECKLIST (1 per line)
            </label>
            <textarea
              rows={3}
              value={stratRules}
              onChange={(e) => setStratRules(e.target.value)}
              placeholder="1. Confirm HTF trend on 1H chart&#10;2. Wait for liquidity sweep & lower timeframe structure shift&#10;3. Risk strictly ≤ 1.0%"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
              CONFLUENCE TAGS (Comma separated)
            </label>
            <input
              type="text"
              value={stratTags}
              onChange={(e) => setStratTags(e.target.value)}
              placeholder="Order Block, Volume Spike, Session Open"
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setIsStrategyModalOpen(false)}
            >
              Cancel
            </GlassButton>
            <button
              type="button"
              onClick={handleSaveStrategy}
              disabled={!stratName.trim()}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 hover:bg-zinc-200 transition-all cursor-pointer disabled:opacity-40"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{strategyToEdit ? "Update Strategy" : "Save Strategy"}</span>
            </button>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
