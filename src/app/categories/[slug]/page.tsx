import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/data/categories';
import { getToolsByCategory } from '@/data/tools';
import ToolGrid from '@/components/tools/ToolGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateCategorySchema, generateWebPageSchema } from '@/lib/schema';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = category.seo.metaTitle || `${category.name} - AI Tools`;
  const description = category.seo.metaDescription || category.description;

  return {
    title,
    description,
    keywords: category.seo.keywords,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/categories/${category.slug}`,
      images: [category.image],
      type: 'website',
    },
    twitter: {
      title,
      description,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category.slug);
  const sectionNo = categories.findIndex((c) => c.slug === category.slug) + 1;
  const free = tools.filter((t) => t.pricing.free).length;
  const avg =
    tools.length > 0
      ? (tools.reduce((s, t) => s + t.rating.average, 0) / tools.length).toFixed(1)
      : '—';

  return (
    <>
      <StructuredData data={generateWebPageSchema({
        name: category.seo.metaTitle || `${category.name} - AI Tools`,
        description: category.seo.metaDescription || category.description,
        url: `/categories/${category.slug}`,
      })} />
      <StructuredData data={generateCategorySchema(category, tools)} />

      <div className="shell pt-8 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Sections', href: '/categories' },
            { label: category.name, href: `/categories/${category.slug}` },
          ]}
        />

        {/* Section head — ruled, with marginal data */}
        <header className="mt-8 grid gap-8 md:grid-cols-[1fr_260px]">
          <div>
            <p className="folio">Section {String(sectionNo).padStart(2, '0')}</p>
            <h1 className="display mt-4 text-5xl text-[var(--ink)] md:text-6xl">
              {category.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
              {category.description}
            </p>
          </div>

          <aside className="border-[var(--rule)] md:border-l md:pl-8">
            <dl className="mono text-[11px] uppercase tracking-[0.1em]">
              {[
                ['Entries filed', `${tools.length}`],
                ['Free to start', `${free}`],
                ['Avg. rating', `★ ${avg}`],
              ].map(([k, v]) => (
                <div key={k} className="rule-b flex items-baseline justify-between py-3">
                  <dt className="text-[var(--ink-faint)]">{k}</dt>
                  <dd className="text-lg font-semibold text-[var(--ink)]">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </header>

        {/* Entries */}
        <div className="rule-strong-t mt-12 pt-8">
          <ToolGrid
            tools={tools}
            emptyMessage={`No tools filed under ${category.name} yet.`}
          />
        </div>
      </div>
    </>
  );
}
