'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { aiTools } from '@/data/tools';
import ToolRow from '@/components/index/ToolRow';
import SectionHead from './SectionHead';

type SortKey = 'rating' | 'name' | 'reviews';

const SHOWN = 12;

/**
 * THE INDEX — the directory itself, on the front page.
 * Type to filter all entries; click a column to re-sort; the readout line
 * above the table echoes whichever entry the cursor is over.
 */
export default function HomeIndex() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('rating');
  const [hovered, setHovered] = useState<number | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = term
      ? aiTools.filter((t) =>
          `${t.name} ${t.tagline} ${t.category} ${t.tags.join(' ')}`.toLowerCase().includes(term),
        )
      : [...aiTools];
    switch (sort) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'reviews':
        list.sort((a, b) => b.rating.count - a.rating.count);
        break;
      default:
        list.sort((a, b) => b.rating.average - a.rating.average || b.rating.count - a.rating.count);
    }
    return list;
  }, [q, sort]);

  const visible = results.slice(0, SHOWN);
  const readout =
    hovered !== null && visible[hovered]
      ? `▸ ${visible[hovered].tagline}`
      : `Showing ${visible.length} of ${results.length} ${q ? 'matches' : 'entries'} — open the full index for filters, keyboard navigation and the preview dock.`;

  return (
    <section className="shell pt-20" id="index">
      <SectionHead
        no="02"
        kicker="Live directory"
        title="The Index"
        linkHref="/tools"
        linkLabel={`Open full index (${aiTools.length})`}
      />

      {/* Controls */}
      <div className="reveal mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex w-full max-w-sm items-center border-b-2 border-[var(--rule-strong)] focus-within:border-[var(--acc)]">
          <span className="mono pr-2 text-[var(--acc-text)]" aria-hidden="true">⌕</span>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setHovered(null);
            }}
            placeholder="Filter entries…"
            className="serif w-full bg-transparent py-2 text-lg italic text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            aria-label="Filter the index"
          />
          <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--acc-text)]">
            {results.length}
          </span>
        </div>

        <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          <span>Sort</span>
          <div className="flex">
            {(
              [
                ['rating', 'Rating'],
                ['reviews', 'Reviews'],
                ['name', 'A–Z'],
              ] as [SortKey, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`-ml-px border px-2.5 py-1.5 transition-colors first:ml-0 ${
                  sort === key
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                    : 'border-[var(--rule)] hover:border-[var(--ink-faint)]'
                }`}
                aria-pressed={sort === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Readout line — echoes the hovered entry */}
      <p
        className="mono mt-5 min-h-5 truncate border-l-2 border-[var(--acc)] pl-3 text-[11px] uppercase tracking-[0.1em] text-[var(--ink-faint)]"
        aria-live="polite"
      >
        {readout}
      </p>

      {/* Column heads */}
      <div className="mono rule-b rule-strong-t mt-3 hidden grid-cols-[3.25rem_2.25rem_1fr_6rem_5rem_6.5rem_2rem] gap-x-4 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)] md:grid">
        <span>№</span>
        <span />
        <span>Entry</span>
        <span>Rating</span>
        <span>Reviews</span>
        <span>Pricing</span>
        <span />
      </div>

      {/* Rows */}
      <div onMouseLeave={() => setHovered(null)}>
        {visible.map((t, i) => (
          <ToolRow key={t.id} tool={t} num={i + 1} onHover={() => setHovered(i)} />
        ))}
        {visible.length === 0 && (
          <p className="serif rule-b px-2 py-10 text-center text-lg italic text-[var(--ink-faint)]">
            Nothing under “{q}” — try the full index search.
          </p>
        )}
      </div>

      {results.length > SHOWN && (
        <div className="flex justify-center py-6">
          <Link
            href={q ? `/tools?q=${encodeURIComponent(q)}` : '/tools'}
            className="btn-line"
          >
            Continue to entry {String(SHOWN + 1).padStart(3, '0')} →
          </Link>
        </div>
      )}
    </section>
  );
}
