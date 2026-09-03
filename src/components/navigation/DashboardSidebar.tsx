"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  History,
  Calculator,
  Orbit,
  PlusCircle,
  Zap,
  ChevronDown,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import { useTrades } from "@/context/TradeContext";
import { SynapsesLogo } from "../brand/SynapsesLogo";

interface DashboardSidebarProps {
  onOpenTradeModal: () => void;
  onOpenSyncModal: () => void;
}

export function DashboardSidebar({ onOpenTradeModal, onOpenSyncModal }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { brokerAccounts, selectedAccount, setSelectedAccount } = useTrades();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const navItems = [
    {
      name: "Bar Replay Simulator",
      href: "/dashboard/backtesting",
      icon: <History className="w-4 h-4" />,
      exact: false,
    },
    {
      name: "Deep-Dive Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
      exact: false,
    },
    {
      name: "Risk & Lot Calculator",
      href: "/dashboard/calculator",
      icon: <Calculator className="w-4 h-4" />,
      exact: false,
    },
    {
      name: "Terminal Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      name: "Trade Journal & Playbook",
      href: "/dashboard/journal",
      icon: <BookOpen className="w-4 h-4" />,
      exact: false,
    },
  ];

  const currentAcc = brokerAccounts.find((a) => a.name === selectedAccount) || brokerAccounts[0];

  return (
    <aside className="w-64 lg:w-72 shrink-0 border-r border-white/10 bg-black/90 backdrop-blur-2xl flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header with Synapses Investments Logo */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="group">
          <SynapsesLogo theme="white" size="md" />
        </Link>
      </div>

      {/* Account Selector Widget */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <button
            onClick={() => setIsAccountDropdownOpen((prev) => !prev)}
            className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/30 transition-all flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22C55E] shrink-0 animate-pulse" />
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">
                  {selectedAccount === "ALL" ? "All Accounts Consolidated" : currentAcc.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block">
                  {selectedAccount === "ALL"
                    ? "3 Connected Feeds"
                    : `${currentAcc.platform} • ${currentAcc.accountNumber}`}
                </span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
          </button>

          {/* Dropdown */}
          {isAccountDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsAccountDropdownOpen(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 p-1.5 rounded-xl bg-brand-900/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-40 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setSelectedAccount("ALL");
                    setIsAccountDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedAccount === "ALL"
                      ? "bg-white/15 text-white font-bold"
                      : "text-zinc-300 hover:bg-white/[0.06]"
                  }`}
                >
                  <span>All Accounts Consolidated</span>
                  <span className="text-[10px] font-mono text-zinc-500">Merged</span>
                </button>
                {brokerAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      setSelectedAccount(acc.name);
                      setIsAccountDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedAccount === acc.name
                        ? "bg-white/15 text-white font-bold"
                        : "text-zinc-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="block truncate font-medium">{acc.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {acc.platform}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      ${acc.balance.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quick Log Trade CTA */}
        <button
          onClick={onOpenTradeModal}
          className="w-full mt-3 synapses-pill-btn py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200"
        >
          <PlusCircle className="w-4 h-4 text-black" />
          <span>Log New Trade</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-2 py-1 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
          CORE PLATFORM
        </div>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-white/[0.08] text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.06)] font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`transition-all duration-150 ${
                    isActive ? "text-white scale-105" : "text-zinc-400 group-hover:text-white group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="transition-colors">{item.name}</span>
              </div>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#FFFFFF]" />
              )}
            </Link>
          );
        })}

        <div className="pt-4 px-2 py-1 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
          INTEGRATIONS & GATEWAYS
        </div>

        {/* Broker Sync Modal Trigger */}
        <button
          onClick={onOpenSyncModal}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-zinc-300 group-hover:text-white group-hover:scale-110 transition-all duration-150" />
            <span>Broker API Feeds</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white group-hover:bg-white/20 transition-colors">
            MT4/5
          </span>
        </button>

        {/* Return to Synapses Quantum Canvas */}
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Orbit className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
            <span>Synapses Quantum Canvas</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white" />
        </Link>
      </nav>

      {/* Footer Security Badge */}
      <div className="p-4 border-t border-white/10 bg-black/40">
        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
          <Shield className="w-4 h-4 text-zinc-200 shrink-0" />
          <span className="font-mono">Bank-Grade 256-Bit SSL</span>
        </div>
        <div className="mt-1 text-[10px] text-zinc-500 font-mono">
          Synapses Investments • Live
        </div>
      </div>
    </aside>
  );
}
