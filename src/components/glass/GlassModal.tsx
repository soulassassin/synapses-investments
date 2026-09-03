"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
}: GlassModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
    "4xl": "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full ${maxWidthClasses[maxWidth]} z-10 animate-in zoom-in-95 duration-200`}>
        <GlassCard className="relative overflow-hidden border-white/15 bg-obsidian-900/90 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-0 max-h-[90vh] flex flex-col">
          {/* Header */}
          {(title || subtitle) && (
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <div>
                {title && <h3 className="text-lg font-semibold text-white tracking-wide">{title}</h3>}
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
        </GlassCard>
      </div>
    </div>
  );
}
