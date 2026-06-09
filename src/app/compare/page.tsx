import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, GitCompare, Star } from 'lucide-react';
import { getToolBySlug } from '@/data/tools';
import { getAccent } from '@/lib/accent';
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

      {/* Clean hero — same pattern as the redesigned home */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="blob anim-drift"
          style={{
            left: '-6%',
            top: '-30%',
            height: 360,
            width: 360,
            background: 'var(--primary-500)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
          <Breadcrumbs items={[{ label: 'Compare', href: '/compare' }]} />
          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--fg-soft)] shadow-soft">
              <GitCompare className="h-3 w-3 text-[var(--brand)]" />
              {totalCombos} side-by-side comparisons
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-[var(--fg)] md:text-5xl">
              Compare AI tools
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--fg-soft)] md:text-lg">
              Pricing, features, platforms, and our editor&apos;s verdict on which tool to pick.
              Pick a matchup below.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison cards */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14">
        {Object.entries(COMBOS_BY_CATEGORY).map(([categoryName, combos]) => (
          <section key={categoryName} className="mb-12 last:mb-0">
            <div className="mb-5 flex items-baseline justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
                {categoryName}
              </h2>
              <span className="text-xs font-medium text-[var(--muted)]">
                {combos.length} matchup{combos.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}

function CompareCard({
  a,
  b,
}: {
  a: ReturnType<typeof getToolBySlug>;
  b: ReturnType<typeof getToolBySlug>;
}) {
  if (!a || !b) return null;
  const accentA = getAccent(a.name);
  const accentB = getAccent(b.name);
  return (
    <Link
      href={`/compare/${a.slug}-vs-${b.slug}`}
      className="lift group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition"
      aria-label={`Compare ${a.name} versus ${b.name}`}
    >
      {/* Subtle accent gradient — single brand sweep, not two pastel halves */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-60"
        style={{
          background: `radial-gradient(closest-side at 0% 100%, ${accentA.tile}, transparent 65%), radial-gradient(closest-side at 100% 100%, ${accentB.tile}, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* Logo row */}
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 pt-6 pb-3">
        <div className="flex justify-end">
          <ToolHeadLogo tool={a} accent={accentA} />
        </div>
        <div className="relative">
          {/* Connector line */}
          <span
            className="absolute left-1/2 top-1/2 h-px w-12 -translate-x-1/2 -translate-y-1/2 bg-[var(--border)]"
            aria-hidden="true"
          />
          <span
            className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--brand)] text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--brand)]/30 transition-transform group-hover:scale-110"
            aria-hidden="true"
          >
            vs
          </span>
        </div>
        <div className="flex justify-start">
          <ToolHeadLogo tool={b} accent={accentB} />
        </div>
      </div>

      {/* Names + ratings */}
      <div className="relative grid grid-cols-2 items-start gap-4 px-5 pb-5">
        <div className="text-center sm:text-left">
          <p className="truncate text-sm font-semibold text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
            {a.name}
          </p>
          <ToolMiniStat tool={a} />
        </div>
        <div className="text-center sm:text-right">
          <p className="truncate text-sm font-semibold text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
            {b.name}
          </p>
          <ToolMiniStat tool={b} align="right" />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] bg-[var(--bg-soft)] px-5 py-3 text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[var(--brand)]">
          <GitCompare className="h-3 w-3" />
          Compare side-by-side
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]" />
      </div>
    </Link>
  );
}

function ToolHeadLogo({
  tool,
  accent,
}: {
  tool: NonNullable<ReturnType<typeof getToolBySlug>>;
  accent: ReturnType<typeof getAccent>;
}) {
  return (
    <div
      className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border bg-[var(--surface)] shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
      style={{ borderColor: accent.ring }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tool.logo}
        alt={`${tool.name} logo`}
        className="h-9 w-9 object-contain"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ToolMiniStat({
  tool,
  align = 'left',
}: {
  tool: NonNullable<ReturnType<typeof getToolBySlug>>;
  align?: 'left' | 'right';
}) {
  const pricing = getPricingLabel(tool.pricing);
  const pricingTint =
    pricing === 'Free'
      ? 'text-emerald-600 dark:text-emerald-400'
      : pricing === 'Freemium'
      ? 'text-sky-600 dark:text-sky-400'
      : 'text-amber-600 dark:text-amber-400';
  return (
    <div
      className={`mt-1 flex items-center gap-1 text-[11px] ${
        align === 'right' ? 'justify-end' : ''
      }`}
    >
      <Star className="h-3 w-3 fill-[var(--accent)] text-[var(--accent)]" />
      <span className="font-semibold text-[var(--fg)]">{tool.rating.average.toFixed(1)}</span>
      <span className="text-[var(--muted)]">·</span>
      <span className={`font-semibold ${pricingTint}`}>{pricing}</span>
    </div>
  );
}
