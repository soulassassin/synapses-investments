"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlowBadge } from "@/components/glass/GlowBadge";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Building2,
  ChevronRight,
  Edit3,
  X,
  Loader2,
  Lock,
  PauseCircle,
  AlertTriangle,
  Gift,
} from "lucide-react";

interface InvoiceRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  receiptUrl: string;
}

export default function BillingPortalPage() {
  const { user, profile, subscription, updateSubscription } = useAuth();

  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(true);

  // Modal States
  const [isUpdateCardOpen, setIsUpdateCardOpen] = useState(false);
  const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Cancellation Questionnaire & Retention State
  const [cancelStep, setCancelStep] = useState<"reason" | "retention" | "confirm">("reason");
  const [cancelReason, setCancelReason] = useState("");
  const [retentionDiscountApplied, setRetentionDiscountApplied] = useState(false);

  // Payment Method Update Form
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExp, setNewCardExp] = useState("");
  const [newCardCvc, setNewCardCvc] = useState("");
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function loadInvoices() {
      try {
        const res = await fetch(`/api/billing/invoices?email=${user?.email || "trader@synapsesinvestments.com"}`);
        const data = await res.json();
        if (data.success && data.invoices) {
          setInvoices(data.invoices);
        }
      } catch (e) {
        console.error("Failed to load invoices:", e);
      } finally {
        setIsLoadingInvoices(false);
      }
    }
    loadInvoices();
  }, [user?.email]);

  const isPro = subscription.isPro;
  const isTrial = subscription.isTrialActive;
  const daysRemaining = subscription.trialDaysRemaining;
  const trialProgressPct = Math.max(0, Math.min(100, Math.round(((49 - daysRemaining) / 49) * 100)));

  const handleUpdatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCard(true);
    try {
      await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_payment_method",
          userId: user?.id,
          last4: newCardNumber.slice(-4) || "8888",
          expMonth: 10,
          expYear: 2029,
        }),
      });
      showToast("✓ Payment method successfully updated.");
      setIsUpdateCardOpen(false);
    } catch (e) {
      showToast("Error updating payment method.");
    } finally {
      setIsSavingCard(false);
    }
  };

  const handlePauseBilling = async () => {
    try {
      await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pause",
          userId: user?.id,
        }),
      });
      showToast("✓ Subscription billing paused for 30 days.");
    } catch (e) {
      showToast("Failed to pause subscription.");
    }
  };

  const handleApplyRetentionDiscount = async () => {
    try {
      await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply_retention_discount",
          userId: user?.id,
        }),
      });
      setRetentionDiscountApplied(true);
      showToast("🎉 30% retention discount successfully applied to your next 2 billing cycles!");
      setIsCancelModalOpen(false);
      setCancelStep("reason");
    } catch (e) {
      showToast("Failed to apply discount.");
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await updateSubscription("demo");
      await fetch("/api/billing/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          userId: user?.id,
          reason: cancelReason,
        }),
      });
      showToast("Your subscription has been cancelled and downgraded to Free Demo tier.");
      setIsCancelModalOpen(false);
      setCancelStep("reason");
    } catch (e) {
      showToast("Failed to cancel subscription.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider [word-spacing:0.12em]">
              SUBSCRIPTION & BILLING PORTAL
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your proprietary trading suite tier, payment methods, trial countdown, and tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlowBadge variant={isPro ? "emerald" : isTrial ? "cyan" : "white"} size="sm">
            {isPro ? "Pro Active" : isTrial ? `Trial Active • ${daysRemaining} Days Left` : "Demo Tier"}
          </GlowBadge>
        </div>
      </div>

      {/* Section 1: Active Subscription Overview Card */}
      <GlassCard className="p-6 sm:p-7 bg-black/85 border-white/15 shadow-[0_15px_45px_rgba(0,0,0,0.85)] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              ACTIVE SUITE SUBSCRIPTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-white flex items-center gap-3">
              <span>{isPro ? "Synapses Institutional Pro" : isTrial ? "7-Week Full Access Trial" : "Demo Protocol"}</span>
              <span className="text-xs font-sans font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {isPro ? "Active" : isTrial ? "Free Trial" : "Free Tier"}
              </span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Unlimited Trade Logging, Automated MT4/MT5 Broker Sync, Market Replay, and Cognitive Tilt Auditor.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/checkout?plan=pro&billing=annual">
              <button className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer">
                Switch to Annual (Save 20%)
              </button>
            </Link>
            <button
              onClick={() => setIsChangePlanOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* 7-Week Trial Progress Bar (if in trial) */}
        {isTrial && (
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>49-DAY FULL ACCESS TRIAL STATUS</span>
              </span>
              <span className="text-emerald-400 font-bold">{daysRemaining} DAYS REMAINING</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${trialProgressPct}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-zinc-500 block">
              Trial ends on {new Date(subscription.trialEndsAt).toLocaleDateString()} • Next recurring billing is $24/mo or R399/mo.
            </span>
          </div>
        )}

        {/* Telemetry Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-zinc-400 block text-[10px]">BILLING FREQUENCY</span>
            <span className="text-white font-bold block text-sm">Monthly Auto-Renewal</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-zinc-400 block text-[10px]">RECURRING AMOUNT</span>
            <span className="text-emerald-400 font-bold block text-sm">
              $29.00 / mo (or R499 ZAR)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-zinc-400 block text-[10px]">NEXT INVOICE DATE</span>
            <span className="text-white font-bold block text-sm">
              {new Date(subscription.trialEndsAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <button
            onClick={handlePauseBilling}
            className="text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PauseCircle className="w-4 h-4 text-amber-400" />
            <span>Pause Billing for 30 Days</span>
          </button>

          <button
            onClick={() => {
              setCancelStep("reason");
              setIsCancelModalOpen(true);
            }}
            className="text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Cancel Subscription &rarr;</span>
          </button>
        </div>
      </GlassCard>

      {/* Section 2: Payment Methods On File */}
      <GlassCard className="p-6 sm:p-7 bg-black/85 border-white/10 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PAYMENT METHOD ON FILE</span>
          </span>
          <button
            onClick={() => setIsUpdateCardOpen(true)}
            className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            + Update Card / Method
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/10 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-white/10 text-white font-bold">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-white">Visa ending in •••• 4242</span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Default
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-500 block mt-0.5">
                Expires 12/2028 • 256-Bit Tokenized Encryption
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-zinc-400">
            <span>Billing Rail: Stripe / Paystack Global</span>
          </div>
        </div>
      </GlassCard>

      {/* Section 3: Invoices & Receipts History */}
      <GlassCard className="p-6 sm:p-7 bg-black/85 border-white/10 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>INVOICE & RECEIPT HISTORY</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">Tax & VAT Compliant</span>
        </div>

        {isLoadingInvoices ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-500 animate-pulse">
            Loading past tax receipts...
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-500">
            No past invoices found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase">
                  <th className="py-3 px-3">Invoice ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-bold text-white">{inv.id}</td>
                    <td className="py-3.5 px-3 text-zinc-400">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 text-zinc-300">{inv.description}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-400">
                      ${inv.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <a
                        href={inv.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-[11px] text-white transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* ========================================================================= */}
      {/* MODAL: UPDATE PAYMENT METHOD */}
      {/* ========================================================================= */}
      {isUpdateCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0d0f14] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>UPDATE PAYMENT METHOD</span>
              </span>
              <button onClick={() => setIsUpdateCardOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePaymentMethod} className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">CARD NUMBER</label>
                <input
                  type="text"
                  required
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">EXPIRY (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={newCardExp}
                    onChange={(e) => setNewCardExp(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">CVC / CVV</label>
                  <input
                    type="text"
                    required
                    value={newCardCvc}
                    onChange={(e) => setNewCardCvc(e.target.value)}
                    placeholder="888"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateCardOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCard}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1.5"
                >
                  {isSavingCard ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>Save New Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHANGE PLAN */}
      {/* ========================================================================= */}
      {isChangePlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0d0f14] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>SELECT SUITE PLAN</span>
              </span>
              <button onClick={() => setIsChangePlanOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                { key: "basic", title: "Basic Journal", price: "$19 / mo", desc: "Core journaling, manual entry, 100 trades/mo" },
                { key: "pro", title: "Institutional Pro (49-Day Trial)", price: "$29 / mo (or $24/mo annual)", desc: "Unlimited logs, automated broker sync, replay engine, mistake auditor", popular: true },
                { key: "syndicate", title: "Syndicate Desk", price: "$99 / mo", desc: "Multi-trader desk, risk tripwires, shared playbook" },
              ].map((p) => (
                <div
                  key={p.key}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    p.popular ? "bg-emerald-500/10 border-emerald-500/70" : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{p.title}</span>
                      {p.popular && (
                        <span className="text-[9px] px-2 py-0.2 rounded-full bg-emerald-500 text-black font-bold">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 font-sans text-[11px]">{p.desc}</p>
                  </div>

                  <Link href={`/checkout?plan=${p.key}`}>
                    <button className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs shrink-0 hover:bg-zinc-200">
                      Select
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 3-STEP RETENTION CANCELLATION FLOW */}
      {/* ========================================================================= */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0d0f14] border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95)] space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>SUBSCRIPTION CANCELLATION</span>
              </span>
              <button onClick={() => setIsCancelModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {cancelStep === "reason" && (
              <div className="space-y-4 font-mono text-xs">
                <p className="text-zinc-300 font-sans text-xs">
                  We're sorry to see you go. Before cancelling, could you tell us why you are leaving?
                </p>

                <div className="space-y-2">
                  {[
                    "Taking a temporary break from trading",
                    "Subscription price is too high",
                    "Missing a specific feature or broker sync",
                    "Switching to another trading journal",
                    "Other reasons",
                  ].map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        value={r}
                        checked={cancelReason === r}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="text-emerald-500"
                      />
                      <span className="text-zinc-300">{r}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300"
                  >
                    Keep My Subscription
                  </button>
                  <button
                    type="button"
                    disabled={!cancelReason}
                    onClick={() => setCancelStep("retention")}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold disabled:opacity-40"
                  >
                    Continue &rarr;
                  </button>
                </div>
              </div>
            )}

            {cancelStep === "retention" && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 font-mono text-xs text-center">
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 w-12 h-12 flex items-center justify-center mx-auto">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Claim 30% Off Next 2 Months</h3>
                  <p className="text-xs text-zinc-400 font-sans mt-1">
                    Stay disciplined and retain unlimited trade history, automated broker sync, and replay access for just $16.80/mo.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleApplyRetentionDiscount}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    Apply 30% Discount & Stay Pro
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelStep("confirm")}
                    className="w-full py-2 px-4 rounded-xl text-zinc-500 hover:text-zinc-300 text-[11px]"
                  >
                    No thanks, proceed to cancel
                  </button>
                </div>
              </div>
            )}

            {cancelStep === "confirm" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-sans">
                  ⚠️ <strong>Warning:</strong> Cancelling will downgrade your account to the Free Demo Tier capped at 25 total trade logs. Automated broker sync and market replay will be paused.
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold"
                  >
                    Never Mind, Keep Pro
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
