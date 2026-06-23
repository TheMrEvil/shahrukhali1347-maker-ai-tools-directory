'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AITool, Category } from '@/types';
import { searchTools } from '@/lib/search';
import { applyFilters } from '@/lib/filters';
import { getPricingLabel } from '@/lib/utils';
import ToolRow from '@/components/index/ToolRow';

interface ToolsPageClientProps {
  tools: AITool[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  initialPricing?: string;
  initialSort?: string;
}

const SORTS = [
  ['popular', 'Popular'],
  ['rating', 'Rating'],
  ['newest', 'Newest'],
  ['name', 'A–Z'],
] as const;

const PRICINGS = [
  ['', 'All'],
  ['free', 'Free'],
  ['freemium', 'Freemium'],
  ['paid', 'Paid'],
] as const;

export default function ToolsPageClient({
  tools,
  categories,
  initialQuery = '',
  initialCategory = '',
  initialPricing = '',
  initialSort = 'popular',
}: ToolsPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = useState(initialPricing);
  const [sortBy, setSortBy] = useState(initialSort);
  const [activeIdx, setActiveIdx] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredTools = useMemo(() => {
    let result = query ? searchTools(query) : tools;
    result = applyFilters(result, {
      categories: selectedCategory ? [selectedCategory] : undefined,
      pricing: selectedPricing ? [selectedPricing as 'free' | 'freemium' | 'paid'] : undefined,
      sortBy: sortBy as 'popular' | 'newest' | 'rating' | 'name',
    });
    return result;
  }, [tools, query, selectedCategory, selectedPricing, sortBy]);

  // Clamp the cursor when the result set shrinks.
  useEffect(() => {
    setActiveIdx((i) => Math.min(i, Math.max(0, filteredTools.length - 1)));
  }, [filteredTools.length]);

  // Keyboard: ↑/↓ or j/k to move, Enter to open the entry, V to visit the site.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const max = filteredTools.length - 1;
      if (max < 0) return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setActiveIdx((i) => {
          const next = Math.min(i + 1, max);
          rowRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setActiveIdx((i) => {
          const next = Math.max(i - 1, 0);
          rowRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
      } else if (e.key === 'Enter') {
        const tool = filteredTools[activeIdx];
        if (tool) router.push(`/tools/${tool.slug}`);
      } else if (e.key === 'v' || e.key === 'V') {
        const tool = filteredTools[activeIdx];
        if (tool) window.open(tool.website, '_blank', 'noopener,noreferrer');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filteredTools, activeIdx, router]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedPricing('');
    setSortBy('popular');
    setActiveIdx(0);
  };

  const hasActive = query || selectedCategory || selectedPricing;
  const docked = filteredTools[activeIdx] ?? filteredTools[0] ?? null;

  return (
    <div>
      {/* Control bar */}
      <div className="rule-strong-t rule-b bg-[var(--paper)] py-4">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          {/* Filter */}
          <div className="flex min-w-56 flex-1 items-center border-b border-[var(--rule-strong)] focus-within:border-[var(--acc)]">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIdx(0);
              }}
              placeholder="Filter the index…"
              className="serif w-full bg-transparent py-1.5 italic text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
              aria-label="Filter tools"
            />
            <span className="mono whitespace-nowrap pl-3 text-[10px] uppercase tracking-[0.12em] text-[var(--acc-text)]">
              {filteredTools.length} / {tools.length}
            </span>
          </div>

          {/* Section */}
          <label className="flex items-center gap-2">
            <span className="kicker">Section</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setActiveIdx(0);
              }}
              className="mono cursor-pointer border border-[var(--rule)] bg-[var(--paper)] px-2 py-1.5 text-[11px] uppercase tracking-[0.1em] text-[var(--ink)] outline-none hover:border-[var(--ink-faint)]"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Pricing segmented */}
          <div className="flex items-center gap-2">
            <span className="kicker">Pricing</span>
            <div className="mono flex text-[10px] uppercase tracking-[0.1em]">
              {PRICINGS.map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => {
                    setSelectedPricing(val);
                    setActiveIdx(0);
                  }}
                  className={`-ml-px border px-2.5 py-1.5 transition-colors first:ml-0 ${
                    selectedPricing === val
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                      : 'border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--ink-faint)]'
                  }`}
                  aria-pressed={selectedPricing === val}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort segmented */}
          <div className="flex items-center gap-2">
            <span className="kicker">Sort</span>
            <div className="mono flex text-[10px] uppercase tracking-[0.1em]">
              {SORTS.map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setSortBy(val)}
                  className={`-ml-px border px-2.5 py-1.5 transition-colors first:ml-0 ${
                    sortBy === val
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]'
                      : 'border-[var(--rule)] text-[var(--ink-soft)] hover:border-[var(--ink-faint)]'
                  }`}
                  aria-pressed={sortBy === val}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {hasActive && (
            <button
              onClick={clearFilters}
              className="u-link mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]"
            >
              Reset
            </button>
          )}
        </div>

        {/* Keyboard hint */}
        <p className="mono mt-3 hidden gap-3 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)] lg:flex">
          <span className="kbd-hint">↑↓</span> navigate
          <span className="kbd-hint">Enter</span> open entry
          <span className="kbd-hint">V</span> visit site
        </p>
      </div>

      {/* Index + dock */}
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Column heads */}
          <div className="mono rule-b hidden grid-cols-[3.25rem_2.25rem_1fr_6rem_5rem_6.5rem_2rem] gap-x-4 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)] md:grid">
            <span>№</span>
            <span />
            <span>Entry</span>
            <span>Rating</span>
            <span>Reviews</span>
            <span>Pricing</span>
            <span />
          </div>

          {filteredTools.length === 0 ? (
            <div className="rule-b py-16 text-center">
              <p className="serif text-2xl italic text-[var(--ink-faint)]">
                Nothing in the index matches.
              </p>
              <button onClick={clearFilters} className="btn-line mt-6">
                Reset all filters
              </button>
            </div>
          ) : (
            filteredTools.map((tool, i) => (
              <div
                key={tool.id}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={i > 40 ? 'cv-auto' : undefined}
              >
                <ToolRow
                  tool={tool}
                  num={i + 1}
                  active={i === activeIdx}
                  onHover={() => setActiveIdx(i)}
                />
              </div>
            ))
          )}
        </div>

        {/* Preview dock — follows the cursor / keyboard like a card catalog drawer */}
        <aside className="hidden lg:block">
          {docked && (
            <div className="sticky top-32 border border-[var(--rule-strong)]">
              <div className="flag" aria-hidden="true" />
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center border border-[var(--rule)] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={docked.logo} alt="" className="h-7 w-7 object-contain" />
                  </span>
                  <span className="mono text-right text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                    Entry {String(activeIdx + 1).padStart(3, '0')}
                    <br />
                    {docked.category.replace(/-/g, ' ')}
                  </span>
                </div>

                <h2 className="display mt-4 text-3xl text-[var(--ink)]">{docked.name}</h2>
                <p className="mt-2 text-sm italic leading-relaxed text-[var(--ink-soft)]">
                  {docked.tagline}
                </p>
                <p className="mt-3 line-clamp-5 text-sm leading-relaxed text-[var(--ink-soft)]">
                  {docked.description}
                </p>

                {/* Rating distribution — print bar chart */}
                <div className="mt-5">
                  <p className="kicker">Rating distribution</p>
                  <div className="mt-2 space-y-1">
                    {([5, 4, 3, 2, 1] as const).map((star) => {
                      const pct = Math.round(
                        (docked.rating.distribution[star] / Math.max(1, docked.rating.count)) * 100,
                      );
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="mono w-5 text-[10px] text-[var(--ink-faint)]">{star}★</span>
                          <span className="h-2 flex-1 bg-[var(--paper-2)]">
                            <span
                              className="block h-full bg-[var(--acc)]"
                              style={{ width: `${pct}%` }}
                            />
                          </span>
                          <span className="mono w-8 text-right text-[10px] text-[var(--ink-faint)]">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <dl className="mono mt-5 text-[10px] uppercase tracking-[0.1em]">
                  {[
                    ['Pricing', getPricingLabel(docked.pricing)],
                    ['Platforms', docked.features.platforms.join(' · ')],
                    ['Reviews', docked.rating.count.toLocaleString()],
                  ].map(([k, v]) => (
                    <div key={k} className="rule-t flex justify-between gap-3 py-2">
                      <dt className="text-[var(--ink-faint)]">{k}</dt>
                      <dd className="text-right text-[var(--ink)]">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 flex gap-2">
                  <Link href={`/tools/${docked.slug}`} className="btn-ink flex-1 justify-center">
                    Read entry
                  </Link>
                  <a
                    href={docked.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-line flex-1 justify-center"
                  >
                    Visit ↗
                  </a>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
