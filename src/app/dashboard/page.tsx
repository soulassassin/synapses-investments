"use client";

import React, { useState } from "react";
import { useTrades } from "@/context/TradeContext";
import { MetricsGrid } from "@/components/trading/MetricsGrid";
import { PnLChart } from "@/components/trading/PnLChart";
import { TradeTable } from "@/components/trading/TradeTable";
import { EmotionTracker } from "@/components/trading/EmotionTracker";
import { RiskGuardrailWidget } from "@/components/trading/RiskGuardrailWidget";
import { TradeDetailModal } from "@/components/trading/TradeDetailModal";
import { TradeLogModal } from "@/components/trading/TradeLogModal";
import { CSVImportModal } from "@/components/trading/CSVImportModal";
import { Trade } from "@/lib/types";

export default function DashboardOverviewPage() {
  const { filteredTrades, currentMetrics } = useTrades();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 8 Institutional KPIs Grid */}
      <MetricsGrid stats={currentMetrics} />

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PnLChart data={currentMetrics.pnlCurve} />
        </div>
        <div className="space-y-6">
          <RiskGuardrailWidget />
          <EmotionTracker stats={currentMetrics} />
        </div>
      </div>

      {/* Full Interactive Trades Table */}
      <TradeTable
        trades={filteredTrades}
        onSelectTrade={(trade) => setSelectedTrade(trade)}
        onEditTrade={(trade) => {
          setTradeToEdit(trade);
          setIsLogModalOpen(true);
        }}
        onOpenImportModal={() => setIsImportModalOpen(true)}
      />

      {/* Detail Modal */}
      <TradeDetailModal
        trade={selectedTrade}
        isOpen={!!selectedTrade}
        onClose={() => setSelectedTrade(null)}
        onEdit={(trade) => {
          setTradeToEdit(trade);
          setIsLogModalOpen(true);
        }}
      />

      {/* Log / Edit Modal */}
      <TradeLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setTradeToEdit(null);
        }}
        tradeToEdit={tradeToEdit}
      />

      {/* Import Modal */}
      <CSVImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
