'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AITool } from '@/types';
import { getPricingLabel } from '@/lib/utils';

interface ToolCardProps {
  tool: AITool;
}

function compact(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${Math.round(n / 1000)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

function reviewedAgo(iso: string): string | null {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return 'today';
  if (days < 60) return `${days}d ago`;
  if (days < 365) return `${Math.round(days / 30)}mo ago`;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Specimen card — used in grids (category pages, related tools).
 * Drawn with rules, not shadows. Whole card links to the entry;
 * VISIT opts out and goes to the vendor.
 */
export default function ToolCard({ tool }: ToolCardProps) {
  const pricing = getPricingLabel(tool.pricing);
  const [imgError, setImgError] = useState(false);
  const reviewed = reviewedAgo(tool.dateUpdated);

  return (
    <div className="plate group relative flex h-full flex-col">
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`${tool.name} — read the entry`}
      />

      {/* Head */}
      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3 p-5 pb-0">
        <span className="grid h-11 w-11 flex-shrink-0 place-items-center border border-[var(--rule)] bg-white">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tool.logo}
              alt=""
              className="h-6 w-6 object-contain grayscale transition group-hover:grayscale-0"
              onError={() => setImgError(true)}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="mono text-xs font-bold text-[var(--ink-faint)]">
              {tool.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>
        <div className="mono flex flex-col items-end gap-1 text-[9px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          {tool.trending && <span className="text-[var(--acc-text)]">▲ Trending</span>}
          {tool.verified && <span>✓ Verified</span>}
          {reviewed && <span>Rev. {reviewed}</span>}
        </div>
      </div>

      {/* Name + tagline */}
      <div className="pointer-events-none relative z-10 p-5 pb-0">
        <h3 className="serif text-2xl font-medium leading-tight text-[var(--ink)]">
          <span className="u-link">{tool.name}</span>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          {tool.tagline}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          {tool.tags.slice(0, 3).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </p>
      </div>

      {/* Data line + actions */}
      <div className="pointer-events-none relative z-10 mt-auto p-5">
        <div className="mono rule-t flex items-baseline justify-between pt-3 text-[11px] uppercase tracking-[0.1em]">
          <span className="text-[var(--ink)]">
            ★ {tool.rating.average.toFixed(1)}
            <span className="text-[var(--ink-faint)]"> · {compact(tool.rating.count)}</span>
          </span>
          <span className={pricing === 'Free' ? 'text-[var(--acc-text)]' : 'text-[var(--ink-soft)]'}>
            {pricing}
          </span>
        </div>
        <div className="mono mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em]">
          <span className="text-[var(--acc-text)]">Read entry ↗</span>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto relative z-20 border border-[var(--rule)] px-2.5 py-1 text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
            aria-label={`Visit ${tool.name} website`}
          >
            Visit ↗
          </a>
        </div>
      </div>
    </div>
  );
}
