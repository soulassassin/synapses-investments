"use client";

import React, { useState, useMemo } from "react";
import { Trade } from "@/lib/types";
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
} from "lucide-react";

interface JournalPlaybookViewProps {
  trades: Trade[];
  onSelectTrade: (trade: Trade) => void;
  onEditTrade?: (trade: Trade) => void;
  onDeleteTrade?: (id: string) => void;
}

const PLAYBOOK_SETUPS = [
  { id: "ALL", label: "All Setups" },
  { id: "ICT Silver Bullet", label: "ICT Silver Bullet" },
  { id: "Fair Value Gap", label: "Fair Value Gap (FVG)" },
  { id: "Order Block", label: "Order Block (OB)" },
  { id: "Liquidity Sweep", label: "Liquidity Sweep" },
  { id: "Breaker Block", label: "Breaker Block" },
  { id: "Turtle Soup", label: "Turtle Soup" },
  { id: "Breakout & Retest", label: "Breakout & Retest" },
];

export function JournalPlaybookView({
  trades,
  onSelectTrade,
  onEditTrade,
  onDeleteTrade,
}: JournalPlaybookViewProps) {
  const [selectedSetup, setSelectedSetup] = useState("ALL");
  const [zoomedChartTrade, setZoomedChartTrade] = useState<Trade | null>(null);

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

  return (
    <div className="space-y-6">
      {/* 1. Setup Filter Pills & Telemetry Ribbon */}
      <div className="p-5 rounded-2xl bg-black/85 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] space-y-4">
        {/* Setup Tabs Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-black font-mono text-white tracking-wider">
              QUANTITATIVE STRATEGY PLAYBOOK VAULT
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            {filteredPlaybookTrades.length} Setups Documented
          </span>
        </div>

        {/* Setup Selector Scrollable Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {PLAYBOOK_SETUPS.map((setup) => {
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

        {/* Setup Model Statistics Strip */}
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
      </div>

      {/* 2. Playbook Card Gallery */}
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
                      /* Interactive Algorithmic Candlestick SVG Visualizer */
                      <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-white/[0.03] to-transparent">
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                          <span>ICT ALGORITHMIC DELIVERY</span>
                          <span>{trade.timeframe || "5m"} KILLZONE</span>
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
                      <span>Setup Model:</span>
                      <span className="text-white font-semibold">{trade.setup || trade.strategy}</span>
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

      {/* 3. High-Resolution Chart Lightbox Modal */}
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
                  {zoomedChartTrade.setup || zoomedChartTrade.strategy}
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
                    Algorithmic {zoomedChartTrade.timeframe || "5m"} Execution Model
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
    </div>
  );
}
