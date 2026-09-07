import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import { TradezellaCheckout } from "@/components/checkout/TradezellaCheckout";
import { ChevronRight, ShieldCheck, Lock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Secure Checkout | 7-Week Full Access Trial | Synapses Investments",
  description:
    "Activate your 49-day full access trial for Synapses Investments. Automated MT4/MT5 sync, Market Replay engine, and institutional playbook vault.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen relative bg-[#050507] text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Background Cyber Atmosphere */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-25 z-0" />
      <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        {/* Header Breadcrumbs */}
        <section className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">
              Pricing Plans
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Secure Checkout</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>256-BIT SSL ENCRYPTED GATEWAY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-wider text-white uppercase">
            UPGRADE TO PRO EXECUTION.
          </h1>

          <p className="text-sm text-zinc-400 font-sans max-w-xl mx-auto">
            Experience 49 full days of unrestricted institutional trading architecture. Cancel anytime with 1 click.
          </p>
        </section>

        {/* TradeZella-Grade Checkout Form */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
              Initializing secure checkout rails...
            </div>
          }
        >
          <TradezellaCheckout />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES PAYMENTS GATEWAY • LEVEL 1 PCI-DSS COMPLIANT
        </span>
        <span className="mt-2 sm:mt-0">SECURE TOKENIZATION v3.4</span>
      </footer>
    </div>
  );
}
