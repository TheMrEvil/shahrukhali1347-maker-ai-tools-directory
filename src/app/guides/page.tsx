import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';
import { guides } from '@/data/guides';
import { getCategoryBySlug } from '@/data/categories';
import { getToolBySlug } from '@/data/tools';
import GuideCover from '@/components/guides/GuideCover';

export const metadata: Metadata = {
  title: 'AI Guides & Tutorials | Best AI Tools',
  description:
    'Step-by-step AI guides and tutorials covering writing, image generation, coding, and more.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'AI Guides & Tutorials | Best AI Tools',
    description: 'Step-by-step AI guides and tutorials.',
    url: '/guides',
    type: 'website',
  },
};

export default function GuidesPage() {
  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: 'AI Guides & Tutorials',
          description: 'Step-by-step guides and tutorials for AI tools.',
          url: '/guides',
        })}
      />

      <div className="shell pt-8 pb-20">
        <Breadcrumbs items={[{ label: 'Guides', href: '/guides' }]} />

        <header className="mt-8 max-w-3xl">
          <p className="folio">№ 004 — Field Notes</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            Learn the tools
            <br />
            <em className="display-it u-wavy text-[var(--acc-text)]">you actually use.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            Step-by-step walkthroughs from real workflows — no fluff, no clickbait, no “10 ways to…”
            lists.
          </p>
        </header>

        {/* Guide clippings with branded covers */}
        <div className="rule-strong-t mt-12 grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g, i) => {
            const cat = getCategoryBySlug(g.category);
            const logo = g.tools[0] ? getToolBySlug(g.tools[0])?.logo : undefined;
            return (
              <Link
                key={g.id}
                href={`/guides/${g.slug}`}
                className="news-plate group flex h-full flex-col"
              >
                <GuideCover
                  title={g.title}
                  no={i + 1}
                  kicker={cat?.name}
                  logo={logo}
                />

                <div className="flex flex-1 flex-col p-5">
                  <p className="line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {g.description}
                  </p>
                  <div className="rule-t mono mt-5 flex items-center justify-between gap-2 pt-3 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                    <span>
                      <span className="text-[var(--acc-text)]">{g.difficulty}</span> · {g.duration} min
                      · {g.steps.length} steps
                    </span>
                    <span className="text-[var(--acc-text)] transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pipeline note */}
        <div className="mt-12 border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
          <p className="kicker text-[var(--acc-text)]">More in the pipeline</p>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
            We publish one new guide every other Friday. Subscribe to the newsletter for a ping when
            each one lands.
          </p>
          <Link href="/tools" className="btn-line btn-sm mt-4">
            Browse all tools
          </Link>
        </div>
      </div>
    </>
  );
}
