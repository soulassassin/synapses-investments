"use client";

import React, { useState, useEffect } from "react";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { useTrades } from "@/context/TradeContext";
import { Trade, AssetClass, TradeDirection, SessionName, MarketCondition } from "@/lib/types";
import {
  Sparkles,
  AlertTriangle,
} from "lucide-react";

interface TradeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  tradeToEdit?: Trade | null;
}

export function TradeLogModal({ isOpen, onClose, tradeToEdit }: TradeLogModalProps) {
  const { addTrade, updateTrade, brokerAccounts, playbookStrategies } = useTrades();

  const [ticker, setTicker] = useState("NAS100");
  const [assetClass, setAssetClass] = useState<AssetClass>("Indices");
  const [direction, setDirection] = useState<TradeDirection>("LONG");
  const [entryDate, setEntryDate] = useState("");
  const [exitDate, setExitDate] = useState("");
  const [session, setSession] = useState<SessionName>("New York");
  const [entryPrice, setEntryPrice] = useState(19820.00);
  const [exitPrice, setExitPrice] = useState(19960.00);
  const [stopLoss, setStopLoss] = useState(19780.00);
  const [takeProfit, setTakeProfit] = useState(19970.00);
  const [positionSize, setPositionSize] = useState(5.0);
  const [commission, setCommission] = useState(35.00);
  const [swap, setSwap] = useState(0.00);
  const [strategy, setStrategy] = useState("Macro Range Expansion");
  const [setup, setSetup] = useState("Fair Value Gap");

  const [marketCondition, setMarketCondition] = useState<MarketCondition>("Trending Bullish");
  const [mistakeTags, setMistakeTags] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(5);
  const [stress, setStress] = useState(2);
  const [discipline, setDiscipline] = useState(5);
  const [preTradeState, setPreTradeState] = useState<any>("Focused");
  const [postTradeState, setPostTradeState] = useState<any>("Satisfied");
  const [notes, setNotes] = useState("");
  const [account, setAccount] = useState("Apex Prop 100K Fund");
  const [timeframe, setTimeframe] = useState("5m");

  const availableMistakes = [
    "FOMO",
    "Early Exit",
    "Overleveraged",
    "Moved Stop Loss",
    "Chased Entry",
    "Revenge Trade",
    "Traded Red Folder News",
    "No Clear Confluence",
  ];

  useEffect(() => {
    if (tradeToEdit) {
      setTicker(tradeToEdit.ticker);
      setAssetClass(tradeToEdit.assetClass);
      setDirection(tradeToEdit.direction);
      setEntryDate(tradeToEdit.entryDate);
      setExitDate(tradeToEdit.exitDate);
      setSession(tradeToEdit.session);
      setEntryPrice(tradeToEdit.entryPrice);
      setExitPrice(tradeToEdit.exitPrice);
      setStopLoss(tradeToEdit.stopLoss);
      setTakeProfit(tradeToEdit.takeProfit || 0);
      setPositionSize(tradeToEdit.positionSize);
      setCommission(tradeToEdit.commission || 0);
      setSwap(tradeToEdit.swap || 0);
      setStrategy(tradeToEdit.strategy || "");
      setSetup(tradeToEdit.setup || "");
      setMarketCondition(tradeToEdit.marketCondition || "Trending Bullish");
      setMistakeTags(tradeToEdit.mistakeTags || []);
      setConfidence(tradeToEdit.emotion?.confidence || 4);
      setStress(tradeToEdit.emotion?.stress || 2);
      setDiscipline(tradeToEdit.emotion?.discipline || 5);
      setPreTradeState(tradeToEdit.emotion?.preTradeState || "Focused");
      setPostTradeState(tradeToEdit.emotion?.postTradeState || "Satisfied");
      setNotes(tradeToEdit.notes || "");
      setAccount(tradeToEdit.account || "Apex Prop 100K Fund");
      setTimeframe(tradeToEdit.timeframe || "5m");
    } else {
      const now = new Date();
      const dateStr = now.toISOString().replace("T", " ").slice(0, 16);
      setEntryDate(dateStr);
      setExitDate(dateStr);
    }
  }, [tradeToEdit, isOpen]);

  const isLong = direction === "LONG";
  const priceDiff = isLong ? exitPrice - entryPrice : entryPrice - exitPrice;
  const calculatedGrossPnL = Number((priceDiff * positionSize * (assetClass === "Forex" ? 10 : 1)).toFixed(2));
  const calculatedNetPnL = Number((calculatedGrossPnL - commission - swap).toFixed(2));

  const riskPerUnit = Math.abs(entryPrice - stopLoss);
  const calculatedR = riskPerUnit > 0 ? Number(((priceDiff / riskPerUnit)).toFixed(2)) : 0;

  const toggleMistakeTag = (tag: string) => {
    setMistakeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tradeData: Omit<Trade, "id"> = {
      ticker: ticker.toUpperCase(),
      assetClass,
      direction,
      entryDate,
      exitDate,
      session,
      entryPrice,
      exitPrice,
      stopLoss,
      takeProfit: takeProfit || undefined,
      positionSize,
      grossPnL: calculatedGrossPnL,
      netPnL: calculatedNetPnL,
      commission,
      swap,
      slippagePips: 0.5,
      spreadPips: 1.0,
      rMultiple: calculatedR,
      strategy,
      setup,
      mistakeTags,
      marketCondition,
      emotion: {
        confidence,
        stress,
        discipline,
        preTradeState,
        postTradeState,
        notes,
      },
      notes,
      timeframe,
      account,
    };

    if (tradeToEdit) {
      updateTrade(tradeToEdit.id, tradeData);
    } else {
      addTrade(tradeData);
    }
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={tradeToEdit ? `Edit Trade #${tradeToEdit.id}` : "Log Execution & Playbook Setup"}
      subtitle="Automated P&L calculations, risk multiples, mistake tagging, and psychology metrics"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Live Calculated Banner */}
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/20 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              ESTIMATED NET P&L
            </span>
            <span
              className={`text-2xl font-black font-mono ${
                calculatedNetPnL >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {calculatedNetPnL >= 0 ? "+" : ""}${calculatedNetPnL.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              R-MULTIPLE
            </span>
            <span
              className={`text-2xl font-black font-mono ${
                calculatedR >= 0 ? "text-white" : "text-red-400"
              }`}
            >
              {calculatedR >= 0 ? "+" : ""}{calculatedR.toFixed(2)}R
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              FEES & SWAP
            </span>
            <span className="text-sm font-bold font-mono text-zinc-300">
              -${(commission + swap).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Section 1: Core Trade Execution */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono block">
            1. Instrument & Execution Data
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Symbol / Ticker</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g. NAS100"
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono uppercase"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Asset Class</label>
              <select
                value={assetClass}
                onChange={(e) => setAssetClass(e.target.value as any)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs"
              >
                <option value="Indices">Indices</option>
                <option value="Forex">Forex</option>
                <option value="Crypto">Crypto</option>
                <option value="Commodities">Commodities</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Direction</label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setDirection("LONG")}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono ${
                    direction === "LONG"
                      ? "bg-white text-black font-bold"
                      : "bg-white/[0.04] text-zinc-400"
                  }`}
                >
                  LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("SHORT")}
                  className={`py-1.5 rounded-lg text-xs font-bold font-mono ${
                    direction === "SHORT"
                      ? "bg-white text-black font-bold"
                      : "bg-white/[0.04] text-zinc-400"
                  }`}
                >
                  SHORT
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1h">1h</option>
                <option value="4h">4h</option>
                <option value="Daily">Daily</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Entry Price</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Exit Price</label>
              <input
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Stop Loss (SL)</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Take Profit (TP)</label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Position Size / Lots</label>
              <input
                type="number"
                step="any"
                value={positionSize}
                onChange={(e) => setPositionSize(parseFloat(e.target.value) || 0)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Commissions ($)</label>
              <input
                type="number"
                step="any"
                value={commission}
                onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Session</label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value as any)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs"
              >
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Asia / Tokyo">Asia / Tokyo</option>
                <option value="London/NY Overlap">London/NY Overlap</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Account</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs"
              >
                {brokerAccounts.map((acc) => (
                  <option key={acc.id} value={acc.name}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Strategy, Setup, and Mistake Tags */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono block">
            2. Setup, Playbook & Mistake Tracking
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Strategy Name</label>
              <input
                type="text"
                list="playbook-strategies-list"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="e.g. Volatility Compression Breakout"
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs"
              />
              <datalist id="playbook-strategies-list">
                {(playbookStrategies || []).map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">Setup Type</label>
              <select
                value={setup}
                onChange={(e) => setSetup(e.target.value)}
                className="w-full glass-input px-3 py-1.5 rounded-xl text-xs"
              >
                <option value="Fair Value Gap">Fair Value Gap (FVG)</option>
                <option value="Liquidity Sweep">Liquidity Sweep</option>
                <option value="Order Block Bounce">Order Block Bounce</option>
                <option value="Breakout & Retest">Breakout & Retest</option>
                <option value="Momentum Scalp">Momentum Scalp</option>
                <option value="Mean Reversion">Mean Reversion</option>
              </select>
            </div>
          </div>

          {/* Mistake Tag Selector */}
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1.5">
              Mistake Tags (Check if applicable)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableMistakes.map((tag) => {
                const isSelected = mistakeTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleMistakeTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 ${
                      isSelected
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Psychology */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono block">
            3. Trader Psychology & Emotion Tracking
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-300 font-medium">Confidence</span>
                <span className="text-xs font-bold font-mono text-white">{confidence} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-300 font-medium">Stress Level</span>
                <span className="text-xs font-bold font-mono text-red-300">{stress} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full accent-red-400"
              />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-zinc-300 font-medium">Discipline Rating</span>
                <span className="text-xs font-bold font-mono text-emerald-300">{discipline} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={discipline}
                onChange={(e) => setDiscipline(parseInt(e.target.value))}
                className="w-full accent-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">
              Trade Notes & Reflection
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Document setup reasoning, market context, entry trigger..."
              className="w-full glass-input px-3 py-2 rounded-xl text-xs custom-scrollbar resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <GlassButton type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            type="submit"
            variant="pill"
            size="sm"
            icon={<Sparkles className="w-4 h-4 text-black" />}
          >
            {tradeToEdit ? "Save Changes" : "Save to Journal"}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
}
