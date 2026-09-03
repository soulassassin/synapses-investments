"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import { Sparkles, ArrowRight, CheckCircle2, Zap, Shield, ChevronRight } from "lucide-react";

interface FeatureLayoutProps {
  badge: string;
  title: string;
  tagline: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  stats: { label: string; value: string; desc: string }[];
  children: ReactNode;
}

export function FeatureLayout({
  badge,
  title,
  tagline,
  description,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText = "Open SN Journal",
  secondaryCtaHref = "/dashboard/journal",
  stats,
  children,
}: FeatureLayoutProps) {
  return (
    <div className="min-h-screen relative bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Top Navbar */}
      <AntigravityNavbar />

      {/* Cybernetic Background Elements */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-30 z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-400">Features</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">{badge}</span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
            {title}
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl font-medium text-zinc-300 max-w-2xl mx-auto italic">
            &ldquo;{tagline}&rdquo;
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={primaryCtaHref} className="group">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.55)] cursor-pointer">
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </Link>
            <Link href={secondaryCtaHref}>
              <button className="px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-white/30 text-white font-semibold text-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer">
                {secondaryCtaText}
              </button>
            </Link>
          </div>
        </section>

        {/* Telemetry Key Stats Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                {s.label}
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight block">
                {s.value}
              </span>
              <span className="text-[11px] text-zinc-500 font-mono block">
                {s.desc}
              </span>
            </div>
          ))}
        </section>

        {/* Feature-Specific Body (Interactive Demo / Mockups / Details) */}
        {children}

        {/* Institutional Call To Action Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/15 text-center relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-radial from-white/[0.05] to-transparent pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            EXPERIENCE THE SYNAPSES ADVANTAGE TODAY
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Zero latency, institutional risk guardrails, and automated ICT/SMC playbook classification. Ready to execute?
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard">
              <button className="px-8 py-3.5 rounded-2xl bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Enter Terminal Overview</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES QUANTUM NETWORK • ALL SYSTEMS OPERATIONAL
        </span>
        <span className="mt-2 sm:mt-0">DMA PROTOCOL v3.4 PRO • INSTITUTIONAL GRADE</span>
      </footer>
    </div>
  );
}
