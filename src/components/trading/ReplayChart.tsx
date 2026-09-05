"use client";

import React, { useState, useEffect, useRef } from "react";
import { ReplayScenario, BacktestPosition, TradeDirection } from "@/lib/types";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface ReplayChartProps {
  scenario?: ReplayScenario;
  candles?: any[];
  currentIndex?: number;
}

export function ReplayChart({ scenario, candles: propCandles, currentIndex: propIndex }: ReplayChartProps) {
  const defaultCandles = scenario?.candles || propCandles || [];
  const [currentBarIndex, setCurrentBarIndex] = useState(propIndex !== undefined ? propIndex : 12);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [balance, setBalance] = useState(scenario?.initialBalance || 100000);
  const [positions, setPositions] = useState<BacktestPosition[]>([]);
  const [orderSize, setOrderSize] = useState(2.0);
  const [stopLossPips, setStopLossPips] = useState(30);
  const [takeProfitPips, setTakeProfitPips] = useState(60);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const candles = defaultCandles;
  const activeIndex = propIndex !== undefined ? propIndex : currentBarIndex;
  const visibleCandles = candles.slice(0, activeIndex + 1);
  const currentCandle = visibleCandles[visibleCandles.length - 1] || candles[0];

  useEffect(() => {
    if (propIndex !== undefined) {
      setCurrentBarIndex(propIndex);
    }
  }, [propIndex]);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentBarIndex((prev) => {
          if (prev >= candles.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeed, candles.length]);

  // Check positions on update
  useEffect(() => {
    if (!currentCandle) return;

    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        if (pos.status === "CLOSED") return pos;

        let isClosed = false;
        let exitPrice = currentCandle.close;
        let pnl = 0;

        if (pos.direction === "LONG") {
          if (currentCandle.low <= pos.stopLoss) {
            isClosed = true;
            exitPrice = pos.stopLoss;
          } else if (pos.takeProfit && currentCandle.high >= pos.takeProfit) {
            isClosed = true;
            exitPrice = pos.takeProfit;
          }
          pnl = (exitPrice - pos.entryPrice) * pos.size * 20;
        } else {
          if (currentCandle.high >= pos.stopLoss) {
            isClosed = true;
            exitPrice = pos.stopLoss;
          } else if (pos.takeProfit && currentCandle.low <= pos.takeProfit) {
            isClosed = true;
            exitPrice = pos.takeProfit;
          }
          pnl = (pos.entryPrice - exitPrice) * pos.size * 20;
        }

        if (isClosed) {
          setBalance((b) => Number((b + pnl).toFixed(2)));
          return {
            ...pos,
            status: "CLOSED",
            exitIndex: activeIndex,
            exitPrice,
            pnl: Number(pnl.toFixed(2)),
          };
        }

        return pos;
      })
    );
  }, [activeIndex, currentCandle]);

  // Order Placement
  const placeOrder = (direction: TradeDirection) => {
    if (!currentCandle) return;
    const isLong = direction === "LONG";
    const entryPrice = currentCandle.close;
    const sl = isLong ? entryPrice - stopLossPips : entryPrice + stopLossPips;
    const tp = isLong ? entryPrice + takeProfitPips : entryPrice - takeProfitPips;

    const newPos: BacktestPosition = {
      id: `SIM-${Date.now().toString().slice(-4)}`,
      direction,
      entryIndex: activeIndex,
      entryPrice,
      stopLoss: Number(sl.toFixed(2)),
      takeProfit: Number(tp.toFixed(2)),
      size: orderSize,
      status: "OPEN",
    };

    setPositions((prev) => [...prev, newPos]);
  };

  const handleStepForward = () => {
    if (currentBarIndex < candles.length - 1) {
      setCurrentBarIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentBarIndex(8);
    setBalance(scenario?.initialBalance || 100000);
    setPositions([]);
  };

  // Performance calculations
  const closedPositions = positions.filter((p) => p.status === "CLOSED");
  const winningPositions = closedPositions.filter((p) => (p.pnl || 0) > 0);
  const totalSimPnL = Number((balance - (scenario?.initialBalance || 100000)).toFixed(2));
  const winRate = closedPositions.length > 0 ? ((winningPositions.length / closedPositions.length) * 100).toFixed(1) : "0.0";

  // Chart coordinates
  const width = 800;
  const height = 280;
  const padding = { top: 20, right: 60, bottom: 30, left: 20 };
  const usableHeight = height - padding.top - padding.bottom;

  const allVisibleHighs = visibleCandles.map((c) => c.high);
  const allVisibleLows = visibleCandles.map((c) => c.low);
  const minPrice = Math.min(...allVisibleLows) * 0.9995;
  const maxPrice = Math.max(...allVisibleHighs) * 1.0005;
  const priceRange = maxPrice - minPrice || 1;

  const candleWidth = Math.min(20, Math.max(8, (width - padding.left - padding.right) / (visibleCandles.length || 1) - 4));

  return (
    <GlassCard className="p-5 sm:p-6 bg-black/85 backdrop-blur-2xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      {/* Header & Scenario Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {scenario?.ticker || "NAS100"} • {scenario?.timeframe || "5m"} BAR-BY-BAR REPLAY
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
              {scenario?.difficulty || "Quant Model"} Playbook
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            {scenario?.description || "Historical tick-by-tick simulation without lookahead bias."}
          </p>
        </div>

        {/* Live Simulator Account Telemetry */}
        <div className="flex items-center gap-4 bg-white/[0.03] px-4 py-2 rounded-xl border border-white/10 font-mono text-xs">
          <div>
            <span className="text-[9px] text-zinc-400 block">SIMULATED EQUITY</span>
            <span
              className={`text-sm font-black ${
                totalSimPnL >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-[9px] text-zinc-400 block">SIM WIN RATE</span>
            <span className="text-sm font-black text-white">
              {winRate}% ({closedPositions.length} trades)
            </span>
          </div>
        </div>
      </div>

      {/* SVG Candlestick Screen */}
      <div className="relative w-full bg-black/90 rounded-2xl border border-white/10 p-3 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + usableHeight * ratio;
            const price = maxPrice - ratio * priceRange;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - padding.right + 8}
                  y={y + 4}
                  fill="rgba(161, 161, 170, 0.6)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {price.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Render Candlesticks */}
          {visibleCandles.map((candle, idx) => {
            const x = padding.left + idx * ((width - padding.left - padding.right) / (visibleCandles.length || 1)) + 10;
            const openY = padding.top + usableHeight - ((candle.open - minPrice) / priceRange) * usableHeight;
            const closeY = padding.top + usableHeight - ((candle.close - minPrice) / priceRange) * usableHeight;
            const highY = padding.top + usableHeight - ((candle.high - minPrice) / priceRange) * usableHeight;
            const lowY = padding.top + usableHeight - ((candle.low - minPrice) / priceRange) * usableHeight;

            const isBullish = candle.close >= candle.open;
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(closeY - openY));

            return (
              <g key={idx}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={isBullish ? "#22C55E" : "#EF4444"}
                  strokeWidth="1.5"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  rx={1.5}
                  fill={isBullish ? "#22C55E" : "#EF4444"}
                  stroke={isBullish ? "#16A34A" : "#DC2626"}
                  strokeWidth="0.5"
                />
              </g>
            );
          })}

          {/* Active Orders & Entry Markers */}
          {positions.map((pos) => {
            const entryY = padding.top + usableHeight - ((pos.entryPrice - minPrice) / priceRange) * usableHeight;
            return (
              <g key={pos.id}>
                <line
                  x1={padding.left}
                  y1={entryY}
                  x2={width - padding.right}
                  y2={entryY}
                  stroke={pos.direction === "LONG" ? "#22C55E" : "#EF4444"}
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                <text
                  x={padding.left + 5}
                  y={entryY - 4}
                  fill={pos.direction === "LONG" ? "#22C55E" : "#EF4444"}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pos.direction} @ {pos.entryPrice} ({pos.size} Lots)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Current Candle Bar Information Pill */}
        {currentCandle && (
          <div className="absolute top-4 left-4 p-2 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 font-mono text-[11px] flex items-center gap-3">
            <span className="text-zinc-400">Time: {currentCandle.time}</span>
            <span className="text-zinc-200">O: {currentCandle.open}</span>
            <span className="text-emerald-400">H: {currentCandle.high}</span>
            <span className="text-red-400">L: {currentCandle.low}</span>
            <span className="text-white font-bold">C: {currentCandle.close}</span>
          </div>
        )}
      </div>

      {/* Control Dashboard */}
      {propIndex === undefined && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Playback Controls */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <GlassButton
                variant={isPlaying ? "danger" : "pill"}
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-black" />}
              >
                {isPlaying ? "Pause" : "Play Replay"}
              </GlassButton>

              <GlassButton
                variant="outline"
                size="sm"
                onClick={handleStepForward}
                icon={<SkipForward className="w-4 h-4 text-zinc-300" />}
                disabled={isPlaying}
              >
                Step (1 Bar)
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="sm"
                onClick={handleReset}
                icon={<RotateCcw className="w-4 h-4" />}
                title="Reset Replay Scenario"
              >
                Reset
              </GlassButton>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-zinc-400 mr-1">SPEED:</span>
              {[1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaySpeed(s)}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                    playSpeed === s
                      ? "bg-white text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Order Execution Panel */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <label className="text-[10px] text-zinc-400 font-mono block">LOTS</label>
                <input
                  type="number"
                  step="0.5"
                  value={orderSize}
                  onChange={(e) => setOrderSize(parseFloat(e.target.value) || 1)}
                  className="w-16 glass-input px-2 py-1 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-mono block">SL (PIPS)</label>
                <input
                  type="number"
                  value={stopLossPips}
                  onChange={(e) => setStopLossPips(parseInt(e.target.value) || 20)}
                  className="w-16 glass-input px-2 py-1 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 font-mono block">TP (PIPS)</label>
                <input
                  type="number"
                  value={takeProfitPips}
                  onChange={(e) => setTakeProfitPips(parseInt(e.target.value) || 40)}
                  className="w-16 glass-input px-2 py-1 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Quick Buy / Sell Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => placeOrder("LONG")}
                className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(34,197,94,0.15)] active:scale-95 transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>SIM BUY</span>
              </button>
              <button
                onClick={() => placeOrder("SHORT")}
                className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-bold font-mono flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.15)] active:scale-95 transition-all"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>SIM SELL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
