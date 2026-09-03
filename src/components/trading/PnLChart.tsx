"use client";

import React, { useState } from "react";
import { PnLPoint } from "@/hooks/useTradeMetrics";
import { GlassCard } from "../glass/GlassCard";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PnLChartProps {
  data: PnLPoint[];
}

export function PnLChart({ data }: PnLChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<PnLPoint | null>(null);
  const [chartMode, setChartMode] = useState<"CUMULATIVE" | "DRAWDOWN" | "TRADE_BARS">("CUMULATIVE");

  if (!data || data.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-zinc-400">
        No trade data available to plot equity curve.
      </GlassCard>
    );
  }

  const width = 800;
  const height = 280;
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };

  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;

  let values = data.map((d) =>
    chartMode === "CUMULATIVE"
      ? d.cumulativePnL
      : chartMode === "DRAWDOWN"
      ? -d.drawdown
      : d.tradePnL
  );

  const minVal = Math.min(0, ...values);
  const maxVal = Math.max(1000, ...values);
  const valRange = maxVal - minVal || 1;

  const points = data.map((d, index) => {
    const val =
      chartMode === "CUMULATIVE"
        ? d.cumulativePnL
        : chartMode === "DRAWDOWN"
        ? -d.drawdown
        : d.tradePnL;

    const x = padding.left + (index / (data.length - 1 || 1)) * usableWidth;
    const y = padding.top + usableHeight - ((val - minVal) / valRange) * usableHeight;
    return { x, y, data: d, val };
  });

  const zeroY = padding.top + usableHeight - ((0 - minVal) / valRange) * usableHeight;

  const linePath = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x},${zeroY} L ${points[0].x},${zeroY} Z`
      : "";

  const latestVal = data[data.length - 1]?.cumulativePnL || 0;
  const isPositive = latestVal >= 0;

  return (
    <GlassCard className="p-5 sm:p-6 bg-black/85 backdrop-blur-2xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
              PORTFOLIO TRAJECTORY
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 font-mono">
              High Precision
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              ${latestVal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
            <span
              className={`flex items-center text-xs sm:text-sm font-bold font-mono ${
                isPositive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {isPositive ? "+Cumulative Alpha" : "Under Drawdown"}
            </span>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/10 gap-1 self-start sm:self-auto">
          <button
            onClick={() => setChartMode("CUMULATIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              chartMode === "CUMULATIVE"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Cumulative P&L
          </button>
          <button
            onClick={() => setChartMode("DRAWDOWN")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              chartMode === "DRAWDOWN"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Drawdown Curve
          </button>
          <button
            onClick={() => setChartMode("TRADE_BARS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              chartMode === "TRADE_BARS"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Trade P&L Dist.
          </button>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="pnlGlowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#A1A1AA" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D4D4D8" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + usableHeight * ratio;
            const gridVal = maxVal - ratio * valRange;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="rgba(161, 161, 170, 0.7)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${Math.round(gridVal).toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Baseline Zero Line */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.5"
          />

          {/* Fill Area */}
          {chartMode !== "TRADE_BARS" && (
            <path
              d={areaPath}
              fill={chartMode === "DRAWDOWN" ? "url(#drawdownGradient)" : "url(#pnlGlowGradient)"}
            />
          )}

          {/* Render Trade Bars Mode */}
          {chartMode === "TRADE_BARS" &&
            points.slice(1).map((pt, idx) => {
              const barH = Math.abs(pt.y - zeroY);
              const isProfit = pt.val >= 0;
              const barY = isProfit ? pt.y : zeroY;
              return (
                <rect
                  key={idx}
                  x={pt.x - 6}
                  y={barY}
                  width={12}
                  height={Math.max(2, barH)}
                  rx={2}
                  fill={isProfit ? "#22C55E" : "#EF4444"}
                  opacity={hoveredPoint?.tradeId === pt.data.tradeId ? 1 : 0.8}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setHoveredPoint(pt.data)}
                />
              );
            })}

          {/* Main Curve Line */}
          {chartMode !== "TRADE_BARS" && (
            <path
              d={linePath}
              fill="none"
              stroke={chartMode === "DRAWDOWN" ? "#EF4444" : "url(#strokeGradient)"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 10px rgba(255, 255, 255, 0.4))"
            />
          )}

          {/* Data Points */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.tradeId === pt.data.tradeId ? 6 : 3.5}
              fill={pt.val >= 0 ? "#FFFFFF" : "#EF4444"}
              stroke="#000000"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:scale-150"
              onMouseEnter={() => setHoveredPoint(pt.data)}
            />
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 p-3 rounded-xl bg-black/95 backdrop-blur-2xl border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.15)] z-20 pointer-events-none animate-in fade-in duration-150 text-xs font-mono">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-1.5 mb-1.5">
              <span className="font-bold text-white">{hoveredPoint.ticker}</span>
              <span className="text-[10px] text-zinc-400">{hoveredPoint.date}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <span className="text-zinc-400">Trade P&L:</span>
              <span
                className={`font-bold text-right ${
                  hoveredPoint.tradePnL >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {hoveredPoint.tradePnL >= 0 ? "+" : ""}${hoveredPoint.tradePnL.toLocaleString()}
              </span>
              <span className="text-zinc-400">R-Multiple:</span>
              <span className="text-right text-white font-bold">
                {hoveredPoint.rMultiple >= 0 ? "+" : ""}
                {hoveredPoint.rMultiple.toFixed(2)}R
              </span>
              <span className="text-zinc-400">Cumulative:</span>
              <span className="text-right text-white font-bold">
                ${hoveredPoint.cumulativePnL.toLocaleString()}
              </span>
              <span className="text-zinc-400">Drawdown:</span>
              <span className="text-right text-red-400">-${hoveredPoint.drawdown.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Axis X Date Labels */}
      <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-2 px-12">
        <span>{data[0]?.date || "Genesis"}</span>
        <span>{data[Math.floor(data.length / 2)]?.date || "Midpoint"}</span>
        <span>{data[data.length - 1]?.date || "Latest"}</span>
      </div>
    </GlassCard>
  );
}
