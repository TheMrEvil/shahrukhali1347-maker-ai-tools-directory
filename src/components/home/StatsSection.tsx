'use client';

import { Boxes, Layers3, Star, Users } from 'lucide-react';
import { aiTools } from '@/data/tools';
import { categories } from '@/data/categories';
import { SITE_CONFIG } from '@/config/site';
import Counter from '@/components/Counter';

const verifiedCount = aiTools.filter((t) => t.verified).length;
const reviewCount = SITE_CONFIG.stats.reviewsCount;

const stats = [
  { icon: Boxes, value: aiTools.length, suffix: '+', label: 'Tools listed', from: '#a78bfa', to: '#6366f1' },
  { icon: Layers3, value: categories.length, suffix: '', label: 'Categories', from: '#5eead4', to: '#0d9488' },
  { icon: Users, value: Math.round(reviewCount / 1000), suffix: 'k+', label: 'Reviews', from: '#fbbf24', to: '#f59e0b' },
  { icon: Star, value: verifiedCount, suffix: '+', label: 'Verified tools', from: '#fb7185', to: '#e11d48' },
];

export default function StatsSection() {
  return (
    <section className="mt-20 border-y border-[var(--border)] bg-[var(--bg-soft)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden bg-[var(--border)] md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`reveal delay-${i + 1} group flex items-center gap-4 bg-[var(--bg-soft)] px-6 py-10 transition-colors hover:bg-[var(--surface)]`}
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-soft transition-transform duration-300 group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
            >
              <s.icon className="h-5 w-5 wobble" strokeWidth={2} />
            </div>
            <div>
              <div className="text-3xl font-semibold tracking-tight text-[var(--fg)]">
                <Counter to={s.value} />
                {s.suffix}
              </div>
              <div className="text-xs text-[var(--muted)]">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
