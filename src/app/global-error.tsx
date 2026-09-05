"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Global Application Error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans select-none">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0d0f14] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              GLOBAL RUNTIME RECOVERY
            </span>
            <h2 className="text-xl font-black font-mono text-white uppercase tracking-wide">
              SYSTEM RECOVERY PROTOCOL ACTIVE
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {error?.message || "A runtime exception occurred. The recovery boundary has isolated the error."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs font-mono flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/";
                }
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
