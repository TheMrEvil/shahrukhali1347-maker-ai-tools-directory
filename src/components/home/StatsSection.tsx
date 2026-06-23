'use client';

import { Boxes, Eye, Layers3, Sparkles, Star, Users } from 'lucide-react';
import { aiTools } from '@/data/tools';
import { categories } from '@/data/categories';
import { SITE_CONFIG } from '@/config/site';

const verifiedCount = aiTools.filter((t) => t.verified).length;

const stats = [
  { icon: Boxes, value: aiTools.length.toString(), suffix: '+', label: 'Tools listed', blurb: 'Hand-checked weekly' },
  { icon: Layers3, value: categories.length.toString(), suffix: '', label: 'Categories', blurb: 'Real use cases only' },
  { icon: Star, value: '4.6', suffix: '', label: 'Avg. rating', blurb: 'From verified reviewers' },
  { icon: Users, value: `${(SITE_CONFIG.stats.usersCount / 1000).toFixed(0)}k`, suffix: '+', label: 'Monthly visitors', blurb: 'Real workflows, not bots' },
  { icon: Sparkles, value: verifiedCount.toString(), suffix: '+', label: 'Verified tools', blurb: 'We tested the claim' },
  { icon: Eye, value: `${(SITE_CONFIG.stats.reviewsCount / 1000).toFixed(0)}k`, suffix: '+', label: 'Reviews', blurb: 'Not a bot ranking' },
];

export default function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-24">
      <div className="reveal mx-auto max-w-2xl text-center">
        <p className="kicker">By the numbers</p>
        <h2 className="display mt-3 text-4xl text-[var(--fg)] md:text-5xl">
          Built on <span className="text-gradient">honest data</span>.
        </h2>
        <p className="mt-3 text-[var(--fg-soft)]">
          Every count is from real usage. Every rating is from a verified reviewer. Every pricing
          claim is checked against the vendor’s own page.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`reveal delay-${(i % 6) + 1} tile group rounded-2xl p-6 transition`}
          >
            <div className="flex items-start justify-between">
              <s.icon className="h-6 w-6 text-[var(--brand)]" />
              <span className="mono text-xs text-[var(--muted)]">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="mono display text-5xl text-[var(--fg)]">{s.value}</span>
              <span className="mono text-2xl font-bold text-[var(--brand)]">{s.suffix}</span>
            </div>
            <div className="mono mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {s.label}
            </div>
            <p className="mt-3 text-xs text-[var(--fg-soft)]">{s.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
