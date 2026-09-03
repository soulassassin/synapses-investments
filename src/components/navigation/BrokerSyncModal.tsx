"use client";

import React, { useState } from "react";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { Zap, CheckCircle2, ShieldCheck, RefreshCw, Key } from "lucide-react";

interface BrokerSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrokerSyncModal({ isOpen, onClose }: BrokerSyncModalProps) {
  const [selectedBroker, setSelectedBroker] = useState<string>("MetaTrader 5 (MT5)");
  const [accountNumber, setAccountNumber] = useState("89210492");
  const [server, setServer] = useState("ICMarketsSC-Live");
  const [investorPassword, setInvestorPassword] = useState("••••••••");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const brokers = [
    { name: "MetaTrader 5 (MT5)", type: "Direct EA / Bridge" },
    { name: "MetaTrader 4 (MT4)", type: "Direct EA / Bridge" },
    { name: "cTrader", type: "Open API v2" },
    { name: "TradingView", type: "Webhook WebSockets" },
    { name: "Interactive Brokers", type: "TWS / Gateway API" },
    { name: "NinjaTrader 8", type: "NT8 Direct Feed" },
  ];

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => {
        setSyncSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Broker & Platform Live Sync Gateway"
      subtitle="Connect your MT4/5, cTrader, or Broker API for real-time automatic trade ingestion"
      maxWidth="lg"
    >
      <form onSubmit={handleSync} className="space-y-5 select-none">
        {/* Broker Selection */}
        <div>
          <label className="text-xs font-mono text-zinc-400 block mb-2 uppercase">
            Select Trading Platform / Broker Feed
          </label>
          <div className="grid grid-cols-2 gap-2">
            {brokers.map((b) => (
              <button
                key={b.name}
                type="button"
                onClick={() => setSelectedBroker(b.name)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  selectedBroker === b.name
                    ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] font-bold"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs">{b.name}</span>
                  <Zap
                    className={`w-3.5 h-3.5 ${
                      selectedBroker === b.name ? "text-white" : "text-zinc-500"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 font-mono block">{b.type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1 uppercase">
              Trading Account Number / Login ID
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
              required
            />
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1 uppercase">
              Broker Server Name
            </label>
            <input
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono text-zinc-400 uppercase">
                Investor (Read-Only) Password
              </label>
              <span className="text-[10px] text-zinc-400">Read-Only Safe</span>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={investorPassword}
                onChange={(e) => setInvestorPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 text-xs text-zinc-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <span>
            Synapses Investments uses zero-knowledge read-only API connectors. We never request or store trading execution rights or master passwords.
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
            icon={syncSuccess ? <CheckCircle2 className="w-4 h-4 text-black" /> : <RefreshCw className="w-4 h-4 text-black" />}
          >
            {syncSuccess ? "Connected Successfully!" : "Establish Live Sync"}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
}
