"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Grid,
  TrendingUp,
  BookOpen,
  History,
  Calculator,
  Layers,
  Zap,
  ArrowRight,
} from "lucide-react";
import { GlassCard } from "../glass/GlassCard";
import { GlassButton } from "../glass/GlassButton";
import { SynapsesLogo } from "../brand/SynapsesLogo";

export function AntigravityNavbar() {
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);

  const apps = [
    { name: "Synapses Journal", desc: "Institutional Analytics", href: "/dashboard", icon: <TrendingUp className="w-5 h-5 text-white" /> },
    { name: "Trade Journal", desc: "Psychology & Playbook", href: "/dashboard/journal", icon: <BookOpen className="w-5 h-5 text-zinc-300" /> },
    { name: "Market Replay", desc: "Bar-by-Bar Backtesting", href: "/dashboard/backtesting", icon: <History className="w-5 h-5 text-zinc-300" /> },
    { name: "Risk Calculator", desc: "Lot Size & Guardrails", href: "/dashboard/calculator", icon: <Calculator className="w-5 h-5 text-white" /> },
    { name: "Broker Gateway", desc: "Live MT5/cTrader Sync", href: "/login", icon: <Zap className="w-5 h-5 text-zinc-300" /> },
    { name: "Quantum Docs", desc: "System Architecture", href: "/dashboard", icon: <Layers className="w-5 h-5 text-white" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-4 pointer-events-none">
      <div className="w-full max-w-6xl flex items-center justify-between pointer-events-auto h-16">
        {/* Brand Header with Big Official Synapses Investments Logo (Flush, In-Line) */}
        <Link href="/" className="flex items-center h-full">
          <GlassCard className="px-5 h-full flex items-center justify-center bg-black/85 backdrop-blur-2xl border-white/15 hover:border-white/35 transition-all shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            <SynapsesLogo theme="white" size="md" />
          </GlassCard>
        </Link>

        {/* Center Nav Links (Flush, In-Line) */}
        <div className="hidden md:flex items-center h-full">
          <GlassCard className="px-7 h-full flex items-center gap-6 bg-black/80 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            <Link
              href="/dashboard/journal"
              className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Journal
            </Link>
            <Link
              href="/dashboard/analytics"
              className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/dashboard/backtesting"
              className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Replay Simulator
            </Link>
            <Link
              href="/dashboard/calculator"
              className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Risk Calculator
            </Link>
          </GlassCard>
        </div>

        {/* Right Actions: App Drawer + SN Journal Button (Flush, In-Line) */}
        <div className="flex items-center gap-2.5 h-full">
          {/* App Drawer Launcher */}
          <div className="relative h-full flex items-center">
            <button
              onClick={() => setIsAppDrawerOpen((prev) => !prev)}
              className="h-full px-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95 flex items-center justify-center"
              title="Synapses Ecosystem"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* App Drawer Popover */}
            {isAppDrawerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsAppDrawerOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 p-3.5 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-50 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 px-1">
                    <span className="text-xs font-bold text-white tracking-wider">
                      SYNAPSES ECOSYSTEM
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">v3.4 PRO</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {apps.map((app, idx) => (
                      <Link
                        key={idx}
                        href={app.href}
                        onClick={() => setIsAppDrawerOpen(false)}
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all flex flex-col gap-1.5 group"
                      >
                        <div className="p-1.5 rounded-lg bg-black/50 w-fit border border-white/10 group-hover:scale-105 transition-transform text-white">
                          {app.icon}
                        </div>
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                          {app.name}
                        </span>
                        <span className="text-[10px] text-zinc-500">{app.desc}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Unified "SN Journal" Button (Exact Height Match) */}
          <Link href="/login" className="h-full flex items-center">
            <button className="h-full px-6 rounded-2xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer">
              <span>SN Journal</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
