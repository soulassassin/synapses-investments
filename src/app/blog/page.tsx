"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import { BLOG_POSTS, BlogCategory } from "@/lib/blogData";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Tag,
} from "lucide-react";

const CATEGORIES: BlogCategory[] = [
  "All",
  "ICT / SMC Mechanics",
  "Risk Management",
  "Trading Psychology",
  "Futures & Prop Protocols",
];

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (activeCategory === "All") return true;
    return post.category === activeCategory;
  });

  return (
    <div className="min-h-screen relative bg-black text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Background Grids */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-30 z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        {/* Header Banner */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-zinc-500 mb-2">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Synapses Terminal
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Terminal Intelligence</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
            <BookOpen className="w-3.5 h-3.5 text-white" />
            <span>KNOWLEDGE BASE & ORDER FLOW EDUCATION</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-[1.1]">
            TERMINAL INTELLIGENCE
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            High-signal research publications covering algorithmic liquidity delivery, Inner Circle Trader (ICT) concepts, risk-of-ruin mathematics, and neurochemical trade psychology.
          </p>
        </section>

        {/* Featured Article Banner */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="block group">
            <div className="p-6 sm:p-10 rounded-3xl bg-zinc-950/90 border border-white/15 hover:border-white/35 transition-all shadow-[0_20px_60px_rgba(0,0,0,0.95)] relative overflow-hidden group-hover:scale-[1.005]">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none font-mono text-9xl font-black text-white select-none">
                01
              </div>

              <div className="relative z-10 space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                    FEATURED PUBLICATION
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/10 text-white font-semibold">
                    {featuredPost.category}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight group-hover:text-zinc-200 transition-colors uppercase">
                  {featuredPost.title}
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
                  {featuredPost.subtitle}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-[10px]">
                      {featuredPost.author.avatarInitials}
                    </div>
                    <div>
                      <span className="text-white block font-semibold">{featuredPost.author.name}</span>
                      <span className="text-[10px] text-zinc-500">{featuredPost.author.role}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-4 border-b border-white/10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-white/30 transition-all h-full flex flex-col justify-between space-y-4 group-hover:scale-[1.01] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-emerald-400 font-semibold text-[11px]">
                      {post.category}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-3 font-sans">
                    {post.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                      {post.author.avatarInitials}
                    </div>
                    <span className="text-zinc-300">{post.author.name}</span>
                  </div>

                  <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SYNAPSES KNOWLEDGE ENGINE • ALL ARTICLES OPEN SOURCE
        </span>
        <span className="mt-2 sm:mt-0">UPDATED WEEKLY WITH INSTITUTIONAL CASE STUDIES</span>
      </footer>
    </div>
  );
}
