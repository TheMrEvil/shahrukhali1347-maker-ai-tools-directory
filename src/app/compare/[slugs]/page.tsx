import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getToolBySlug } from '@/data/tools';
import { getCategoryBySlug } from '@/data/categories';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';
import { formatDate, getPricingLabel } from '@/lib/utils';
import { AITool } from '@/types';

interface ComparePageProps {
  params: Promise<{ slugs: string }>;
}

// Curated list of high-value comparison combos to pre-render at build time.
// Each pair is two tools that users actually search to compare.
const FEATURED_COMBOS: Array<[string, string]> = [
  // Chatbots
  ['chatgpt', 'claude'],
  ['chatgpt', 'gemini'],
  ['claude', 'gemini'],
  ['chatgpt', 'perplexity'],
  ['claude', 'deepseek'],
  ['claude', 'mistral-le-chat'],
  ['chatgpt', 'microsoft-copilot'],
  ['gemini', 'grok'],
  ['perplexity', 'phind'],
  // Code
  ['cursor', 'github-copilot'],
  ['cursor', 'windsurf'],
  ['cursor', 'v0'],
  ['v0', 'bolt-new'],
  ['windsurf', 'aider'],
  ['github-copilot', 'tabnine'],
  ['github-copilot', 'codeium'],
  ['cursor', 'devin'],
  // Image
  ['midjourney', 'dall-e'],
  ['midjourney', 'stable-diffusion'],
  ['midjourney', 'flux-ai'],
  ['dall-e', 'leonardo-ai'],
  ['krea-ai', 'pika'],
  // Writing
  ['jasper', 'copy-ai'],
  ['grammarly', 'quillbot'],
  ['notion-ai', 'jasper'],
  // Video
  ['runway', 'pika'],
  ['synthesia', 'heygen'],
  // Productivity
  ['notion-ai', 'mem'],
  ['otter-ai', 'fireflies'],
  ['raycast-ai', 'superhuman'],
];

export async function generateStaticParams() {
  return FEATURED_COMBOS.map(([a, b]) => ({
    slugs: `${a}-vs-${b}`,
  }));
}

