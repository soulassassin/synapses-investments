"use client";

import React from "react";
import { clsx } from "clsx";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface GlassTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  variant?: "pill" | "underline" | "card";
  className?: string;
}

export function GlassTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  variant = "pill",
  className,
}: GlassTabsProps<T>) {
  if (variant === "pill") {
    return (
      <div
        className={clsx(
          "inline-flex p-1 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-xl gap-1",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer select-none",
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-cyan-400 text-obsidian-950 font-bold" : "bg-white/10 text-slate-300"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={clsx("flex border-b border-white/10 gap-6", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "flex items-center gap-2 pb-3 text-sm font-medium transition-all relative select-none",
              isActive ? "text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-slate-300">
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_10px_#00F2FE]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
