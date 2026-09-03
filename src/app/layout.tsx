import type { Metadata } from "next";
import "./globals.css";
import { TradeProvider } from "@/context/TradeContext";
import { GravityProvider } from "@/context/GravityContext";

export const metadata: Metadata = {
  title: "Synapses Investments • Institutional Trading Terminal & Quantum Canvas",
  description: "Next-generation institutional trading terminal, zero-G physics engine, and Synapses Journal analytics terminal by Synapses Investments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-brand-100 min-h-screen relative overflow-x-hidden antialiased selection:bg-white selection:text-black font-sans">
        {/* Fixed Ambient Monochrome Lighting Background Layers */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top-Center White Halo Glow */}
          <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full bg-white/[0.04] blur-[160px]" />
          
          {/* Bottom-Right Subtle Glow */}
          <div className="absolute -bottom-[15%] -right-[10%] w-[600px] h-[600px] rounded-full bg-white/[0.025] blur-[150px]" />

          {/* Isometric Dot Matrix Grid */}
          <div className="absolute inset-0 bg-dot-matrix opacity-30" />
          
          {/* Subtle Technical 1px Grid */}
          <div className="absolute inset-0 bg-tech-grid opacity-20" />
        </div>

        {/* Global Context Providers */}
        <GravityProvider>
          <TradeProvider>
            <div className="relative z-10">{children}</div>
          </TradeProvider>
        </GravityProvider>
      </body>
    </html>
  );
}
