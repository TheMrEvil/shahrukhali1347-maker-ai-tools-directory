'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { SITE_CONFIG } from '@/config/site';

const chips = ['ChatGPT', 'Midjourney', 'GitHub Copilot', 'Claude', 'Notion AI'];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div
        className="blob anim-drift"
        style={{ left: '-8%', top: '-30%', height: 420, width: 420, background: 'var(--primary-500)' }}
      />
      <div
        className="blob anim-drift"
        style={{ right: '-8%', top: '-10%', height: 360, width: 360, background: 'var(--primary-300)', animationDelay: '4s' }}
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        <div className="anim-rise inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--fg-soft)] shadow-soft">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {SITE_CONFIG.stats.toolsCount.toLocaleString()}+ AI tools · curated by humans
          <Sparkles className="h-3 w-3 text-[var(--brand)]" />
        </div>

        <h1 className="anim-rise delay-1 mt-7 text-balance text-4xl font-semibold tracking-tight text-[var(--fg)] md:text-6xl">
          The simplest way to discover{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span className="relative z-10 text-[var(--brand)]">AI tools</span>
            <span className="absolute inset-x-0 bottom-1.5 z-0 h-3 rounded bg-[var(--brand-soft)]" />
          </span>
        </h1>
        <p className="anim-rise delay-2 mx-auto mt-5 max-w-2xl text-pretty text-base text-[var(--fg-soft)] md:text-lg">
          Browse, compare and choose from {SITE_CONFIG.stats.toolsCount.toLocaleString()}+ vetted AI tools
          across {SITE_CONFIG.stats.categoriesCount}+ categories. Honest reviews, clear pricing, zero pay-to-play.
        </p>

        <div className="anim-rise delay-3 mx-auto mt-9 max-w-xl">
          <SearchBar />
        </div>

        <div className="anim-rise delay-4 mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--fg-soft)]">
          <span className="text-[var(--muted)]">Try:</span>
          {chips.map((c) => (
            <Link
              key={c}
              href={`/tools?q=${encodeURIComponent(c)}`}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              {c}
            </Link>
          ))}
        </div>

        <div className="anim-rise delay-5 mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[var(--fg-soft)]">
          <Stat label="Tools listed" value={`${SITE_CONFIG.stats.toolsCount.toLocaleString()}+`} />
          <Sep />
          <Stat label="Categories" value={`${SITE_CONFIG.stats.categoriesCount}+`} />
          <Sep />
          <Stat label="Reviews" value={`${(SITE_CONFIG.stats.reviewsCount / 1000).toFixed(0)}k+`} />
          <Sep />
          <Stat label="Avg. rating" value="4.6" icon />
        </div>

        <div className="anim-rise delay-6 mt-10">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--brand-strong)]"
          >
            Explore the directory <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon && <Star className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />}
      <span className="font-semibold text-[var(--fg)]">{value}</span>
      <span className="text-[var(--muted)]">{label}</span>
    </span>
  );
}

function Sep() {
  return <span className="hidden h-3 w-px bg-[var(--border)] sm:inline-block" aria-hidden="true" />;
}
