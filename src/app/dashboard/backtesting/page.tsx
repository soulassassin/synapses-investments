"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlowBadge } from "@/components/glass/GlowBadge";
import { ReplayChart } from "@/components/trading/ReplayChart";
import { mockReplayCandles, ReplayCandle } from "@/lib/marketReplayData";
import {
  History,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function BacktestingPage() {
  const initialIndex = 25;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [simulatedAccountBalance, setSimulatedAccountBalance] = useState(100000);
  const [openPosition, setOpenPosition] = useState<{
    direction: "LONG" | "SHORT";
    entryPrice: number;
    lots: number;
  } | null>(null);
  const [completedSimTrades, setCompletedSimTrades] = useState<
    Array<{
      direction: "LONG" | "SHORT";
      entryPrice: number;
      exitPrice: number;
      pnl: number;
    }>
  >([]);

  const currentCandle = mockReplayCandles[currentIndex] || mockReplayCandles[mockReplayCandles.length - 1];
  const currentPrice = currentCandle.close;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= mockReplayCandles.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed]);

  const handleStepForward = () => {
    if (currentIndex < mockReplayCandles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleResetReplay = () => {
    setIsPlaying(false);
    setCurrentIndex(initialIndex);
    setOpenPosition(null);
    setCompletedSimTrades([]);
    setSimulatedAccountBalance(100000);
  };

  const handleOpenPosition = (direction: "LONG" | "SHORT") => {
    if (openPosition) return;
    setOpenPosition({
      direction,
      entryPrice: currentPrice,
      lots: 2.0,
    });
  };

  const handleClosePosition = () => {
    if (!openPosition) return;
    const diff =
      openPosition.direction === "LONG"
        ? currentPrice - openPosition.entryPrice
        : openPosition.entryPrice - currentPrice;
    const pnl = Number((diff * openPosition.lots * 10).toFixed(2));

    setSimulatedAccountBalance((prev) => prev + pnl);
    setCompletedSimTrades((prev) => [
      ...prev,
      {
        direction: openPosition.direction,
        entryPrice: openPosition.entryPrice,
        exitPrice: currentPrice,
        pnl,
      },
    ]);
    setOpenPosition(null);
  };

  const floatingPnL = openPosition
    ? Number(
        (
          (openPosition.direction === "LONG"
            ? currentPrice - openPosition.entryPrice
            : openPosition.entryPrice - currentPrice) *
          openPosition.lots *
          10
        ).toFixed(2)
      )
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              MARKET REPLAY & HISTORICAL BACKTESTING ENGINE
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Replay tick-by-tick NAS100 candles, execute simulated market orders, and test playbook setups with zero forward bias.
          </p>
        </div>

        {/* Live Simulator Balance Pill */}
        <div className="p-3 px-4 rounded-xl bg-black/85 border border-white/10 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              SIMULATED EQUITY
            </span>
            <span className="text-base font-bold font-mono text-white">
              ${(simulatedAccountBalance + floatingPnL).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <GlowBadge variant="white" size="sm">
            Live Replay
          </GlowBadge>
        </div>
      </div>

      {/* Main Chart Simulator Component */}
      <ReplayChart candles={mockReplayCandles} currentIndex={currentIndex} />

      {/* Control Cockpit Dock */}
      <GlassCard className="p-5 bg-black/85 border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="synapses-pill-btn p-3 px-5 text-xs font-bold flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-black" /> : <Play className="w-4 h-4 text-black" />}
              <span>{isPlaying ? "Pause Stream" : "Start Replay"}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={isPlaying || currentIndex >= mockReplayCandles.length - 1}
              className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white disabled:opacity-40 transition-all"
              title="Next Candle"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetReplay}
              className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-400 hover:text-white transition-all"
              title="Reset Replay"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Multiplier */}
            <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 gap-1 ml-2 text-xs font-mono">
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaySpeed(speed)}
                  className={`px-2.5 py-1 rounded-lg ${
                    playSpeed === speed
                      ? "bg-white text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Order Cockpit */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            {!openPosition ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenPosition("LONG")}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(34,197,94,0.15)] active:scale-95 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>SIM BUY 2.0 LOTS</span>
                </button>
                <button
                  onClick={() => handleOpenPosition("SHORT")}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.15)] active:scale-95 transition-all"
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>SIM SELL 2.0 LOTS</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-white/[0.03] p-2 px-4 rounded-xl border border-white/10">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-zinc-400 block">
                    OPEN {openPosition.direction} ({openPosition.lots} Lots)
                  </span>
                  <span
                    className={`text-sm font-black ${
                      floatingPnL >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    Floating: {floatingPnL >= 0 ? "+" : ""}${floatingPnL}
                  </span>
                </div>
                <GlassButton variant="danger" size="sm" onClick={handleClosePosition}>
                  Market Close Position
                </GlassButton>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Completed Replay Trades Log */}
      {completedSimTrades.length > 0 && (
        <GlassCard className="p-5 bg-black/85 border-white/10">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase block mb-3">
            COMPLETED REPLAY SIMULATION TRADES
          </span>
          <div className="space-y-2">
            {completedSimTrades.map((st, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">Trade #{i + 1}</span>
                  <GlowBadge variant={st.direction === "LONG" ? "emerald" : "rose"} size="sm">
                    {st.direction}
                  </GlowBadge>
                  <span className="text-zinc-400">Entry: {st.entryPrice}</span>
                  <span className="text-zinc-400">Exit: {st.exitPrice}</span>
                </div>
                <span
                  className={`font-bold ${
                    st.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {st.pnl >= 0 ? "+" : ""}${st.pnl.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
