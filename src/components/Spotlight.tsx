'use client';

import { useRef, useCallback } from 'react';
import type { ReactNode, MouseEvent, CSSProperties } from 'react';

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wraps content with the .spot class and tracks the cursor inside the element,
 * publishing --mx and --my CSS variables so the spotlight gradient follows.
 */
export default function Spotlight({ children, className = '', style }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div ref={ref} onMouseMove={onMove} className={`spot ${className}`} style={style}>
      {children}
    </div>
  );
}
