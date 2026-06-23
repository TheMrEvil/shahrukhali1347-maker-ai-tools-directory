'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown } from 'lucide-react';
import { NAV_LINKS } from '@/config/site';
import { aiTools } from '@/data/tools';
import ThemeToggle from '@/components/ThemeToggle';
import MobileNav from './MobileNav';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]">
      <div className="flag" aria-hidden="true" />

      {/* Edition strip */}
      <div className="rule-b hidden lg:block">
        <div className="shell flex h-7 items-center justify-between">
          <p className="mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            An independent index of artificial-intelligence software
          </p>
          <p className="mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
            {aiTools.length} entries · reviewed weekly
          </p>
        </div>
      </div>

      {/* Masthead — 3-column grid: wordmark left, nav dead-center, actions right */}
      <div className="rule-b">
        <div className="shell grid h-16 grid-cols-[auto_1fr_auto] items-center gap-6">
          <Link href="/" className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
            <span className="serif text-[1.35rem] font-semibold leading-none tracking-tight text-[var(--ink)]">
              Best AI Tools
            </span>
            <span className="mono hidden text-[9px] uppercase tracking-[0.18em] text-[var(--acc-text)] min-[1180px]:inline">
              The Index
            </span>
          </Link>

          <nav
            className="hidden items-center justify-center gap-5 justify-self-center lg:flex xl:gap-7"
            aria-label="Primary"
          >
            {NAV_LINKS.map((link, i) => {
              const num = String(i + 1).padStart(2, '0');
              const active = link.children
                ? link.children.some((c) => isActive(c.href))
                : isActive(link.href);

              if (link.children) {
                return (
                  <div key={link.label} className="group relative">
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={`mono flex items-center gap-1 whitespace-nowrap text-[10.5px] uppercase leading-none tracking-[0.14em] transition-colors ${
                        active
                          ? 'text-[var(--acc-text)]'
                          : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                      }`}
                    >
                      <span className="mr-1 text-[var(--ink-faint)]">{num}</span>
                      {link.label}
                      <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="min-w-[11rem] border border-[var(--rule-strong)] bg-[var(--paper)] py-1 shadow-[3px_3px_0_var(--ink)]">
                        {link.children.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className={`mono block whitespace-nowrap px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)] ${
                              isActive(c.href) ? 'text-[var(--acc-text)]' : 'text-[var(--ink-soft)]'
                            }`}
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mono whitespace-nowrap text-[10.5px] uppercase leading-none tracking-[0.14em] transition-colors ${
                    active
                      ? 'text-[var(--acc-text)]'
                      : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span className="mr-1 text-[var(--ink-faint)]">{num}</span>
                  <span
                    className={
                      active
                        ? 'underline decoration-[var(--acc)] decoration-2 underline-offset-[6px]'
                        : ''
                    }
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="col-start-3 flex shrink-0 items-center justify-self-end gap-2.5">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }),
                );
              }}
              aria-label="Open search"
              className="mono hidden h-9 items-center gap-2 whitespace-nowrap border border-[var(--rule)] px-3 text-[10px] uppercase leading-none tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] sm:inline-flex"
            >
              Search
              <span className="text-[var(--ink-faint)]">⌘K</span>
            </button>

            <ThemeToggle />

            <Link href="/tools" className="btn-ink btn-sm hidden lg:inline-flex">
              Open Index
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center border border-[var(--rule)] text-[var(--ink)] lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <MobileNav isOpen={open} onClose={() => setOpen(false)} />
    </header>
  );
}
