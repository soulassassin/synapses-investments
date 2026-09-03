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
import { SynapsesLogo } from "../brand/SynapsesLogo";

export function AntigravityNavbar() {
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);

  const apps = [
    { name: "About Synapses", desc: "Zero-G Thesis & Vision", href: "/about", icon: <History className="w-5 h-5 text-zinc-300" /> },
    { name: "Broker Gateway", desc: "Live MT5/cTrader Sync", href: "/login", icon: <Zap className="w-5 h-5 text-zinc-300" /> },
    { name: "Intelligence", desc: "Research & Order Flow", href: "/blog", icon: <Layers className="w-5 h-5 text-white" /> },
    { name: "Risk Calculator", desc: "Dynamic Lot Guardrails", href: "/dashboard/calculator", icon: <Calculator className="w-5 h-5 text-white" /> },
    { name: "SN Manifesto", desc: "Mechanical Execution", href: "/what-is-sn-journal", icon: <TrendingUp className="w-5 h-5 text-zinc-300" /> },
    { name: "Trade Journal", desc: "ICT & SMC Playbook", href: "/dashboard/journal", icon: <BookOpen className="w-5 h-5 text-white" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/75 hover:bg-black/85 backdrop-blur-2xl border-b border-white/10 hover:border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-20 px-6 sm:px-10">
        {/* Brand Header: Clean, Unboxed Synapses Logo with Generous Padding */}
        <Link
          href="/"
          className="flex items-center py-3 px-4 sm:px-6 mr-3 select-none hover:opacity-90 active:scale-95 transition-all shrink-0"
          title="Synapses Investments Home"
        >
          <SynapsesLogo theme="white" size="md" />
        </Link>

        {/* Center Nav Links (Alphabetical Order: About, Intelligence, Journal, Manifesto, Risk Calculator) */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            href="/about"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] tracking-widest [word-spacing:0.18em] transition-all duration-200 active:scale-95"
          >
            About
          </Link>
          <Link
            href="/blog"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] tracking-widest [word-spacing:0.18em] transition-all duration-200 active:scale-95"
          >
            Intelligence
          </Link>
          <Link
            href="/dashboard/journal"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] tracking-widest [word-spacing:0.18em] transition-all duration-200 active:scale-95"
          >
            Journal
          </Link>
          <Link
            href="/what-is-sn-journal"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] tracking-widest [word-spacing:0.18em] transition-all duration-200 active:scale-95"
          >
            Manifesto
          </Link>
          <Link
            href="/dashboard/calculator"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] tracking-widest [word-spacing:0.18em] transition-all duration-200 active:scale-95"
          >
            Risk Calculator
          </Link>
        </nav>

        {/* Right Actions: App Drawer + Login Button */}
        <div className="flex items-center gap-3">
          {/* App Drawer Launcher */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsAppDrawerOpen((prev) => !prev)}
              className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95 flex items-center justify-center cursor-pointer"
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
                <div className="absolute right-0 top-full mt-3 w-80 p-3.5 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-50 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10 px-1">
                    <span className="text-xs font-bold text-white tracking-[0.2em] [word-spacing:0.25em]">
                      SYNAPSES ECOSYSTEM
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 tracking-wider">v3.4 PRO</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {apps.map((app, idx) => (
                      <Link
                        key={idx}
                        href={app.href}
                        onClick={() => setIsAppDrawerOpen(false)}
                        className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-200 flex flex-col gap-1.5 group"
                      >
                        <div className="p-1.5 rounded-lg bg-black/50 w-fit border border-white/10 group-hover:scale-110 group-hover:border-white/30 transition-all duration-200 text-white">
                          {app.icon}
                        </div>
                        <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors tracking-wider">
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

          {/* Unified "Login" Button with Letter & Word Spacing */}
          <Link href="/login" className="flex items-center group">
            <button className="py-2.5 px-6 rounded-xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-widest [word-spacing:0.18em] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] cursor-pointer">
              <span>Login</span>
              <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
