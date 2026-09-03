"use client";

import React, { useState } from "react";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { useTrades } from "@/context/TradeContext";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSVImportModal({ isOpen, onClose }: CSVImportModalProps) {
  const { importFromCSV } = useTrades();
  const [csvContent, setCsvContent] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    if (!csvContent.trim()) {
      setImportStatus("Please provide CSV content or upload a valid file.");
      setIsSuccess(false);
      return;
    }

    try {
      importFromCSV(csvContent);
      setImportStatus("Successfully parsed and imported trade records!");
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setImportStatus(null);
        setCsvContent("");
      }, 1200);
    } catch (err: any) {
      setImportStatus(`Error parsing CSV: ${err.message}`);
      setIsSuccess(false);
    }
  };

  const sampleCSV = `Ticker,AssetClass,Direction,EntryDate,ExitDate,Session,EntryPrice,ExitPrice,StopLoss,TakeProfit,PositionSize,GrossPnL,NetPnL,Commission,Swap,RMultiple,Strategy,Setup,MistakeTags,MarketCondition,Confidence,Stress,Discipline,Notes,Account
NAS100,Indices,LONG,2026-08-30 14:30,2026-08-30 15:45,New York,19850,19960,19810,19970,5,550,520,30,0,2.75,ICT Silver Bullet,Fair Value Gap,,Trending Bullish,5,2,5,Clean FVG fill,Apex Prop 100K Fund`;

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Institutional CSV / Synapses Journal Import"
      subtitle="Paste CSV text or upload an export from MT4, MT5, cTrader, Synapses Journal, or Excel"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Upload Zone */}
        <label className="border-2 border-dashed border-white/20 hover:border-white/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all">
          <Upload className="w-8 h-8 text-zinc-400 mb-2" />
          <span className="text-xs font-semibold text-zinc-200">
            Click to upload or drag & drop .csv file
          </span>
          <span className="text-[10px] text-zinc-500 mt-1 font-mono">
            Supports MetaTrader 4/5, cTrader & Synapses Journal CSV schemas
          </span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Or Paste Raw Content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono text-zinc-400 uppercase">
              Or Paste CSV Data Directly
            </label>
            <button
              type="button"
              onClick={() => setCsvContent(sampleCSV)}
              className="text-[10px] text-zinc-300 hover:text-white font-mono hover:underline"
            >
              Insert Sample Template
            </button>
          </div>
          <textarea
            rows={5}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="Ticker,AssetClass,Direction,EntryDate,ExitDate..."
            className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono custom-scrollbar resize-none"
          />
        </div>

        {/* Status Message */}
        {importStatus && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-mono ${
              isSuccess
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{importStatus}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <GlassButton variant="outline" size="sm" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton variant="pill" size="sm" onClick={handleImport}>
            Execute Import
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}
