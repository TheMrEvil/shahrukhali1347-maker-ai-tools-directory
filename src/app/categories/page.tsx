import { Metadata } from 'next';
import { categories } from '@/data/categories';
import CategoryCard from '@/components/categories/CategoryCard';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateCategoriesListSchema, generateWebPageSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'AI Tool Categories - Browse by Use Case',
  description: `Explore ${SITE_CONFIG.stats.categoriesCount}+ categories of AI tools. Find tools for chatbots, image generation, code assistance, content creation, and more.`,
  alternates: {
    canonical: '/categories',
  },
  openGraph: {
    title: 'AI Tool Categories - Browse by Use Case',
    description: `Explore ${SITE_CONFIG.stats.categoriesCount}+ categories of AI tools including chatbots, image generation, coding, and content creation.`,
    url: '/categories',
    type: 'website',
  },
  twitter: {
    title: 'AI Tool Categories - Browse by Use Case',
    description: `Explore ${SITE_CONFIG.stats.categoriesCount}+ categories of AI tools including chatbots, image generation, coding, and content creation.`,
  },
};

export default function CategoriesPage() {
  const total = categories.reduce((sum, c) => sum + c.toolCount, 0);

  return (
    <>
      <StructuredData data={generateWebPageSchema({
        name: 'AI Tool Categories - Browse by Use Case',
        description: `Explore ${SITE_CONFIG.stats.categoriesCount}+ categories of AI tools. Find tools for chatbots, image generation, code assistance, content creation, and more.`,
        url: '/categories',
      })} />
      <StructuredData data={generateCategoriesListSchema(categories.map(c => ({
        name: c.name,
        description: c.description,
        slug: c.slug,
        toolCount: c.toolCount,
      })))} />

      <div className="mx-auto max-w-6xl px-5 pt-8 pb-20 lg:px-8">
        <Breadcrumbs items={[{ label: 'Sections', href: '/categories' }]} />

        {/* Newspaper nameplate — this section gets a centered masthead */}
        <header className="mt-8">
          <div className="mono flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-[var(--rule)] pb-2 text-[9px] uppercase tracking-[0.18em] text-[var(--ink-faint)]">
            <span>Best AI Tools · The Index</span>
            <span className="text-[var(--acc-text)]">Table of Sections</span>
            <span>
              {categories.length} departments · {total} entries
            </span>
          </div>

          <div className="nameplate px-4 py-9 md:py-12">
            <p className="folio">№ 003</p>
            <h1 className="display misprint mt-2 text-[2.75rem] leading-[0.9] text-[var(--ink)] sm:text-6xl md:text-[6.5rem]">
              The Directory
            </h1>
            <div className="ornament mx-auto mt-5 max-w-lg">
              <span className="mono whitespace-nowrap text-[10px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                Every department, filed
              </span>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-[var(--ink-soft)]">
            {categories.length} sections, {total} filed entries. Every tool lives in exactly one
            section — pick the one closest to the job at hand.
          </p>
        </header>

        {/* Sections as newspaper clippings */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
      </div>
    </>
  );
}
