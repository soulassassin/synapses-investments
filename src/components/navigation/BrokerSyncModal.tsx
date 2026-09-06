"use client";

import React, { useState } from "react";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { useTrades } from "@/context/TradeContext";
import { BrokerAccount } from "@/lib/types";
import {
  Zap,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Key,
  Copy,
  Check,
  Trash2,
  Layers,
  Radio,
  ExternalLink,
  Plus,
  Terminal,
  Activity,
  ArrowRight,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

interface BrokerSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrokerSyncModal({ isOpen, onClose }: BrokerSyncModalProps) {
  const {
    brokerAccounts,
    connectBroker,
    disconnectBroker,
    selectedAccount,
    setSelectedAccount,
    scanAndSyncAccount,
    isScanningAccount,
    scanningLogs,
  } = useTrades();

  const [tab, setTab] = useState<"CONNECT" | "MANAGE">(
    brokerAccounts.length > 0 ? "MANAGE" : "CONNECT"
  );
  const [platform, setPlatform] = useState<string>("MetaTrader 5");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [server, setServer] = useState("");
  const [balance, setBalance] = useState<string>("100000");
  const [currency, setCurrency] = useState("USD");
  const [investorPassword, setInvestorPassword] = useState("");
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Scanning progress & scan result modal states
  const [scanResultNotice, setScanResultNotice] = useState<{
    success: boolean;
    count: number;
    pnl: number;
    accountName: string;
  } | null>(null);
  const [activeScanningAccountId, setActiveScanningAccountId] = useState<string | null>(null);

  const platforms = [
    { name: "MetaTrader 5", tag: "Direct MT5 Bridge / EA" },
    { name: "MetaTrader 4", tag: "Direct MT4 Bridge / EA" },
    { name: "cTrader", tag: "Open API v2 Read-Only" },
    { name: "TradingView", tag: "Automated Webhook Sync" },
    { name: "Interactive Brokers", tag: "Flex Web Service / TWS" },
    { name: "Prop Firm Account", tag: "Apex, FTMO, Topstep, etc." },
    { name: "Manual Gateway", tag: "Direct Journal Feed" },
  ];

  const handleConnectAndScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = accountName.trim() || `${platform} Account`;
    const finalNum = accountNumber.trim() || `ACC-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalBal = parseFloat(balance) || 100000;
    const finalServer = server.trim() || `${platform}-Live-Server-01`;

    setScanResultNotice(null);

    const res = await scanAndSyncAccount({
      platform: platform as any,
      name: finalName,
      accountNumber: finalNum,
      server: finalServer,
      balance: finalBal,
      currency,
      investorPassword,
      lookbackDays: 30,
      autoImport: true,
    });

    if (res.success) {
      setScanResultNotice({
        success: true,
        count: res.scannedTrades.length,
        pnl: res.stats.netPnL,
        accountName: finalName,
      });

      setTimeout(() => {
        setAccountName("");
        setAccountNumber("");
        setServer("");
        setInvestorPassword("");
        setTab("MANAGE");
      }, 1800);
    }
  };

  // Re-scan an existing connected account on demand
  const handleRescanAccount = async (acc: BrokerAccount) => {
    setActiveScanningAccountId(acc.id);
    const res = await scanAndSyncAccount({
      platform: acc.platform as any,
      name: acc.name,
      accountNumber: acc.accountNumber,
      server: acc.server,
      balance: acc.balance,
      currency: acc.currency || "USD",
      lookbackDays: 30,
      autoImport: true,
    });

    setActiveScanningAccountId(null);
    if (res.success) {
      setScanResultNotice({
        success: true,
        count: res.scannedTrades.length,
        pnl: res.stats.netPnL,
        accountName: acc.name,
      });
      setTimeout(() => setScanResultNotice(null), 4000);
    }
  };

  const copyWebhookTemplate = () => {
    const template = JSON.stringify(
      {
        ticker: "{{ticker}}",
        direction: "{{strategy.order.action}}",
        entryPrice: "{{close}}",
        quantity: "{{strategy.order.contracts}}",
        account: accountName || "TradingView Live",
        timestamp: "{{timenow}}",
      },
      null,
      2
    );
    navigator.clipboard.writeText(template);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Broker & Trading Account Gateway"
      subtitle="Connect live accounts from MT4/5, cTrader, TradingView, or Prop Firms for automated ticket scanning and real-time execution tracking"
      maxWidth="lg"
    >
      <div className="space-y-5 select-none">
        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => {
              setTab("CONNECT");
              setScanResultNotice(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
              tab === "CONNECT"
                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            + Connect & Scan New Account
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("MANAGE");
              setScanResultNotice(null);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              tab === "MANAGE"
                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Connected Feeds</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/15 text-[10px]">
              {brokerAccounts.length}
            </span>
          </button>
        </div>

        {/* Global Scan Result Toast / Notice */}
        {scanResultNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Successfully scanned <strong>{scanResultNotice.count} executions</strong> for{" "}
                {scanResultNotice.accountName}. Realized P&L:{" "}
                <strong className={scanResultNotice.pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                  {scanResultNotice.pnl >= 0 ? "+" : ""}${scanResultNotice.pnl.toLocaleString()}
                </strong>
                . Journal updated automatically.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setScanResultNotice(null)}
              className="text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: CONNECT & SCAN ACCOUNT */}
        {/* ========================================================================= */}
        {tab === "CONNECT" ? (
          <form onSubmit={handleConnectAndScan} className="space-y-4">
            {/* Platform Selection */}
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1.5 uppercase">
                Select Trading Gateway / Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setPlatform(p.name)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      platform === p.name
                        ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.08)] font-bold"
                        : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs truncate">{p.name}</span>
                      <Zap
                        className={`w-3 h-3 ${
                          platform === p.name ? "text-cyan-400" : "text-zinc-600"
                        }`}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono block truncate">
                      {p.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Credentials Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Account Friendly Name / Prop Alias
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex 100K Funded #1"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Account Number / Login ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5184920"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Server / Host Gateway
                </label>
                <input
                  type="text"
                  placeholder={
                    platform.includes("MetaTrader")
                      ? "e.g. ICMarketsSC-Live02"
                      : "e.g. Rithmic01-Live"
                  }
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Read-Only Investor Password (Optional)
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Read-only investor password"
                    value={investorPassword}
                    onChange={(e) => setInvestorPassword(e.target.value)}
                    className="w-full glass-input pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Starting Balance ($)
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Base Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs font-mono text-white bg-black/80"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>

            {/* TradingView Real-Time Webhook Helper */}
            {platform === "TradingView" && (
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      Real-Time TradingView Alert Webhook
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyWebhookTemplate}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedWebhook ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedWebhook ? "Copied Payload!" : "Copy Alert JSON"}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-cyan-500/20 font-mono text-[11px] text-zinc-300 break-all select-all flex items-center justify-between">
                  <span>https://synapses-investments.vercel.app/api/webhook/trade</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Paste this Webhook URL into your TradingView Alert notification tab. Synapses will automatically parse order actions, entry prices, contracts, and P&L into your journal.
                </p>
              </div>
            )}

            {/* LIVE SCANNING RADAR & LOGS CONSOLE */}
            {isScanningAccount && (
              <div className="p-4 rounded-2xl bg-black/90 border border-cyan-500/40 space-y-3 animate-in fade-in duration-300 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                      Scanning Broker Server & Closed Deals...
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Encrypted Protocol Handshake
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] text-zinc-300 max-h-32 overflow-y-auto custom-scrollbar space-y-1">
                  {scanningLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Terminal className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                      <span className={log.includes("ERROR") ? "text-red-400" : "text-zinc-300"}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Guarantee Notice */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 text-[11px] text-zinc-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Zero-Knowledge Audit Protocol: Synapses only consumes read-only execution telemetry. We never store master passwords or require order placement permissions.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <GlassButton type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </GlassButton>
              <GlassButton
                type="submit"
                variant="pill"
                size="sm"
                isLoading={isScanningAccount}
                icon={<RefreshCw className={`w-4 h-4 text-black ${isScanningAccount ? "animate-spin" : ""}`} />}
              >
                {isScanningAccount ? "Scanning Account..." : "Scan & Ingest Account"}
              </GlassButton>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* TAB 2: MANAGE & RESCAN CONNECTED ACCOUNTS */
          /* ========================================================================= */
          <div className="space-y-3">
            {brokerAccounts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-mono">No Connected Accounts</h4>
                  <p className="text-xs text-zinc-400">
                    Connect your first MetaTrader, cTrader, or Prop Firm account to scan and stream real trades.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("CONNECT")}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  + Connect & Scan Account Now
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {brokerAccounts.map((acc) => {
                  const isSelected = selectedAccount === acc.name;
                  const isScanningThis = activeScanningAccountId === acc.id || (isScanningAccount && selectedAccount === acc.name);

                  return (
                    <div
                      key={acc.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-white/[0.08] border-white shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                          : "bg-white/[0.02] border-white/10"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-mono">{acc.name}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                            LIVE FEED
                          </span>
                          {acc.scannedTradesCount !== undefined && acc.scannedTradesCount > 0 && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                              {acc.scannedTradesCount} Trades Scanned
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 font-mono">
                          <span>{acc.platform}</span>
                          <span>•</span>
                          <span>Login: <strong className="text-zinc-200">{acc.accountNumber}</strong></span>
                          <span>•</span>
                          <span>Server: {acc.server}</span>
                        </div>

                        <div className="flex items-center gap-3 pt-0.5">
                          <span className="text-xs text-emerald-400 font-mono font-black">
                            Balance: ${(acc.balance || 100000).toLocaleString()} {acc.currency || "USD"}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>{acc.lastSync || "Just now"}</span>
                          </span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Rescan Button */}
                        <button
                          type="button"
                          disabled={isScanningThis}
                          onClick={() => handleRescanAccount(acc)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isScanningThis
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                              : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-200 hover:text-white border-white/10"
                          }`}
                          title="Scan account for new executions and update journal"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isScanningThis ? "animate-spin text-cyan-400" : "text-zinc-400"}`} />
                          <span>{isScanningThis ? "Scanning..." : "Scan & Sync"}</span>
                        </button>

                        {/* Set Active Filter */}
                        <button
                          type="button"
                          onClick={() => setSelectedAccount(acc.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-400 text-black shadow-[0_0_12px_rgba(34,197,94,0.35)]"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          {isSelected ? "Active" : "Filter"}
                        </button>

                        {/* Disconnect */}
                        <button
                          type="button"
                          onClick={() => disconnectBroker(acc.id)}
                          className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Disconnect account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </GlassModal>
  );
}
