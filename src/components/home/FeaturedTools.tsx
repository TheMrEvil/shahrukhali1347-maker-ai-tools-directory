import Link from 'next/link';
import { getFeaturedTools } from '@/data/tools';
import { getPricingLabel } from '@/lib/utils';
import SectionHead from './SectionHead';

/**
 * № 001 — SPECIMENS. Front-page lead layout: the top pick runs as one large
 * feature plate; the next three sit beside it as compact ranked briefs.
 */
export default function FeaturedTools() {
  const specimens = getFeaturedTools().slice(0, 4);
  const [lead, ...briefs] = specimens;
  if (!lead) return null;

  const leadPricing = getPricingLabel(lead.pricing);

  return (
    <section className="shell pt-16">
      <SectionHead
        no="01"
        kicker="This week"
        title="Specimens"
        linkHref="/tools?featured=true"
        linkLabel="All featured"
      />

      <div className="reveal mt-10 grid gap-px bg-[var(--rule)] lg:grid-cols-[1.35fr_1fr]">
        {/* LEAD — the front-page feature */}
        <Link
          href={`/tools/${lead.slug}`}
          className="plate cropmarks group relative flex flex-col gap-7 !border-0 p-7 md:p-10"
        >
          <span className="crop-br" aria-hidden="true" />
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center gap-2">
              <span className="bg-[var(--acc)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                Lead
              </span>
              <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                Pick 01 / 04
              </span>
            </span>
            <span className="grid h-16 w-16 place-items-center border border-[var(--rule)] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lead.logo}
                alt=""
                className="h-9 w-9 object-contain grayscale transition group-hover:grayscale-0"
                loading="lazy"
                decoding="async"
              />
            </span>
          </div>

          <div>
            <h3 className="display misprint text-4xl leading-[0.95] text-[var(--ink)] md:text-6xl">
              <span className="u-link">{lead.name}</span>
            </h3>
            <p className="serif mt-4 max-w-md text-lg italic leading-relaxed text-[var(--ink-soft)]">
              {lead.tagline}
            </p>
          </div>

          <dl className="mono mt-auto grid grid-cols-2 gap-x-8 text-[11px] uppercase tracking-[0.1em]">
            {[
              ['Rating', `★ ${lead.rating.average.toFixed(1)} / 5`],
              ['Reviews', lead.rating.count.toLocaleString()],
              ['Pricing', leadPricing],
              ['Filed under', lead.category.replace(/-/g, ' ')],
            ].map(([k, v]) => (
              <div key={k} className="rule-t flex justify-between py-2.5">
                <dt className="text-[var(--ink-faint)]">{k}</dt>
                <dd className="text-[var(--ink)]">{v}</dd>
              </div>
            ))}
          </dl>

          <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--acc-text)]">
            Read the entry ↗
          </span>
        </Link>

        {/* BRIEFS — three compact ranked rows stacked beside the lead */}
        <div className="grid grid-rows-3 gap-px bg-[var(--rule)]">
          {briefs.map((tool, i) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="plate group relative flex items-center gap-4 !border-0 p-6"
            >
              <span className="mono w-8 shrink-0 text-2xl font-bold leading-none text-[var(--acc-text)]">
                {String(i + 2).padStart(2, '0')}
              </span>
              <span className="grid h-12 w-12 shrink-0 place-items-center border border-[var(--rule)] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tool.logo}
                  alt=""
                  className="h-7 w-7 object-contain grayscale transition group-hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="display block truncate text-xl leading-tight text-[var(--ink)]">
                  <span className="u-link">{tool.name}</span>
                </span>
                <span className="mono mt-1 block text-[10px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                  ★ {tool.rating.average.toFixed(1)} · {getPricingLabel(tool.pricing)}
                </span>
              </span>
              <span className="mono shrink-0 text-sm text-[var(--ink-faint)]" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
