import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AntigravityNavbar } from "@/components/antigravity/AntigravityNavbar";
import { BLOG_POSTS, BlogPost } from "@/lib/blogData";
import {
  ChevronRight,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  Share2,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostReaderPage({ params }: BlogPostPageProps) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen relative bg-black text-white selection:bg-white selection:text-black font-sans">
      <AntigravityNavbar />

      {/* Cybernetic Grid */}
      <div className="fixed inset-0 pointer-events-none bg-tech-grid opacity-30 z-0" />

      <main className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Synapses Terminal
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-zinc-300 transition-colors">
            Intelligence
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-400 truncate max-w-xs">{post.category}</span>
        </div>

        {/* Article Header */}
        <header className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
              {post.category}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.publishedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-sans">
            {post.subtitle}
          </p>

          {/* Author Badge */}
          <div className="pt-2 flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-xs font-mono">
                {post.author.avatarInitials}
              </div>
              <div>
                <span className="text-sm font-bold text-white block">{post.author.name}</span>
                <span className="text-xs font-mono text-zinc-400">{post.author.role}</span>
              </div>
            </div>

            <span className="text-xs font-mono text-zinc-500">
              Zero-G Publication Series
            </span>
          </div>
        </header>

        {/* Key Takeaways Summary Blockquote */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border-l-4 border-emerald-400 border-y border-r border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>EXECUTIVE TAKEAWAY</span>
          </div>
          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed italic font-sans">
            &ldquo;{post.keyTakeaway}&rdquo;
          </p>
        </div>

        {/* Article Body + Table of Contents Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* Main Article Body */}
          <article className="lg:col-span-3 space-y-6 text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
            <div
              className="space-y-6 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:tracking-tight [&_h2]:pt-6 [&_h2]:border-t [&_h2]:border-white/10 [&_h2]:uppercase [&_p]:text-zinc-300 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_li]:text-zinc-300 [&_strong]:text-white"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Sticky Table of Contents Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 p-5 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-4">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-bold">
              TABLE OF CONTENTS
            </span>
            <nav className="space-y-2 text-xs font-mono">
              {post.tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-zinc-400 hover:text-white transition-colors py-1 hover:translate-x-1 duration-150"
                >
                  {item.title}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono text-zinc-500 block mb-2">
                APPLY TO LIVE TRADING
              </span>
              <Link href="/dashboard/journal">
                <button className="w-full py-2 px-3 rounded-xl bg-white text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition-colors cursor-pointer">
                  <span>Log Execution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </aside>
        </div>

        {/* Footer Banner: Log Your Execution in SN Journal */}
        <section className="p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-white/15 text-center relative overflow-hidden space-y-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight uppercase">
            PRACTICE DISCIPLINED ORDER FLOW IN SYNAPSES JOURNAL
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
            Test and log setups from this article. Auto-track your R:R, session matrices, and mistake tags in local encrypted storage.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard/journal">
              <button className="px-7 py-3 rounded-2xl bg-white text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Open Terminal Journal</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </Link>
          </div>
        </section>

        {/* Related Articles */}
        <section className="space-y-6 pt-4">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
            RELATED INTELLIGENCE BRIEFINGS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`} className="group block">
                <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 hover:border-white/30 transition-all space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">
                    {rel.category} • {rel.readTime}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-zinc-200 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <span className="text-xs text-zinc-500 flex items-center gap-1 pt-1 font-mono">
                    <span>Read Analysis</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-emerald-400" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto">
        <span>SYNAPSES INTELLIGENCE ARCHIVE</span>
        <span className="mt-2 sm:mt-0">AUTHORITATIVE QUANTITATIVE RESEARCH</span>
      </footer>
    </div>
  );
}
