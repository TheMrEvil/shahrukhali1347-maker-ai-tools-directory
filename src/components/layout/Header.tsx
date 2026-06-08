'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '@/config/site';
import ThemeToggle from '@/components/ThemeToggle';
import MobileNav from './MobileNav';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Best<span className="text-[var(--brand)]">AI</span>Tools
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`under text-sm font-medium transition ${
                isActive(link.href)
                  ? 'text-[var(--brand)]'
                  : 'text-[var(--fg-soft)] hover:text-[var(--fg)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
            }}
            aria-label="Open search"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-1.5 text-sm text-[var(--muted)] transition hover:border-[var(--fg-soft)] hover:text-[var(--fg)]"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search tools</span>
            <kbd className="ml-2 hidden lg:inline-flex items-center rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)]">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />

          <Link
            href="/tools"
            className="hidden md:inline-flex items-center rounded-full bg-[var(--brand)] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--brand-strong)]"
          >
            Browse
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
}
