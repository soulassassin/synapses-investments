"use client";

import React from "react";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import { FloatingCanvas } from "@/components/antigravity/FloatingCanvas";

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col justify-between bg-black text-white font-sans">
      {/* Top Navbar */}
      <AntigravityNavbar />

      {/* Main Synapses Quantum Canvas */}
      <FloatingCanvas />

      {/* Footer System Status Bar */}
      <footer className="fixed bottom-3 left-6 z-30 pointer-events-none hidden md:flex items-center gap-3 text-[11px] font-mono text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_#FFFFFF]" />
          SYNAPSES QUANTUM NETWORK: ONLINE
        </span>
        <span>•</span>
        <span>DMA LATENCY: 2.4ms</span>
        <span>•</span>
        <span>ZERO-G PHYSICS ENGINE ACTIVE</span>
      </footer>
    </main>
  );
}
