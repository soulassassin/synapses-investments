import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "pill" | "glass" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function GlassButton({
  variant = "glass",
  size = "md",
  children,
  icon,
  isLoading,
  className,
  disabled,
  ...props
}: GlassButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-semibold rounded-xl gap-1.5",
    md: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-7 py-3.5 text-base font-bold rounded-2xl gap-2.5",
    icon: "p-2.5 rounded-xl aspect-square justify-center",
  };

  const variantClasses = {
    pill: "synapses-pill-btn",
    glass:
      "bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-white/40 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]",
    outline:
      "bg-transparent hover:bg-white/[0.06] border border-white/[0.2] hover:border-white text-zinc-200 hover:text-white active:scale-[0.98]",
    ghost:
      "bg-transparent hover:bg-white/[0.08] text-zinc-400 hover:text-white active:scale-[0.98]",
    danger:
      "bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-[0.98]",
    success:
      "bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-100 shadow-[0_0_20px_rgba(34,197,94,0.2)] active:scale-[0.98]",
  };

  return (
    <button
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none font-sans",
          sizeClasses[size],
          variantClasses[variant],
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
