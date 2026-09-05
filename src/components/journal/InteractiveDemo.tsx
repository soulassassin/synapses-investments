"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Filter,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  X,
  RotateCcw,
  Eye,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  Layers,
  Clock,
  Target,
  Shield,
  Zap,
} from "lucide-react";

export interface DemoTrade {
  id: string;
  asset: string;
  direction: "LONG" | "SHORT";
  session: "London Open" | "NY AM" | "NY PM" | "Asian Range";
  setupTag: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  rrRatio: number;
  resultR: number;
  pnlDollar: number;
  outcome: "WIN" | "LOSS";
  timestamp: string;
  notes: string;
  emotionalState: "Disciplined" | "Neutral" | "High Conviction" | "FOMO Risk";
}

const INITIAL_TRADES: DemoTrade[] = [
  {
    id: "sn-demo-01",
    asset: "NAS100",
    direction: "LONG",
    session: "NY AM",
    setupTag: "NY AM Silver Bullet (5m FVG)",
    entryPrice: 19820.0,
    stopLoss: 19780.0,
    takeProfit: 19948.0,
    rrRatio: 3.2,
    resultR: 3.2,
    pnlDollar: 3200,
    outcome: "WIN",
    timestamp: "10:15 EST • Today",
    notes: "Clean 5m BISI mitigation inside NY AM killzone window following 15m MSS liquidity sweep.",
    emotionalState: "High Conviction",
  },
  {
    id: "sn-demo-02",
    asset: "EURUSD",
    direction: "SHORT",
    session: "London Open",
    setupTag: "London High Liquidity Sweep",
    entryPrice: 1.0845,
    stopLoss: 1.0865,
    takeProfit: 1.0803,
    rrRatio: 2.1,
    resultR: 2.1,
    pnlDollar: 2100,
    outcome: "WIN",
    timestamp: "03:30 EST • Yesterday",
    notes: "Asian high run-out followed by immediate displacement lower and 1m bearish Order Block mitigation.",
    emotionalState: "Disciplined",
  },
  {
    id: "sn-demo-03",
    asset: "BTCUSD",
    direction: "LONG",
    session: "NY PM",
    setupTag: "Daily FVG Tap + Equal Lows",
    entryPrice: 64200.0,
    stopLoss: 63600.0,
    takeProfit: 66000.0,
    rrRatio: 3.0,
    resultR: -1.0,
    pnlDollar: -1000,
    outcome: "LOSS",
    timestamp: "14:20 EST • 2 Days Ago",
    notes: "Displaced below lower boundary of daily imbalance; stop loss respected without slippage.",
    emotionalState: "Disciplined",
  },
  {
    id: "sn-demo-04",
    asset: "US30",
    direction: "SHORT",
    session: "NY PM",
    setupTag: "NY PM Macro Breaker Block",
    entryPrice: 41250.0,
    stopLoss: 41320.0,
    takeProfit: 41054.0,
    rrRatio: 2.8,
    resultR: 2.8,
    pnlDollar: 2800,
    outcome: "WIN",
    timestamp: "15:10 EST • 3 Days Ago",
    notes: "Institutional algorithmic delivery into sell-side liquidity void prior to equity market close.",
    emotionalState: "High Conviction",
  },
];