function parseSlugs(slugs: string): [string, string] | null {
  const parts = slugs.split('-vs-');
  if (parts.length !== 2) return null;
  return [parts[0], parts[1]];
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);

  if (!parsed) return { title: 'Comparison Not Found' };

  const [slugA, slugB] = parsed;
  const a = getToolBySlug(slugA);
  const b = getToolBySlug(slugB);

  if (!a || !b) return { title: 'Comparison Not Found' };

  const title = `${a.name} vs ${b.name}: Side-by-Side Comparison (2026)`;
  const description = `Compare ${a.name} and ${b.name} — pricing, features, platforms, and ratings. Editor-written verdict on which AI tool to pick for your use case.`;

  return {
    title,
    description,
    keywords: [`${a.name} vs ${b.name}`, `${a.name} alternatives`, `${b.name} alternatives`, ...a.seo.keywords, ...b.seo.keywords],
    alternates: { canonical: `/compare/${slugA}-vs-${slugB}` },
    openGraph: {
      title,
      description,
      url: `/compare/${slugA}-vs-${slugB}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function priceCell(tool: AITool): string {
  const min = Math.min(...tool.pricing.plans.map((p) => p.price));
  if (min === 0 && tool.pricing.free) return 'Free';
  if (min === 0) return 'Free tier';
  return `From $${min}/${tool.pricing.plans[0].interval}`;
}

function platformCell(tool: AITool): string {
  return tool.features.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
}

function generateVerdict(a: AITool, b: AITool): { winner: AITool; reasoning: string } {
  // Simple heuristic: featured + higher rating wins. If tied, lower price wins.
  const aScore = (a.featured ? 1 : 0) + (a.trending ? 0.5 : 0) + a.rating.average / 10;
  const bScore = (b.featured ? 1 : 0) + (b.trending ? 0.5 : 0) + b.rating.average / 10;

  if (aScore > bScore) {
    return {
      winner: a,
      reasoning: `${a.name} edges out for most users — stronger feature set and a more refined experience based on our editorial scoring.`,
    };
  }
  if (bScore > aScore) {
    return {
      winner: b,
      reasoning: `${b.name} edges out for most users — stronger feature set and a more refined experience based on our editorial scoring.`,
    };
  }
  return {
    winner: a.pricing.free && !b.pricing.free ? a : b,
    reasoning: 'Both tools score similarly in our review. Pick based on pricing fit and platform availability — see the comparison table above.',
  };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { slugs } = await params;
  const parsed = parseSlugs(slugs);
  if (!parsed) notFound();

  const [slugA, slugB] = parsed;
  const a = getToolBySlug(slugA);
  const b = getToolBySlug(slugB);
  if (!a || !b) notFound();

  const categoryA = getCategoryBySlug(a.category);
  const categoryB = getCategoryBySlug(b.category);
  const verdict = generateVerdict(a, b);
  const sameCategory = a.category === b.category;

  // FAQPage schema for AI Overviews
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Which is better, ${a.name} or ${b.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: verdict.reasoning,
        },
      },
      {
        '@type': 'Question',
        name: `What is the pricing difference between ${a.name} and ${b.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${a.name} starts at ${priceCell(a)}, while ${b.name} starts at ${priceCell(b)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I use ${a.name} and ${b.name} together?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: sameCategory
            ? `Yes, but most users pick one. ${a.name} and ${b.name} are both in the ${categoryA?.name} category, so they overlap significantly.`
            : `Yes — ${a.name} (${categoryA?.name}) and ${b.name} (${categoryB?.name}) serve different use cases and complement each other well.`,
        },
      },
    ],
  };

  const yes = <span className="text-[var(--acc-text)]">Yes</span>;
  const no = <span className="text-[var(--ink-faint)]">No</span>;

  const ComparisonRow = ({ label, valA, valB }: { label: string; valA: React.ReactNode; valB: React.ReactNode }) => (
    <div className="rule-b grid grid-cols-3 gap-4 py-3.5">
      <div className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">{label}</div>
      <div className="text-sm text-[var(--ink)]">{valA}</div>
      <div className="text-sm text-[var(--ink)]">{valB}</div>
    </div>
  );

  const lastReviewed = a.dateUpdated > b.dateUpdated ? a.dateUpdated : b.dateUpdated;

  return (
    <>
      <StructuredData data={generateWebPageSchema({
        name: `${a.name} vs ${b.name}: Comparison`,
        description: `Side-by-side comparison of ${a.name} and ${b.name}.`,
        url: `/compare/${slugA}-vs-${slugB}`,
      })} />
      <StructuredData data={faqSchema} />

      <article className="shell pt-8 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Compare', href: '/compare' },
            { label: `${a.name} vs ${b.name}`, href: `/compare/${slugA}-vs-${slugB}` },
          ]}
        />

        {/* Hero / title block */}
        <header className="mt-8 max-w-3xl">
          <p className="folio">№ — Head-to-Head</p>
          <h1 className="display misprint mt-4 text-4xl text-[var(--ink)] md:text-6xl">
            {a.name} <em className="display-it text-[var(--acc-text)]">vs</em> {b.name}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[var(--ink-soft)]">
            Side-by-side comparison: pricing, features, platforms, and our editorial verdict.
          </p>
          <p className="mono mt-6 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
            Last reviewed{' '}
            <time dateTime={lastReviewed}>{formatDate(lastReviewed)}</time>
          </p>
        </header>

        {/* Tool panels — logo / VS / logo */}
        <div className="rule-strong-t mt-12 grid items-stretch gap-0 pt-10 md:grid-cols-[1fr_auto_1fr]">
          {[a, b].map((tool, idx) => {
            const cat = getCategoryBySlug(tool.category);
            return (
              <div key={tool.id} className="border border-[var(--rule)] p-6">
                <div className="flex items-start gap-4">
                  <span className="grid h-14 w-14 flex-shrink-0 place-items-center border border-[var(--rule)] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tool.logo}
                      alt={`${tool.name} logo`}
                      className="h-9 w-9 object-contain"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                      {idx === 0 ? 'Contender A' : 'Contender B'}
                    </p>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="display mt-1 block text-2xl text-[var(--ink)] transition-colors hover:text-[var(--acc-text)]"
                    >
                      {tool.name}
                    </Link>
                    <p className="mono mt-1 text-[10px] uppercase tracking-[0.1em] text-[var(--ink-faint)]">
                      {cat?.name}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)] line-clamp-3">
                  {tool.tagline}
                </p>
                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ink btn-sm mt-5 inline-flex"
                >
                  Visit {tool.name} ↗
                </a>
              </div>
            );
          })}

          {/* VS block — sits between the two panels */}
          <div className="order-first grid place-items-center md:order-none md:-mx-4 md:py-0 py-4">
            <span className="mono grid h-8 w-8 place-items-center bg-[var(--acc)] text-[10px] font-bold text-white">
              VS
            </span>
          </div>
        </div>

        {/* At a glance — ruled comparison ledger */}
        <section className="mt-12">
          <h2 className="kicker">At a glance</h2>
          <div className="mt-6 border border-[var(--rule)] p-6 sm:p-8">
            <div className="rule-strong-t grid grid-cols-3 gap-4 pb-3.5 pt-3.5">
              <div className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]" />
              <div className="display text-base text-[var(--ink)]">{a.name}</div>
              <div className="display text-base text-[var(--ink)]">{b.name}</div>
            </div>
            <ComparisonRow label="Pricing" valA={priceCell(a)} valB={priceCell(b)} />
            <ComparisonRow
              label="Pricing model"
              valA={getPricingLabel(a.pricing)}
              valB={getPricingLabel(b.pricing)}
            />
            <ComparisonRow
              label="Free tier"
              valA={a.pricing.free ? yes : no}
              valB={b.pricing.free ? yes : no}
            />
            <ComparisonRow
              label="Free trial"
              valA={a.pricing.trial ? `${a.pricing.trialDays || 14} days` : no}
              valB={b.pricing.trial ? `${b.pricing.trialDays || 14} days` : no}
            />
            <ComparisonRow label="Platforms" valA={platformCell(a)} valB={platformCell(b)} />
            <ComparisonRow
              label="Editor rating"
              valA={<span className="mono font-semibold text-[var(--ink)]">★ {a.rating.average.toFixed(1)}</span>}
              valB={<span className="mono font-semibold text-[var(--ink)]">★ {b.rating.average.toFixed(1)}</span>}
            />
            <ComparisonRow
              label="Featured"
              valA={a.featured ? yes : no}
              valB={b.featured ? yes : no}
            />
            <ComparisonRow
              label="Last reviewed"
              valA={<time dateTime={a.dateUpdated}>{formatDate(a.dateUpdated)}</time>}
              valB={<time dateTime={b.dateUpdated}>{formatDate(b.dateUpdated)}</time>}
            />
          </div>
        </section>

        {/* Key features */}
        <section className="mt-12">
          <h2 className="kicker">Key features</h2>
          <div className="mt-6 grid gap-0 md:grid-cols-2">
            {[a, b].map((tool) => (
              <div key={tool.id} className="border border-[var(--rule)] p-6">
                <h3 className="display text-lg text-[var(--ink)]">{tool.name}</h3>
                <ul className="mt-3">
                  {tool.features.core.map((feature, i) => (
                    <li
                      key={i}
                      className="rule-b flex items-baseline gap-3 py-2.5 text-sm text-[var(--ink-soft)]"
                    >
                      <span className="mono flex-shrink-0 text-[10px] text-[var(--acc-text)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Verdict — editorial callout */}
        <section className="mt-12">
          <h2 className="kicker">Editor&apos;s verdict</h2>
          <div className="mt-6 border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
            <p className="text-base leading-relaxed text-[var(--ink-soft)]">
              <strong className="text-[var(--acc-text)]">Winner: {verdict.winner.name}.</strong>{' '}
              {verdict.reasoning}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">
              See our{' '}
              <Link href="/methodology" className="u-link text-[var(--acc-text)]">
                editorial methodology
              </Link>{' '}
              for how we score and rank tools.
            </p>
          </div>
        </section>

        {/* Recommended next */}
        <section className="rule-strong-t mt-16 pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="display text-3xl text-[var(--ink)] md:text-4xl">More matchups</h2>
            <span className="mono text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
              Other comparisons
            </span>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURED_COMBOS
              .filter(([x, y]) => (x === slugA || x === slugB || y === slugA || y === slugB) && !(x === slugA && y === slugB))
              .slice(0, 4)
              .map(([x, y]) => {
                const tx = getToolBySlug(x);
                const ty = getToolBySlug(y);
                if (!tx || !ty) return null;
                return (
                  <Link
                    key={`${x}-${y}`}
                    href={`/compare/${x}-vs-${y}`}
                    className="news-plate group flex items-center justify-between px-4 py-4"
                  >
                    <span className="text-sm font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--acc-text)]">
                      {tx.name} vs {ty.name}
                    </span>
                    <span className="mono text-[10px] text-[var(--ink-faint)] transition-colors group-hover:text-[var(--acc-text)]">
                      ↗
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      </article>
    </>
  );
}
