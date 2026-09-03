"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/navigation/DashboardSidebar";
import { TickerTape } from "@/components/navigation/TickerTape";
import { BrokerSyncModal } from "@/components/navigation/BrokerSyncModal";
import { TradeLogModal } from "@/components/trading/TradeLogModal";
import { TradeDetailModal } from "@/components/trading/TradeDetailModal";
import { CSVImportModal } from "@/components/trading/CSVImportModal";
import { Trade } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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
    <div className="flex h-screen bg-obsidian-950 overflow-hidden">
      {/* Terminal Sidebar */}
      <DashboardSidebar
        onOpenTradeModal={() => {
          setTradeToEdit(null);
          setIsTradeModalOpen(true);
        }}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Terminal Window */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Streaming Ticker Tape */}
        <TickerTape />

        {/* Dynamic Page Scroll Body */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
          {children}
        </main>
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
