import Link from 'next/link';
import { getRecentTools } from '@/data/tools';
import ToolRow from '@/components/index/ToolRow';

/** Latest entries as index rows. (Not on the front page; kept for reuse.) */
export default function RecentlyAdded() {
  const recent = getRecentTools(8);
  return (
    <section className="mx-auto max-w-6xl px-5 pt-20 lg:px-8">
      <div className="rule-strong-t flex flex-wrap items-baseline justify-between gap-4 pt-4">
        <h2 className="display text-3xl text-[var(--ink)] md:text-5xl">Latest entries</h2>
        <Link
          href="/tools?sort=newest"
          className="u-link mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]"
        >
          All new entries ↗
        </Link>
      </div>
      <div className="mt-8">
        {recent.map((t, i) => (
          <ToolRow key={t.id} tool={t} num={i + 1} />
        ))}
      </div>
    </section>
  );
}
