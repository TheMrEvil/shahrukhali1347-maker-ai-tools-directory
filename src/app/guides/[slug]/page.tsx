import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides } from '@/data/guides';
import { getCategoryBySlug } from '@/data/categories';
import { getToolBySlug } from '@/data/tools';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';
import { formatDate } from '@/lib/utils';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return { title: 'Guide Not Found' };
  return {
    title: `${g.title} — AI Guide`,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      title: g.title,
      description: g.description,
      url: `/guides/${g.slug}`,
      type: 'article',
      images: [g.image],
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const cat = getCategoryBySlug(guide.category);
  const usedTools = guide.tools.map((s) => getToolBySlug(s)).filter(Boolean);
  const relatedGuides = guides.filter((g) => g.slug !== guide.slug).slice(0, 2);
  const guideNo = guides.findIndex((g) => g.slug === guide.slug) + 1;

  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: guide.title,
          description: guide.description,
          url: `/guides/${guide.slug}`,
        })}
      />

      <article className="shell pt-8 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Guides', href: '/guides' },
            { label: guide.title, href: `/guides/${guide.slug}` },
          ]}
        />

        {/* Hero / title block */}
        <header className="mt-8 max-w-3xl">
          <p className="folio">
            № {String(guideNo).padStart(3, '0')} — Field Guide
          </p>
          <h1 className="display misprint mt-4 text-4xl text-[var(--ink)] md:text-6xl">
            {guide.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[var(--ink-soft)]">
            {guide.description}
          </p>

          <div className="mono mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            <span className="text-[var(--acc-text)]">{guide.difficulty}</span>
            {cat && (
              <Link href={`/categories/${cat.slug}`} className="u-link">
                Filed under {cat.name}
              </Link>
            )}
            <span>{guide.duration} min read</span>
            <span>{guide.steps.length} steps</span>
            <span>By {guide.author}</span>
            <span>Updated {formatDate(guide.dateUpdated)}</span>
            <span>{guide.views.toLocaleString()} views</span>
          </div>
        </header>

        {/* Body: steps + sidebar */}
        <div className="rule-strong-t mt-12 grid gap-12 pt-10 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0 max-w-2xl">
            <p className="serif text-xl leading-relaxed text-[var(--ink)]">
              {guide.content}
            </p>

            <section className="mt-12">
              <h2 className="kicker">Step-by-step</h2>
              <ol className="mt-6 space-y-px">
                {guide.steps.map((step) => (
                  <li
                    key={step.number}
                    className="rule-b flex gap-5 py-6"
                  >
                    <span className="mono grid h-10 w-10 flex-shrink-0 place-items-center border border-[var(--rule)] text-sm font-bold text-[var(--acc-text)]">
                      {String(step.number).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="display text-lg text-[var(--ink)]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                        {step.content}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Closing callout */}
            <div className="mt-12 border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
              <p className="display text-lg text-[var(--ink)]">You made it to the end.</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink-soft)]">
                Pair this guide with the tools below to put what you learned into practice.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="border-[var(--rule)] lg:border-l lg:pl-8">
            {usedTools.length > 0 && (
              <div>
                <p className="kicker">Tools used in this guide</p>
                <ul className="mt-3">
                  {usedTools.map((t) => (
                    <li key={t!.id} className="rule-b">
                      <Link
                        href={`/tools/${t!.slug}`}
                        className="group flex items-center gap-3 py-3"
                      >
                        <span className="grid h-9 w-9 flex-shrink-0 place-items-center border border-[var(--rule)] bg-white">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={t!.logo}
                            alt=""
                            className="h-6 w-6 object-contain"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--acc-text)]">
                            {t!.name}
                          </p>
                          <p className="truncate text-xs text-[var(--ink-faint)]">{t!.tagline}</p>
                        </div>
                        <span className="mono text-[10px] text-[var(--ink-faint)] transition-colors group-hover:text-[var(--acc-text)]">
                          ↗
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedGuides.length > 0 && (
              <div className="mt-8">
                <p className="kicker">Keep learning</p>
                <ul className="mt-3">
                  {relatedGuides.map((g) => (
                    <li key={g.id} className="rule-b">
                      <Link href={`/guides/${g.slug}`} className="group block py-3">
                        <p className="text-sm font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--acc-text)]">
                          {g.title}
                        </p>
                        <p className="mono mt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                          {g.duration} min · {g.difficulty}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/guides" className="btn-line btn-sm mt-8 inline-flex">
              ← All guides
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
