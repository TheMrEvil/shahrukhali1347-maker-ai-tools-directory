import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  GraduationCap,
  ListChecks,
  User,
} from 'lucide-react';
import { guides } from '@/data/guides';
import { getCategoryBySlug } from '@/data/categories';
import { getToolBySlug } from '@/data/tools';
import { getAccent } from '@/lib/accent';
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

const difficultyTint: Record<string, string> = {
  beginner:
    'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300',
  intermediate:
    'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300',
  advanced:
    'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300',
};

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const accent = getAccent(guide.slug);
  const cat = getCategoryBySlug(guide.category);
  const usedTools = guide.tools.map((s) => getToolBySlug(s)).filter(Boolean);
  const relatedGuides = guides.filter((g) => g.slug !== guide.slug).slice(0, 2);

  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: guide.title,
          description: guide.description,
          url: `/guides/${guide.slug}`,
        })}
      />

      {/* Hero — image with brand-tinted overlay */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="relative h-72 sm:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={guide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent.tile}, transparent 40%), linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.2))`,
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-5 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs
              items={[
                { label: 'Guides', href: '/guides' },
                { label: guide.title, href: `/guides/${guide.slug}` },
              ]}
              variant="light"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyTint[guide.difficulty]}`}
              >
                {guide.difficulty}
              </span>
              {cat && (
                <Link
                  href={`/categories/${cat.slug}`}
                  className="rounded-full border border-white/30 bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-black/60"
                >
                  {cat.name}
                </Link>
              )}
            </div>
            <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-white drop-shadow md:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-3 max-w-2xl text-white/85 drop-shadow md:text-lg">
              {guide.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {guide.duration} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-3.5 w-3.5" />
                {guide.steps.length} steps
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {guide.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Updated {formatDate(guide.dateUpdated)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                {guide.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body: steps + sidebar */}
      <article className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="min-w-0">
            <p className="text-lg leading-relaxed text-[var(--fg-soft)]">{guide.content}</p>

            <h2 className="mt-12 flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--fg)]">
              <GraduationCap className="h-6 w-6 text-[var(--brand)]" />
              Step-by-step
            </h2>

            <ol className="mt-6 space-y-4">
              {guide.steps.map((step) => (
                <li
                  key={step.number}
                  className="lift group relative isolate flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
                  style={
                    {
                      '--accent-from': accent.from,
                      '--accent-to': accent.to,
                    } as React.CSSProperties
                  }
                >
                  <span className="accent-bar" aria-hidden="true" />
                  <span
                    className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl text-base font-bold text-white shadow-soft"
                    style={{
                      background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                    }}
                  >
                    {step.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-[var(--fg)] group-hover:text-[var(--brand)] transition">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--fg-soft)]">
                      {step.content}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 rounded-2xl border border-[var(--brand)]/30 bg-[var(--brand-soft)] p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brand)]" />
                <div>
                  <p className="font-semibold text-[var(--fg)]">You made it to the end.</p>
                  <p className="mt-1 text-sm text-[var(--fg-soft)]">
                    Pair this guide with the tools below to put what you learned into practice.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {usedTools.length > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Tools used in this guide
                </p>
                <ul className="space-y-2">
                  {usedTools.map((t) => (
                    <li key={t!.id}>
                      <Link
                        href={`/tools/${t!.slug}`}
                        className="group flex items-center gap-3 rounded-lg p-2 transition hover:bg-[var(--bg-soft)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={t!.logo}
                          alt=""
                          className="h-8 w-8 flex-shrink-0 rounded-md object-contain"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--brand)]">
                            {t!.name}
                          </p>
                          <p className="truncate text-xs text-[var(--muted)]">{t!.tagline}</p>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 flex-shrink-0 text-[var(--muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--brand)]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedGuides.length > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Keep learning
                </p>
                <ul className="space-y-3">
                  {relatedGuides.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/guides/${g.slug}`}
                        className="group block rounded-lg p-1 -m-1"
                      >
                        <p className="text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--brand)]">
                          {g.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                          {g.duration} min · {g.difficulty}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/guides"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All guides
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
