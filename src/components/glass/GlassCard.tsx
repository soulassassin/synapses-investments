import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "subtle" | "glow" | "interactive";
  className?: string;
}

export function GlassCard({
  children,
  variant = "default",
  className,
  ...props
}: GlassCardProps) {
  const baseClasses = "rounded-2xl backdrop-blur-2xl transition-all duration-300";

  const variantClasses = {
    default: "bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.7)]",
    subtle: "bg-white/[0.015] border border-white/[0.05] shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
    glow: "bg-white/[0.04] border border-white/[0.15] shadow-[0_0_25px_rgba(255,255,255,0.08)]",
    interactive:
      "bg-white/[0.03] border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.7)] hover:bg-white/[0.055] hover:border-white/30 hover:shadow-[0_0_35px_rgba(255,255,255,0.08)] cursor-pointer active:scale-[0.99]",
  };

  return (
    <div
      className={twMerge(clsx(baseClasses, variantClasses[variant], className))}
      {...props}
    >
      {children}
    </div>
  );
}
