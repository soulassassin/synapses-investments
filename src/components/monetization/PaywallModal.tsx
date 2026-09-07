"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Tag,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTrades } from "@/context/TradeContext";

export function PaywallModal() {
  const router = useRouter();
  const { user, subscription, updateSubscription } = useAuth();
  const { isPaywallOpen, paywallReason, closePaywall, trades, maxDemoTrades } = useTrades();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [paymentRail, setPaymentRail] = useState<"card" | "paystack" | "crypto" | "paypal">("card");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Promo code in modal
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPct: number } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  if (!isPaywallOpen) return null;

  const isPro = subscription.isPro;
  const isTrial = subscription.isTrialActive;
  const daysLeft = subscription.trialDaysRemaining;
  const tradesCount = trades.length;

  const isZAR = paymentRail === "paystack";
  const basePrice = isZAR
    ? billingCycle === "monthly" ? 499 : 399
    : billingCycle === "monthly" ? 29 : 24;

  const discountMultiplier = appliedPromo ? (100 - appliedPromo.discountPct) / 100 : 1.0;
  const finalPrice = Number((basePrice * discountMultiplier).toFixed(2));

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    try {
      const res = await fetch("/api/checkout/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, plan: billingCycle }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setAppliedPromo({ code: data.coupon.code, discountPct: data.coupon.discountPct });
        setPromoCode("");
      } else {
        setErrorMessage(data.error || "Invalid promo code.");
      }
    } catch {
      setErrorMessage("Failed to validate promo code.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const email = user?.email || "trader@synapsesinvestments.com";
      const userId = user?.id || "demo-trader-01";

      if (paymentRail === "paystack") {
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
          await updateSubscription("pro", "paystack", data.reference);
          setIsLoading(false);
          closePaywall();
          return;
        }

        window.location.href = data.authorization_url;
      } else if (paymentRail === "crypto") {
        await updateSubscription("pro", "lemonsqueezy", "crypto_sim_01");
        setIsLoading(false);
        closePaywall();
        router.push("/dashboard?payment=success&provider=crypto");
      } else if (paymentRail === "paypal") {
        await updateSubscription("pro", "lemonsqueezy", "paypal_sim_01");
        setIsLoading(false);
        closePaywall();
        router.push("/dashboard?payment=success&provider=paypal");
      } else {
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
      <div className="relative z-10 w-full max-w-2xl my-auto rounded-3xl bg-[#08090c] border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Glowing Emerald Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-[#10b981]/15 via-[#0d0f14] to-[#08090c] border-b border-white/10">
          <button
            onClick={closePaywall}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-sans">
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
        <div className="p-6 sm:p-8 space-y-5">
          {/* Payment Method Selector (4 Industry Rails) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                SELECT PAYMENT RAIL
              </label>
              <div className="flex gap-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    billingCycle === "monthly" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    billingCycle === "annual" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-normal">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setPaymentRail("card")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentRail === "card"
                    ? "bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border-white/10"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="text-[10px]">Cards / Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentRail("paystack")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentRail === "paystack"
                    ? "bg-emerald-500 text-black font-bold border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border-white/10"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="text-[10px]">Paystack (ZAR)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentRail("crypto")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentRail === "crypto"
                    ? "bg-cyan-500 text-black font-bold border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                    : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border-white/10"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px]">Crypto Web3</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentRail("paypal")}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentRail === "paypal"
                    ? "bg-blue-500 text-white font-bold border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border-white/10"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[10px]">PayPal</span>
              </button>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                  {isZAR ? `R${finalPrice}` : `$${finalPrice}`}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  / {billingCycle === "annual" ? "year" : "month"}
                </span>
                {appliedPromo && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {appliedPromo.discountPct}% OFF ({appliedPromo.code})
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono text-emerald-400 block mt-1">
                {isZAR
                  ? "✓ Processed in South Africa (Cards, Capitec Pay, Instant EFT)"
                  : "✓ Processed globally (Automated 7-Week Trial Tokenization)"}
              </span>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 sm:text-right">
              <div>49 Days Free Full Access</div>
              <div className="text-zinc-500">Cancel anytime with 1-click</div>
            </div>
          </div>

          {/* Promo Code Input Field */}
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Promo Code (e.g. SYNAPSES20)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs uppercase focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={isApplyingPromo || !promoCode.trim()}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              {isApplyingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
            </button>
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
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm font-mono tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>INITIALIZING SECURE GATEWAY...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                <span>
                  START 7-WEEK FREE TRIAL ({isZAR ? `R${finalPrice}/mo` : `$${finalPrice}/mo`})
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Full Checkout Page Link */}
          <div className="text-center pt-1">
            <Link
              href={`/checkout?plan=pro&billing=${billingCycle}`}
              onClick={closePaywall}
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>Or open dedicated checkout portal with full crypto & card parameters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
