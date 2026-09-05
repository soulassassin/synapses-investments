"use client";

import React, { useState } from "react";
import { Search, Mic, Camera, ArrowRight, TrendingUp, Sparkles, X, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const suggestions = [
    { text: "Launch Synapses Journal Terminal", route: "/dashboard", icon: <TrendingUp className="w-4 h-4 text-white" /> },
    { text: "Institutional Broker Gateway (MT5, cTrader, IBKR)", route: "/login", icon: <Activity className="w-4 h-4 text-zinc-300" /> },
    { text: "NAS100 Range Expansion Backtesting Replay", route: "/dashboard/backtesting", icon: <Sparkles className="w-4 h-4 text-white" /> },
    { text: "Trade Journal & Psychology Mistake Tracker", route: "/dashboard/journal", icon: <TrendingUp className="w-4 h-4 text-zinc-300" /> },
    { text: "Dynamic Position Sizing & Risk Calculator", route: "/dashboard/calculator", icon: <Activity className="w-4 h-4 text-white" /> },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) {
      router.push("/dashboard");
      return;
    }
    const match = suggestions.find((s) => s.text.toLowerCase().includes(query.toLowerCase()));
    if (match) {
      router.push(match.route);
    } else {
      router.push(`/dashboard?search=${encodeURIComponent(query)}`);
    }
  };

  const handleMicClick = () => {
    setIsListening(true);
    setQuery("Connecting Synapses Journal...");
    setTimeout(() => {
      setIsListening(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-30">
      <form onSubmit={handleSearchSubmit} className="relative group">
        {/* Glass Container */}
        <div
          className={`flex items-center px-5 sm:px-6 py-3.5 sm:py-4 rounded-full bg-white/[0.04] backdrop-blur-2xl border transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.8)] ${
            isFocused
              ? "border-white/50 bg-white/[0.08] shadow-[0_0_35px_rgba(255,255,255,0.15)]"
              : "border-white/[0.12] hover:border-white/[0.25] hover:bg-white/[0.06]"
          }`}
        >
          {/* Search Icon */}
          <Search
            className={`w-5 h-5 mr-3 shrink-0 transition-colors ${
              isFocused ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
            }`}
          />

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search plays, tickers, metrics, or type 'journal'..."
            className="w-full bg-transparent border-none outline-none text-white placeholder-zinc-500 text-sm sm:text-base font-normal tracking-wide [word-spacing:0.1em]"
          />

          {/* Clear button if text */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-zinc-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice & Lens Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-white/10 shrink-0">
            <button
              type="button"
              onClick={handleMicClick}
              title="Voice Search"
              className={`p-1.5 rounded-full transition-all duration-200 hover:bg-white/10 cursor-pointer ${
                isListening ? "text-white animate-pulse bg-white/20 scale-110" : "text-zinc-400 hover:text-white hover:scale-110"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard/journal")}
              title="Visual Chart Search & Upload"
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggestion Dropdown */}
        {isFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 py-2 px-1 rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-3 py-1 text-[11px] font-mono tracking-widest [word-spacing:0.15em] text-zinc-500 uppercase">
              QUICK COMMAND LAUNCHER
            </div>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onMouseDown={() => router.push(item.route)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.08] hover:border-white/10 cursor-pointer transition-all duration-150 group/item"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-white group-hover/item:scale-110 transition-transform duration-150">
                    {item.icon}
                  </div>
                  <span className="text-sm text-zinc-200 group-hover/item:text-white font-medium transition-colors">
                    {item.text}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover/item:text-white group-hover/item:translate-x-1 transition-all duration-150" />
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Dual Action Buttons */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6">
        <button
          onClick={() => handleSearchSubmit()}
          className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 text-zinc-200 hover:text-white hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-200 active:scale-95 cursor-pointer"
        >
          Synapses Search
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="synapses-pill-btn px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-black animate-spin" style={{ animationDuration: "6s" }} />
          <span>Launch Synapses Trading</span>
        </button>
      </div>
    </div>
  );
}
