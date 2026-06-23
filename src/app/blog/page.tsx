import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema, generateBlogListSchema } from '@/lib/schema';
import { blogPosts } from '@/data/blog';
import { getToolBySlug } from '@/data/tools';
import GuideCover from '@/components/guides/GuideCover';

export const metadata: Metadata = {
  title: 'The Blog — AI Tool Reviews & Comparisons | Best AI Tools',
  description:
    'Hands-on AI tool comparisons, roundups, and plain-English explainers — ChatGPT vs Claude vs Gemini, the best free AI tools, AI agents explained, and more.',
  keywords: ['AI blog', 'AI tool comparisons', 'best AI tools', 'AI reviews', 'AI guides'],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'The Blog — AI Tool Reviews & Comparisons | Best AI Tools',
    description: 'Hands-on AI tool comparisons, roundups, and plain-English explainers.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    title: 'The Blog — AI Tool Reviews & Comparisons | Best AI Tools',
    description: 'Hands-on AI tool comparisons, roundups, and plain-English explainers.',
  },
};

export default function BlogPage() {
  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: 'The Blog — Best AI Tools',
          description: 'Hands-on AI tool comparisons, roundups, and explainers.',
          url: '/blog',
        })}
      />
      <StructuredData
        data={generateBlogListSchema(
          blogPosts.map((p) => ({
            title: p.title,
            excerpt: p.excerpt,
            slug: p.slug,
            date: p.datePublished,
          })),
        )}
      />

      <div className="shell pt-8 pb-20">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />

        <header className="mt-8 max-w-3xl">
          <p className="folio">№ — From the Desk</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            The <em className="display-it u-wavy text-[var(--acc-text)]">blog.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            Hands-on comparisons, honest roundups, and plain-English explainers on the AI tools that
            actually ship — answer-first, sources shown, no clickbait.
          </p>
        </header>

        <div className="rule-strong-t mt-12 grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => {
            const logo = post.toolSlug ? getToolBySlug(post.toolSlug)?.logo : undefined;
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="news-plate group flex h-full flex-col"
              >
                <GuideCover
                  title={post.title}
                  no={i + 1}
                  kicker={post.category}
                  logo={logo}
                  iconName={post.coverIcon}
                  section="The Blog"
                />
                <div className="flex flex-1 flex-col p-5">
                  <p className="line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {post.excerpt}
                  </p>
                  <div className="rule-t mono mt-5 flex items-center justify-between gap-2 pt-3 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                    <span>
                      <span className="text-[var(--acc-text)]">{post.category}</span> ·{' '}
                      {post.readMinutes} min
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
      </div>
    </>
  );
}
