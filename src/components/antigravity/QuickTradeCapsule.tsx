"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Zap, CheckCircle2, ChevronDown } from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { useTrades } from "@/context/TradeContext";
import { useDMA } from "@/context/DMAContext";

export function QuickTradeCapsule() {
  const { addTrade } = useTrades();
  const { tickers, getTicker } = useDMA();
  const [selectedTicker, setSelectedTicker] = useState("NAS100");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLongExecuted, setIsLongExecuted] = useState(false);
  const [isShortExecuted, setIsShortExecuted] = useState(false);

  const activeTicker = getTicker(selectedTicker) || {
    symbol: "NAS100",
    name: "Nasdaq 100",
    price: 29544.15,
    change: 61.85,
    changePercent: 0.21,
    isPositive: true,
    decimals: 2,
    assetClass: "Indices" as const,
  };

  const price = activeTicker.price;
  const isUp = activeTicker.lastTickDir === "up";
  const isDown = activeTicker.lastTickDir === "down";

  const handleQuickOrder = (direction: "LONG" | "SHORT") => {
    if (direction === "LONG") {
      setIsLongExecuted(true);
      setTimeout(() => setIsLongExecuted(false), 2000);
    } else {
      setIsShortExecuted(true);
      setTimeout(() => setIsShortExecuted(false), 2000);
    }

    const slDistance = price * 0.003;
    const tpDistance = price * 0.009;

    addTrade({
      ticker: activeTicker.symbol,
      assetClass: activeTicker.assetClass,
      direction,
      entryDate: new Date().toISOString().replace("T", " ").slice(0, 16),
      exitDate: new Date(Date.now() + 1800000).toISOString().replace("T", " ").slice(0, 16),
      session: "New York",
      entryPrice: price,
      exitPrice: direction === "LONG" ? price + tpDistance : price - tpDistance,
      stopLoss: direction === "LONG" ? price - slDistance : price + slDistance,
      takeProfit: direction === "LONG" ? price + tpDistance : price - tpDistance,
      positionSize: 2.0,
      grossPnL: 900.0,
      netPnL: 885.0,
      commission: 15.0,
      swap: 0,
      slippagePips: 0.5,
      spreadPips: 1.0,
      rMultiple: 3.0,
      strategy: "Quick Synapses DMA Order",
      setup: "Instant DMA Fill",
      mistakeTags: [],
      marketCondition: "Trending Bullish",
      emotion: {
        confidence: 5,
        stress: 1,
        discipline: 5,
        preTradeState: "Focused",
        postTradeState: "Satisfied",
        notes: `Instant DMA execution for ${activeTicker.symbol} at ${price}.`,
      },
      account: "Apex Prop 100K Fund",
    });
  };

  const selectableSymbols = ["NAS100", "US30", "XAUUSD", "BTCUSD", "EURUSD"];

  return (
    <GlassCard className="p-3.5 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.8)] w-[265px] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold font-mono">{activeTicker.symbol}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-32 py-1 rounded-xl bg-zinc-950/95 border border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              {selectableSymbols.map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    setSelectedTicker(sym);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs font-mono flex items-center justify-between hover:bg-white/10 ${
                    selectedTicker === sym ? "text-white font-bold bg-white/[0.06]" : "text-zinc-400"
                  }`}
                >
                  <span>{sym}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE DMA
        </span>
      </div>

      {/* Price with Live Tick Animation */}
      <div
        className={`flex items-baseline justify-between mb-3 px-2.5 py-2 rounded-lg border transition-colors duration-300 ${
          isUp
            ? "bg-emerald-500/10 border-emerald-500/30"
            : isDown
            ? "bg-red-500/10 border-red-500/30"
            : "bg-white/[0.03] border-white/10"
        }`}
      >
        <span className="text-[10px] text-zinc-400 font-mono">SPOT DMA</span>
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-base font-bold font-mono transition-colors ${
              isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-white"
            }`}
          >
            {price < 10
              ? price.toFixed(activeTicker.decimals || 4)
              : price.toLocaleString("en-US", {
                  minimumFractionDigits: activeTicker.decimals || 2,
                  maximumFractionDigits: activeTicker.decimals || 2,
                })}
          </span>
          <span className={`text-[10px] font-mono ${activeTicker.isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {activeTicker.isPositive ? "+" : ""}
            {activeTicker.changePercent}%
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleQuickOrder("LONG")}
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
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
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
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
