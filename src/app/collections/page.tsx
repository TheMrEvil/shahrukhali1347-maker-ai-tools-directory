import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Zap, Brain, Rocket, Target, Users } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateCollectionsListSchema, generateWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Curated AI Tool Collections | Best AI Tools',
  description: 'Explore curated collections of the best AI tools for startups, developers, writers, marketers, and researchers. Find tools organized by use case and workflow.',
  alternates: {
    canonical: '/collections',
  },
  openGraph: {
    title: 'Curated AI Tool Collections | Best AI Tools',
    description: 'Explore curated collections of the best AI tools for startups, developers, writers, marketers, and researchers. Find tools organized by use case and workflow.',
    url: '/collections',
    type: 'website',
  },
  twitter: {
    title: 'Curated AI Tool Collections | Best AI Tools',
    description: 'Explore curated collections of the best AI tools for startups, developers, writers, marketers, and researchers. Find tools organized by use case and workflow.',
  },
};

const collections = [
  {
    id: 1,
    title: 'Best AI Tools for Startups',
    description: 'Essential AI tools to help startups scale faster with limited resources.',
    icon: Rocket,
    toolCount: 15,
    slug: 'startups',
  },
  {
    id: 2,
    title: 'AI Writing Assistants',
    description: 'Top tools for content creation, copywriting, and editing.',
    icon: Sparkles,
    toolCount: 20,
    slug: 'writing-assistants',
  },
  {
    id: 3,
    title: 'AI for Developers',
    description: 'Code generation, debugging, and development productivity tools.',
    icon: Zap,
    toolCount: 18,
    slug: 'developers',
  },
  {
    id: 4,
    title: 'AI Marketing Stack',
    description: 'Complete marketing toolkit powered by artificial intelligence.',
    icon: Target,
    toolCount: 22,
    slug: 'marketing',
  },
  {
    id: 5,
    title: 'AI for Teams',
    description: 'Collaboration and productivity tools for modern teams.',
    icon: Users,
    toolCount: 12,
    slug: 'teams',
  },
  {
    id: 6,
    title: 'AI Research Tools',
    description: 'Tools for academic research, data analysis, and insights.',
    icon: Brain,
    toolCount: 16,
    slug: 'research',
  },
];

export default function CollectionsPage() {
  const total = collections.reduce((sum, c) => sum + c.toolCount, 0);

  return (
    <>
      {/* WebPage + CollectionPage schema for rich results */}
      <StructuredData data={generateWebPageSchema({
        name: 'Curated AI Tool Collections',
        description: 'Handpicked collections of AI tools organized by use case, industry, and workflow.',
        url: '/collections',
      })} />
      <StructuredData data={generateCollectionsListSchema(collections.map(c => ({
        title: c.title,
        description: c.description,
        slug: c.slug,
        toolCount: c.toolCount,
      })))} />

      <div className="shell pt-8 pb-20">
        <Breadcrumbs items={[{ label: 'Collections', href: '/collections' }]} />

        {/* Editorial hero */}
        <header className="mt-8 max-w-3xl">
          <p className="folio">№ 005 — Curated Sets</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            Built for
            <br />
            <em className="display-it u-wavy text-[var(--acc-text)]">the job.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            {collections.length} hand-assembled sets — {total} entries grouped by who you are and
            what you&apos;re shipping. Start from a workflow instead of a blank index.
          </p>
        </header>

        {/* Collections as newspaper clippings */}
        <div className="rule-strong-t mt-12 grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => {
            const Icon = collection.icon;
            return (
              <Link
                key={collection.id}
                href={`/tools?collection=${collection.slug}`}
                className="news-plate group flex h-full min-h-[15rem] flex-col"
              >
                {/* Dateline band */}
                <div className="mono flex items-center justify-between border-b border-[var(--rule)] px-5 py-2.5 text-[9px] uppercase tracking-[0.18em]">
                  <span className="font-semibold text-[var(--acc-text)]">
                    Set {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[var(--ink-faint)]">Curated</span>
                </div>

                {/* Icon + headline + standfirst */}
                <div className="flex flex-1 flex-col px-5 pt-5 pb-5">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--rule)] text-[var(--ink)] transition-colors group-hover:border-[var(--ink-faint)]">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <h2 className="display text-balance text-[1.4rem] leading-[1.05] text-[var(--ink)] transition-colors group-hover:text-[var(--acc-text)]">
                      <span className="u-link">{collection.title}</span>
                    </h2>
                  </div>
                  <div className="hairline-x my-3.5" aria-hidden="true" />
                  <p className="line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {collection.description}
                  </p>
                </div>

                {/* Ruled footer: count + invert CTA */}
                <div className="rule-t mono flex items-stretch text-[10px] uppercase tracking-[0.12em]">
                  <span className="flex items-center gap-1.5 px-5 py-3 text-[var(--ink-soft)]">
                    <span className="text-base font-bold leading-none text-[var(--ink)]">
                      {collection.toolCount}
                    </span>
                    tools
                  </span>
                  <span className="ml-auto flex items-center border-l border-[var(--rule)] px-5 py-3 text-[var(--acc-text)] transition-colors group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]">
                    Open the set ↗
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
