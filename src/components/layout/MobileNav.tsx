'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { X, Sparkles } from 'lucide-react';
import { NAV_LINKS } from '@/config/site';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <Fragment>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xs border-l border-[var(--border)] bg-[var(--bg)] shadow-xl md:hidden">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Best<span className="text-[var(--brand)]">AI</span>Tools
              </span>
            </Link>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] text-[var(--fg-soft)]"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--fg-soft)] transition hover:bg-[var(--bg-soft)] hover:text-[var(--fg)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[var(--border)] p-4">
            <Link
              href="/submit"
              onClick={onClose}
              className="block w-full rounded-full bg-[var(--brand)] px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[var(--brand-strong)]"
            >
              Submit a Tool
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
