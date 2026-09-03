"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Zap, CheckCircle2 } from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { useTrades } from "@/context/TradeContext";

export function QuickTradeCapsule() {
  const { addTrade } = useTrades();
  const [ticker, setTicker] = useState("NAS100");
  const [price, setPrice] = useState(19842.50);
  const [isLongExecuted, setIsLongExecuted] = useState(false);
  const [isShortExecuted, setIsShortExecuted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 2.5;
      setPrice((prev) => Number((prev + delta).toFixed(2)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleQuickOrder = (direction: "LONG" | "SHORT") => {
    if (direction === "LONG") {
      setIsLongExecuted(true);
      setTimeout(() => setIsLongExecuted(false), 2000);
    } else {
      setIsShortExecuted(true);
      setTimeout(() => setIsShortExecuted(false), 2000);
    }

    addTrade({
      ticker,
      assetClass: "Indices",
      direction,
      entryDate: new Date().toISOString().replace("T", " ").slice(0, 16),
      exitDate: new Date(Date.now() + 1800000).toISOString().replace("T", " ").slice(0, 16),
      session: "New York",
      entryPrice: price,
      exitPrice: direction === "LONG" ? price + 45 : price - 45,
      stopLoss: direction === "LONG" ? price - 25 : price + 25,
      takeProfit: direction === "LONG" ? price + 75 : price - 75,
      positionSize: 2.0,
      grossPnL: 900.00,
      netPnL: 885.00,
      commission: 15.00,
      swap: 0,
      slippagePips: 0.5,
      spreadPips: 1.0,
      rMultiple: 3.0,
      strategy: "Quick Synapses Order",
      setup: "Instant Fill",
      mistakeTags: [],
      marketCondition: "Trending Bullish",
      emotion: {
        confidence: 5,
        stress: 1,
        discipline: 5,
        preTradeState: "Focused",
        postTradeState: "Satisfied",
        notes: "Quick order executed from Synapses Quantum Node.",
      },
      account: "Apex Prop 100K Fund",
    });
  };

  return (
    <GlassCard className="p-3.5 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.8)] w-[260px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-white/10 text-white">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white font-mono">{ticker}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/20 font-mono">
          LIVE DMA
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline justify-between mb-3 bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/10">
        <span className="text-[10px] text-zinc-400">SPOT DMA</span>
        <span className="text-base font-bold font-mono text-white">
          {price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleQuickOrder("LONG")}
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-semibold active:scale-95 transition-all"
        >
          {isLongExecuted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filled!</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>BUY</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleQuickOrder("SHORT")}
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-semibold active:scale-95 transition-all"
        >
          {isShortExecuted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
              <span>Filled!</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>SELL</span>
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
