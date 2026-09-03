"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/glass/GlassCard";
import { SynapsesLogo } from "@/components/brand/SynapsesLogo";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  UserPlus,
  LogIn,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGitHub,
    signInDemoUser,
    isSupabaseLive,
  } = useAuth();

  const [authMode, setAuthMode] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const brokerPlatforms = [
    { name: "MetaTrader 5", code: "MT5" },
    { name: "cTrader", code: "cT" },
    { name: "TradingView", code: "TV" },
    { name: "Interactive Brokers", code: "IBKR" },
    { name: "NinjaTrader", code: "NT8" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (authMode === "SIGN_UP") {
        const { error, needsEmailVerification } = await signUpWithEmail(
          email,
          password,
          fullName
        );

        if (error) {
          setErrorMessage(error);
          setIsLoading(false);
          return;
        }

        if (needsEmailVerification) {
          setSuccessMessage(
            "Account created! Please check your email to verify your address before entering the terminal."
          );
          setIsLoading(false);
          return;
        }

        // Proceed to onboarding flow
        router.push("/onboarding");
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error);
          setIsLoading(false);
          return;
        }

        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubAuth = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    const { error } = await signInWithGitHub();
    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
    } else if (!isSupabaseLive) {
      // Local fallback immediate redirection
      router.push("/dashboard");
    }
  };

  const handleDemoLogin = () => {
    signInDemoUser();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-12 select-none">
      {/* Return to Quantum Canvas */}
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
        <div className="absolute -inset-1 rounded-3xl bg-white/[0.06] blur-xl opacity-75 -z-10" />

        <GlassCard className="p-6 sm:p-8 bg-black/90 backdrop-blur-2xl border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <SynapsesLogo variant="horizontal" theme="white" size="md" className="mb-2" />
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
                {authMode === "SIGN_IN" ? "TRADER TERMINAL GATEWAY" : "CREATE TRADER PROFILE"}
              </span>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                  isSupabaseLive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/10 text-zinc-300 border-white/15"
                }`}
                title={isSupabaseLive ? "Connected to Supabase" : "Running on secure local engine"}
              >
                {isSupabaseLive ? "LIVE SUPABASE" : "SANDBOX"}
              </span>
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-white/[0.04] rounded-xl border border-white/10 mb-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("SIGN_IN");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "SIGN_IN"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("SIGN_UP");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === "SIGN_UP"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* GitHub 1-Click OAuth Button */}
          <button
            type="button"
            onClick={handleGitHubAuth}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all mb-4 group cursor-pointer"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-zinc-950 px-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest absolute">
              OR EMAIL
            </span>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === "SIGN_UP" && (
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1.5 uppercase">
                  TRADER NAME / CALLSIGN
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Apex Alpha"
                    className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1.5 uppercase">
                TRADER EMAIL ADDRESS
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
                <label className="text-[11px] font-mono text-zinc-400 uppercase">
                  PASSWORD
                </label>
                {authMode === "SIGN_IN" && (
                  <span className="text-[11px] text-zinc-400 hover:text-white cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Remember Me / Terms */}
            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-black text-white focus:ring-0"
                />
                <span>
                  {authMode === "SIGN_IN"
                    ? "Remember Terminal Session"
                    : "Agree to ICT Execution Standards"}
                </span>
              </label>
              <span className="text-[11px] font-mono text-white">SSL Encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full synapses-pill-btn py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mt-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-black" />
                  <span>
                    {authMode === "SIGN_IN" ? "Enter Synapses Journal" : "Begin Trader Onboarding"}
                  </span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Instant Sandbox Access */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              <span>Instant Launch Demo Terminal</span>
            </button>
          </div>

          {/* Broker Quick Sync Row */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block text-center mb-2.5">
              SUPPORTED BROKER & PLATFORM PROTOCOLS
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {brokerPlatforms.map((b) => (
                <div
                  key={b.code}
                  className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-1 text-center"
                >
                  <span className="text-xs font-bold font-mono text-white">
                    {b.code}
                  </span>
                  <span className="text-[9px] text-zinc-400 truncate max-w-full block">
                    {b.name.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center text-[10px] font-mono text-zinc-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <span>256-Bit Bank-Grade • Zero-Knowledge Logging • Supabase RLS</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
