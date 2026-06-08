'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { AITool, Category } from '@/types';
import { searchTools } from '@/lib/search';
import { applyFilters } from '@/lib/filters';
import ToolGrid from '@/components/tools/ToolGrid';

interface ToolsPageClientProps {
  tools: AITool[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  initialPricing?: string;
  initialSort?: string;
}

const sortOptions = [
  { label: 'Most popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Highest rated', value: 'rating' },
  { label: 'Name A-Z', value: 'name' },
];

const pricingOptions = [
  { label: 'Free', value: 'free' },
  { label: 'Freemium', value: 'freemium' },
  { label: 'Paid', value: 'paid' },
];

export default function ToolsPageClient({
  tools,
  categories,
  initialQuery = '',
  initialCategory = '',
  initialPricing = '',
  initialSort = 'popular',
}: ToolsPageClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPricing, setSelectedPricing] = useState(initialPricing);
  const [sortBy, setSortBy] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTools = useMemo(() => {
    let result = query ? searchTools(query) : tools;
    result = applyFilters(result, {
      categories: selectedCategory ? [selectedCategory] : undefined,
      pricing: selectedPricing
        ? [selectedPricing as 'free' | 'freemium' | 'paid']
        : undefined,
      sortBy: sortBy as 'popular' | 'newest' | 'rating' | 'name',
    });
    return result;
  }, [tools, query, selectedCategory, selectedPricing, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setSelectedPricing('');
    setSortBy('popular');
  };

  const hasActive = query || selectedCategory || selectedPricing;
  const activeCount = [query, selectedCategory, selectedPricing].filter(Boolean).length;

  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr]">
      <aside
        className={`space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:sticky md:top-20 md:h-fit ${
          !showFilters ? 'hidden md:block' : ''
        }`}
      >
        <FilterGroup label="Sort by">
          <div className="flex flex-col gap-1">
            {sortOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setSortBy(o.value)}
                className={`rounded-md px-2 py-1.5 text-left text-sm transition ${
                  sortBy === o.value
                    ? 'bg-[var(--brand-soft)] font-medium text-[var(--brand-strong)]'
                    : 'text-[var(--fg-soft)] hover:bg-[var(--bg-soft)]'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Category">
          <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`rounded-md px-2 py-1.5 text-left text-sm transition ${
                !selectedCategory
                  ? 'bg-[var(--brand-soft)] font-medium text-[var(--brand-strong)]'
                  : 'text-[var(--fg-soft)] hover:bg-[var(--bg-soft)]'
              }`}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`rounded-md px-2 py-1.5 text-left text-sm transition ${
                  selectedCategory === c.slug
                    ? 'bg-[var(--brand-soft)] font-medium text-[var(--brand-strong)]'
                    : 'text-[var(--fg-soft)] hover:bg-[var(--bg-soft)]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Pricing">
          <div className="flex flex-wrap gap-1.5">
            <Chip active={!selectedPricing} onClick={() => setSelectedPricing('')}>
              All
            </Chip>
            {pricingOptions.map((p) => (
              <Chip
                key={p.value}
                active={selectedPricing === p.value}
                onClick={() => setSelectedPricing(p.value)}
              >
                {p.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        {hasActive && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--fg-soft)] hover:text-[var(--brand)]"
          >
            <X className="h-3 w-3" /> Reset all
          </button>
        )}
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools…"
              className="w-full rounded-full border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/30"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--fg-soft)]">
            <span>{filteredTools.length} tools</span>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 md:hidden"
            >
              Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6">
          <ToolGrid
            tools={filteredTools}
            emptyMessage="No tools matched. Try clearing a filter."
          />
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      {children}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--fg-soft)] hover:border-[var(--brand)] hover:text-[var(--brand)]'
      }`}
    >
      {children}
    </button>
  );
}
