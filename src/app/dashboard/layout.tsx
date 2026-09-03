"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Zap,
  PlusCircle,
  Plus,
  LayoutDashboard,
  BookOpen,
  Calculator,
  BarChart3,
} from "lucide-react";
import { DashboardSidebar } from "@/components/navigation/DashboardSidebar";
import { TickerTape } from "@/components/navigation/TickerTape";
import { BrokerSyncModal } from "@/components/navigation/BrokerSyncModal";
import { TradeLogModal } from "@/components/trading/TradeLogModal";
import { TradeDetailModal } from "@/components/trading/TradeDetailModal";
import { CSVImportModal } from "@/components/trading/CSVImportModal";
import { SynapsesLogo } from "@/components/brand/SynapsesLogo";
import { Trade } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);

  const handleOpenEdit = (trade: Trade) => {
    setTradeToEdit(trade);
    setIsTradeModalOpen(true);
  };

  const handleCloseTradeModal = () => {
    setIsTradeModalOpen(false);
    setTradeToEdit(null);
  };

  return (
    <div className="flex h-screen bg-obsidian-950 overflow-hidden relative">
      {/* Terminal Sidebar (Desktop fixed + Mobile slide-over drawer) */}
      <DashboardSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onOpenTradeModal={() => {
          setTradeToEdit(null);
          setIsTradeModalOpen(true);
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Terminal Window */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Top Header (hidden on md and above) */}
        <div className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-black/90 border-b border-white/10 shrink-0 z-20">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/15 text-zinc-300 hover:text-white active:scale-95 transition-all"
              aria-label="Open terminal sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center">
              <SynapsesLogo theme="white" size="sm" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white"
              title="Sync Broker"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => {
                setTradeToEdit(null);
                setIsTradeModalOpen(true);
              }}
              className="py-1.5 px-3 rounded-xl bg-white text-black font-extrabold text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(255,255,255,0.3)] active:scale-95 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>
          </div>
        </div>

        {/* Streaming Ticker Tape */}
        <TickerTape />

        {/* Dynamic Page Scroll Body with mobile bottom padding */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8 space-y-6">
          {children}
        </main>

        {/* Mobile 1-Thumb Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around py-2 px-1 shadow-[0_-10px_30px_rgba(0,0,0,0.85)]">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              pathname === "/dashboard" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-wider">Terminal</span>
          </Link>

          <Link
            href="/dashboard/journal"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              pathname === "/dashboard/journal" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-wider">Journal</span>
          </Link>

          {/* Quick Floating Center Log Action */}
          <button
            onClick={() => {
              setTradeToEdit(null);
              setIsTradeModalOpen(true);
            }}
            className="w-11 h-11 -mt-4 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.45)] hover:scale-105 active:scale-95 transition-all"
            title="Log Trade Execution"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          <Link
            href="/dashboard/calculator"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              pathname === "/dashboard/calculator" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-wider">Risk</span>
          </Link>

          <Link
            href="/dashboard/analytics"
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              pathname === "/dashboard/analytics" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] font-mono tracking-wider">Analytics</span>
          </Link>
        </nav>
      </div>

      {/* Global Modals */}
      <BrokerSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      <TradeLogModal
        isOpen={isTradeModalOpen}
        onClose={handleCloseTradeModal}
        tradeToEdit={tradeToEdit}
      />

      <TradeDetailModal
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        trade={selectedTrade}
        onEdit={(trade) => {
          setSelectedTrade(null);
          handleOpenEdit(trade);
        }}
      />

      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
