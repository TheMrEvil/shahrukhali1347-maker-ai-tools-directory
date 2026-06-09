'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowUpRight,
  Bookmark,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import { AITool } from '@/types';
import { getPricingLabel } from '@/lib/utils';
import { getAccent, getInitials } from '@/lib/accent';
import Spotlight from '@/components/Spotlight';

interface ToolCardProps {
  tool: AITool;
}

function formatReviews(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

function formatReviewed(iso: string): { label: string; fresh: boolean } | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  const label =
    days <= 0
      ? 'today'
      : days === 1
      ? '1d ago'
      : days < 60
      ? `${days}d ago`
      : days < 365
      ? `${Math.round(days / 30)}mo ago`
      : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return { label, fresh: days <= 14 };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const pricingLabel = getPricingLabel(tool.pricing);
  const [imgError, setImgError] = useState(false);

  const accent = getAccent(tool.name);
  const initials = getInitials(tool.name);
  const reviewed = formatReviewed(tool.dateUpdated);

  const pricingPill =
    pricingLabel === 'Free'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300'
      : pricingLabel === 'Freemium'
      ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300'
      : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300';

  const accentStyle = {
    '--accent-from': accent.from,
    '--accent-to': accent.to,
  } as React.CSSProperties;

  return (
    <Spotlight
      className="group lift sheen relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
      style={accentStyle}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={tool.name}
      />

      {/* Tinted header strip — pointer-events-none so clicks fall through to the
          card-wide Link beneath. Any inner element that needs to be interactive
          opts back in with pointer-events-auto + relative z-20. */}
      <div
        className="pointer-events-none relative z-10 flex items-end p-4 pb-3"
        style={{
          background: `linear-gradient(135deg, ${accent.tile}, transparent 70%)`,
        }}
      >
        <span className="dot-bg absolute inset-0 opacity-30" aria-hidden="true" />

        <div className="relative flex flex-1 items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="grid h-14 w-14 place-items-center overflow-hidden rounded-xl border bg-[var(--surface)] shadow-soft transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
              style={{ borderColor: accent.ring }}
            >
              {!imgError ? (
                <img
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  className="h-8 w-8 object-contain"
                  onError={() => setImgError(true)}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="text-base font-bold" style={{ color: accent.text }}>
                  {initials}
                </span>
              )}
            </div>
            {(tool.trending || tool.featured) && (
              <span
                title={tool.trending ? 'Trending' : 'Editor’s pick'}
                className={`absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-white shadow-soft ring-2 ring-[var(--surface)] ${
                  tool.trending
                    ? 'bg-gradient-to-br from-rose-500 to-orange-500'
                    : 'bg-[var(--brand)]'
                }`}
                aria-label={tool.trending ? 'Trending' : "Editor's pick"}
              >
                {tool.trending ? (
                  <TrendingUp className="h-2.5 w-2.5" />
                ) : (
                  <Sparkles className="h-2.5 w-2.5" />
                )}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
              {tool.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1 truncate text-xs text-[var(--fg-soft)]">
              <Star className="h-3 w-3 flex-shrink-0 fill-[var(--accent)] text-[var(--accent)]" />
              <span className="flex-shrink-0 font-semibold text-[var(--fg)]">
                {tool.rating.average.toFixed(1)}
              </span>
              <span className="flex-shrink-0 text-[var(--muted)]">·</span>
              <span className="flex-shrink-0 text-[var(--muted)]">
                {formatReviews(tool.rating.count)}
              </span>
              {reviewed && (
                <>
                  <span className="flex-shrink-0 text-[var(--muted)]">·</span>
                  <span
                    className={`inline-flex flex-shrink-0 items-center gap-0.5 ${
                      reviewed.fresh
                        ? 'font-medium text-emerald-600 dark:text-emerald-400'
                        : 'text-[var(--muted)]'
                    }`}
                    title={`Listing reviewed by editors on ${tool.dateUpdated}`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    {reviewed.label}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body — pointer-events-none on the wrapper so the entire card surface
          routes to the Link; bookmark + visit-site buttons opt back in below. */}
      <div className="pointer-events-none relative z-10 flex flex-1 flex-col px-4 pb-4 pt-2">
        <p className="line-clamp-2 text-sm text-[var(--fg-soft)]">{tool.tagline}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--fg-soft)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${pricingPill}`}
            >
              {pricingLabel}
            </span>
            {tool.verified && (
              <span
                title="Verified"
                className="inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--fg-soft)]"
              >
                <CheckCircle className="h-2.5 w-2.5 text-emerald-500" />
                <span className="hidden lg:inline">Verified</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Icon buttons (interactive — opt back in to pointer events) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              aria-label="Bookmark"
              className="pointer-events-auto relative z-20 grid h-7 w-7 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
            >
              <Bookmark className="h-3 w-3" />
            </button>
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto relative z-20 inline-flex h-7 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--fg-soft)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
              aria-label={`Visit ${tool.name} website`}
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Visit</span>
            </a>
            {/* "View" affordance — visually communicates the card is clickable. */}
            <span
              aria-hidden="true"
              className="inline-flex h-7 items-center gap-1 rounded-full bg-[var(--brand)] px-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition group-hover:bg-[var(--brand-strong)]"
            >
              View
              <ArrowUpRight className="h-3 w-3 nudge" />
            </span>
          </div>
        </div>
      </div>
    </Spotlight>
  );
}
