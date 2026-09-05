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
    signInWithGoogle,
    signInWithApple,
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

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
    } else if (!isSupabaseLive) {
      // Local fallback immediate redirection
      router.push("/dashboard");
    }
  };

  const handleAppleAuth = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    const { error } = await signInWithApple();
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

          {/* Social OAuth Buttons: Google & Apple */}
          <div className="space-y-2.5 mb-4">
            {/* Google 1-Click Login */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Apple 1-Click Login */}
            <button
              type="button"
              onClick={handleAppleAuth}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white font-medium text-xs flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.02-.48 2.64-1.23z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

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
