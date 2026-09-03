"use client";

import React from "react";
import { useGravity } from "@/context/GravityContext";
import { Orbit, Zap } from "lucide-react";
import { GlassCard } from "../glass/GlassCard";

export function GravityController() {
  const { isZeroG, gravityMode, setGravityMode, triggerImpulse } = useGravity();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 hidden sm:block">
      <GlassCard className="p-2 sm:p-2.5 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.9)] flex items-center gap-2 sm:gap-3">
        {/* Gravity State Indicator */}
        <div className="flex items-center gap-2 pl-2 pr-1">
          <div className="relative">
            <Orbit
              className={`w-4 h-4 transition-all duration-500 ${
                isZeroG ? "text-white animate-spin" : "text-zinc-500 rotate-180"
              }`}
              style={{ animationDuration: isZeroG ? "12s" : "0s" }}
            />
            <span
              className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${
                isZeroG ? "bg-white shadow-[0_0_8px_#FFFFFF]" : "bg-zinc-500"
              } animate-ping`}
            />
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              PHYSICS DOCK
            </span>
            <span className="text-xs font-bold text-white font-mono">
              {isZeroG ? "ZERO-G ACTIVE" : "SURFACE GRAVITY"}
            </span>
          </div>
        </div>

        {/* Mode Selector Pill */}
        <div className="flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/10 gap-1">
          <button
            onClick={() => setGravityMode("ZERO_G")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
              gravityMode === "ZERO_G"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Zero-G
          </button>

          <button
            onClick={() => setGravityMode("SURFACE_GRAVITY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
              gravityMode === "SURFACE_GRAVITY"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            1.0 G
          </button>

          <button
            onClick={() => setGravityMode("LUNAR")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer hidden md:block ${
              gravityMode === "LUNAR"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            0.16G
          </button>
        </div>

        {/* Impulse / Shake Button */}
        <button
          onClick={triggerImpulse}
          title="Trigger Quantum Impulse"
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-300 hover:text-white active:scale-90 transition-all cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.4)]"
        >
          <Zap className="w-4 h-4 text-white" />
        </button>
      </GlassCard>
    </div>
  );
}
