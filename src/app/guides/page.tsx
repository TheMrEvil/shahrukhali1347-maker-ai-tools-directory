import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Clock, GraduationCap, Sparkles } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';
import { guides } from '@/data/guides';
import { getCategoryBySlug } from '@/data/categories';
import { getAccent } from '@/lib/accent';

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

const difficultyTint: Record<string, string> = {
  beginner:
    'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300',
  intermediate:
    'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300',
  advanced:
    'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300',
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

      {/* Clean hero — consistent with other index pages */}
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
          <Breadcrumbs items={[{ label: 'Guides', href: '/guides' }]} />
          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--fg-soft)] shadow-soft">
              <GraduationCap className="h-3 w-3 text-[var(--brand)]" />
              {guides.length} hands-on guide{guides.length === 1 ? '' : 's'}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-[var(--fg)] md:text-5xl">
              Learn the AI tools you actually use
            </h1>
            <p className="mt-3 max-w-2xl text-[var(--fg-soft)] md:text-lg">
              Step-by-step walkthroughs from real workflows — no fluff, no clickbait, no “10 ways
              to…” lists.
            </p>
          </div>
        </div>
      </section>

      {/* Guide cards */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => {
            const accent = getAccent(g.slug);
            const cat = getCategoryBySlug(g.category);
            const tintClass = difficultyTint[g.difficulty] ?? difficultyTint.beginner;
            return (
              <Link
                key={g.id}
                href={`/guides/${g.slug}`}
                className="lift group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                style={
                  {
                    '--accent-from': accent.from,
                    '--accent-to': accent.to,
                  } as React.CSSProperties
                }
              >
                <span className="accent-bar" aria-hidden="true" />

                {/* Image header with brand-tinted overlay */}
                <div className="relative h-40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${accent.tile}, transparent 50%), linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%)`,
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tintClass}`}
                    >
                      {g.difficulty}
                    </span>
                    {cat && (
                      <span className="rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                        {cat.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
                    {g.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--fg-soft)]">{g.description}</p>

                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-[var(--muted)]">
                      <Clock className="h-3.5 w-3.5" />
                      {g.duration} min · {g.steps.length} steps
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] p-8 text-center">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-strong)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-[var(--fg)]">
            More guides are in the pipeline.
          </p>
          <p className="max-w-md text-xs text-[var(--fg-soft)]">
            We publish one new guide every other Friday. Subscribe to the newsletter if you want a
            ping when each one lands.
          </p>
          <Link
            href="/tools"
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--brand-strong)]"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Browse all tools
          </Link>
        </div>
      </div>
    </>
  );
}
