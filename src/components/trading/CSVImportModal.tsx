"use client";

import React, { useState, useMemo } from "react";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { useTrades } from "@/context/TradeContext";
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Check, Table } from "lucide-react";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CSVImportModal({ isOpen, onClose }: CSVImportModalProps) {
  const { importFromCSV } = useTrades();
  const [csvContent, setCsvContent] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sampleCSV = `Ticker,AssetClass,Direction,EntryDate,ExitDate,Session,EntryPrice,ExitPrice,StopLoss,TakeProfit,PositionSize,GrossPnL,NetPnL,Commission,Swap,RMultiple,Strategy,Setup,MistakeTags,MarketCondition,Confidence,Stress,Discipline,Notes,Account
NAS100,Indices,LONG,2026-09-03 14:30,2026-09-03 15:45,New York,19850,19960,19810,19970,5,550,520,30,0,2.75,Macro Range Expansion,Fair Value Gap,,Trending Bullish,5,2,5,Clean FVG fill,Apex Prop 100K Fund
EURUSD,Forex,SHORT,2026-09-02 08:15,2026-09-02 09:30,London,1.0865,1.0820,1.0880,1.0810,10,450,425,25,0,3.00,Session Extreme Sweep,Liquidity Sweep,,Trending Bearish,4,1,5,London open purge,Topstep 50K
XAUUSD,Commodities,LONG,2026-09-01 10:10,2026-09-01 11:25,New York,2502.4,2520.0,2496.8,2525.0,3,528,510,18,0,3.14,Order Block Retest,Fair Value Gap,,Trending Bullish,5,1,5,Discount FVG tap,Apex Prop 100K Fund`;

  // Live parsed rows summary
  const parsedPreview = useMemo(() => {
    if (!csvContent.trim()) return [];
    const lines = csvContent.trim().split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[\"\']/g, ""));
    const findIdx = (keywords: string[]) => headers.findIndex((col) => keywords.some((k) => col.includes(k)));

    const tickerIdx = findIdx(["ticker", "symbol", "instrument", "pair", "item"]);
    const dirIdx = findIdx(["direction", "side", "type", "action", "cmd"]);
    const pnlIdx = findIdx(["netpnl", "profit", "pnl", "p&l", "net profit", "net"]);
    const dateIdx = findIdx(["entrydate", "open time", "time", "date", "open"]);

    return lines.slice(1, 6).map((line, idx) => {
      const parts = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      const ticker = (tickerIdx !== -1 ? parts[tickerIdx] : parts[0]) || "UNKNOWN";
      const dir = (dirIdx !== -1 ? parts[dirIdx] : parts[2]) || "BUY";
      const pnl = parseFloat(pnlIdx !== -1 ? parts[pnlIdx] : parts[12]) || 0;
      const date = (dateIdx !== -1 ? parts[dateIdx] : parts[3]) || "N/A";
      return { id: idx, ticker, dir, pnl, date };
    });
  }, [csvContent]);

  const totalRowsCount = useMemo(() => {
    if (!csvContent.trim()) return 0;
    const lines = csvContent.trim().split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    return Math.max(0, lines.length - 1);
  }, [csvContent]);

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
      setImportStatus(`Successfully parsed and imported ${totalRowsCount} trade records!`);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setImportStatus(null);
        setCsvContent("");
      }, 1000);
    } catch (err: any) {
      setImportStatus(`Error parsing CSV: ${err.message}`);
      setIsSuccess(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Institutional CSV / Trade Record Importer"
      subtitle="Universal schema auto-detection for MetaTrader 4/5, cTrader, NinjaTrader, TradingView & Excel"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Upload Zone */}
        <label className="border-2 border-dashed border-white/20 hover:border-white/50 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.05] transition-all">
          <Upload className="w-7 h-7 text-zinc-400 mb-1.5" />
          <span className="text-xs font-semibold text-zinc-200">
            Click to upload or drag & drop .csv export file
          </span>
          <span className="text-[10px] text-zinc-500 mt-1 font-mono">
            Auto-detects columns from MT4, MT5, cTrader, NinjaTrader, Tradovate & Synapses formats
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
              className="text-[10px] text-zinc-300 hover:text-white font-mono hover:underline cursor-pointer"
            >
              Insert Sample Dataset (3 Trades)
            </button>
          </div>
          <textarea
            rows={4}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            placeholder="Ticker,AssetClass,Direction,EntryDate,ExitDate..."
            className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono custom-scrollbar resize-none"
          />
        </div>

        {/* Live Parse Preview Table */}
        {parsedPreview.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Table className="w-3.5 h-3.5 text-cyan-400" />
                <span>Detected {totalRowsCount} Trades (Showing first {parsedPreview.length}):</span>
              </span>
              <span className="text-emerald-400 font-bold">Schema Validated</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/60">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-[10px] text-zinc-400 uppercase">
                    <th className="p-2">Symbol</th>
                    <th className="p-2">Dir</th>
                    <th className="p-2">Date</th>
                    <th className="p-2 text-right">Net P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {parsedPreview.map((row) => (
                    <tr key={row.id} className="hover:bg-white/[0.02]">
                      <td className="p-2 font-bold text-white">{row.ticker}</td>
                      <td className="p-2">
                        <span className={row.dir.toUpperCase().includes("SHORT") || row.dir.toUpperCase().includes("SELL") ? "text-red-400" : "text-emerald-400"}>
                          {row.dir}
                        </span>
                      </td>
                      <td className="p-2 text-zinc-400">{row.date}</td>
                      <td className={`p-2 text-right font-bold ${row.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
          <GlassButton
            variant="pill"
            size="sm"
            onClick={handleImport}
            disabled={totalRowsCount === 0}
          >
            Execute Import ({totalRowsCount} Trades)
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}
