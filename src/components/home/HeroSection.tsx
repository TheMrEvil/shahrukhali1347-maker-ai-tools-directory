'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Star, TrendingUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import SearchBar from '@/components/search/SearchBar';
import { SITE_CONFIG } from '@/config/site';

const chipQueries = ['ChatGPT', 'Midjourney', 'GitHub Copilot', 'Claude', 'Cursor'];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--px', x.toFixed(3));
      el.style.setProperty('--py', y.toFixed(3));
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-b border-[var(--border)] bg-[var(--bg)]"
      style={{ '--px': '0', '--py': '0' } as React.CSSProperties}
    >
      {/* Layered background */}
      <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="blob anim-drift pointer-events-none"
        style={{
          left: '-8%',
          top: '-25%',
          height: 520,
          width: 520,
          background: 'var(--primary-500)',
          transform: 'translate(calc(var(--px, 0) * 24px), calc(var(--py, 0) * 24px))',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)',
        }}
        aria-hidden="true"
      />
      <div
        className="blob anim-drift pointer-events-none"
        style={{
          right: '-8%',
          top: '0%',
          height: 420,
          width: 420,
          background: 'var(--accent)',
          animationDelay: '5s',
          transform: 'translate(calc(var(--px, 0) * -28px), calc(var(--py, 0) * 28px))',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1)',
        }}
        aria-hidden="true"
      />

      {/* Foreground content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 pt-20 pb-24 text-center md:pt-28 md:pb-32">
        <div className="anim-rise inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--fg-soft)] shadow-soft">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {SITE_CONFIG.stats.toolsCount.toLocaleString()}+ AI tools · curated by humans
          <Sparkles className="h-3 w-3 text-[var(--brand)]" />
        </div>

        <h1 className="anim-rise delay-1 mt-7 text-balance text-[2.5rem] font-semibold tracking-tight text-[var(--fg)] sm:text-5xl md:text-7xl">
          The simplest way to discover{' '}
          <span className="relative inline-block whitespace-nowrap">
            <span
              className="relative z-10 bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 40%, var(--accent) 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 6s ease-in-out infinite',
              }}
            >
              AI tools
            </span>
          </span>
        </h1>
        <p className="anim-rise delay-2 mx-auto mt-5 max-w-2xl text-pretty text-base text-[var(--fg-soft)] md:text-lg">
          Browse, compare and choose from {SITE_CONFIG.stats.toolsCount.toLocaleString()}+ vetted
          AI tools across {SITE_CONFIG.stats.categoriesCount}+ categories. Honest reviews, clear
          pricing, zero pay-to-play.
        </p>

        <div className="anim-rise delay-3 mx-auto mt-9 max-w-xl">
          <SearchBar />
        </div>

        <div className="anim-rise delay-4 mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--fg-soft)]">
          <span className="text-[var(--muted)]">Try:</span>
          {chipQueries.map((c) => (
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
          <Stat
            icon={<TrendingUp className="h-3.5 w-3.5 text-[var(--brand)]" />}
            label="Tools listed"
            value={`${SITE_CONFIG.stats.toolsCount.toLocaleString()}+`}
          />
          <Sep />
          <Stat label="Categories" value={`${SITE_CONFIG.stats.categoriesCount}+`} />
          <Sep />
          <Stat label="Reviews" value={`${(SITE_CONFIG.stats.reviewsCount / 1000).toFixed(0)}k+`} />
          <Sep />
          <Stat
            icon={<Star className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />}
            label="Avg. rating"
            value="4.6"
          />
        </div>

        <div className="anim-rise delay-6 mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/tools"
            className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-[var(--brand)]/20 transition hover:bg-[var(--brand-strong)]"
          >
            Explore the directory
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            Compare matchups
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span className="font-semibold text-[var(--fg)]">{value}</span>
      <span className="text-[var(--muted)]">{label}</span>
    </span>
  );
}

function Sep() {
  return <span className="hidden h-3 w-px bg-[var(--border)] sm:inline-block" aria-hidden="true" />;
}
