import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { aiTools, getToolBySlug, getRelatedTools } from '@/data/tools';
import { getCategoryBySlug } from '@/data/categories';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import ToolCard from '@/components/tools/ToolCard';
import { generateToolSchema, generateWebPageSchema } from '@/lib/schema';
import { formatDate, getPricingLabel } from '@/lib/utils';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return aiTools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  const title = tool.seo.metaTitle || `${tool.name} - ${tool.tagline}`;
  const description = tool.seo.metaDescription || tool.description;

  return {
    title,
    description,
    keywords: tool.seo.keywords,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/tools/${tool.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const category = getCategoryBySlug(tool.category);
  const relatedTools = getRelatedTools(tool, 4);
  const pricingLabel = getPricingLabel(tool.pricing);
  const entryNo = aiTools.findIndex((t) => t.slug === tool.slug) + 1;

  return (
    <>
      <StructuredData data={generateWebPageSchema({
        name: tool.seo.metaTitle || `${tool.name} - ${tool.tagline}`,
        description: tool.seo.metaDescription || tool.description,
        url: `/tools/${tool.slug}`,
        dateModified: tool.dateUpdated,
      })} />
      <StructuredData data={generateToolSchema(tool)} />

      <article className="shell pt-8 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Tools', href: '/tools' },
            { label: category?.name || tool.category, href: `/categories/${tool.category}` },
            { label: tool.name, href: `/tools/${tool.slug}` },
          ]}
        />

        {/* Entry head */}
        <header className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mono flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
              <span className="text-[var(--acc-text)]">Entry № {String(entryNo).padStart(3, '0')}</span>
              {category && (
                <Link href={`/categories/${category.slug}`} className="u-link">
                  Filed under {category.name}
                </Link>
              )}
              {tool.verified && <span>✓ Verified</span>}
              {tool.trending && <span className="text-[var(--acc-text)]">▲ Trending</span>}
            </div>

            <div className="mt-5 flex items-start gap-5">
              <span className="grid h-16 w-16 flex-shrink-0 place-items-center border border-[var(--rule)] bg-white md:h-20 md:w-20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  className="h-10 w-10 object-contain md:h-12 md:w-12"
                />
              </span>
              <div className="min-w-0">
                <h1 className="display misprint text-4xl text-[var(--ink)] md:text-6xl">{tool.name}</h1>
                <p className="serif mt-2 text-lg italic text-[var(--ink-soft)] md:text-xl">
                  {tool.tagline}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={tool.website} target="_blank" rel="noopener noreferrer" className="btn-ink">
                Visit {tool.name} ↗
              </a>
              <Link href={`/tools?category=${tool.category}`} className="btn-line">
                More like this
              </Link>
            </div>

            {/* Standfirst — a lead deck + filed-at-a-glance that fills the
                column so it balances the tall record sidebar beside it. */}
            <div className="rule-t mt-10 max-w-2xl pt-7">
              <p className="serif text-lg italic leading-relaxed text-[var(--ink-soft)] md:text-xl">
                {tool.description}
              </p>
              <dl className="mono mt-7 grid grid-cols-2 gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.12em] sm:grid-cols-4">
                {[
                  ['Filed under', category?.name ?? tool.category],
                  ['Pricing', pricingLabel],
                  ['Platforms', tool.features.platforms.join(' · ')],
                  ['Last reviewed', formatDate(tool.dateUpdated)],
                ].map(([k, v]) => (
                  <div key={k} className="rule-t pt-2.5">
                    <dt className="text-[var(--ink-faint)]">{k}</dt>
                    <dd className="mt-1.5 tracking-normal text-[var(--ink)] [text-transform:none]">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Marginal record */}
          <aside className="border-[var(--rule)] lg:border-l lg:pl-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="kicker">On record</p>
              {tool.verified && <span className="stamp">Inspected</span>}
            </div>
            <dl className="mono mt-3 text-[11px] uppercase tracking-[0.1em]">
              {[
                ['Rating', `★ ${tool.rating.average.toFixed(1)} / 5`],
                ['Reviews', tool.rating.count.toLocaleString()],
                ['Pricing', pricingLabel],
                ['Platforms', tool.features.platforms.join(' · ')],
                ['Added', formatDate(tool.dateAdded)],
                ['Last reviewed', formatDate(tool.dateUpdated)],
              ].map(([k, v]) => (
                <div key={k} className="rule-b flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="flex-shrink-0 text-[var(--ink-faint)]">{k}</dt>
                  <dd className="text-right text-[var(--ink)]">{v}</dd>
                </div>
              ))}
            </dl>

            {/* Distribution */}
            <p className="kicker mt-6">Rating distribution</p>
            <div className="mt-2 space-y-1">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const pct = Math.round(
                  (tool.rating.distribution[star] / Math.max(1, tool.rating.count)) * 100,
                );
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="mono w-5 text-[10px] text-[var(--ink-faint)]">{star}★</span>
                    <span className="h-2 flex-1 bg-[var(--paper-2)]">
                      <span className="block h-full bg-[var(--acc)]" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="mono w-8 text-right text-[10px] text-[var(--ink-faint)]">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        </header>

        {/* Body */}
        <div className="rule-strong-t mt-12 grid gap-12 pt-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <section>
              <h2 className="kicker">About</h2>
              <p className="serif mt-4 max-w-2xl text-xl leading-relaxed text-[var(--ink)]">
                {tool.fullDescription}
              </p>
            </section>

            <section className="mt-12">
              <h2 className="kicker">Key features</h2>
              <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
                {tool.features.core.map((feature, index) => (
                  <li
                    key={index}
                    className="rule-b flex items-baseline gap-3 py-3 text-sm text-[var(--ink-soft)]"
                  >
                    <span className="mono flex-shrink-0 text-[10px] text-[var(--acc-text)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="kicker">Use cases</h2>
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {tool.useCases.map((useCase) => (
                  <span key={useCase} className="tag text-sm">
                    {useCase}
                  </span>
                ))}
              </p>
            </section>

            <section className="mt-12">
              <h2 className="kicker">Tags</h2>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {tool.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tools?q=${encodeURIComponent(tag)}`}
                    className="u-link mono text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]"
                  >
                    #{tag}
                  </Link>
                ))}
              </p>
            </section>
          </div>

          {/* Pricing ledger */}
          <aside>
            <h2 className="kicker">Pricing</h2>
            <div className="mt-4 space-y-4">
              {tool.pricing.plans.map((plan, index) => (
                <div
                  key={index}
                  className={`border p-5 ${
                    plan.popular
                      ? 'border-[var(--acc)]'
                      : 'border-[var(--rule)]'
                  }`}
                >
                  <div className="mono flex items-baseline justify-between text-[10px] uppercase tracking-[0.12em]">
                    <span className="text-[var(--ink-faint)]">{plan.name}</span>
                    {plan.popular && <span className="text-[var(--acc-text)]">Most filed</span>}
                  </div>
                  <p className="mt-2">
                    <span className="display text-3xl text-[var(--ink)]">
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                        {' '}
                        / {plan.interval}
                      </span>
                    )}
                  </p>
                  <ul className="mt-3">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <li
                        key={idx}
                        className="rule-t flex items-baseline gap-2 py-2 text-xs text-[var(--ink-soft)]"
                      >
                        <span className="text-[var(--acc-text)]">—</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="mono text-[10px] uppercase tracking-[0.1em] leading-relaxed text-[var(--ink-faint)]">
                Checked against the vendor’s page on {formatDate(tool.dateUpdated)}.
              </p>
            </div>
          </aside>
        </div>

        {/* Cross references */}
        {relatedTools.length > 0 && (
          <section className="rule-strong-t mt-16 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="display text-3xl text-[var(--ink)] md:text-4xl">See also</h2>
              <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                Cross-referenced entries
              </span>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTools.map((relatedTool) => (
                <ToolCard key={relatedTool.id} tool={relatedTool} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
