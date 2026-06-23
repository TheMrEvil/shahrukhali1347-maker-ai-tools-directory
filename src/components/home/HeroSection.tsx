import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';
import { SITE_CONFIG } from '@/config/site';
import { aiTools, getTrendingTools } from '@/data/tools';
import { categories } from '@/data/categories';

export default function HeroSection() {
  const trending = getTrendingTools().slice(0, 3);

  return (
    <section className="rule-b">
      <div className="shell grid gap-0 md:grid-cols-[1fr_300px]">
        {/* Lead column */}
        <div className="anim-rise flex flex-col justify-between py-14 pr-0 md:py-20 md:pr-12">
          <div>
            <p className="folio">Vol. 02 — The 2026 Edition</p>
            <h1 className="display misprint mt-6 text-5xl text-[var(--ink)] sm:text-6xl lg:text-[5.2rem]">
              An honest index of{' '}
              <em className="display-it u-wavy text-[var(--acc-text)]">working</em>{' '}
              AI tools.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] md:text-lg">
              {aiTools.length} tools across {categories.length} categories — each one reviewed by
              a person, priced against the vendor’s own page, and re-checked on a schedule.
              No banners. No boosted listings.
            </p>
          </div>

          <div className="mt-10 max-w-xl">
            <div className="ornament mb-8 text-sm" aria-hidden="true">
              ❦
            </div>
            <SearchBar />
            <div className="mono mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              <span>Consult:</span>
              {['ChatGPT', 'Cursor', 'Midjourney', 'Claude'].map((q) => (
                <Link
                  key={q}
                  href={`/tools?q=${encodeURIComponent(q)}`}
                  className="u-link text-[var(--ink-soft)]"
                >
                  {q}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Index sidebar — today's numbers, ruled like a table of contents */}
        <aside className="anim-rise delay-2 border-[var(--rule)] py-10 md:border-l md:py-20 md:pl-10">
          <div className="mb-6 flex items-center justify-between">
            <p className="kicker">Today’s index</p>
            <span className="stamp">Certified honest</span>
          </div>
          <dl className="mt-0">
            {[
              { k: 'Tools on record', v: `${aiTools.length}` },
              { k: 'Categories', v: `${categories.length}` },
              { k: 'Reader reviews', v: `${(SITE_CONFIG.stats.reviewsCount / 1000).toFixed(0)}k` },
              { k: 'Average rating', v: '4.6 / 5' },
            ].map((row) => (
              <div key={row.k} className="rule-b flex items-baseline justify-between py-3">
                <dt className="mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  {row.k}
                </dt>
                <dd className="mono text-xl font-semibold text-[var(--ink)]">{row.v}</dd>
              </div>
            ))}
          </dl>

          <p className="kicker mt-8">Moving this week</p>
          <ol className="mt-3">
            {trending.map((t, i) => (
              <li key={t.id}>
                <Link
                  href={`/tools/${t.slug}`}
                  className="row-invert -mx-2 flex items-baseline gap-3 px-2 py-2.5"
                >
                  <span className="row-num mono text-[10px] text-[var(--acc-text)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="serif text-lg leading-none">{t.name}</span>
                  <span className="row-dim mono ml-auto text-[10px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                    ★ {t.rating.average.toFixed(1)}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            href="/tools?sort=popular"
            className="u-link mono mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]"
          >
            Full movers list ↗
          </Link>
        </aside>
      </div>
    </section>
  );
}
