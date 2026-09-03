"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "../glass/GlassCard";
import { Cpu, Radio } from "lucide-react";
import { useGravity } from "@/context/GravityContext";

export function LiveTelemetryWidget() {
  const { isZeroG } = useGravity();
  const [tps, setTps] = useState(4892);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toTimeString().split(" ")[0] + " UTC");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    const tpsTimer = setInterval(() => {
      setTps(4800 + Math.floor(Math.random() * 250));
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(tpsTimer);
    };
  }, []);

  return (
    <GlassCard className="p-3.5 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.8)] w-[250px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-white" />
          <span className="text-[11px] font-bold text-white tracking-wider">TELEMETRY</span>
        </div>
        <span className="flex items-center gap-1 text-[9px] font-mono text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/15">
          <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" /> 99.99% UP
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
          <span className="text-[9px] text-zinc-500 block">PHYSICS MODE</span>
          <span className="text-[11px] font-bold text-white">
            {isZeroG ? "ZERO-G DRIFT" : "SURFACE 1.0G"}
          </span>
        </div>

        <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
          <span className="text-[9px] text-zinc-500 block">MEMPOOL TPS</span>
          <span className="text-[11px] font-bold text-zinc-200">{tps} tx/s</span>
        </div>

        <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
          <span className="text-[9px] text-zinc-500 block">DMA LATENCY</span>
          <span className="text-[11px] font-bold text-white">2.4ms DMA</span>
        </div>

        <div className="bg-white/[0.03] p-1.5 rounded-lg border border-white/5">
          <span className="text-[9px] text-zinc-500 block">SESSION CLOCK</span>
          <span className="text-[10px] font-bold text-zinc-300">{time || "12:00:00 UTC"}</span>
        </div>
      </div>
    </GlassCard>
  );
}
