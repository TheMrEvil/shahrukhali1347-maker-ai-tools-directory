'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { NAV_LINKS } from '@/config/site';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <Fragment>
      <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col border-l border-[var(--rule)] bg-[var(--paper)] lg:hidden">
        <div className="flag" aria-hidden="true" />
        <div className="rule-b flex items-center justify-between px-5 py-4">
          <span className="serif text-xl font-semibold text-[var(--ink)]">Best AI Tools</span>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center border border-[var(--rule)] text-[var(--ink-soft)]"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto" aria-label="Mobile">
          {NAV_LINKS.map((link, i) => {
            const num = String(i + 1).padStart(2, '0');
            if (link.children) {
              return (
                <div key={link.label} className="rule-b px-5 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="mono text-[10px] tracking-[0.14em] text-[var(--acc-text)]">
                      {num}
                    </span>
                    <span className="serif text-lg text-[var(--ink)]">{link.label}</span>
                  </div>
                  <div className="mt-2 flex flex-col pl-7">
                    {link.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        onClick={onClose}
                        className="mono py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)] transition-colors hover:text-[var(--acc-text)]"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="rule-b flex items-baseline gap-3 px-5 py-4 transition-colors hover:bg-[var(--paper-2)]"
              >
                <span className="mono text-[10px] tracking-[0.14em] text-[var(--acc-text)]">
                  {num}
                </span>
                <span className="serif text-lg text-[var(--ink)]">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="rule-t p-5">
          <Link href="/tools" onClick={onClose} className="btn-ink w-full justify-center">
            Open Index
          </Link>
        </div>
      </div>
    </Fragment>
  );
}
