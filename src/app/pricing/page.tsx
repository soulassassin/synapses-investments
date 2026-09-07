"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import {
  CURRENCIES,
  SupportedCurrency,
  formatPrice,
  BASE_PLANS_USD,
} from "@/lib/currency";
import {
  Check,
  ShieldCheck,
  Zap,
  Globe,
  CreditCard,
  Sparkles,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  Clock,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [currency, setCurrency] = useState<SupportedCurrency>("USD");

  const plans = [
    {
      key: "basic",
      name: "DEMO PROTOCOL",
      badge: "Free Tier",
      priceUSD: 0,
      period: "forever",
      description: "For testing execution taxonomy and exploring sample market telemetry.",
      features: [
        "Up to 25 execution logs",
        "Basic P&L calendar & streak tracker",
        "Live Direct Market Access (DMA) ticker feed",
        "Pre-trade position size & risk calculator",
        "Manual CSV trade import & export",
        "Community Discord access",
      ],
      ctaText: "Launch Demo Terminal",
      ctaHref: "/dashboard/journal",
      highlighted: false,
    },
    {
      key: "pro",
      name: "7-WEEK FULL ACCESS TRIAL",
      badge: "Most Popular • 0$ Upfront",
      priceUSD: billingCycle === "monthly" ? BASE_PLANS_USD.pro.monthly : BASE_PLANS_USD.pro.annualMonthly,
      period: "per month after 49-day trial",
      trialNote: "49 Days Free • Cancel Anytime in 1 Click",
      description: "Complete proprietary firm trading architecture with automated broker scanning & unlimited vault capacity.",
      features: [
        "49 Days 100% Free Full Access",
        "Unlimited execution logs & historical storage",
        "Automated MT4/MT5/cTrader live account scanning",
        "Advanced Cognitive Tilt & Mistake Auditor",
        "Custom Playbook & Strategy Vault with lightbox zoom",
        "Market Replay & Historical Backtesting Engine",
        "Multi-timeframe chart screenshot attachments",
        "Real-time Sharpe, Sortino & Profit Factor analytics",
        "Priority 24/7 institutional desk support",
      ],
      ctaText: "Claim 7-Week Free Trial",
      ctaHref: `/checkout?plan=pro&billing=${billingCycle}&currency=${currency}`,
      highlighted: true,
    },
    {
      key: "syndicate",
      name: "INSTITUTIONAL SYNDICATE",
      badge: "Desk / Fund",
      priceUSD: billingCycle === "monthly" ? BASE_PLANS_USD.syndicate.monthly : BASE_PLANS_USD.syndicate.annualMonthly,
      period: "per month",
      description: "For proprietary trading firms, syndicates, and multi-desk risk managers requiring team oversight.",
      features: [
        "Everything in Pro Full Access",
        "Multi-trader desk dashboard & team telemetry",
        "Automated trader risk & max drawdown tripwires",
        "Shared firm strategy playbook library",
        "Custom API webhooks & webhook ingestion",
        "Dedicated institutional onboarding engineer",
      ],
      ctaText: "Get Syndicate Access",
      ctaHref: `/checkout?plan=syndicate&billing=${billingCycle}&currency=${currency}`,
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: "How does the 7-Week Full-Access Free Trial work?",
      a: "You get 49 full days of unrestricted access to all Pro features (including automated broker account syncing, unlimited trade logs, and the mistake auditor). No unexpected charges—you can cancel with one click directly inside your billing settings at any time.",
    },
    {
      q: "Which payment methods are supported globally?",
      a: "We support all major Credit & Debit cards (Visa, Mastercard, American Express, Discover), Apple Pay, Google Pay, PayPal, and Cryptocurrency Web3 rails (USDT, USDC, BTC, ETH).",
    },
    {
      q: "Can I pay in my local currency?",
      a: "Yes. All pricing is standardized to US Dollars ($) as the global industry baseline, and automatically converts to your local currency (EUR, GBP, CAD, AUD, JPY, etc.) at current live exchange rates.",
    },
    {
      q: "Can I connect live MetaTrader (MT4/MT5) and cTrader accounts?",
      a: "Yes. Our broker sync engine connects via institutional read-only investor credentials to automatically import past trade tickets, execution times, commissions, and swap fees.",
    },
    {
      q: "What happens to my logged trades if I downgrade or cancel?",
      a: "Your data is permanently retained and encrypted in your local vault and Supabase PostgreSQL instance. You will never lose your historical trading records or analytics.",
    },
  ];

  return (
    <div className="min-h-screen relative bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Background Cybernetic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-25 z-0" />
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto space-y-5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-1">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Pricing & Plans</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>7-WEEK FULL ACCESS TRIAL • 0$ COMMITMENT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider [word-spacing:0.15em] text-white uppercase leading-[1.12]">
            INSTITUTIONAL EDGE. TRANSPARENT PRICING.
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans font-light">
            Unlock your full trading edge with 49 days of free unlimited access. Built for prop firm challengers and disciplined quantitative operators.
          </p>

          {/* Controls: Billing Cycle & Geo Currency Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Currency Selector Dropdown */}
            <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2 px-3 py-1 font-mono text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400">CURRENCY:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
                className="bg-black/60 border border-white/15 text-white text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="p-1 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  billingCycle === "monthly" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "annual" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const displayPrice = plan.priceUSD === 0 ? "$0" : formatPrice(plan.priceUSD, currency);
            return (
              <div
                key={plan.name}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.highlighted
                    ? "bg-[#0d0f14]/95 border-2 border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30"
                    : "bg-[#0d0f14]/70 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-black font-mono tracking-wider text-white">
                        {plan.name}
                      </h3>
                      {!plan.highlighted && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black font-mono text-white">
                        {displayPrice}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {plan.period}
                      </span>
                    </div>
                    {plan.trialNote && (
                      <span className="text-[11px] font-mono text-emerald-400 font-bold block mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{plan.trialNote}</span>
                      </span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block font-bold">
                      INCLUDED TELEMETRY & FEATURES:
                    </span>
                    <ul className="space-y-2.5 text-xs text-zinc-300 font-sans">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Link href={plan.ctaHref} className="block w-full">
                    <button
                      className={`w-full py-3.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        plan.highlighted
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                          : "bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10"
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* FAQ SECTION */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#0d0f14]/80 border border-white/10 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black font-mono tracking-wider text-white uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              Clear answers regarding our 7-week trial, billing security, and broker integration capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES INVESTMENTS • QUANTITATIVE TRADING DESK ARCHITECTURE
        </span>
        <span className="mt-2 sm:mt-0">SECURE 256-BIT ENCRYPTION</span>
      </footer>
    </div>
  );
}
