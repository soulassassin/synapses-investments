"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "../glass/GlassCard";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export function CryptoTickerCapsule() {
  const [cryptoData, setCryptoData] = useState([
    { symbol: "BTC", price: 64280.50, change: "+3.42%", positive: true },
    { symbol: "ETH", price: 2795.10, change: "+5.18%", positive: true },
    { symbol: "SOL", price: 148.90, change: "-1.24%", positive: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoData((prev) =>
        prev.map((coin) => {
          const delta = (Math.random() - 0.48) * (coin.price * 0.0008);
          return {
            ...coin,
            price: Number((coin.price + delta).toFixed(2)),
          };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GlassCard className="p-3.5 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.8)] w-[250px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
          <span className="text-[11px] font-bold text-white tracking-wider">SYNAPSES FEED</span>
        </div>
        <span className="text-[9px] font-mono text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
          0.8ms
        </span>
      </div>

      <div className="space-y-1.5">
        {cryptoData.map((item) => (
          <div key={item.symbol} className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-zinc-300">{item.symbol}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">
                ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`text-[10px] flex items-center font-bold ${
                  item.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {item.positive ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
