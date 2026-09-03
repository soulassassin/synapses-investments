"use client";

import React, { useState } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import { TradeLog } from "@/types/journal";
import { useJournalStore } from "@/store/useJournalStore";

interface TradeDetailModalProps {
  trade: TradeLog | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (trade: TradeLog) => void;
}

export function TradeDetailModal({ trade, isOpen, onClose, onEdit }: TradeDetailModalProps) {
  const { deleteTrade } = useJournalStore();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  if (!isOpen || !trade) return null;

  const isWin = trade.status === "WIN";
  const formattedDate = new Date(trade.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this execution log?")) {
      deleteTrade(trade.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl my-auto rounded-2xl bg-zinc-950 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black font-mono text-white tracking-wider">
                {trade.pair}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase flex items-center gap-1 ${
                  trade.direction === "LONG"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {trade.direction === "LONG" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trade.direction}
              </span>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {trade.timeframe || "5m"} • {trade.session.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(trade)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 cursor-pointer"
              title="Edit Execution"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/15 active:scale-90 transition-all duration-150 cursor-pointer"
              title="Delete Execution"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all duration-150 cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Main Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">NET REALIZED</span>
              <span
                className={`text-xl font-black font-mono ${
                  isWin ? "text-emerald-400" : trade.status === "LOSS" ? "text-red-400" : "text-white"
                }`}
              >
                {trade.netPnL !== undefined
                  ? `${trade.netPnL >= 0 ? "+" : ""}$${trade.netPnL.toLocaleString()}`
                  : `${trade.rMultiple}R`}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">OUTCOME R:R</span>
              <span
                className={`text-base font-mono font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${
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

            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">SETUP MODEL</span>
              <span className="text-xs font-mono font-bold text-white mt-1 block">
                {trade.setup.replace("_", " ")}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">DISCIPLINE</span>
              <span className="text-xs font-mono font-semibold text-emerald-400 mt-1 block">
                {trade.emotionalState}
              </span>
            </div>
          </div>

          {/* Price Execution Details */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-black border border-white/10">
              <span className="text-zinc-500 text-[10px] block">ENTRY</span>
              <span className="text-white font-bold">{trade.entryPrice}</span>
            </div>
            <div className="p-3 rounded-xl bg-black border border-red-500/20">
              <span className="text-red-400 text-[10px] block">STOP LOSS</span>
              <span className="text-white font-bold">{trade.stopLoss}</span>
            </div>
            <div className="p-3 rounded-xl bg-black border border-emerald-500/20">
              <span className="text-emerald-400 text-[10px] block">TAKE PROFIT</span>
              <span className="text-white font-bold">{trade.takeProfit}</span>
            </div>
          </div>

          {/* Confluence & Playbook Notes */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              EXECUTION ANALYSIS & CONFLUENCE
            </span>
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
              {trade.confluenceNotes || "No execution notes recorded."}
            </div>
          </div>

          {/* Screenshots Gallery */}
          {trade.chartScreenshots && trade.chartScreenshots.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                CHART SCREENSHOTS ({trade.chartScreenshots.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trade.chartScreenshots.map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className="relative group rounded-xl overflow-hidden border border-white/15 cursor-pointer bg-black aspect-video"
                  >
                    <img src={src} alt="Trade Screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-mono">
                      <Maximize2 className="w-4 h-4" /> Expand
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp footer */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Logged on {formattedDate}
            </span>
            <span>ID: {trade.id}</span>
          </div>
        </div>
      </div>

      {/* Enlarged Screenshot Modal */}
      {activeImageIndex !== null && trade.chartScreenshots && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveImageIndex(null)}
        >
          <div className="absolute top-6 right-6 flex items-center gap-3 z-50">
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
              Click anywhere or press ESC to dismiss
            </span>
            <button
              onClick={() => setActiveImageIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer shadow-2xl border border-white/20"
              title="Close image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <img
            src={trade.chartScreenshots[activeImageIndex]}
            alt="Enlarged Screenshot"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-white/20 shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
          />
        </div>
      )}
    </div>
  );
}