export function InteractiveDemo() {
  const [trades, setTrades] = useState<DemoTrade[]>(INITIAL_TRADES);
  const [sessionFilter, setSessionFilter] = useState<string>("All");
  const [assetFilter, setAssetFilter] = useState<string>("All");
  const [outcomeFilter, setOutcomeFilter] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<DemoTrade | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for "Log Sample Execution"
  const [formAsset, setFormAsset] = useState("NAS100");
  const [formDirection, setFormDirection] = useState<"LONG" | "SHORT">("LONG");
  const [formSession, setFormSession] = useState<DemoTrade["session"]>("NY AM");
  const [formSetupTag, setFormSetupTag] = useState("Fair Value Gap (FVG)");
  const [formEntry, setFormEntry] = useState("19850.00");
  const [formSL, setFormSL] = useState("19800.00");
  const [formTP, setFormTP] = useState("19975.00");
  const [formOutcome, setFormOutcome] = useState<"WIN" | "LOSS">("WIN");
  const [formNotes, setFormNotes] = useState("");
  const [formEmotion, setFormEmotion] = useState<DemoTrade["emotionalState"]>("Disciplined");

  // Dynamic Live R:R computation for the modal
  const computedModalRR = useMemo(() => {
    const entry = parseFloat(formEntry) || 0;
    const sl = parseFloat(formSL) || 0;
    const tp = parseFloat(formTP) || 0;
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    if (risk <= 0 || isNaN(risk) || isNaN(reward)) return "0.00";
    return (reward / risk).toFixed(2);
  }, [formEntry, formSL, formTP]);

  // Filtered Trades
  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      const matchSession = sessionFilter === "All" || t.session === sessionFilter;
      const matchAsset = assetFilter === "All" || t.asset === assetFilter;
      const matchOutcome =
        outcomeFilter === "All" ||
        (outcomeFilter === "Wins" && t.outcome === "WIN") ||
        (outcomeFilter === "Losses" && t.outcome === "LOSS");
      return matchSession && matchAsset && matchOutcome;
    });
  }, [trades, sessionFilter, assetFilter, outcomeFilter]);

  // Telemetry Quick Stats Strip (Computed dynamically from filtered / current trade state)
  const stats = useMemo(() => {
    const total = filteredTrades.length;
    if (total === 0) {
      return { winRate: "0.0%", avgRR: "0.00", totalR: "0.0R", profitFactor: "0.00", netPnl: "$0" };
    }
    const wins = filteredTrades.filter((t) => t.outcome === "WIN");
    const winRate = ((wins.length / total) * 100).toFixed(1) + "%";

    const totalRVal = filteredTrades.reduce((acc, t) => acc + t.resultR, 0);
    const totalRStr = (totalRVal >= 0 ? "+" : "") + totalRVal.toFixed(1) + "R";

    const totalWinR = wins.reduce((acc, t) => acc + t.resultR, 0);
    const totalLossR = Math.abs(
      filteredTrades.filter((t) => t.outcome === "LOSS").reduce((acc, t) => acc + t.resultR, 0)
    );
    const profitFactor =
      totalLossR > 0 ? (totalWinR / totalLossR).toFixed(2) : totalWinR > 0 ? "MAX" : "0.00";

    const avgRRVal = wins.length > 0 ? wins.reduce((acc, t) => acc + t.rrRatio, 0) / wins.length : 0;
    const avgRRStr = "1 : " + avgRRVal.toFixed(2);

    const netPnlVal = filteredTrades.reduce((acc, t) => acc + t.pnlDollar, 0);
    const netPnlStr = (netPnlVal >= 0 ? "+$" : "-$") + Math.abs(netPnlVal).toLocaleString();

    return { winRate, avgRR: avgRRStr, totalR: totalRStr, profitFactor, netPnl: netPnlStr };
  }, [filteredTrades]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const entry = parseFloat(formEntry) || 0;
    const sl = parseFloat(formSL) || 0;
    const tp = parseFloat(formTP) || 0;
    const rr = parseFloat(computedModalRR) || 1.0;
    const resultR = formOutcome === "WIN" ? rr : -1.0;
    const pnlDollar = formOutcome === "WIN" ? Math.round(rr * 1000) : -1000;

    const newTrade: DemoTrade = {
      id: `sn-demo-${Date.now().toString().slice(-4)}`,
      asset: formAsset,
      direction: formDirection,
      session: formSession,
      setupTag: formSetupTag,
      entryPrice: entry,
      stopLoss: sl,
      takeProfit: tp,
      rrRatio: rr,
      resultR: resultR,
      pnlDollar: pnlDollar,
      outcome: formOutcome,
      timestamp: "Just Now",
      notes: formNotes || `${formSetupTag} execution captured during ${formSession}.`,
      emotionalState: formEmotion,
    };

    setTrades([newTrade, ...trades]);
    setIsModalOpen(false);
    showToast(`Execution Logged: ${formAsset} ${formDirection} (${resultR >= 0 ? "+" : ""}${resultR}R)`);

    // Reset default form inputs
    setFormNotes("");
  };

  const handleDeleteTrade = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTrades(trades.filter((t) => t.id !== id));
    if (selectedTrade?.id === id) setSelectedTrade(null);
    showToast("Trade removed from sandbox session.");
  };

  const handleReset = () => {
    setTrades(INITIAL_TRADES);
    setSessionFilter("All");
    setAssetFilter("All");
    setOutcomeFilter("All");
    showToast("Sandbox restored to initial institutional state.");
  };

  return (
    <div className="w-full rounded-3xl bg-[#08090c] border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-zinc-900/95 border border-emerald-500/40 text-white font-mono text-xs shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Sandbox Header */}
      <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0d0f14]/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-mono">
                  INTERACTIVE EXECUTION SANDBOX
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[10px] font-mono uppercase tracking-wider border border-white/15">
                  LIVE DEMO
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Test the client-side trade logging interface and watch the telemetry calculate in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Reset Sandbox"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Sample Execution</span>
          </button>
        </div>
      </div>

      {/* Telemetry Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-b border-white/10 bg-[#0a0c10]">
        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            DEMO WIN RATE
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider block mt-1">
            {stats.winRate}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
            {filteredTrades.filter((t) => t.outcome === "WIN").length}W / {filteredTrades.filter((t) => t.outcome === "LOSS").length}L ({filteredTrades.length} Total)
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            AVERAGE R:R RATIO
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono text-cyan-400 tracking-wider block mt-1">
            {stats.avgRR}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
            Institutional Expectancy
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            TOTAL R HARVESTED
          </span>
          <span
            className={`text-xl sm:text-2xl font-black font-mono tracking-wider block mt-1 ${
              stats.totalR.startsWith("-") ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {stats.totalR}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
            Cumulative Unit Return
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            PROFIT FACTOR
          </span>
          <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider block mt-1">
            {stats.profitFactor}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
            Gross Gain / Loss Ratio
          </span>
        </div>

        <div className="p-4 sm:p-5 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
            SIMULATED NET GAIN
          </span>
          <span
            className={`text-xl sm:text-2xl font-black font-mono tracking-wider block mt-1 ${
              stats.netPnl.startsWith("-") ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {stats.netPnl}
          </span>
          <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
            @ $1,000 / 1.0R Risk Unit
          </span>
        </div>
      </div>

      {/* Live Interactive Filter Bar */}
      <div className="p-4 bg-[#0d0f14]/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-zinc-500 flex items-center gap-1.5 mr-1 text-[11px]">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span>SESSION:</span>
          </span>
          {["All", "London Open", "NY AM", "NY PM"].map((s) => (
            <button
              key={s}
              onClick={() => setSessionFilter(s)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                sessionFilter === s
                  ? "bg-white text-black font-bold shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-zinc-500 flex items-center gap-1.5 mr-1 text-[11px]">
            <span>ASSET:</span>
          </span>
          {["All", "NAS100", "EURUSD", "BTCUSD", "US30"].map((a) => (
            <button
              key={a}
              onClick={() => setAssetFilter(a)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                assetFilter === a
                  ? "bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
              }`}
            >
              {a}
            </button>
          ))}

          <span className="text-zinc-500 mx-1">•</span>

          <span className="text-zinc-500 text-[11px]">OUTCOME:</span>
          {["All", "Wins", "Losses"].map((o) => (
            <button
              key={o}
              onClick={() => setOutcomeFilter(o)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                outcomeFilter === o
                  ? "bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/5"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Trades Data Table */}
      <div className="overflow-x-auto custom-scrollbar bg-[#08090c]">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] text-zinc-400 uppercase tracking-wider">
              <th className="p-3.5 pl-5">ASSET / DIRECTION</th>
              <th className="p-3.5">SESSION</th>
              <th className="p-3.5">SMC CONFLUENCE / SETUP</th>
              <th className="p-3.5">ENTRY / SL / TP</th>
              <th className="p-3.5 text-center">PLANNED R:R</th>
              <th className="p-3.5 text-right">RETURN</th>
              <th className="p-3.5 text-right pr-5">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">
                  <p className="font-mono text-xs">No executions match current active filters.</p>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-xs text-emerald-400 hover:underline font-mono"
                  >
                    Reset filters or log a sample trade
                  </button>
                </td>
              </tr>
            ) : (
              filteredTrades.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTrade(t)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  {/* Asset / Direction */}
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          t.direction === "LONG"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {t.direction === "LONG" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="text-white font-bold block">{t.asset}</span>
                        <span className="text-[10px] text-zinc-500 block">{t.direction}</span>
                      </div>
                    </div>
                  </td>

                  {/* Session */}
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300 text-[10px]">
                      {t.session}
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1">{t.timestamp}</span>
                  </td>

                  {/* Setup Tag */}
                  <td className="p-3.5">
                    <span className="text-zinc-200 block font-semibold">{t.setupTag}</span>
                    <span className="text-[10px] text-zinc-500 truncate max-w-xs block">
                      {t.notes}
                    </span>
                  </td>

                  {/* Entry / SL / TP */}
                  <td className="p-3.5 text-zinc-300 text-[11px]">
                    <div>
                      <span className="text-zinc-500">Entry:</span> {t.entryPrice}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      <span className="text-red-400">SL:</span> {t.stopLoss} •{" "}
                      <span className="text-emerald-400">TP:</span> {t.takeProfit}
                    </div>
                  </td>

                  {/* Planned R:R */}
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-zinc-200 font-bold text-xs">
                      1 : {t.rrRatio.toFixed(2)}
                    </span>
                  </td>

                  {/* Return */}
                  <td className="p-3.5 text-right font-bold">
                    <div
                      className={`text-sm ${
                        t.outcome === "WIN" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {t.resultR >= 0 ? `+${t.resultR.toFixed(1)}R` : `${t.resultR.toFixed(1)}R`}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {t.pnlDollar >= 0 ? `+$${t.pnlDollar.toLocaleString()}` : `-$${Math.abs(t.pnlDollar).toLocaleString()}`}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right pr-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrade(t);
                        }}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
                        title="View Telemetry Breakdown"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteTrade(t.id, e)}
                        className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete from Demo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Strip */}
      <div className="p-3.5 bg-[#0a0c10] border-t border-white/10 px-5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>ZERO-KNOWLEDGE CLIENT SANDBOX • NO DATABASE AUTH REQUIRED</span>
        </div>
        <span>CLICK ANY ROW TO AUDIT INSTITUTIONAL EXECUTION TELEMETRY</span>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: "Log Sample Execution" Drawer / Modal */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl rounded-3xl bg-[#0d0f14] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase font-mono tracking-wider">
                    LOG SAMPLE PROPRIETARY EXECUTION
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-sans">
                    Live client-side calculation & telemetry simulation
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleAddTrade} className="p-5 space-y-4">
              {/* Asset & Direction */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    ASSET SYMBOL
                  </label>
                  <select
                    value={formAsset}
                    onChange={(e) => setFormAsset(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="NAS100">NAS100 (Nasdaq Futures)</option>
                    <option value="US30">US30 (Dow Jones)</option>
                    <option value="EURUSD">EURUSD (Euro FX)</option>
                    <option value="GBPUSD">GBPUSD (British Pound)</option>
                    <option value="BTCUSD">BTCUSD (Bitcoin)</option>
                    <option value="ETHUSD">ETHUSD (Ethereum)</option>
                    <option value="XAUUSD">XAUUSD (Gold Spot)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    DIRECTION
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormDirection("LONG")}
                      className={`py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                        formDirection === "LONG"
                          ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                          : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      LONG
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormDirection("SHORT")}
                      className={`py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                        formDirection === "SHORT"
                          ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                          : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white"
                      }`}
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      SHORT
                    </button>
                  </div>
                </div>
              </div>

              {/* Session & Confluence */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    EXECUTION SESSION
                  </label>
                  <select
                    value={formSession}
                    onChange={(e) => setFormSession(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="London Open">London Open (02:00 - 05:00 EST)</option>
                    <option value="NY AM">NY AM Killzone (09:30 - 11:30 EST)</option>
                    <option value="NY PM">NY PM Power Hour (13:30 - 16:00 EST)</option>
                    <option value="Asian Range">Asian Range (19:00 - 00:00 EST)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    SMC SETUP TAG
                  </label>
                  <select
                    value={formSetupTag}
                    onChange={(e) => setFormSetupTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fair Value Gap (FVG)">Fair Value Gap (FVG / BISI / SIBI)</option>
                    <option value="NY AM Silver Bullet">NY AM Silver Bullet Model</option>
                    <option value="Liquidity Sweep Reversal">Buy-Side / Sell-Side Sweep</option>
                    <option value="Order Block Mitigation">Institutional Order Block (OB)</option>
                    <option value="Breaker Block Shift">Breaker Block Structure Shift</option>
                    <option value="Judas Swing Trap">London Open Judas Swing Trap</option>
                  </select>
                </div>
              </div>

              {/* Entry, SL, TP */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    ENTRY PRICE
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formEntry}
                    onChange={(e) => setFormEntry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-red-400 uppercase tracking-wider block mb-1">
                    STOP LOSS (SL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formSL}
                    onChange={(e) => setFormSL(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                    TAKE PROFIT (TP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formTP}
                    onChange={(e) => setFormTP(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Reactive R:R Display + Outcome Selector */}
              <div className="p-3 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                    LIVE COMPUTED R:R RATIO
                  </span>
                  <span className="text-lg font-black font-mono text-cyan-400">
                    1 : {computedModalRR}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-400 mr-1">SIMULATED OUTCOME:</span>
                  <button
                    type="button"
                    onClick={() => setFormOutcome("WIN")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      formOutcome === "WIN"
                        ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                        : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    WIN (+{computedModalRR}R)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormOutcome("LOSS")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      formOutcome === "LOSS"
                        ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        : "bg-white/[0.04] text-zinc-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    LOSS (-1.0R)
                  </button>
                </div>
              </div>

              {/* Behavioral Emotion Tag */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  BEHAVIORAL AUDIT STATE
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {(["Disciplined", "High Conviction", "Neutral", "FOMO Risk"] as const).map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormEmotion(em)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-medium border transition-all text-center truncate ${
                        formEmotion === em
                          ? "bg-white text-black border-white font-bold"
                          : "bg-white/[0.03] text-zinc-400 border-white/10 hover:text-white"
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Execution Notes */}
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  EXECUTION CONTEXT / NOTES
                </label>
                <input
                  type="text"
                  placeholder="e.g., 5m Fair Value Gap tap with liquidity sweep of London High..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Push Execution to Sandbox</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: "Trade Detail / Telemetry Inspector" Modal */}
      {/* ========================================================================= */}
      {selectedTrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedTrade(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-[#0d0f14] border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden space-y-5 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                    selectedTrade.direction === "LONG"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {selectedTrade.direction === "LONG" ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white font-mono">
                      {selectedTrade.asset} • {selectedTrade.direction}
                    </h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        selectedTrade.outcome === "WIN"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-red-500/20 text-red-400 border border-red-500/40"
                      }`}
                    >
                      {selectedTrade.outcome === "WIN" ? `+${selectedTrade.resultR}R WIN` : `${selectedTrade.resultR}R LOSS`}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    ID: {selectedTrade.id} • {selectedTrade.timestamp}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTrade(null)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">SESSION KILLZONE</span>
                <span className="text-white font-bold block">{selectedTrade.session}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">BEHAVIORAL AUDIT</span>
                <span className="text-emerald-400 font-bold block">{selectedTrade.emotionalState}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">ENTRY PRICE</span>
                <span className="text-white font-bold block">{selectedTrade.entryPrice}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase">REALIZED NET RETURN</span>
                <span
                  className={`font-bold block ${
                    selectedTrade.pnlDollar >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {selectedTrade.pnlDollar >= 0 ? `+$${selectedTrade.pnlDollar.toLocaleString()}` : `-$${Math.abs(selectedTrade.pnlDollar).toLocaleString()}`}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-red-400 uppercase">STOP LOSS</span>
                <span className="text-white font-bold block">{selectedTrade.stopLoss}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-emerald-400 uppercase">TAKE PROFIT</span>
                <span className="text-white font-bold block">{selectedTrade.takeProfit}</span>
              </div>
            </div>

            {/* Confluence & Notes */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                INSTITUTIONAL SETUP CONFLUENCE
              </span>
              <span className="text-xs font-mono font-bold text-white block">
                {selectedTrade.setupTag}
              </span>
              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {selectedTrade.notes}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audited Institutional Telemetry</span>
              </span>

              <button
                onClick={() => setSelectedTrade(null)}
                className="px-5 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono hover:bg-zinc-200 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
