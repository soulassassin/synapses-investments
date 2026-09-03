"use client";

import React from "react";
import Link from "next/link";
import { GlassCard } from "../glass/GlassCard";

interface AppCapsuleProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  badgeColor?: "white" | "cyan" | "indigo" | "emerald" | "amber" | "rose";
  statusColor?: string;
}

export function AppCapsule({
  title,
  subtitle,
  icon,
  href,
  badge,
  badgeColor = "white",
  statusColor = "bg-white",
}: AppCapsuleProps) {
  return (
    <Link href={href}>
      <GlassCard
        variant="interactive"
        className="px-4 py-3 flex items-center gap-3.5 bg-black/85 backdrop-blur-2xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.7)] min-w-[210px]"
      >
        <div className="relative p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          {icon}
          <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${statusColor} shadow-[0_0_8px_#FFFFFF] border border-black animate-pulse`} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white tracking-wide">{title}</span>
            {badge && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full border border-white/20 bg-white/10 text-white font-mono">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <span className="text-[11px] text-zinc-400 font-normal">{subtitle}</span>}
        </div>
      </GlassCard>
    </Link>
  );
}
