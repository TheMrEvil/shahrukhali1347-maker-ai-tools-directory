'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Paper / Ink switch — a segmented two-state toggle. The active stock is filled
 * with ink so the choice reads clearly in both themes (the old single box
 * blended into the light masthead).
 */
export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';

  const seg = (active: boolean) =>
    `flex h-full items-center px-2.5 transition-colors ${
      active
        ? 'bg-[var(--ink)] text-[var(--paper)]'
        : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
    }`;

  return (
    <div
      role="group"
      aria-label="Theme"
      className="mono flex h-9 items-stretch border border-[var(--rule-strong)] text-[10px] uppercase tracking-[0.14em]"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={mounted ? !isDark : undefined}
        title="Switch to paper (light)"
        className={seg(!isDark)}
      >
        Paper
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={mounted ? isDark : undefined}
        title="Switch to ink (dark)"
        className={`-ml-px border-l border-[var(--rule-strong)] ${seg(isDark)}`}
      >
        Ink
      </button>
    </div>
  );
}
