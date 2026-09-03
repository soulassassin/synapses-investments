"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BlogPost, BlogCategory } from "@/lib/blogData";
import { Clock, ArrowRight } from "lucide-react";

interface BlogFeedProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

export function BlogFeed({ posts, categories }: BlogFeedProps) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("All");

  const filteredPosts = posts.filter((post) => {
    if (activeCategory === "All") return true;
    return post.category === activeCategory;
  });

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 pt-4 border-b border-white/10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
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
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(0,0,0,0.8)] transition-all duration-300 h-full flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-emerald-400 font-semibold text-[11px]">
                    {post.category}
                  </span>
                  <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide [word-spacing:0.1em] group-hover:text-zinc-200 transition-colors">
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
    </div>
  );
}
