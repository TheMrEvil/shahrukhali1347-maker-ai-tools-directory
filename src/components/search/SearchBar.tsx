'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { searchTools } from '@/lib/search';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const trendingSearches = ['AI chatbots', 'image generators', 'code assistants', 'video editing'];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        const results = searchTools(query);
        setSuggestions(results.slice(0, 5).map((tool) => tool.name));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/tools?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
      >
        <div className="flex items-center border-b-2 border-[var(--rule-strong)] transition-colors focus-within:border-[var(--acc)]">
          <span className="mono select-none pr-3 text-sm text-[var(--acc-text)]" aria-hidden="true">
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search the index — name, task, category…"
            className="serif w-full bg-transparent py-3 text-lg italic text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
            aria-label="Search tools"
          />
          <button
            type="submit"
            className="mono flex items-center gap-1 pl-3 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:text-[var(--acc-text)]"
            aria-label="Search"
          >
            Go
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-50 mt-px border border-[var(--rule-strong)] bg-[var(--paper)]">
          {suggestions.length > 0 ? (
            <ul>
              <li className="kicker rule-b px-4 py-2">Matches</li>
              {suggestions.map((s, i) => (
                <li key={s}>
                  <button
                    onClick={() => handleSearch(s)}
                    className="row-invert flex w-full items-baseline gap-3 px-4 py-2.5 text-left"
                  >
                    <span className="row-num mono text-[10px] text-[var(--acc-text)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="serif text-base">{s}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !query && (
              <ul>
                <li className="kicker rule-b px-4 py-2">Frequently consulted</li>
                {trendingSearches.map((s, i) => (
                  <li key={s}>
                    <button
                      onClick={() => handleSearch(s)}
                      className="row-invert flex w-full items-baseline gap-3 px-4 py-2.5 text-left"
                    >
                      <span className="row-num mono text-[10px] text-[var(--acc-text)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="serif text-base">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      )}
    </div>
  );
}
