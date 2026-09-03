"use client";

import React from "react";
import { DraggableNode } from "./DraggableNode";
import { NeonLogo } from "./NeonLogo";
import { SearchBar } from "./SearchBar";
import { AppCapsule } from "./AppCapsule";
import { QuickTradeCapsule } from "./QuickTradeCapsule";
import { CryptoTickerCapsule } from "./CryptoTickerCapsule";
import { LiveTelemetryWidget } from "./LiveTelemetryWidget";
import { GravityController } from "./GravityController";
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
        <NeonLogo />
        <div className="w-full mt-7">
          <SearchBar />
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
        <QuickTradeCapsule />
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
        <CryptoTickerCapsule />
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
        <LiveTelemetryWidget />
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
        <AppCapsule
          title="Trade Journal & Playbook"
          subtitle="ICT & SMC Visual Logger"
          icon={<Brain className="w-5 h-5 text-white" />}
          href="/dashboard/journal"
          badge="ALPHA LOGS"
          badgeColor="white"
          statusColor="bg-white"
        />
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
        <AppCapsule
          title="Bar-by-Bar Replay"
          subtitle="Tick Simulator Engine"
          icon={<Terminal className="w-5 h-5 text-white" />}
          href="/dashboard/backtesting"
          badge="10x SPEED"
          badgeColor="white"
          statusColor="bg-white"
        />
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
        <AppCapsule
          title="Dynamic Lot Sizer"
          subtitle="Pre-Trade Guardrails"
          icon={<Cpu className="w-5 h-5 text-white" />}
          href="/dashboard/calculator"
          badge="1.0% RISK"
          badgeColor="white"
          statusColor="bg-white"
        />
      </DraggableNode>

      {/* Bottom Right Gravity Controller Dock */}
      <GravityController />
    </div>
  );
}
