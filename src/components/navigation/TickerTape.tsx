"use client";

import React from "react";
import { TrendingUp, TrendingDown, Radio } from "lucide-react";
import { useDMA } from "@/context/DMAContext";

export function TickerTape() {
  const { tickers, latencyMs, status } = useDMA();

  return (
    <div className="w-full bg-black/95 border-b border-white/10 backdrop-blur-2xl py-2 px-4 overflow-hidden relative select-none flex items-center">
      {/* Live Badge */}
      <div className="shrink-0 flex items-center gap-2 pr-4 border-r border-white/10 text-[10px] font-mono font-bold text-white z-10 bg-black">
        <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
        <span className="hidden sm:inline tracking-wider">SYNAPSES DMA FEED</span>
        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {latencyMs.toFixed(1)}ms
        </span>
      </div>

      {/* Marquee Row with Real-Time DMA Data */}
      <div className="flex items-center gap-8 overflow-x-auto whitespace-nowrap pl-4 custom-scrollbar text-xs font-mono">
        {tickers.concat(tickers).map((item, idx) => {
          const isUp = item.lastTickDir === "up";
          const isDown = item.lastTickDir === "down";

          return (
            <div
              key={`${item.symbol}-${idx}`}
              className={`inline-flex items-center gap-2 shrink-0 px-2 py-0.5 rounded transition-colors duration-200 ${
                isUp ? "bg-emerald-500/10" : isDown ? "bg-red-500/10" : ""
              }`}
            >
              <span className="font-bold text-zinc-300">{item.symbol}</span>
              <span
                className={`font-semibold transition-colors ${
                  isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-white"
                }`}
              >
                {item.price < 10
                  ? item.price.toFixed(item.decimals || 4)
                  : item.price.toLocaleString("en-US", {
                      minimumFractionDigits: item.decimals || 2,
                      maximumFractionDigits: item.decimals || 2,
                    })}
              </span>
              <span
                className={`flex items-center text-[10px] font-bold ${
                  item.isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {item.isPositive ? (
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                )}
                {item.isPositive ? "+" : ""}
                {item.changePercent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
