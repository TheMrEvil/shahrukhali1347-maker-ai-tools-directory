import Link from 'next/link';
import { categories } from '@/data/categories';
import SectionHead from './SectionHead';

/**
 * № 003 — SECTIONS. Categories as a compact grid of catalog cards: a big
 * mono index number, serif name, entry count, hover-inverts to ink.
 */
export default function CategoriesGrid() {
  return (
    <section className="shell pt-20">
      <SectionHead
        no="03"
        kicker="By department"
        title="Sections"
        linkHref="/categories"
        linkLabel="Browse all sections"
      />

      <div className="reveal mt-10 grid gap-px bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 12).map((c, i) => (
          <Link
            key={c.id}
            href={`/categories/${c.slug}`}
            className="row-invert group flex flex-col gap-3 bg-[var(--paper)] p-6"
          >
            <div className="flex items-baseline justify-between">
              <span className="row-num mono text-2xl font-bold leading-none text-[var(--acc-text)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="row-dim mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                {c.toolCount} tools
              </span>
            </div>
            <h3 className="serif mt-1 text-balance text-[1.4rem] leading-[1.05] text-[var(--ink)] group-hover:text-[var(--paper)]">
              {c.name}
            </h3>
            <span className="row-dim mono mt-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-[var(--acc-text)]">
              Open ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
