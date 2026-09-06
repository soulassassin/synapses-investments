"use client";

import React, { useState } from "react";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { useTrades } from "@/context/TradeContext";
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
} from "lucide-react";

interface BrokerSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrokerSyncModal({ isOpen, onClose }: BrokerSyncModalProps) {
  const { brokerAccounts, connectBroker, disconnectBroker, selectedAccount, setSelectedAccount } = useTrades();

  const [tab, setTab] = useState<"CONNECT" | "MANAGE">(brokerAccounts.length > 0 ? "MANAGE" : "CONNECT");
  const [platform, setPlatform] = useState<string>("MetaTrader 5");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [server, setServer] = useState("");
  const [balance, setBalance] = useState<string>("100000");
  const [currency, setCurrency] = useState("USD");
  const [investorPassword, setInvestorPassword] = useState("");
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const platforms = [
    { name: "MetaTrader 5", tag: "Direct MT5 Bridge / EA" },
    { name: "MetaTrader 4", tag: "Direct MT4 Bridge / EA" },
    { name: "cTrader", tag: "Open API v2 Read-Only" },
    { name: "TradingView", tag: "Automated Webhook Sync" },
    { name: "Interactive Brokers", tag: "Flex Web Service / TWS" },
    { name: "Prop Firm Account", tag: "Apex, FTMO, Topstep, etc." },
    { name: "Manual Gateway", tag: "Direct Journal Feed" },
  ];

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = accountName.trim() || `${platform} Account`;
    const finalNum = accountNumber.trim() || `ACC-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalBal = parseFloat(balance) || 100000;

    setIsSyncing(true);
    setTimeout(() => {
      connectBroker(
        platform as any,
        finalName,
        finalNum,
        server.trim() || `${platform}-Live-Feed`,
        finalBal,
        currency,
        "Connected"
      );
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => {
        setSyncSuccess(false);
        setAccountName("");
        setAccountNumber("");
        setServer("");
        setInvestorPassword("");
        setTab("MANAGE");
      }, 1000);
    }, 800);
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
      subtitle="Connect real accounts from MT4/5, cTrader, TradingView, or Prop Firms for automated execution tracking"
      maxWidth="lg"
    >
      <div className="space-y-5 select-none">
        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-white/[0.04] rounded-xl border border-white/10 gap-1">
          <button
            type="button"
            onClick={() => setTab("CONNECT")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
              tab === "CONNECT"
                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            + Connect New Account
          </button>
          <button
            type="button"
            onClick={() => setTab("MANAGE")}
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

        {tab === "CONNECT" ? (
          <form onSubmit={handleConnect} className="space-y-4">
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
                  Account Friendly Name
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. FTMO 100K Funded / Real ECN"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Account Login / Number ID
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 5928104"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  required
                />
              </div>
            </div>

            {platform !== "TradingView" && platform !== "Manual Gateway" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                    Broker Server Name
                  </label>
                  <input
                    type="text"
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    placeholder="e.g. ICMarketsSC-Live or FTMO-Server"
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                    Investor (Read-Only) Password
                  </label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={investorPassword}
                      onChange={(e) => setInvestorPassword(e.target.value)}
                      placeholder="Read-only audit pass"
                      className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Balance & Currency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Account Balance ($)
                </label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="100000"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1 uppercase">
                  Base Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs font-mono cursor-pointer"
                >
                  <option value="USD" className="bg-zinc-950 text-white">USD ($)</option>
                  <option value="EUR" className="bg-zinc-950 text-white">EUR (€)</option>
                  <option value="GBP" className="bg-zinc-950 text-white">GBP (£)</option>
                  <option value="ZAR" className="bg-zinc-950 text-white">ZAR (R)</option>
                  <option value="AUD" className="bg-zinc-950 text-white">AUD ($)</option>
                  <option value="CAD" className="bg-zinc-950 text-white">CAD ($)</option>
                </select>
              </div>
            </div>

            {/* TradingView Webhook Section */}
            {platform === "TradingView" && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>SYNAPSES WEBHOOK ENDPOINT</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyWebhookTemplate}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
                  >
                    {copiedWebhook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedWebhook ? "Copied Payload!" : "Copy Alert JSON"}</span>
                  </button>
                </div>
                <div className="p-2 rounded-xl bg-black/60 border border-cyan-500/20 font-mono text-[11px] text-zinc-300 break-all select-all">
                  https://synapses-investments.vercel.app/api/webhook/trade
                </div>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  Paste this Webhook URL into your TradingView Alert notification tab. Synapses will automatically log executions with zero latency.
                </p>
              </div>
            )}

            {/* Security Guarantee Notice */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 text-[11px] text-zinc-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Zero-Knowledge Connection: Synapses only consumes read-only telemetry. We never store master passwords or require execution permissions.
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
                isLoading={isSyncing}
                icon={syncSuccess ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-black" />}
              >
                {syncSuccess ? "Connected Successfully!" : "Establish Account Feed"}
              </GlassButton>
            </div>
          </form>
        ) : (
          /* MANAGE CONNECTED ACCOUNTS TAB */
          <div className="space-y-3">
            {brokerAccounts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-mono">No Connected Accounts</h4>
                  <p className="text-xs text-zinc-400">
                    Connect your first MetaTrader, cTrader, or Prop Firm account to stream real trades.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTab("CONNECT")}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs font-mono hover:bg-zinc-200 transition-all"
                >
                  + Connect Account Now
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {brokerAccounts.map((acc) => {
                  const isSelected = selectedAccount === acc.name;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-white/[0.08] border-white shadow-[0_0_20px_rgba(255,255,255,0.08)]"
                          : "bg-white/[0.02] border-white/10"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{acc.name}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            LIVE CONNECTED
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          {acc.platform} • Login: <strong className="text-zinc-200">{acc.accountNumber}</strong> • Server: {acc.server}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                          Balance: ${(acc.balance || 100000).toLocaleString()} {acc.currency || "USD"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAccount(acc.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                            isSelected
                              ? "bg-emerald-400 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                              : "bg-white/10 hover:bg-white/20 text-white"
                          }`}
                        >
                          {isSelected ? "Active Filter" : "Select"}
                        </button>
                        <button
                          type="button"
                          onClick={() => disconnectBroker(acc.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Disconnect account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 flex justify-between items-center border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setTab("CONNECT")}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect Another Account</span>
                  </button>
                  <GlassButton variant="outline" size="sm" onClick={onClose}>
                    Done
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GlassModal>
  );
}
