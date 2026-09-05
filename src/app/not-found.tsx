import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Terminal } from "lucide-react";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans flex flex-col justify-between">
      <AntigravityNavbar />

      <main className="flex-1 flex items-center justify-center p-6 pt-32">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0d0f14] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 text-white flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              HTTP 404 • ROUTE UNALLOCATED
            </span>
            <h1 className="text-2xl font-black font-mono text-white uppercase tracking-wide">
              OUTSIDE EXECUTION BOUNDS
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The requested pathway does not exist in the active Synapses routing matrix.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <Link href="/">
              <button className="px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs font-mono flex items-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)]">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Quantum Canvas</span>
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs font-mono text-zinc-500">
        SYNAPSES QUANTUM NETWORK • PROTOCOL v3.4 PRO
      </footer>
    </div>
  );
}
