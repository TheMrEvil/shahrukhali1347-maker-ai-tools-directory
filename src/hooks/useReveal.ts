'use client';

import { useEffect } from 'react';

/**
 * Adds `.is-visible` to every element matching `selector` as soon as it
 * crosses the viewport. Pair with `.reveal` utility for an opacity+translate
 * scroll-triggered fade-in.
 */
export function useReveal(selector = '.reveal') {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [selector]);
}
