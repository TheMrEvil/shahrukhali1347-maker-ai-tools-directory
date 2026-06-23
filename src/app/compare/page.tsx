import { Metadata } from 'next';
import Link from 'next/link';
import { getToolBySlug } from '@/data/tools';
import { getPricingLabel } from '@/lib/utils';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Compare AI Tools — Side-by-Side Comparisons | Best AI Tools',
  description:
    'Compare popular AI tools side-by-side: pricing, features, platforms, and our editorial verdict on which to pick. ChatGPT vs Claude, Cursor vs v0, Midjourney vs DALL-E, and 30+ more.',
  alternates: { canonical: '/compare' },
  openGraph: {
    title: 'Compare AI Tools — Side-by-Side Comparisons | Best AI Tools',
    description: 'Compare popular AI tools side-by-side.',
    url: '/compare',
    type: 'website',
  },
};

const COMBOS_BY_CATEGORY: Record<string, Array<[string, string]>> = {
  Chatbots: [
    ['chatgpt', 'claude'],
    ['chatgpt', 'gemini'],
    ['claude', 'gemini'],
    ['chatgpt', 'perplexity'],
    ['claude', 'deepseek'],
    ['claude', 'mistral-le-chat'],
    ['chatgpt', 'microsoft-copilot'],
    ['gemini', 'grok'],
    ['perplexity', 'phind'],
  ],
  'Code Assistance': [
    ['cursor', 'github-copilot'],
    ['cursor', 'windsurf'],
    ['cursor', 'v0'],
    ['v0', 'bolt-new'],
    ['windsurf', 'aider'],
    ['github-copilot', 'tabnine'],
    ['github-copilot', 'codeium'],
    ['cursor', 'devin'],
  ],
  'Image Generation': [
    ['midjourney', 'dall-e'],
    ['midjourney', 'stable-diffusion'],
    ['midjourney', 'flux-ai'],
    ['dall-e', 'leonardo-ai'],
    ['krea-ai', 'pika'],
  ],
  'Writing & Content': [
    ['jasper', 'copy-ai'],
    ['grammarly', 'quillbot'],
    ['notion-ai', 'jasper'],
  ],
  Video: [
    ['runway', 'pika'],
    ['synthesia', 'heygen'],
  ],
  Productivity: [
    ['notion-ai', 'mem'],
    ['otter-ai', 'fireflies'],
    ['raycast-ai', 'superhuman'],
  ],
};

export default function CompareIndexPage() {
  const totalCombos = Object.values(COMBOS_BY_CATEGORY).reduce((n, c) => n + c.length, 0);
  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: 'Compare AI Tools — Side-by-Side Comparisons',
          description: 'Compare popular AI tools side-by-side.',
          url: '/compare',
        })}
      />

      <div className="shell pt-8 pb-20">
        <Breadcrumbs items={[{ label: 'Compare', href: '/compare' }]} />

        {/* Editorial hero — matches the index pages */}
        <header className="mt-8 max-w-3xl">
          <p className="folio">№ 004 — Head-to-Head</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            Pick the
            <br />
            <em className="display-it u-wavy text-[var(--acc-text)]">better tool.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            {totalCombos} side-by-side matchups — pricing, features, platforms, and our editor&apos;s
            verdict on which one earns the slot. Pick a contest below.
          </p>
        </header>

        {/* Matchups, grouped by section */}
        <div className="mt-14 space-y-16">
          {Object.entries(COMBOS_BY_CATEGORY).map(([categoryName, combos]) => (
            <section key={categoryName}>
              {/* Section subhead — newspaper rule + folio count */}
              <div className="rule-strong-t flex items-baseline justify-between gap-4 pt-4">
                <h2 className="display text-[1.9rem] leading-none text-[var(--ink)] md:text-4xl">
                  {categoryName}
                </h2>
                <span className="mono whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                  {combos.length} matchup{combos.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {combos.map(([a, b]) => {
                  const ta = getToolBySlug(a);
                  const tb = getToolBySlug(b);
                  if (!ta || !tb) return null;
                  return <CompareCard key={`${a}-${b}`} a={ta} b={tb} />;
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

function CompareCard({
  a,
  b,
}: {
  a: NonNullable<ReturnType<typeof getToolBySlug>>;
  b: NonNullable<ReturnType<typeof getToolBySlug>>;
}) {
  return (
    <Link
      href={`/compare/${a.slug}-vs-${b.slug}`}
      className="news-plate group flex h-full flex-col"
      aria-label={`Compare ${a.name} versus ${b.name}`}
    >
      {/* Dateline band */}
      <div className="mono flex items-center justify-between border-b border-[var(--rule)] px-4 py-2 text-[9px] uppercase tracking-[0.18em]">
        <span className="font-semibold text-[var(--acc-text)]">Head-to-head</span>
        <span className="text-[var(--ink-faint)]">The verdict ↗</span>
      </div>

      {/* Plate: logo — VS — logo */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 pt-6 pb-4">
        <div className="flex justify-center">
          <ToolLogo tool={a} />
        </div>
        <span
          className="mono grid h-7 w-7 shrink-0 place-items-center bg-[var(--acc)] text-[9px] font-bold tracking-wider text-white"
          aria-hidden="true"
        >
          VS
        </span>
        <div className="flex justify-center">
          <ToolLogo tool={b} />
        </div>
      </div>

      {/* Names + line readings */}
      <div className="grid grid-cols-2 items-start gap-3 px-4 pb-5">
        <ToolHead tool={a} />
        <ToolHead tool={b} align="right" />
      </div>

      {/* Ruled footer with invert CTA */}
      <div className="rule-t mono mt-auto flex items-stretch text-[10px] uppercase tracking-[0.12em]">
        <span className="flex items-center px-4 py-3 text-[var(--ink-soft)]">
          Compare side-by-side
        </span>
        <span className="ml-auto flex items-center border-l border-[var(--rule)] px-4 py-3 text-[var(--acc-text)] transition-colors group-hover:bg-[var(--ink)] group-hover:text-[var(--paper)]">
          Open ↗
        </span>
      </div>
    </Link>
  );
}

function ToolLogo({ tool }: { tool: NonNullable<ReturnType<typeof getToolBySlug>> }) {
  return (
    <span className="grid h-12 w-12 place-items-center border border-[var(--rule)] bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tool.logo}
        alt={`${tool.name} logo`}
        className="h-7 w-7 object-contain"
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

function ToolHead({
  tool,
  align = 'left',
}: {
  tool: NonNullable<ReturnType<typeof getToolBySlug>>;
  align?: 'left' | 'right';
}) {
  const right = align === 'right';
  return (
    <div className={right ? 'text-right' : 'text-left'}>
      <p
        className={`serif truncate text-[1.05rem] leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--acc-text)]`}
      >
        {tool.name}
      </p>
      <p
        className={`mono mt-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)] ${
          right ? 'justify-end' : ''
        }`}
      >
        <span className="text-[var(--ink)]">★ {tool.rating.average.toFixed(1)}</span>
        <span>·</span>
        <span>{getPricingLabel(tool.pricing)}</span>
      </p>
    </div>
  );
}
