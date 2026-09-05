"use client";

import React from "react";
import { GlassCard } from "../glass/GlassCard";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useDMA } from "@/context/DMAContext";
import { TickerInfo } from "@/hooks/useDMAFeed";

export function CryptoTickerCapsule() {
  const { tickers, latencyMs } = useDMA();

  const cryptoSymbols = ["BTCUSD", "ETHUSD", "SOLUSD"];
  const displayCoins: TickerInfo[] = cryptoSymbols.map((sym) => {
    const t = tickers.find((item) => item.symbol === sym);
    if (t) return t;
    if (sym === "BTCUSD") {
      return {
        symbol: "BTCUSD",
        name: "Bitcoin",
        price: 79924.0,
        change: 278.5,
        changePercent: 0.35,
        isPositive: true,
        assetClass: "Crypto",
        decimals: 2,
        lastTickDir: "flat",
      };
    }
    if (sym === "ETHUSD") {
      return {
        symbol: "ETHUSD",
        name: "Ethereum",
        price: 2489.9,
        change: 37.6,
        changePercent: 1.53,
        isPositive: true,
        assetClass: "Crypto",
        decimals: 2,
        lastTickDir: "flat",
      };
    }
    return {
      symbol: "SOLUSD",
      name: "Solana",
      price: 103.74,
      change: 2.13,
      changePercent: 2.1,
      isPositive: true,
      assetClass: "Crypto",
      decimals: 2,
      lastTickDir: "flat",
    };
  });

  return (
    <GlassCard className="p-3.5 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.8)] w-[265px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="text-[11px] font-bold text-white tracking-wider font-mono">SYNAPSES DMA FEED</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          {latencyMs.toFixed(1)}ms DMA
        </span>
      </div>

      <div className="space-y-2">
        {displayCoins.map((item) => {
          const displaySym = item.symbol.replace("USD", "");
          const isUp = item.lastTickDir === "up";
          const isDown = item.lastTickDir === "down";

          return (
            <div
              key={item.symbol}
              className={`flex items-center justify-between text-xs font-mono p-1 rounded-lg transition-colors duration-300 ${
                isUp ? "bg-emerald-500/10" : isDown ? "bg-red-500/10" : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-zinc-200">{displaySym}</span>
                <span className="text-[9px] text-zinc-500 font-sans">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-bold transition-colors ${isUp ? "text-emerald-400" : isDown ? "text-red-400" : "text-white"}`}>
                  ${item.price.toLocaleString("en-US", {
                    minimumFractionDigits: item.decimals ?? 2,
                    maximumFractionDigits: item.decimals ?? 2,
                  })}
                </span>
                <span
                  className={`text-[10px] flex items-center font-bold ${
                    item.isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {item.isPositive ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                  {item.isPositive ? "+" : ""}
                  {item.changePercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
