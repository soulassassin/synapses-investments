"use client";

import React from "react";
import Link from "next/link";
import { DraggableNode } from "./DraggableNode";
import { NeonLogo } from "./NeonLogo";
import { SearchBar } from "./SearchBar";
import { AppCapsule } from "./AppCapsule";
import { QuickTradeCapsule } from "./QuickTradeCapsule";
import { CryptoTickerCapsule } from "./CryptoTickerCapsule";
import { LiveTelemetryWidget } from "./LiveTelemetryWidget";
import { GravityController } from "./GravityController";
import { ClientErrorBoundary } from "@/components/common/ClientErrorBoundary";
import {
  Calendar,
  Terminal,
  Brain,
  Sparkles,
  Cpu,
} from "lucide-react";

export function FloatingCanvas() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center pt-28 pb-20 px-4 select-none">
      {/* Center Fixed/Floating Search Hub */}
      <div className="relative z-20 flex flex-col items-center max-w-3xl w-full mx-auto my-auto text-center">
        <ClientErrorBoundary componentName="NeonLogo">
          <NeonLogo />
        </ClientErrorBoundary>

        <div className="w-full mt-7">
          <ClientErrorBoundary componentName="SearchBar">
            <SearchBar />
          </ClientErrorBoundary>
        </div>

        {/* Mobile & Tablet Quick Launcher Grid (< lg) */}
        <div className="lg:hidden w-full max-w-xl mx-auto mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 z-20">
          <Link
            href="/dashboard/journal"
            className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/15 hover:border-white/35 flex items-center justify-between transition-all active:scale-98 shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.08] border border-white/10 text-white">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block tracking-wider">Trade Journal</span>
                <span className="text-[10px] font-mono text-zinc-400 block">ICT & SMC Visual Logger</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              ALPHA
            </span>
          </Link>

          <Link
            href="/dashboard/calculator"
            className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/15 hover:border-white/35 flex items-center justify-between transition-all active:scale-98 shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.08] border border-white/10 text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block tracking-wider">Risk Calculator</span>
                <span className="text-[10px] font-mono text-zinc-400 block">Lot Sizing & Guardrails</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              GUARD
            </span>
          </Link>

          <Link
            href="/dashboard/backtesting"
            className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/15 hover:border-white/35 flex items-center justify-between transition-all active:scale-98 shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.08] border border-white/10 text-white">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block tracking-wider">Market Replay</span>
                <span className="text-[10px] font-mono text-zinc-400 block">Bar-by-Bar Simulator</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              10x
            </span>
          </Link>

          <Link
            href="/blog"
            className="p-3.5 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/15 hover:border-white/35 flex items-center justify-between transition-all active:scale-98 shadow-[0_8px_25px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/[0.08] border border-white/10 text-white">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block tracking-wider">Intelligence</span>
                <span className="text-[10px] font-mono text-zinc-400 block">Research & Education</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              INTEL
            </span>
          </Link>
        </div>
      </div>

      {/* Floating Orbiting Node 1: Quick Trade Capsule (Top Left) */}
      <DraggableNode
        initialX={-480}
        initialY={-200}
        driftAmplitude={{ x: 10, y: 12, rotate: 2.5 }}
        driftDuration={6.5}
        delay={0.2}
        className="hidden lg:block top-1/2 left-1/2"
      >
        <ClientErrorBoundary componentName="QuickTradeCapsule">
          <QuickTradeCapsule />
        </ClientErrorBoundary>
      </DraggableNode>

      {/* Floating Orbiting Node 2: Crypto Ticker Capsule (Top Right) */}
      <DraggableNode
        initialX={320}
        initialY={-200}
        driftAmplitude={{ x: 12, y: 10, rotate: -2 }}
        driftDuration={7.2}
        delay={0.6}
        className="hidden lg:block top-1/2 left-1/2"
      >
        <ClientErrorBoundary componentName="CryptoTickerCapsule">
          <CryptoTickerCapsule />
        </ClientErrorBoundary>
      </DraggableNode>

      {/* Floating Orbiting Node 3: System Telemetry (Bottom Left) */}
      <DraggableNode
        initialX={-490}
        initialY={150}
        driftAmplitude={{ x: 9, y: 12, rotate: -3 }}
        driftDuration={8}
        delay={1.2}
        className="hidden lg:block top-1/2 left-1/2"
      >
        <ClientErrorBoundary componentName="LiveTelemetryWidget">
          <LiveTelemetryWidget />
        </ClientErrorBoundary>
      </DraggableNode>

      {/* Floating Orbiting Node 4: Trade Journal Playbook (Bottom Right) */}
      <DraggableNode
        initialX={300}
        initialY={160}
        driftAmplitude={{ x: 11, y: 13, rotate: 3 }}
        driftDuration={7.8}
        delay={1.8}
        className="hidden lg:block top-1/2 left-1/2"
      >
        <ClientErrorBoundary componentName="AppCapsuleJournal">
          <AppCapsule
            title="Trade Journal & Playbook"
            subtitle="ICT & SMC Visual Logger"
            icon={<Brain className="w-5 h-5 text-white" />}
            href="/dashboard/journal"
            badge="ALPHA LOGS"
            badgeColor="white"
            statusColor="bg-white"
          />
        </ClientErrorBoundary>
      </DraggableNode>

      {/* Floating Orbiting Node 5: Market Replay Simulator (Far Right Center) */}
      <DraggableNode
        initialX={460}
        initialY={-20}
        driftAmplitude={{ x: 14, y: 9, rotate: -2 }}
        driftDuration={6.8}
        delay={2.2}
        className="hidden xl:block top-1/2 left-1/2"
      >
        <ClientErrorBoundary componentName="AppCapsuleReplay">
          <AppCapsule
            title="Bar-by-Bar Replay"
            subtitle="Tick Simulator Engine"
            icon={<Terminal className="w-5 h-5 text-white" />}
            href="/dashboard/backtesting"
            badge="10x SPEED"
            badgeColor="white"
            statusColor="bg-white"
          />
        </ClientErrorBoundary>
      </DraggableNode>

      {/* Floating Orbiting Node 6: Risk Calculator (Far Left Center) */}
      <DraggableNode
        initialX={-470}
        initialY={-20}
        driftAmplitude={{ x: 10, y: 15, rotate: 2 }}
        driftDuration={7.5}
        delay={2.5}
        className="hidden xl:block top-1/2 left-1/2"
      >
        <ClientErrorBoundary componentName="AppCapsuleCalculator">
          <AppCapsule
            title="Dynamic Lot Sizer"
            subtitle="Pre-Trade Guardrails"
            icon={<Cpu className="w-5 h-5 text-white" />}
            href="/dashboard/calculator"
            badge="1.0% RISK"
            badgeColor="white"
            statusColor="bg-white"
          />
        </ClientErrorBoundary>
      </DraggableNode>

      {/* Bottom Right Gravity Controller Dock */}
      <ClientErrorBoundary componentName="GravityController">
        <GravityController />
      </ClientErrorBoundary>
    </div>
  );
}
