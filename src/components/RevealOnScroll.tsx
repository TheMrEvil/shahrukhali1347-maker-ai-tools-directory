'use client';

import { useReveal } from '@/hooks/useReveal';

/**
 * Drop this once anywhere in the tree to enable the `.reveal` → `.is-visible`
 * scroll-trigger across the page.
 */
export default function RevealOnScroll() {
  useReveal('.reveal');
  return null;
}
