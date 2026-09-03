"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Radio } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  isPositive: boolean;
}

export function TickerTape() {
  const [tickers, setTickers] = useState<TickerItem[]>([
    { symbol: "NAS100", price: 19842.5, change: 1.24, isPositive: true },
    { symbol: "US30", price: 39910.0, change: 0.65, isPositive: true },
    { symbol: "SPX500", price: 5542.2, change: 0.88, isPositive: true },
    { symbol: "EURUSD", price: 1.0892, change: -0.18, isPositive: false },
    { symbol: "GBPUSD", price: 1.2940, change: 0.32, isPositive: true },
    { symbol: "USDJPY", price: 154.22, change: -0.45, isPositive: false },
    { symbol: "XAUUSD (GOLD)", price: 2420.5, change: 1.62, isPositive: true },
    { symbol: "BTCUSD", price: 64280.0, change: 3.42, isPositive: true },
    { symbol: "ETHUSD", price: 2795.0, change: 5.18, isPositive: true },
    { symbol: "DXY", price: 104.15, change: -0.22, isPositive: false },
  ]);

  // Micro-tick price variations
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.48) * (t.price * 0.0004);
          const newPrice = Number((t.price + delta).toFixed(t.price < 10 ? 4 : 2));
          return {
            ...t,
            price: newPrice,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black/90 border-b border-white/10 backdrop-blur-2xl py-2 px-4 overflow-hidden relative select-none flex items-center">
      {/* Live Badge */}
      <div className="shrink-0 flex items-center gap-1.5 pr-4 border-r border-white/10 text-[10px] font-mono font-bold text-white z-10 bg-black">
        <Radio className="w-3 h-3 text-white animate-pulse" />
        <span className="hidden sm:inline">SYNAPSES DMA FEED</span>
      </div>

      {/* Marquee Row */}
      <div className="flex items-center gap-8 overflow-x-auto whitespace-nowrap pl-4 custom-scrollbar text-xs font-mono">
        {tickers.concat(tickers).map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-2 shrink-0">
            <span className="font-bold text-zinc-300">{item.symbol}</span>
            <span className="text-white font-medium">
              {item.price < 10
                ? item.price.toFixed(4)
                : item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
              {item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
