"use client";

import React, { useState } from "react";
import { useTrades } from "@/context/TradeContext";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlowBadge } from "@/components/glass/GlowBadge";
import { TradeDetailModal } from "@/components/trading/TradeDetailModal";
import { TradeLogModal } from "@/components/trading/TradeLogModal";
import { Trade } from "@/lib/types";
import {
  BookOpen,
  Calendar,
  Filter,
  PlusCircle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Brain,
  Tag,
  Search,
} from "lucide-react";

export default function JournalPage() {
  const { filteredTrades } = useTrades();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  const allTags = Array.from(
    new Set(filteredTrades.flatMap((t) => t.mistakeTags || []))
  );

  const displayedTrades = filteredTrades.filter((t) => {
    const matchesSearch =
      t.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.setup || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.notes || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag =
      selectedTag === "ALL" || (t.mistakeTags && t.mistakeTags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              TRADE PLAYBOOK & PSYCHOLOGY JOURNAL
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Visual trade breakdown, mental notes, rule adherence tracking, and setup catalogs.
          </p>
        </div>

        <GlassButton
          variant="pill"
          size="sm"
          onClick={() => {
            setTradeToEdit(null);
            setIsLogModalOpen(true);
          }}
          icon={<PlusCircle className="w-4 h-4 text-black" />}
        >
          New Journal Entry
        </GlassButton>
      </div>

      {/* Filter & Tag Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-2xl bg-black/85 border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, setups, tickers..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
              selectedTag === "ALL"
                ? "bg-white text-black font-bold"
                : "bg-white/[0.04] text-zinc-400 hover:text-white"
            }`}
          >
            All Trades ({filteredTrades.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                selectedTag === tag
                  ? "bg-red-500/25 text-red-300 border border-red-500/50"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/5"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Journal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedTrades.length === 0 ? (
          <div className="col-span-full p-12 text-center text-zinc-400">
            No journal entries match the search or tag filters.
          </div>
        ) : (
          displayedTrades.map((trade) => {
            const isWin = trade.netPnL >= 0;
            return (
              <GlassCard
                key={trade.id}
                variant="interactive"
                className="p-5 flex flex-col justify-between bg-black/85 border-white/10"
                onClick={() => setSelectedTrade(trade)}
              >
                <div>
                  {/* Top Row: Symbol, Direction, Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-mono text-white">
                        {trade.ticker}
                      </span>
                      <GlowBadge
                        variant={trade.direction === "LONG" ? "emerald" : "rose"}
                        size="sm"
                      >
                        {trade.direction}
                      </GlowBadge>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {trade.entryDate.split(" ")[0]}
                    </span>
                  </div>

                  {/* P&L & R-Multiple */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                        NET REALIZED
                      </span>
                      <span
                        className={`text-lg font-black font-mono ${
                          isWin ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {isWin ? "+" : ""}${trade.netPnL.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                        R:R OUTCOME
                      </span>
                      <span
                        className={`text-sm font-bold font-mono px-2 py-0.5 rounded border ${
                          trade.rMultiple >= 0
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-400/30"
                            : "bg-red-500/15 text-red-400 border-red-400/30"
                        }`}
                      >
                        {trade.rMultiple >= 0 ? "+" : ""}
                        {trade.rMultiple?.toFixed(2)}R
                      </span>
                    </div>
                  </div>

                  {/* Setup & Strategy */}
                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Playbook Setup:</span>
                      <span className="text-zinc-200 font-medium">{trade.setup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Session:</span>
                      <span className="text-zinc-300 font-mono">{trade.session}</span>
                    </div>
                  </div>

                  {/* Notes Snippet */}
                  {trade.notes && (
                    <p className="text-xs text-zinc-400 line-clamp-2 italic bg-black/40 p-2.5 rounded-lg border border-white/5 mb-3 font-sans">
                      &ldquo;{trade.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Footer: Mistakes & Discipline */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {trade.mistakeTags && trade.mistakeTags.length > 0 ? (
                      trade.mistakeTags.slice(0, 2).map((m, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-mono"
                        >
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> High Discipline
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400">
                    Conf: {trade.emotion?.confidence || 5}/5
                  </span>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Trade Detail Modal */}
      <TradeDetailModal
        trade={selectedTrade}
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        onEdit={(trade) => {
          setTradeToEdit(trade);
          setIsLogModalOpen(true);
        }}
      />

      {/* Log / Edit Modal */}
      <TradeLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setTradeToEdit(null);
        }}
        tradeToEdit={tradeToEdit}
      />
    </div>
  );
}
