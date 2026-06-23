'use client';

import Link from 'next/link';
import { AITool } from '@/types';
import { getPricingLabel } from '@/lib/utils';

function compact(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${Math.round(n / 1000)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

interface ToolRowProps {
  tool: AITool;
  num: number;
  active?: boolean;
  onHover?: () => void;
}

/**
 * One entry in the index. Whole row is a link; hover/active inverts ink↔paper.
 * Logos print grayscale and take color on hover — like spot color on newsprint.
 */
export default function ToolRow({ tool, num, active = false, onHover }: ToolRowProps) {
  const pricing = getPricingLabel(tool.pricing);
  return (
    <Link
      href={`/tools/${tool.slug}`}
      data-active={active || undefined}
      onMouseEnter={onHover}
      onFocus={onHover}
      className="row-invert rule-b grid grid-cols-[2.75rem_2.25rem_1fr_auto] items-center gap-x-3 px-2 py-3 md:grid-cols-[3.25rem_2.25rem_1fr_6rem_5rem_6.5rem_2rem] md:gap-x-4"
    >
      <span className="row-num mono text-[11px] font-semibold text-[var(--acc-text)]">
        {String(num).padStart(3, '0')}
      </span>

      <span className="grid h-8 w-8 place-items-center overflow-hidden border border-[var(--rule)] bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tool.logo} alt="" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
      </span>

      <span className="min-w-0">
        <span className="serif block truncate text-lg leading-tight">{tool.name}</span>
        <span className="row-dim mono block truncate text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          {tool.category.replace(/-/g, ' ')}
        </span>
      </span>

      <span className="mono hidden text-sm md:block">★ {tool.rating.average.toFixed(1)}</span>
      <span className="row-dim mono hidden text-sm text-[var(--ink-soft)] md:block">
        {compact(tool.rating.count)}
      </span>
      <span className="mono hidden text-[10px] uppercase tracking-[0.12em] md:block">
        {pricing}
      </span>

      <span className="mono justify-self-end text-sm" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}
