'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ComponentType } from 'react';
import {
  Search,
  X,
  Layers,
  GitCompare,
  ArrowRight,
  Newspaper,
  GraduationCap,
  BookOpen,
  Mail,
  Plus,
  Info,
  FileText,
} from 'lucide-react';
import { aiTools } from '@/data/tools';
import { categories } from '@/data/categories';

type SearchResult =
  | { type: 'tool'; id: string; name: string; tagline: string; slug: string; logo: string }
  | { type: 'category'; id: string; name: string; description: string; slug: string }
  | { type: 'page'; id: string; name: string; description: string; href: string };

const STATIC_PAGES: SearchResult[] = [
  { type: 'page', id: 'compare', name: 'Compare AI Tools', description: 'Side-by-side comparisons', href: '/compare' },
  { type: 'page', id: 'collections', name: 'Collections', description: 'Curated tool stacks', href: '/collections' },
  { type: 'page', id: 'blog', name: 'The Blog', description: 'Reviews, comparisons, explainers', href: '/blog' },
  { type: 'page', id: 'guides', name: 'Field Notes', description: 'Step-by-step guides', href: '/guides' },
  { type: 'page', id: 'methodology', name: 'How We Review', description: 'Our editorial methodology', href: '/methodology' },
  { type: 'page', id: 'submit', name: 'Submit a Tool', description: 'Suggest a tool for our directory', href: '/submit' },
  { type: 'page', id: 'contact', name: 'Contact', description: 'Get in touch', href: '/contact' },
  { type: 'page', id: 'about', name: 'About', description: 'Mission and methodology', href: '/about' },
];

const PAGE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  compare: GitCompare,
  collections: Layers,
  blog: Newspaper,
  guides: GraduationCap,
  methodology: BookOpen,
  submit: Plus,
  contact: Mail,
  about: Info,
};

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Open / close keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      // "/" to open (when not focused on an input)
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setOpen(true);
        return;
      }
      // Escape to close
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default: top featured tools + key pages
      const featured: SearchResult[] = aiTools
        .filter((t) => t.featured)
        .slice(0, 5)
        .map((t) => ({ type: 'tool', id: t.id, name: t.name, tagline: t.tagline, slug: t.slug, logo: t.logo }));
      return [...STATIC_PAGES.slice(0, 3), ...featured];
    }

    const toolMatches: SearchResult[] = aiTools
      .filter((t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 8)
      .map((t) => ({ type: 'tool', id: t.id, name: t.name, tagline: t.tagline, slug: t.slug, logo: t.logo }));

    const categoryMatches: SearchResult[] = categories
      .filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({ type: 'category', id: c.id, name: c.name, description: c.description, slug: c.slug }));

    const pageMatches: SearchResult[] = STATIC_PAGES.filter(
      (p) => p.name.toLowerCase().includes(q) || ('description' in p && p.description.toLowerCase().includes(q))
    );

    return [...toolMatches, ...categoryMatches, ...pageMatches].slice(0, 12);
  }, [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = (r: SearchResult) => {
    setOpen(false);
    if (r.type === 'tool') router.push(`/tools/${r.slug}`);
    else if (r.type === 'category') router.push(`/categories/${r.slug}`);
    else router.push(r.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) handleSelect(r);
    }
  };

  if (!open) return null;

  const getIcon = (r: SearchResult) => {
    if (r.type === 'tool') {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={r.logo} alt="" className="h-4 w-4 object-contain" />;
    }
    if (r.type === 'category') return <Layers className="h-4 w-4 text-[var(--ink-faint)]" />;
    const Icon = PAGE_ICONS[r.id] ?? FileText;
    return <Icon className="h-4 w-4 text-[var(--ink-faint)]" />;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[10vh] bg-[color-mix(in_oklab,var(--ink)_55%,transparent)]"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden border border-[var(--rule-strong)] bg-[var(--paper)]"
      >
        <div className="flag" aria-hidden="true" />
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--rule)] px-4 py-3">
          <Search className="h-5 w-5 text-[var(--ink-faint)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search the index — tools, sections, pages…"
            className="serif flex-1 bg-transparent text-base italic text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
          />
          <button
            onClick={() => setOpen(false)}
            className="grid h-7 w-7 place-items-center border border-[var(--rule)] text-[var(--ink-faint)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="serif text-lg italic text-[var(--ink-faint)]">
                Nothing in the index matches &quot;{query}&quot;
              </p>
              <p className="mono mt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                Try another term or{' '}
                <button
                  onClick={() => { setOpen(false); router.push('/tools'); }}
                  className="u-link text-[var(--acc-text)]"
                >
                  browse all tools
                </button>
              </p>
            </div>
          ) : (
            <>
              {!query && (
                <div className="kicker px-4 py-2">Quick links &amp; featured tools</div>
              )}
              {results.map((r, i) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => handleSelect(r)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className="row-invert flex w-full items-center gap-3 px-4 py-3 text-left"
                  data-active={activeIndex === i}
                >
                  <span
                    className={`grid h-8 w-8 flex-shrink-0 place-items-center border border-[var(--rule)] ${
                      r.type === 'tool' ? 'bg-white' : 'bg-[var(--paper-2)]'
                    }`}
                  >
                    {getIcon(r)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[var(--ink)]">
                      {r.name}
                    </span>
                    <span className="row-dim block truncate text-xs text-[var(--ink-faint)]">
                      {r.type === 'tool' ? r.tagline : r.description}
                    </span>
                  </span>
                  <span className="row-dim mono flex-shrink-0 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                    {r.type}
                  </span>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--ink-faint)]" />
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div className="mono flex items-center justify-between border-t border-[var(--rule)] bg-[var(--paper-2)] px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <kbd className="kbd-hint">↑↓</kbd> navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="kbd-hint">↵</kbd> open
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="kbd-hint">esc</kbd> close
            </span>
          </div>
          <span>Best AI Tools</span>
        </div>
      </div>
    </div>
  );
}
