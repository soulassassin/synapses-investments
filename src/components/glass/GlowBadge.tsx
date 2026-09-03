import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlowBadgeProps {
  children: React.ReactNode;
  variant?: "white" | "cyan" | "indigo" | "emerald" | "rose" | "amber" | "neutral";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function GlowBadge({
  children,
  variant = "white",
  size = "md",
  dot = true,
  className,
}: GlowBadgeProps) {
  const variantStyles = {
    white: "bg-white/[0.08] border-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.12)]",
    cyan: "bg-white/[0.08] border-white/20 text-white",
    indigo: "bg-white/[0.08] border-white/20 text-white",
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]",
    rose: "bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.15)]",
    amber: "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    neutral: "bg-white/[0.04] border-white/10 text-zinc-300",
  };

  const dotColors = {
    white: "bg-white shadow-[0_0_8px_#FFFFFF]",
    cyan: "bg-white shadow-[0_0_8px_#FFFFFF]",
    indigo: "bg-zinc-300 shadow-[0_0_8px_#D4D4D8]",
    emerald: "bg-emerald-400 shadow-[0_0_8px_#22C55E]",
    rose: "bg-red-400 shadow-[0_0_8px_#EF4444]",
    amber: "bg-amber-400 shadow-[0_0_8px_#F59E0B]",
    neutral: "bg-zinc-400",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center font-medium border rounded-full backdrop-blur-md select-none font-sans",
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
    >
      {dot && <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
}
