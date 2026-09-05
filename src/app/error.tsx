"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, Terminal } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Synapses Application Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans select-none">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#0d0f14] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
            DMA RUNTIME EXCEPTION RECOVERY
          </span>
          <h2 className="text-xl font-black font-mono text-white uppercase tracking-wide">
            TERMINAL STATE ANOMALY DETECTED
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            {error?.message || "An unexpected rendering event occurred. The quantum recovery protocol has isolated the component."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset & Reload</span>
          </button>

          <Link href="/" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-all">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
