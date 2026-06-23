import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

/**
 * Section clipping — a retro newspaper card. A mono dateline band, a balanced
 * serif headline (no orphaned words), a hairline byline rule, an abstract, and
 * a ruled footer whose CTA inverts to ink. A press rule draws in across the top
 * on hover (see .news-plate).
 */
export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="news-plate group flex h-full min-h-[15rem] flex-col"
    >
      {/* Dateline band */}
      <div className="mono flex items-center justify-between border-b border-[var(--rule)] px-5 py-2.5 text-[9px] uppercase tracking-[0.18em]">
        <span className="font-semibold text-[var(--acc-text)]">
          Sec. {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-[var(--ink-faint)]">
          {category.popular ? '★ Frequently consulted' : 'Filed entry'}
        </span>
      </div>

      {/* Headline + standfirst */}
      <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
        <h3 className="display text-balance text-[1.5rem] leading-[1.02] text-[var(--ink)] transition-colors group-hover:text-[var(--acc-text)]">
          <span className="u-link">{category.name}</span>
        </h3>
        <div className="hairline-x my-3.5" aria-hidden="true" />
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
          {category.description}
        </p>
      </div>

      {/* Ruled footer: count + invert CTA */}
      <div className="rule-t mono flex items-stretch text-[10px] uppercase tracking-[0.12em]">
        <span className="flex items-center gap-1.5 px-5 py-3 text-[var(--ink-soft)]">
          <span className="text-base font-bold leading-none text-[var(--ink)]">
            {category.toolCount}
          </span>
          entries
        </span>
        <span className="ml-auto flex items-center border-l border-[var(--rule)] px-5 py-3 text-[var(--acc-text)] transition-colors group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]">
          Read section ↗
        </span>
      </div>
    </Link>
  );
}
