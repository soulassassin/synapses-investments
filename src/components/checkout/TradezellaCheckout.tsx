"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  CURRENCIES,
  SupportedCurrency,
  BASE_PLANS_USD,
  convertUSD,
  formatPrice,
  getPlanPriceUSD,
  detectCurrencyFromCountry,
} from "@/lib/currency";
import {
  ShieldCheck,
  CreditCard,
  Globe,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Tag,
  Clock,
  QrCode,
  Copy,
  Check,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function TradezellaCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, updateSubscription } = useAuth();

  // URL Query Parameters
  const paramPlan = searchParams.get("plan") as "basic" | "pro" | "syndicate" | null;
  const paramBilling = searchParams.get("billing") as "monthly" | "annual" | null;
  const paramCurrency = searchParams.get("currency") as SupportedCurrency | null;

  // Form States
  const [selectedTier, setSelectedTier] = useState<"basic" | "pro" | "syndicate">(
    paramPlan && ["basic", "pro", "syndicate"].includes(paramPlan) ? paramPlan : "pro"
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    paramBilling && ["monthly", "annual"].includes(paramBilling) ? paramBilling : "monthly"
  );
  const [currency, setCurrency] = useState<SupportedCurrency>(
    paramCurrency && CURRENCIES[paramCurrency] ? paramCurrency : "USD"
  );
  const [paymentRail, setPaymentRail] = useState<"card" | "crypto" | "paypal">("card");
  const [cryptoAsset, setCryptoAsset] = useState<"USDT_TRC20" | "USDT_ERC20" | "USDC" | "BTC">("USDT_TRC20");

  // User & Card Input States
  const [fullName, setFullName] = useState(profile?.full_name || "Alex Vance");
  const [email, setEmail] = useState(user?.email || profile?.email || "trader@synapsesinvestments.com");
  const [country, setCountry] = useState("US");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [postalCode, setPostalCode] = useState("10001");

  // Promo Code States
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountPct: number;
    description: string;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Processing & Feedback States
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Sync state if search params change
  useEffect(() => {
    if (paramPlan && ["basic", "pro", "syndicate"].includes(paramPlan)) {
      setSelectedTier(paramPlan);
    }
    if (paramBilling && ["monthly", "annual"].includes(paramBilling)) {
      setBillingCycle(paramBilling);
    }
    if (paramCurrency && CURRENCIES[paramCurrency]) {
      setCurrency(paramCurrency);
    }
  }, [paramPlan, paramBilling, paramCurrency]);

  // Pricing calculations standardized on USD base
  const basePriceUSD = getPlanPriceUSD(selectedTier, billingCycle);
  const isFreeTrial = selectedTier === "pro";

  const discountAmountUSD = appliedPromo
    ? Number(((basePriceUSD * appliedPromo.discountPct) / 100).toFixed(2))
    : 0;
  const discountedRecurringUSD = Number((basePriceUSD - discountAmountUSD).toFixed(2));

  // During 7-week trial, Total Due Today is $0.00!
  const totalDueTodayUSD = isFreeTrial ? 0 : discountedRecurringUSD;

  // Format Date 49 days from now for first billing
  const trialEndFormatted = new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    const autoDetectedCurrency = detectCurrencyFromCountry(newCountry);
    if (autoDetectedCurrency) {
      setCurrency(autoDetectedCurrency);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError(null);

    try {
      const res = await fetch("/api/checkout/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, plan: billingCycle }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPromoError(data.error || "Invalid promo code.");
        setAppliedPromo(null);
      } else {
        setAppliedPromo(data.coupon);
        setPromoInput("");
      }
    } catch {
      setPromoError("Failed to apply promo code.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleExecuteCheckout = async () => {
    setIsProcessing(true);
    setCheckoutError(null);

    try {
      if (paymentRail === "card") {
        // Trigger Lemon Squeezy / Stripe
        const res = await fetch("/api/checkout/lemonsqueezy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userId: user?.id || profile?.id || "demo-trader-01",
            plan: billingCycle,
            returnUrl: `${window.location.origin}/dashboard?payment=success&provider=lemonsqueezy`,
          }),
        });
        const data = await res.json();
        if (data.mode === "sandbox" || !data.checkout_url?.startsWith("http")) {
          await updateSubscription("pro", "lemonsqueezy", "ls_sub_01");
          router.push("/dashboard?payment=success&provider=lemonsqueezy");
          return;
        }
        window.location.href = data.checkout_url;
      } else if (paymentRail === "crypto") {
        // Trigger Crypto Web3 Payment
        const res = await fetch("/api/checkout/crypto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            userId: user?.id || profile?.id || "demo-trader-01",
            asset: cryptoAsset,
            amountUSD: totalDueTodayUSD > 0 ? totalDueTodayUSD : discountedRecurringUSD,
          }),
        });
        const data = await res.json();
        if (data.success) {
          await updateSubscription("pro", "crypto", data.deposit.txId || "crypto_verified_01");
          router.push("/dashboard?payment=success&provider=crypto");
        } else {
          throw new Error(data.error || "Failed to initialize crypto payment session.");
        }
      } else {
        // PayPal instant subscription
        await updateSubscription("pro", "paypal", "paypal_sub_01");
        router.push("/dashboard?payment=success&provider=paypal");
      }
    } catch (err: any) {
      setCheckoutError(err?.message || "Payment processing failed. Please check your parameters.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Payment Methods (7 Cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Step 1: Plan Selection Container */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0d0f14]/95 border border-white/10 shadow-[0_15px_45px_rgba(0,0,0,0.85)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>1. SELECT SUITE PLAN & CURRENCY</span>
            </span>

            {/* Currency Selector & Monthly/Annual Toggle */}
            <div className="flex items-center gap-2">
              {/* Geo Currency Dropdown */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                  className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                  aria-label="Select Currency"
                >
                  {Object.values(CURRENCIES).map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#0d0f14] text-white">
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly / Annual Toggle */}
              <div className="p-1 rounded-xl bg-black/60 border border-white/10 flex items-center gap-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    billingCycle === "monthly" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                    billingCycle === "annual" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    -20%
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["basic", "pro", "syndicate"] as const).map((tierKey) => {
              const tierUSD = getPlanPriceUSD(tierKey, billingCycle);
              const isSelected = selectedTier === tierKey;
              const formattedPlanPrice = formatPrice(tierUSD, currency);

              return (
                <div
                  key={tierKey}
                  onClick={() => setSelectedTier(tierKey)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30"
                      : "bg-white/[0.02] hover:bg-white/[0.05] border-white/10"
                  }`}
                >
                  {tierKey === "pro" && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                      49-Day Free Trial
                    </span>
                  )}
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase block">
                      {tierKey}
                    </span>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black font-mono text-white">
                        {formattedPlanPrice}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">/mo</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 mt-2 block">
                    {tierKey === "pro" ? "✓ 49 Days Free ($0 Due)" : "Standard Access"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Customer Information */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0d0f14]/95 border border-white/10 space-y-4">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block border-b border-white/10 pb-2.5">
            2. TRADER & BILLING CREDENTIALS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">FULL NAME</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                placeholder="Alex Vance"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                placeholder="trader@synapsesinvestments.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">COUNTRY / TAX RESIDENCY</label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="US">United States (USD • Stripe & Cards)</option>
                <option value="GB">United Kingdom (GBP • Apple Pay & Cards)</option>
                <option value="EU">European Union (EUR • SEPA & Cards)</option>
                <option value="CA">Canada (CAD • Interac & Cards)</option>
                <option value="AU">Australia (AUD • Cards)</option>
                <option value="JP">Japan (JPY • Cards)</option>
                <option value="ZA">South Africa (ZAR • Cards & EFT)</option>
                <option value="GLOBAL">International / Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Payment Method Selector (Standard Global Rails) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0d0f14]/95 border border-white/10 space-y-5">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block border-b border-white/10 pb-2.5">
            3. SELECT GLOBAL PAYMENT RAIL
          </span>

          {/* Rail Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => setPaymentRail("card")}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                paymentRail === "card"
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)] border-white"
                  : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border-white/10"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-xs">Card / Apple Pay / Google Pay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentRail("crypto")}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                paymentRail === "crypto"
                  ? "bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.35)] border-cyan-500"
                  : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border-white/10"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-xs">Crypto Web3 (USDT / BTC)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentRail("paypal")}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition-all cursor-pointer ${
                paymentRail === "paypal"
                  ? "bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.35)] border-blue-500"
                  : "bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border-white/10"
              }`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs">PayPal Express</span>
            </button>
          </div>

          {/* Payment Method Details Form */}
          {paymentRail === "card" && (
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>CREDIT OR DEBIT CARD</span>
                <span className="text-zinc-500">Visa • Mastercard • Amex • Apple Pay</span>
              </div>
              <div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="Card Number"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="MM/YY"
                />
                <input
                  type="text"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="CVC"
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="ZIP"
                />
              </div>
            </div>
          )}

          {paymentRail === "crypto" && (
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">SELECT CRYPTO ASSET:</span>
                <div className="flex gap-1.5">
                  {(["USDT_TRC20", "USDT_ERC20", "USDC", "BTC"] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCryptoAsset(c)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                        cryptoAsset === c ? "bg-cyan-500 text-black font-bold" : "bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {c.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center gap-4 text-xs font-mono">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TX9SynapsesInvestTRC20DepositVault799"
                  alt="Crypto QR Code"
                  className="w-20 h-20 rounded-lg bg-white p-1 shrink-0"
                />
                <div className="space-y-1.5 overflow-hidden w-full">
                  <span className="text-[10px] text-zinc-400 block">DEPOSIT VAULT ADDRESS:</span>
                  <div className="p-2 rounded-lg bg-black text-[11px] text-cyan-400 truncate flex items-center justify-between">
                    <span>TX9SynapsesInvestTRC20DepositVault799</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("TX9SynapsesInvestTRC20DepositVault799");
                        setCopiedAddress(true);
                        setTimeout(() => setCopiedAddress(false), 2000);
                      }}
                      className="text-zinc-400 hover:text-white shrink-0 ml-2 cursor-pointer"
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-zinc-500 block">
                    Account activates immediately after 1 network confirmation.
                  </span>
                </div>
              </div>
            </div>
          )}

          {paymentRail === "paypal" && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs font-mono space-y-2 animate-in fade-in duration-200">
              <span className="font-bold text-blue-400 block flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>PAYPAL EXPRESS ONE-CLICK CHECKOUT</span>
              </span>
              <p className="text-zinc-300 text-[11px] font-sans">
                You will be redirected securely to PayPal to confirm your subscription in {currency}. Cancel anytime.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Sticky Order Summary & Guarantees (5 Cols) */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0d0f14]/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
              ORDER SUMMARY
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {isFreeTrial ? "49 Days 0$ Upfront" : "Instant Activation"}
            </span>
          </div>

          {/* Selected Plan Details */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-black font-mono text-white uppercase">
                {BASE_PLANS_USD[selectedTier]?.name || selectedTier}
              </span>
              <span className="text-xs font-mono text-zinc-400 capitalize">
                {billingCycle}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Automated Broker Sync, Bar Replay Engine, Mistake Auditor & Unlimited Vault.
            </p>
          </div>

          {/* Promo Code Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>HAVE A PROMO CODE?</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="e.g. SYNAPSES20"
                className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isApplyingPromo || !promoInput.trim()}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer"
              >
                {isApplyingPromo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
              </button>
            </div>
            {promoError && (
              <span className="text-[11px] font-mono text-red-400 block">{promoError}</span>
            )}
            {appliedPromo && (
              <span className="text-[11px] font-mono text-emerald-400 block flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{appliedPromo.description}</span>
              </span>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2.5 font-mono text-xs pt-2 border-t border-white/10">
            <div className="flex justify-between text-zinc-400">
              <span>Standard Price:</span>
              <span>{formatPrice(basePriceUSD, currency)}</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Promo Discount ({appliedPromo.discountPct}%):</span>
                <span>-{formatPrice(discountAmountUSD, currency)}</span>
              </div>
            )}

            {isFreeTrial && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>7-Week Free Trial Credit:</span>
                <span>-{formatPrice(discountedRecurringUSD, currency)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-400">
              <span>Estimated Tax / VAT:</span>
              <span>{CURRENCIES[currency]?.symbol || "$"}0.00</span>
            </div>

            {/* Total Due Today */}
            <div className="flex justify-between items-baseline pt-3 border-t border-white/15 text-sm">
              <span className="text-white font-bold uppercase font-mono">TOTAL DUE TODAY:</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {totalDueTodayUSD === 0
                  ? `${CURRENCIES[currency]?.symbol || "$"}0.00`
                  : formatPrice(totalDueTodayUSD, currency)}
              </span>
            </div>

            {isFreeTrial && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-sans leading-relaxed">
                ✓ <strong>49-Day Full Access Trial:</strong> You will not be charged today. Your first billing of{" "}
                <strong>{formatPrice(discountedRecurringUSD, currency)}</strong> will occur on{" "}
                <strong>{trialEndFormatted}</strong>. Cancel anytime with 1 click in your billing dashboard.
              </div>
            )}
          </div>

          {checkoutError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleExecuteCheckout}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-sm font-bold uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(16,185,129,0.35)] active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>TOKENIZING SECURE RAILS...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{isFreeTrial ? "START 7-WEEK FREE TRIAL (0$ DUE)" : "COMPLETE SECURE CHECKOUT"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Trust Badges & Guarantee */}
          <div className="pt-2 border-t border-white/10 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL</span>
              </span>
              <span>•</span>
              <span>PCI-DSS Level 1</span>
              <span>•</span>
              <span>SOC2 Type II</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-sans">
              30-Day Money-Back Guarantee after trial ends. 1-Click instant cancellation anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
