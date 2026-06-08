// Deterministic per-tool/per-category accent picker.
// Returns Tailwind-compatible gradient endpoints + a soft tile bg.
//
// We use a small palette of well-paired colors so hover states stay coherent.

export interface Accent {
  from: string; // CSS color
  to: string;   // CSS color
  tile: string; // soft tinted background for the logo tile
  ring: string; // border tint
  text: string; // text-on-tile fallback
  // Tailwind class for solid pricing/badge etc — kept simple
  swatch: string;
}

const palette: Accent[] = [
  { from: '#a78bfa', to: '#6366f1', tile: 'rgba(99,102,241,0.10)',  ring: 'rgba(99,102,241,0.30)',  text: '#4338ca', swatch: 'bg-indigo-500'  },
  { from: '#34d399', to: '#059669', tile: 'rgba(16,185,129,0.10)',  ring: 'rgba(16,185,129,0.30)',  text: '#047857', swatch: 'bg-emerald-500' },
  { from: '#fbbf24', to: '#f59e0b', tile: 'rgba(245,158,11,0.10)',  ring: 'rgba(245,158,11,0.30)',  text: '#b45309', swatch: 'bg-amber-500'   },
  { from: '#fb7185', to: '#e11d48', tile: 'rgba(244,63,94,0.10)',   ring: 'rgba(244,63,94,0.30)',   text: '#be123c', swatch: 'bg-rose-500'    },
  { from: '#38bdf8', to: '#0284c7', tile: 'rgba(14,165,233,0.10)',  ring: 'rgba(14,165,233,0.30)',  text: '#0369a1', swatch: 'bg-sky-500'     },
  { from: '#c084fc', to: '#9333ea', tile: 'rgba(168,85,247,0.10)',  ring: 'rgba(168,85,247,0.30)',  text: '#7e22ce', swatch: 'bg-purple-500'  },
  { from: '#5eead4', to: '#0d9488', tile: 'rgba(20,184,166,0.10)',  ring: 'rgba(20,184,166,0.30)',  text: '#0f766e', swatch: 'bg-teal-500'    },
  { from: '#fb923c', to: '#ea580c', tile: 'rgba(249,115,22,0.10)',  ring: 'rgba(249,115,22,0.30)',  text: '#c2410c', swatch: 'bg-orange-500'  },
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getAccent(seed: string): Accent {
  return palette[hash(seed) % palette.length];
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
