"use client";

import React from "react";
import { MetricStats } from "@/lib/types";
import { GlassCard } from "../glass/GlassCard";
import { Brain, AlertCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

interface EmotionTrackerProps {
  stats: MetricStats;
}

export function EmotionTracker({ stats }: EmotionTrackerProps) {
  const avgDiscipline = stats.disciplineScore;
  const avgConfidence = 4.2;
  const avgStress = 2.1;

  const mistakes = Object.entries(stats.mistakeFrequency || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <GlassCard className="p-5 sm:p-6 bg-black/85 backdrop-blur-2xl border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-white" />
          <h3 className="text-base font-bold text-white tracking-wide">
            PSYCHOLOGY & DISCIPLINE RADAR
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
          Cognitive Telemetry
        </span>
      </div>

      {/* 3 Metric Gauges */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
          <span className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
            DISCIPLINE SCORE
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400 block">
            {avgDiscipline}%
          </span>
          <span className="text-[10px] text-zinc-400 mt-1 block">Rule Following</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
          <span className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
            AVG CONFIDENCE
          </span>
          <span className="text-2xl font-black font-mono text-white block">
            {avgConfidence} / 5
          </span>
          <span className="text-[10px] text-zinc-400 mt-1 block">Pre-Trade State</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center">
          <span className="text-[10px] font-mono text-zinc-400 block mb-1 uppercase">
            STRESS INDEX
          </span>
          <span className="text-2xl font-black font-mono text-zinc-300 block">
            {avgStress} / 5
          </span>
          <span className="text-[10px] text-zinc-400 mt-1 block">Under Control</span>
        </div>
      </div>

      {/* Top Behavioral Mistakes */}
      <div>
        <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-2.5">
          FREQUENCY OF COSTLY PSYCHOLOGY MISTAKES
        </span>

        {mistakes.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero behavioral mistakes recorded across trades!</span>
          </div>
        ) : (
          <div className="space-y-2">
            {mistakes.map(([tag, count], idx) => {
              const percentage = Math.round((count / (stats.totalTrades || 1)) * 100);
              return (
                <div key={idx} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between items-center text-xs font-mono mb-1">
                    <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      {tag}
                    </span>
                    <span className="text-zinc-400">
                      {count} occurrences ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-red-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, percentage * 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
