'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Bookmark, CheckCircle, ExternalLink, ShieldCheck, Sparkles, Star, TrendingUp } from 'lucide-react';
import { AITool } from '@/types';
import { getPricingLabel } from '@/lib/utils';
import { getAccent, getInitials } from '@/lib/accent';
import Spotlight from '@/components/Spotlight';

function formatReviewed(iso: string): { label: string; fresh: boolean } | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  // Only show within 60 days; "fresh" means within 14 days for stronger badge.
  if (days > 60) return null;
  const label =
    days <= 0
      ? 'today'
      : days === 1
      ? '1 day ago'
      : days < 30
      ? `${days} days ago`
      : days < 60
      ? `${Math.round(days / 7)} weeks ago`
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return { label, fresh: days <= 14 };
}

interface ToolCardProps {
  tool: AITool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const pricingLabel = getPricingLabel(tool.pricing);
  const [imgError, setImgError] = useState(false);

  const accent = getAccent(tool.name);
  const initials = getInitials(tool.name);
  const reviewed = formatReviewed(tool.dateUpdated);

  const pricingPill =
    pricingLabel === 'Free'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
      : pricingLabel === 'Freemium'
      ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300'
      : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300';

  const accentStyle = {
    '--accent-from': accent.from,
    '--accent-to': accent.to,
  } as React.CSSProperties;

  return (
    <Spotlight
      className="group lift sheen relative isolate flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
      style={accentStyle}
    >
      <span className="accent-bar" aria-hidden="true" />

      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={tool.name}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-xl border transition-transform duration-300 group-hover:scale-105"
            style={{ background: accent.tile, borderColor: accent.ring }}
          >
            {!imgError ? (
              <img
                src={tool.logo}
                alt={`${tool.name} logo`}
                className="h-7 w-7 object-contain"
                onError={() => setImgError(true)}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="text-sm font-bold" style={{ color: accent.text }}>
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
              {tool.name}
            </h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                <span className="font-semibold text-[var(--fg)]">{tool.rating.average.toFixed(1)}</span>
              </span>
              <span className="text-[var(--muted)]">·</span>
              <span className="text-[var(--muted)]">{tool.rating.count.toLocaleString()}</span>
              {reviewed && (
                <>
                  <span className="text-[var(--muted)]">·</span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      reviewed.fresh
                        ? 'font-medium text-emerald-600 dark:text-emerald-400'
                        : 'text-[var(--muted)]'
                    }`}
                    title={`Listing reviewed by editors on ${tool.dateUpdated}`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Reviewed {reviewed.label}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {tool.trending && (
            <span className="halo inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <TrendingUp className="h-3 w-3" /> Hot
            </span>
          )}
          {tool.featured && !tool.trending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-strong)]">
              <Sparkles className="h-3 w-3" /> Pick
            </span>
          )}
        </div>
      </div>

      <p className="relative z-10 mt-4 line-clamp-2 text-sm text-[var(--fg-soft)]">
        {tool.tagline}
      </p>

      <div className="relative z-10 mt-4 flex flex-wrap gap-1.5">
        {tool.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--fg-soft)] transition group-hover:border-[var(--border)] group-hover:bg-[var(--bg)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-5 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-4">
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
              Verified
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label="Bookmark"
            className="relative z-20 grid h-7 w-7 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
          >
            <Bookmark className="h-3 w-3" />
          </button>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="relative z-20 grid h-7 w-7 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
            aria-label="Visit website"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-full text-[var(--muted)] transition group-hover:bg-[var(--brand)] group-hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4 nudge" />
          </span>
        </div>
      </div>
    </Spotlight>
  );
}
