import Breadcrumbs from '@/components/seo/Breadcrumbs';

export type LegalBlock = { p: string } | { h3: string } | { ul: string[] };

export interface LegalSection {
  title: string;
  blocks: LegalBlock[];
}

interface LegalLayoutProps {
  kicker: string;
  title: string;
  accent: string;
  updated: string;
  lede: string;
  breadcrumb: { label: string; href: string };
  sections: LegalSection[];
}

/**
 * Editorial legal document — replaces the old gradient-hero + unstyled `prose`
 * block. Numbered serif sections under a double rule, ruled list items, a mono
 * dateline. Reads as a printed record, on theme.
 */
export default function LegalLayout({
  kicker,
  title,
  accent,
  updated,
  lede,
  breadcrumb,
  sections,
}: LegalLayoutProps) {
  return (
    <div className="shell pt-8 pb-24">
      <Breadcrumbs items={[breadcrumb]} />

      <header className="mt-8 max-w-3xl">
        <p className="folio">{kicker}</p>
        <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
          {title} <em className="display-it u-wavy text-[var(--acc-text)]">{accent}</em>
        </h1>
        <p className="mono mt-6 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          Last updated · {updated}
        </p>
        <p className="mt-5 text-base leading-relaxed text-[var(--ink-soft)]">{lede}</p>
      </header>

      <div className="rule-strong-t mt-12 max-w-3xl space-y-14 pt-10">
        {sections.map((s, i) => (
          <section key={s.title}>
            <div className="flex items-baseline gap-4">
              <span className="mono text-sm text-[var(--acc-text)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="display text-[1.6rem] leading-tight text-[var(--ink)] md:text-[1.9rem]">
                {s.title}
              </h2>
            </div>
            <div className="mt-4 space-y-4 sm:pl-10">
              {s.blocks.map((b, j) => {
                if ('p' in b) {
                  return (
                    <p key={j} className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                      {b.p}
                    </p>
                  );
                }
                if ('h3' in b) {
                  return (
                    <h3 key={j} className="kicker pt-2">
                      {b.h3}
                    </h3>
                  );
                }
                return (
                  <ul key={j}>
                    {b.ul.map((li, k) => (
                      <li
                        key={k}
                        className="rule-b flex items-baseline gap-3 py-2.5 text-[15px] leading-relaxed text-[var(--ink-soft)]"
                      >
                        <span className="mono shrink-0 text-[10px] text-[var(--acc-text)]">—</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
