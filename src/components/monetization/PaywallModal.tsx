"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Zap,
  ShieldCheck,
  CreditCard,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTrades } from "@/context/TradeContext";

export function PaywallModal() {
  const { user, subscription, updateSubscription } = useAuth();
  const { isPaywallOpen, paywallReason, closePaywall, trades, maxDemoTrades } = useTrades();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [currencyRail, setCurrencyRail] = useState<"ZAR" | "USD">("ZAR");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isPaywallOpen) return null;

  const isPro = subscription.isPro;
  const isTrial = subscription.isTrialActive;
  const daysLeft = subscription.trialDaysRemaining;
  const tradesCount = trades.length;

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const email = user?.email || "trader@synapsesinvestments.com";
      const userId = user?.id || "demo-trader-01";

      if (currencyRail === "ZAR") {
        // Paystack (South Africa) Rail
        const res = await fetch("/api/checkout/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userId,
            plan: billingCycle,
            returnUrl: window.location.href,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to initialize Paystack checkout.");
        }

        if (data.mode === "sandbox") {
          // Instantly upgrade in sandbox simulation
          await updateSubscription("pro", "paystack", data.reference);
          setIsLoading(false);
          closePaywall();
          return;
        }

        // Live redirect to Paystack hosted payment page
        window.location.href = data.authorization_url;
      } else {
        // Lemon Squeezy / Global USD Rail
        const res = await fetch("/api/checkout/lemonsqueezy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userId,
            plan: billingCycle,
            returnUrl: window.location.href,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to initialize International checkout.");
        }

        if (data.mode === "sandbox") {
          await updateSubscription("pro", "lemonsqueezy", "sub_ls_simulated");
          setIsLoading(false);
          closePaywall();
          return;
        }

        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      console.error("Checkout initiation error:", err);
      setErrorMessage(err?.message || "Payment initialization failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Deep Obsidian Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
        onClick={closePaywall}
      />

      {/* Quantum Terminal Card */}
      <div className="relative z-10 w-full max-w-2xl my-auto rounded-2xl bg-[#08090c] border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glowing Emerald Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#10b981]/15 via-[#0d0f14] to-[#08090c] border-b border-white/10">
          <button
            onClick={closePaywall}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close paywall"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Telemetry Status Line */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              7-WEEK FULL ACCESS TRIAL ACTIVE
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              [TELEMETRY: {daysLeft} DAYS REMAINING IN WINDOW]
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Institutional Pro Terminal Access
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl">
            {paywallReason ||
              "Unlock unlimited execution logs, automated MT4/MT5/cTrader gateway scanning, Spot DMA order execution, and institutional quantitative analytics."}
          </p>

          {/* Demo Quota Meter */}
          <div className="mt-4 p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  Trial Window: 49 Days Total Access
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  Free demo tier is capped at {maxDemoTrades} trade logs ({tradesCount}/{maxDemoTrades} used)
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold text-emerald-400 block">
                {daysLeft} Days
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block">
                Before Paywall Lock
              </span>
            </div>
          </div>
        </div>

        {/* Configuration Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Dual Multi-Rail Switchers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Currency Rail: South Africa (ZAR) vs Global (USD) */}
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                PAYMENT PROCESSING RAIL
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrencyRail("ZAR")}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                    currencyRail === "ZAR"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>South Africa (ZAR)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrencyRail("USD")}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                    currencyRail === "USD"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Global (USD)</span>
                </button>
              </div>
            </div>

            {/* Billing Cycle: Monthly vs Annual */}
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                SUBSCRIPTION BILLING CYCLE
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                    billingCycle === "annual"
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-normal">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                  {currencyRail === "ZAR"
                    ? billingCycle === "annual"
                      ? "R4,790"
                      : "R499"
                    : billingCycle === "annual"
                    ? "$279"
                    : "$29"}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  / {billingCycle === "annual" ? "year" : "month"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                {currencyRail === "ZAR"
                  ? "✓ Processed locally via Paystack (Cards, Instant EFT, SnapScan)"
                  : "✓ Processed globally via Lemon Squeezy / Stripe (Automated 7-Week Trial Tokenization)"}
              </span>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 sm:text-right">
              <div>No lock-in contracts</div>
              <div className="text-zinc-500">Cancel anytime with 1-click</div>
            </div>
          </div>

          {/* Feature Comparison Matrix */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
              INSTITUTIONAL PRO CAPABILITIES INCLUDED
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Unlimited Trade Journaling (No 25-cap)</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>MT4/MT5/cTrader Gateway Scanner</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Spot DMA Direct Market Order Entry</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Unlimited CSV Statement Drag & Drop</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Multi-Account Portfolio Consolidation</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Quantitative Psychology & Mistake Tagging</span>
              </div>
            </div>
          </div>

          {/* Error Message if Any */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Primary Checkout CTA */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleCheckout}
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm font-mono tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>INITIALIZING {currencyRail} SECURE GATEWAY...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                <span>
                  {isTrial
                    ? `LOCK IN PRO ACCESS (${currencyRail === "ZAR" ? "R499/mo" : "$29/mo"})`
                    : `ACTIVATE INSTITUTIONAL PRO (${currencyRail === "ZAR" ? "R499/mo" : "$29/mo"})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Footer Security Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[10px] font-mono text-zinc-500 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>PCI-DSS Level 1 Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              <span>Visa, Mastercard, Instant EFT, Amex</span>
            </div>
            <div>Synapses Investments LLC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
