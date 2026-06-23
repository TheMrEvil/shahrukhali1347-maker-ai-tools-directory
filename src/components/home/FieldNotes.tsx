import Link from 'next/link';
import { guides } from '@/data/guides';
import SectionHead from './SectionHead';

const difficultyMark: Record<string, string> = {
  beginner: '●○○',
  intermediate: '●●○',
  advanced: '●●●',
};

/**
 * № 004 — FIELD NOTES. Guides as library catalog cards: a ruled header band
 * with a call number, the title, an abstract, and a difficulty gauge.
 */
export default function FieldNotes() {
  return (
    <section className="shell pt-20">
      <SectionHead
        no="04"
        kicker="From the desk"
        title="Field notes"
        linkHref="/guides"
        linkLabel="All notes"
      />

      <div className="reveal mt-10 grid gap-px bg-[var(--rule)] md:grid-cols-3">
        {guides.slice(0, 3).map((g, i) => (
          <Link
            key={g.id}
            href={`/guides/${g.slug}`}
            className="plate group relative flex flex-col !border-0 bg-[var(--paper)]"
          >
            {/* Catalog header band */}
            <div className="rule-b flex items-center justify-between bg-[var(--paper-2)] px-6 py-2.5">
              <span className="mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--acc-text)]">
                FN-{String(i + 1).padStart(3, '0')}
              </span>
              <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                {g.duration} min read
              </span>
            </div>

            {/* Card body */}
            <div className="flex flex-1 flex-col gap-4 p-6">
              <h3 className="display text-[1.65rem] leading-[1.05] text-[var(--ink)]">
                <span className="u-link">{g.title}</span>
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                {g.description}
              </p>

              <div className="mono mt-auto flex items-center justify-between border-t border-[var(--rule)] pt-3 text-[10px] uppercase tracking-[0.12em]">
                <span className="text-[var(--ink-faint)]">
                  Level{' '}
                  <span className="ml-1 tracking-[0.2em] text-[var(--acc-text)]">
                    {difficultyMark[g.difficulty] ?? '●○○'}
                  </span>
                </span>
                <span className="text-[var(--acc-text)]">Read ↗</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
