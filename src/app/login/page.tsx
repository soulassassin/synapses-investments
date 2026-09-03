"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { SynapsesLogo } from "@/components/brand/SynapsesLogo";
import {
  Lock,
  Mail,
  Fingerprint,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Building,
  UserCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"SIGN_IN" | "INSTITUTIONAL">("SIGN_IN");
  const [email, setEmail] = useState("trader@synapsesinvestments.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const brokerPlatforms = [
    { name: "MetaTrader 5", code: "MT5" },
    { name: "cTrader", code: "cT" },
    { name: "TradingView", code: "TV" },
    { name: "Interactive Brokers", code: "IBKR" },
    { name: "NinjaTrader", code: "NT8" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 900);
  };

  const handleBiometricAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-12 select-none">
      {/* Background Return to Synapses Quantum Canvas */}
      <div className="fixed top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Synapses Quantum Canvas</span>
        </Link>
      </div>

      {/* Centered Frosted Glass Portal */}
      <div className="w-full max-w-md relative z-10 animate-in zoom-in-95 duration-300">
        {/* Subtle White Glow Ring */}
        <div className="absolute -inset-1 rounded-3xl bg-white/[0.06] blur-xl opacity-75 -z-10" />

        <GlassCard className="p-6 sm:p-8 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <SynapsesLogo variant="horizontal" theme="white" size="md" className="mb-2" />
            <span className="text-xs font-mono text-zinc-400 tracking-widest uppercase mt-2">
              SYNAPSES JOURNAL GATEWAY
            </span>
          </div>

          {/* Tabbed Access */}
          <div className="grid grid-cols-2 p-1 bg-white/[0.04] rounded-xl border border-white/10 mb-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("SIGN_IN")}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "SIGN_IN"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Trader Sign In</span>
            </button>
            <button
              onClick={() => setActiveTab("INSTITUTIONAL")}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "INSTITUTIONAL"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Institutional Prop</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1.5 uppercase">
                {activeTab === "INSTITUTIONAL" ? "FIRM / INSTITUTIONAL EMAIL" : "TRADER EMAIL ADDRESS"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@synapsesinvestments.com"
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-mono text-zinc-400 uppercase">PASSWORD / PASSKEY</label>
                <a href="#forgot" className="text-[11px] text-white hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full glass-input pl-10 pr-12 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  title="Biometric Passkey"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors"
                >
                  <Fingerprint className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-black text-white focus:ring-0"
                />
                <span>Remember Terminal Session</span>
              </label>
              <span className="text-[11px] font-mono text-white">SSL Encrypted</span>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full synapses-pill-btn py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-black" />
                  <span>Enter Synapses Journal</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass Button */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Instant Launch Demo Terminal</span>
            </button>
          </div>

          {/* Live Broker Quick Sync Row */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block text-center mb-2.5">
              1-CLICK FAST BROKER & PLATFORM SYNC
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {brokerPlatforms.map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => setTimeout(() => router.push("/dashboard"), 400)}
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center gap-1 group"
                >
                  <span className="text-xs font-bold font-mono text-white group-hover:scale-110 transition-transform">
                    {b.code}
                  </span>
                  <span className="text-[9px] text-zinc-400 truncate max-w-full block">
                    {b.name.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Security Badges */}
          <div className="mt-6 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center text-[10px] font-mono text-zinc-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <span>256-Bit Bank-Grade • Zero-Knowledge Logging • API-Read-Only</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
