"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  TrendingUp,
  TrendingDown,
  Calculator,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Sparkles,
  Shield,
  Zap,
  Check,
} from "lucide-react";
import { TradeLog, AssetPair, SessionType, SetupModel, TradeOutcome, EmotionalState } from "@/types/journal";
import { useJournalStore } from "@/store/useJournalStore";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeToEdit?: TradeLog | null;
}

const ASSET_PAIRS: AssetPair[] = [
  "NAS100",
  "US30",
  "SPX500",
  "BTCUSD",
  "EURUSD",
  "GBPUSD",
  "XAUUSD",
];

const SESSIONS: SessionType[] = ["LONDON", "NY_AM", "NY_PM", "ASIA"];

const SETUP_MODELS: { value: SetupModel; label: string }[] = [
  { value: "SILVER_BULLET", label: "Macro Range Expansion" },
  { value: "FVG", label: "Fair Value Imbalance (FVG)" },
  { value: "ORDER_BLOCK", label: "Order Block (OB)" },
  { value: "LIQUIDITY_SWEEP", label: "Liquidity Sweep" },
  { value: "BREAKER", label: "Breaker Block" },
  { value: "TURTLE_SOUP", label: "False Breakout Purge" },
];

const EMOTIONAL_STATES: { value: EmotionalState; label: string; color: string }[] = [
  { value: "DISCIPLINED", label: "Disciplined", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { value: "FOMO", label: "FOMO Entered", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { value: "HESITANT", label: "Hesitant", color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { value: "GREEDY", label: "Greedy Target", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { value: "REVENGE", label: "Revenge Trade", color: "text-red-400 border-red-500/30 bg-red-500/10" },
];

const STRATEGY_CONFLUENCES = [
  "Fair Value Gap (FVG)",
  "Liquidity Sweep (BSL / SSL)",
  "Market Structure Shift (MSS)",
  "Order Block Mitigation",
  "Premium / Discount Array",
  "SMT Divergence",
  "High Relative Volume",
  "Killzone Macro Window",
];


export function TradeModal({ isOpen, onClose, tradeToEdit }: TradeModalProps) {
  const { addTrade, updateTrade } = useJournalStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pair, setPair] = useState<AssetPair | string>("NAS100");
  const [direction, setDirection] = useState<"LONG" | "SHORT">("LONG");
  const [session, setSession] = useState<SessionType>("NY_AM");
  const [setup, setSetup] = useState<SetupModel>("SILVER_BULLET");
  const [timeframe, setTimeframe] = useState("5m");
  const [entryPrice, setEntryPrice] = useState<number>(19850);
  const [stopLoss, setStopLoss] = useState<number>(19825);
  const [takeProfit, setTakeProfit] = useState<number>(19925);
  const [contractsOrLots, setContractsOrLots] = useState<number>(1.0);
  const [riskPercentage, setRiskPercentage] = useState<number>(1.0);
  const [status, setStatus] = useState<TradeOutcome>("WIN");
  const [confluenceNotes, setConfluenceNotes] = useState("");
  const [selectedConfluences, setSelectedConfluences] = useState<string[]>([
    "Fair Value Gap (FVG)",
    "Market Structure Shift (MSS)",
  ]);
  const [emotionalState, setEmotionalState] = useState<EmotionalState>("DISCIPLINED");
  const [screenshots, setScreenshots] = useState<string[]>([]);

  // Populate form if editing
  useEffect(() => {
    if (tradeToEdit) {
      setPair(tradeToEdit.pair);
      setDirection(tradeToEdit.direction);
      setSession(tradeToEdit.session);
      setSetup(tradeToEdit.setup);
      setTimeframe(tradeToEdit.timeframe || "5m");
      setEntryPrice(tradeToEdit.entryPrice);
      setStopLoss(tradeToEdit.stopLoss);
      setTakeProfit(tradeToEdit.takeProfit);
      setContractsOrLots(tradeToEdit.contractsOrLots);
      setRiskPercentage(tradeToEdit.riskPercentage);
      setStatus(tradeToEdit.status);
      setConfluenceNotes(tradeToEdit.confluenceNotes);
      setEmotionalState(tradeToEdit.emotionalState);
      setScreenshots(tradeToEdit.chartScreenshots || []);
    } else {
      // Defaults for new entry
      setPair("NAS100");
      setDirection("LONG");
      setSession("NY_AM");
      setSetup("SILVER_BULLET");
      setTimeframe("5m");
      setEntryPrice(19850);
      setStopLoss(19825);
      setTakeProfit(19925);
      setContractsOrLots(1.0);
      setRiskPercentage(1.0);
      setStatus("WIN");
      setConfluenceNotes("");
      setSelectedConfluences(["Fair Value Gap (FVG)", "Market Structure Shift (MSS)"]);
      setEmotionalState("DISCIPLINED");
      setScreenshots([]);
    }
  }, [tradeToEdit, isOpen]);

  if (!isOpen) return null;

  // Live R:R Calculation
  const riskDistance = Math.abs(entryPrice - stopLoss);
  const rewardDistance = Math.abs(takeProfit - entryPrice);
  const calculatedRR = riskDistance > 0 ? Number((rewardDistance / riskDistance).toFixed(2)) : 0;

  // Estimated P&L calculation
  const calculatedPnL = () => {
    if (status === "WIN") {
      return Number((rewardDistance * contractsOrLots * 20).toFixed(2));
    } else if (status === "LOSS") {
      return -Number((riskDistance * contractsOrLots * 20).toFixed(2));
    }
    return 0;
  };

  const handleConfluenceToggle = (item: string) => {
    if (selectedConfluences.includes(item)) {
      setSelectedConfluences(selectedConfluences.filter((c) => c !== item));
    } else {
      setSelectedConfluences([...selectedConfluences, item]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setScreenshots((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullNotes = [
      selectedConfluences.length > 0 ? `Confluences: ${selectedConfluences.join(" • ")}` : "",
      confluenceNotes,
    ]
      .filter(Boolean)
      .join("\n\n");

    const rMult = status === "WIN" ? calculatedRR : status === "LOSS" ? -1.0 : 0;

    if (tradeToEdit) {
      updateTrade(tradeToEdit.id, {
        pair,
        direction,
        session,
        setup,
        timeframe,
        entryPrice: Number(entryPrice),
        stopLoss: Number(stopLoss),
        takeProfit: Number(takeProfit),
        contractsOrLots: Number(contractsOrLots),
        riskPercentage: Number(riskPercentage),
        rMultiple: rMult,
        netPnL: calculatedPnL(),
        status,
        confluenceNotes: fullNotes,
        emotionalState,
        chartScreenshots: screenshots,
      });
    } else {
      addTrade({
        pair,
        direction,
        session,
        setup,
        timeframe,
        entryPrice: Number(entryPrice),
        stopLoss: Number(stopLoss),
        takeProfit: Number(takeProfit),
        contractsOrLots: Number(contractsOrLots),
        riskPercentage: Number(riskPercentage),
        rMultiple: rMult,
        netPnL: calculatedPnL(),
        status,
        confluenceNotes: fullNotes,
        emotionalState,
        chartScreenshots: screenshots,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto custom-scrollbar">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl my-auto rounded-2xl bg-zinc-950 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.95)] z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">
                {tradeToEdit ? "EDIT EXECUTION RECORD" : "LOG INSTITUTIONAL EXECUTION"}
              </h2>
              <p className="text-[11px] font-mono text-zinc-400">
                Quantitative Precision Journal • Zero-G DMA Telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Section 1: Execution Coordinates */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              1. Execution Parameters
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Asset Pair */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">ASSET</label>
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                >
                  {ASSET_PAIRS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Direction Toggle */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">DIRECTION</label>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black border border-white/15">
                  <button
                    type="button"
                    onClick={() => setDirection("LONG")}
                    className={`py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                      direction === "LONG"
                        ? "bg-emerald-500 text-black shadow-[0_0_12px_#10B981]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("SHORT")}
                    className={`py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                      direction === "SHORT"
                        ? "bg-red-500 text-white shadow-[0_0_12px_#EF4444]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <TrendingDown className="w-3 h-3" />
                    SHORT
                  </button>
                </div>
              </div>

              {/* Session */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">SESSION</label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value as SessionType)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                >
                  {SESSIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Setup Model */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">SETUP</label>
                <select
                  value={setup}
                  onChange={(e) => setSetup(e.target.value as SetupModel)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                >
                  {SETUP_MODELS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Entry, SL, TP row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">ENTRY PRICE</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-red-400 block mb-1">STOP LOSS (SL)</label>
                <input
                  type="number"
                  step="any"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black border border-red-500/30 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-emerald-400 block mb-1">TAKE PROFIT (TP)</label>
                <input
                  type="number"
                  step="any"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black border border-emerald-500/30 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Calculated Live R:R Ratio Card */}
              <div className="flex flex-col justify-center items-center bg-black/60 p-2 rounded-lg border border-white/10 text-center">
                <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider">
                  PROJECTED R:R
                </span>
                <span className="text-base font-mono font-extrabold text-white">
                  1 : {calculatedRR}
                </span>
                <span className="text-[9px] font-mono text-emerald-400">
                  Risk: {riskDistance.toFixed(1)} pts
                </span>
              </div>
            </div>

            {/* Sizing & Status row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">CONTRACTS / LOTS</label>
                <input
                  type="number"
                  step="0.1"
                  value={contractsOrLots}
                  onChange={(e) => setContractsOrLots(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">RISK %</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">TIMEFRAME</label>
                <input
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="5m / 15m"
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">OUTCOME</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TradeOutcome)}
                  className="w-full px-3 py-2 rounded-xl bg-black border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-white/50"
                >
                  <option value="WIN">WIN (+R)</option>
                  <option value="LOSS">LOSS (-1R)</option>
                  <option value="BREAKEVEN">BREAKEVEN (0R)</option>
                  <option value="OPEN">ACTIVE OPEN</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Strategy Confluences */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-white" />
              2. Strategy & Execution Confluences
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STRATEGY_CONFLUENCES.map((item) => {
                const isChecked = selectedConfluences.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleConfluenceToggle(item)}
                    className={`p-2 rounded-xl text-left text-xs font-mono transition-all border flex items-center justify-between ${
                      isChecked
                        ? "bg-white/10 border-white/40 text-white"
                        : "bg-black/50 border-white/10 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span className="truncate pr-1 text-[11px]">{item}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Psychology & Trade Notes */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-white" />
              3. Psychology & Execution Log
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">EMOTIONAL STATE</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {EMOTIONAL_STATES.map((es) => (
                    <button
                      key={es.value}
                      type="button"
                      onClick={() => setEmotionalState(es.value)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
                        emotionalState === es.value
                          ? `${es.color} ring-1 ring-white/20`
                          : "bg-black/40 border-white/10 text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {es.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">EXECUTION ANALYSIS</label>
                <textarea
                  value={confluenceNotes}
                  onChange={(e) => setConfluenceNotes(e.target.value)}
                  placeholder="Judas swing, macro time window, volume displacement, entry notes..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 resize-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Screenshot Upload Dropzone */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-white" />
                4. Chart Screenshots & Proof
              </span>
              <span className="text-[10px] text-zinc-500">Base64 Local Storage</span>
            </span>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-white/35 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white/[0.01]"
            >
              <UploadCloud className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
              <span className="text-xs text-zinc-300 block font-semibold">
                Click or Drop Chart Screenshot
              </span>
              <span className="text-[10px] text-zinc-500">PNG, JPG up to 10MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Screenshot previews */}
            {screenshots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                {screenshots.map((src, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 bg-black aspect-video">
                    <img src={src} alt={`Chart ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer shadow-lg"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/[0.06] active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs sm:text-sm hover:bg-zinc-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] cursor-pointer"
            >
              {tradeToEdit ? "Save Changes" : "Commit Execution to Journal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
