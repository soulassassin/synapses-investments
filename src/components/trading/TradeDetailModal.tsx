"use client";

import React, { useState } from "react";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { GlowBadge } from "../glass/GlowBadge";
import { Trade } from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  DollarSign,
  AlertTriangle,
  Brain,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";
import { useTrades } from "@/context/TradeContext";

interface TradeDetailModalProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (trade: Trade) => void;
}

export function TradeDetailModal({ trade, isOpen, onClose, onEdit }: TradeDetailModalProps) {
  const { deleteTrade } = useTrades();
  const [activeChartTab, setActiveChartTab] = useState<"5m" | "15m" | "1h" | "Daily">("5m");

  if (!trade) return null;

  const isWin = trade.netPnL >= 0;

  const handleDelete = () => {
    deleteTrade(trade.id);
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${trade.ticker} • ${trade.direction} Execution Report`}
      subtitle={`Trade ID: #${trade.id} • ${trade.account || "Apex Prop 100K Fund"}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Highlight Banner */}
        <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl border ${
                isWin
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {isWin ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                FINAL NET REALIZED
              </span>
              <h2
                className={`text-3xl font-black font-mono tracking-wider ${
                  isWin ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {isWin ? "+" : ""}${trade.netPnL.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">R-MULTIPLE</span>
              <span
                className={`text-xl font-bold font-mono ${
                  trade.rMultiple >= 0 ? "text-white" : "text-red-400"
                }`}
              >
                {trade.rMultiple >= 0 ? "+" : ""}
                {trade.rMultiple.toFixed(2)}R
              </span>
            </div>

            <GlowBadge variant={trade.direction === "LONG" ? "emerald" : "rose"} size="md">
              {trade.direction}
            </GlowBadge>
          </div>
        </div>

        {/* Execution Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">ENTRY PRICE</span>
            <span className="text-white font-bold text-sm">{trade.entryPrice}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">EXIT PRICE</span>
            <span className="text-white font-bold text-sm">{trade.exitPrice}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">STOP LOSS</span>
            <span className="text-red-400 font-bold text-sm">{trade.stopLoss}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">TAKE PROFIT</span>
            <span className="text-emerald-400 font-bold text-sm">{trade.takeProfit || "N/A"}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">POSITION SIZE</span>
            <span className="text-zinc-200 font-bold text-sm">{trade.positionSize} Lots</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">COMMISSION & SWAP</span>
            <span className="text-zinc-200 font-bold text-sm">
              -${((trade.commission || 0) + (trade.swap || 0)).toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">SESSION</span>
            <span className="text-zinc-200 font-bold text-sm">{trade.session}</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-zinc-500 text-[10px] block">TIMEFRAME</span>
            <span className="text-white font-bold text-sm">{trade.timeframe || "5m"}</span>
          </div>
        </div>

        {/* Multi-Timeframe Chart Simulation */}
        <div className="p-4 rounded-2xl bg-black/80 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
              MULTI-TIMEFRAME CHART PLAYBOOK
            </span>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] font-mono">
              {(["5m", "15m", "1h", "Daily"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveChartTab(tf)}
                  className={`px-2 py-0.5 rounded ${
                    activeChartTab === tf
                      ? "bg-white text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-44 bg-zinc-950/80 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center p-4">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-white">
              <span>{trade.ticker}</span>
              <span>•</span>
              <span>{activeChartTab} Execution Canvas</span>
            </div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Setup: {trade.setup} • Strategy: {trade.strategy} • Entry Trigger: Liquidity grab into fair value gap.
            </p>
          </div>
        </div>

        {/* Mistakes & Psychology Feedback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-xs font-bold text-zinc-300 uppercase font-mono block mb-2">
              Mistake Tags & Rule Adherence
            </span>
            <div className="flex flex-wrap gap-1.5">
              {trade.mistakeTags && trade.mistakeTags.length > 0 ? (
                trade.mistakeTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-400 font-mono">
                  No execution errors logged. High discipline.
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-300 uppercase font-mono">
                Psychology Profile
              </span>
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <span className="text-[10px] text-zinc-500 block">CONFIDENCE</span>
                <span className="font-bold text-white">{trade.emotion?.confidence || 5}/5</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <span className="text-[10px] text-zinc-500 block">STRESS</span>
                <span className="font-bold text-red-300">{trade.emotion?.stress || 1}/5</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <span className="text-[10px] text-zinc-500 block">DISCIPLINE</span>
                <span className="font-bold text-emerald-400">{trade.emotion?.discipline || 5}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trade Notes */}
        {trade.notes && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-xs font-bold text-zinc-300 uppercase font-mono block mb-1">
              Trader Journal Reflections
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">{trade.notes}</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2">
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => {
                onEdit(trade);
                onClose();
              }}
              icon={<Edit className="w-3.5 h-3.5 text-zinc-300" />}
            >
              Edit Trade
            </GlassButton>
            <GlassButton variant="pill" size="sm" onClick={onClose}>
              Done
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
}
