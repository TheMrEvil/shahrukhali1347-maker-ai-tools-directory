import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts, getBlogPostBySlug } from '@/data/blog';
import { getToolBySlug } from '@/data/tools';
import { BlogBlock } from '@/types';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import GuideCover from '@/components/guides/GuideCover';
import {
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
} from '@/lib/schema';
import { formatDate } from '@/lib/utils';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.datePublished,
      modifiedTime: post.dateUpdated,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
    },
  };
}

const anchor = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          id={anchor(block.text)}
          className="display mt-12 scroll-mt-28 text-[1.6rem] leading-tight text-[var(--ink)] first:mt-0 md:text-[1.85rem]"
        >
          {block.text}
        </h2>
      );
    case 'p':
      return (
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">{block.text}</p>
      );
    case 'ul':
      return (
        <ul className="mt-4">
          {block.items.map((li, i) => (
            <li
              key={i}
              className="rule-b flex items-baseline gap-3 py-2.5 text-[15px] leading-relaxed text-[var(--ink-soft)]"
            >
              <span className="mono shrink-0 text-[10px] text-[var(--acc-text)]">—</span>
              <span>{li}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="mt-4">
          {block.items.map((li, i) => (
            <li
              key={i}
              className="rule-b flex items-baseline gap-3 py-2.5 text-[15px] leading-relaxed text-[var(--ink-soft)]"
            >
              <span className="mono shrink-0 text-[11px] text-[var(--acc-text)]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{li}</span>
            </li>
          ))}
        </ol>
      );
    case 'callout':
      return (
        <div className="mt-6 border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
          <p className="kicker text-[var(--acc-text)]">{block.label}</p>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">{block.text}</p>
        </div>
      );
    case 'table':
      return (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="rule-b">
                {block.head.map((h, i) => (
                  <th
                    key={i}
                    className="mono whitespace-nowrap py-2.5 pr-4 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="rule-b align-top">
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`py-3 pr-4 ${
                        ci === 0
                          ? 'font-semibold text-[var(--ink)]'
                          : 'text-[var(--ink-soft)]'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const logo = post.toolSlug ? getToolBySlug(post.toolSlug)?.logo : undefined;
  const headings = post.blocks.filter((b) => b.type === 'h2') as Extract<
    BlogBlock,
    { type: 'h2' }
  >[];
  const relatedTools = (post.relatedTools ?? [])
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const crumbs = [
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <StructuredData
        data={generateArticleSchema({
          title: post.title,
          excerpt: post.excerpt,
          author: post.author,
          datePublished: post.datePublished,
          dateUpdated: post.dateUpdated,
          slug: post.slug,
          category: post.category,
          keywords: post.seo.keywords,
        })}
      />
      <StructuredData
        data={generateFAQSchema(
          post.faqs.map((f, i) => ({
            id: `${post.slug}-faq-${i}`,
            question: f.question,
            answer: f.answer,
          })),
        )}
      />
      <StructuredData data={generateBreadcrumbSchema(crumbs)} />

      <article className="shell pt-8 pb-24">
        <Breadcrumbs items={crumbs} />

        <header className="mt-8 max-w-3xl">
          <p className="folio">{post.category}</p>
          <h1 className="display misprint mt-4 text-4xl text-[var(--ink)] md:text-6xl">
            {post.title}
          </h1>
          <p className="mono mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            <span className="text-[var(--ink-soft)]">{post.author}</span>
            <span>·</span>
            <span>Updated {formatDate(post.dateUpdated)}</span>
            <span>·</span>
            <span>{post.readMinutes} min read</span>
          </p>
        </header>

        {/* Branded cover */}
        <div className="mt-8 max-w-3xl border border-[var(--rule)]">
          <GuideCover
            title={post.title}
            no={blogPosts.findIndex((p) => p.slug === post.slug) + 1}
            kicker={post.category}
            logo={logo}
            iconName={post.coverIcon}
            section="The Blog"
            size="lead"
          />
        </div>

        {/* Answer-first box (AEO) */}
        <div className="mt-8 max-w-3xl border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
          <p className="kicker text-[var(--acc-text)]">The short answer</p>
          <p className="serif mt-2 text-lg leading-relaxed text-[var(--ink)]">{post.tldr}</p>
        </div>

        {/* Body + TOC */}
        <div className="rule-strong-t mt-10 grid gap-12 pt-10 lg:grid-cols-[1fr_220px]">
          <div className="min-w-0 max-w-2xl">
            {post.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="kicker">On this page</p>
              <ol className="mt-3 space-y-2.5">
                {headings.map((h) => (
                  <li key={h.text}>
                    <a
                      href={`#${anchor(h.text)}`}
                      className="u-link mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-soft)]"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>

              {relatedTools.length > 0 && (
                <>
                  <p className="kicker mt-8">Tools mentioned</p>
                  <ul className="mt-3 space-y-px">
                    {relatedTools.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/tools/${t.slug}`}
                          className="row-invert -mx-2 flex items-center gap-2.5 px-2 py-2"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center border border-[var(--rule)] bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={t.logo} alt="" className="h-4 w-4 object-contain" />
                          </span>
                          <span className="serif text-sm text-[var(--ink)]">{t.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
        </div>

        {/* FAQ — matches FAQPage schema above */}
        {post.faqs.length > 0 && (
          <section className="rule-strong-t mt-16 max-w-2xl pt-10">
            <h2 className="display text-3xl text-[var(--ink)] md:text-4xl">Frequently asked</h2>
            <dl className="mt-6">
              {post.faqs.map((f, i) => (
                <div key={i} className="rule-b py-5">
                  <dt className="serif text-lg text-[var(--ink)]">{f.question}</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                    {f.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Related comparisons */}
        {post.relatedCompare && post.relatedCompare.length > 0 && (
          <section className="mt-12 max-w-2xl">
            <p className="kicker">Compare head-to-head</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {post.relatedCompare.map((c) => (
                <Link key={c} href={`/compare/${c}`} className="btn-line btn-sm">
                  {c.replace(/-vs-/g, ' vs ').replace(/-/g, ' ')} ↗
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Closing CTA */}
        <div className="mt-12 max-w-2xl border-t border-[var(--rule)] pt-8">
          <Link href="/tools" className="btn-ink">
            Browse the full index ↗
          </Link>
        </div>
      </article>
    </>
  );
}
