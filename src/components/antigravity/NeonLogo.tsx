"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Orbit } from "lucide-react";
import { SynapsesLogo } from "../brand/SynapsesLogo";

export function NeonLogo() {
  return (
    <div className="flex flex-col items-center select-none group">
      {/* Zero-G Quantum Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-3.5 py-1 mb-6 rounded-full bg-white/[0.05] border border-white/15 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.08)] text-[11px] font-semibold tracking-widest text-zinc-300 uppercase"
      >
        <Orbit className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: "10s" }} />
        <span>Zero-G Physics Engine</span>
        <span className="w-1 h-1 rounded-full bg-white animate-ping" />
        <span className="text-zinc-500 font-mono">v3.4 PRO</span>
      </motion.div>

      {/* Main Synapses Investments Logo (Hero Presentation) */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="flex flex-col items-center justify-center cursor-pointer max-w-full px-4"
      >
        <SynapsesLogo theme="white" size="hero" />
      </motion.div>

      {/* Subtitle Telemetry */}
      <div className="flex items-center gap-3 mt-5">
        <span className="text-xs font-mono tracking-[0.2em] text-zinc-400 uppercase">
          INSTITUTIONAL QUANTUM TERMINAL
        </span>
        <span className="text-zinc-600 text-xs">•</span>
        <span className="text-xs font-mono tracking-[0.2em] text-white uppercase flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3 text-white" /> SYNAPSES JOURNAL
        </span>
      </div>
    </div>
  );
}
