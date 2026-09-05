import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TradeProvider } from "@/context/TradeContext";
import { GravityProvider } from "@/context/GravityContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://synapses-investments.vercel.app"),
  title: {
    default: "Synapses Investments | Institutional Trading Terminal & ICT/SMC Journal",
    template: "%s | Synapses Investments",
  },
  description:
    "Next-generation institutional trading terminal, ICT & Smart Money Concepts trade journaling, tick replay simulation, mathematical risk models, and zero-latency DMA telemetry.",
  keywords: [
    "Synapses Investments",
    "ICT trading",
    "Smart Money Concepts",
    "SMC trade journal",
    "trade journal",
    "institutional order flow",
    "NAS100 replay simulator",
    "prop firm risk calculator",
    "Fair Value Gap",
    "Order Block",
    "Liquidity Sweep",
    "Silver Bullet trading",
    "trading psychology tracker",
    "prop firm evaluation",
    "zero-G trading terminal",
  ],
  authors: [{ name: "Synapses Investments Quantitative Engineering", url: "https://synapses-investments.vercel.app" }],
  creator: "Synapses Investments",
  publisher: "Synapses Investments",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://synapses-investments.vercel.app",
  },
  openGraph: {
    title: "Synapses Investments | Institutional Trading Terminal & ICT/SMC Journal",
    description:
      "Institutional-grade execution analytics, ICT/SMC trade journaling, risk guardrails, and DMA telemetry engineered for serious prop operators.",
    url: "https://synapses-investments.vercel.app",
    siteName: "Synapses Investments",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/synapses-logo-v2.png",
        width: 1828,
        height: 506,
        alt: "Synapses Investments Institutional Terminal Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Synapses Investments | Institutional Trading Terminal",
    description:
      "Institutional trading terminal, ICT & SMC trade journaling, dynamic position sizing, and DMA execution telemetry.",
    images: ["/synapses-logo-v2.png"],
    creator: "@SynapsesInvest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "US-NY",
    "geo.placename": "New York",
    "geo.position": "40.7128;-74.0060",
    "ICBM": "40.7128, -74.0060",
    "target-audience": "Proprietary Traders, Institutional Operators, Quantitative Analysts",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://synapses-investments.vercel.app/#organization",
      name: "Synapses Investments",
      url: "https://synapses-investments.vercel.app",
      logo: "https://synapses-investments.vercel.app/synapses-logo-v2.png",
      description:
        "Synapses Investments builds high-frequency execution tools, mathematical risk models, and institutional telemetry for systematic operators.",
      sameAs: [
        "https://github.com/soulassassin/synapses-investments",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "New York",
        addressRegion: "NY",
        addressCountry: "US",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://synapses-investments.vercel.app/#website",
      url: "https://synapses-investments.vercel.app",
      name: "Synapses Investments",
      publisher: {
        "@id": "https://synapses-investments.vercel.app/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://synapses-investments.vercel.app/dashboard?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://synapses-investments.vercel.app/#software",
      name: "Synapses Journal",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: "https://synapses-investments.vercel.app/dashboard/journal",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "The Algorithmic Execution Black Box: mechanical feedback terminal engineered to audit ICT/SMC confluences, track behavioral psychology, and quantify statistical edge.",
    },
  ],
};

import { DMAProvider } from "@/context/DMAContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
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

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Global Context Providers */}
        <AuthProvider>
          <GravityProvider>
            <TradeProvider>
              <DMAProvider>
                <div className="relative z-10">{children}</div>
              </DMAProvider>
            </TradeProvider>
          </GravityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
