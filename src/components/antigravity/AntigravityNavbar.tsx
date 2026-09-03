"use client";

import React, { useState, useEffect } from "react";
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
  Menu,
  X,
  Sparkles,
  Terminal,
} from "lucide-react";
import { SynapsesLogo } from "../brand/SynapsesLogo";
import { useAuth } from "@/context/AuthContext";

export function AntigravityNavbar() {
  const { user, profile } = useAuth();
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "About", href: "/about", desc: "Institutional philosophy & edge", icon: <History className="w-4 h-4" /> },
    { name: "Intelligence", href: "/blog", desc: "High-signal research & setups", icon: <Layers className="w-4 h-4" /> },
    { name: "Journal", href: "/dashboard/journal", desc: "ICT / SMC execution logging", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Manifesto", href: "/what-is-sn-journal", desc: "Why mechanical feedback wins", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Risk Calculator", href: "/dashboard/calculator", desc: "Lot sizing & stop-loss bounds", icon: <Calculator className="w-4 h-4" /> },
  ];

  const apps = [
    { name: "About Synapses", desc: "Zero-G Thesis & Vision", href: "/about", icon: <History className="w-5 h-5 text-zinc-300" /> },
    { name: "Broker Gateway", desc: "Live MT5/cTrader Sync", href: "/login", icon: <Zap className="w-5 h-5 text-zinc-300" /> },
    { name: "Intelligence", desc: "Research & Order Flow", href: "/blog", icon: <Layers className="w-5 h-5 text-white" /> },
    { name: "Risk Calculator", desc: "Dynamic Lot Guardrails", href: "/dashboard/calculator", icon: <Calculator className="w-5 h-5 text-white" /> },
    { name: "SN Manifesto", desc: "Mechanical Execution", href: "/what-is-sn-journal", icon: <TrendingUp className="w-5 h-5 text-zinc-300" /> },
    { name: "Trade Journal", desc: "ICT & SMC Playbook", href: "/dashboard/journal", icon: <BookOpen className="w-5 h-5 text-white" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-black/80 hover:bg-black/90 backdrop-blur-2xl border-b border-white/10 hover:border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-18 sm:h-20 px-3.5 sm:px-8 lg:px-10">
        {/* Brand Header: Clean, Unboxed Synapses Logo with Generous Padding */}
        <Link
          href="/"
          className="flex items-center py-2 px-1.5 sm:py-3 sm:px-6 select-none hover:opacity-90 active:scale-95 transition-all shrink-0"
          title="Synapses Investments Home"
        >
          <SynapsesLogo theme="white" size="md" />
        </Link>

        {/* Center Nav Links (Desktop: Alphabetical Order) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 lg:px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] tracking-widest [word-spacing:0.18em] transition-all duration-200 active:scale-95 whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions: App Drawer + Login Button + Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* App Drawer Launcher */}
          <div className="relative flex items-center">
            <button
              onClick={() => setIsAppDrawerOpen((prev) => !prev)}
              className="p-2.5 sm:p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-95 flex items-center justify-center cursor-pointer"
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
                <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 p-3.5 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] z-50 animate-in zoom-in-95 duration-150">
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

          {/* Unified "Login" / "Terminal" Button (Desktop & Tablet) */}
          {user ? (
            <Link href="/dashboard" className="hidden sm:flex items-center group">
              <button className="py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono tracking-wider">{profile?.callsign || user.email?.split("@")[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:flex items-center group">
              <button className="py-2.5 px-5 sm:px-6 rounded-xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 tracking-widest [word-spacing:0.18em] transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.45)] cursor-pointer">
                <span>Login</span>
                <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </Link>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-zinc-300 hover:text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Navigation Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-18 sm:top-20 bottom-0 bg-black/95 backdrop-blur-3xl border-t border-white/10 z-50 flex flex-col justify-between p-5 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest [word-spacing:0.15em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                NAVIGATION SYSTEM
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                v3.4 PRO
              </span>
            </div>

            {/* Mobile Nav Links List */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-white group-hover:scale-110 transition-transform">
                      {link.icon}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block tracking-wide">
                        {link.name}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-sans block">
                        {link.desc}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            {/* Terminal Access Action Cards */}
            <div className="pt-2 grid grid-cols-2 gap-2.5">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/25 flex flex-col gap-1 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-white text-xs font-bold tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Terminal
                </div>
                <span className="text-[10px] text-zinc-500">Live Workspace</span>
              </Link>
              <Link
                href="/dashboard/backtesting"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/25 flex flex-col gap-1 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-white text-xs font-bold tracking-wider">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  Replay
                </div>
                <span className="text-[10px] text-zinc-500">Tick Simulator</span>
              </Link>
            </div>
          </div>

          {/* Bottom Actions on Mobile: Login Button & System Status */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full"
              >
                <button className="w-full py-3.5 px-6 rounded-2xl bg-white/[0.08] border border-white/20 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.15] active:scale-98 tracking-widest [word-spacing:0.18em] transition-all cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Enter Terminal ({profile?.callsign || "Active"})</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full"
              >
                <button className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-98 tracking-widest [word-spacing:0.18em] transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] cursor-pointer">
                  <span>Login to Terminal</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </Link>
            )}

            <div className="text-center text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYNAPSES ZERO-G NETWORK • ONLINE</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
