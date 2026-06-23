import { Metadata } from 'next';
import { aiTools } from '@/data/tools';
import { categories } from '@/data/categories';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateToolsListSchema, generateWebPageSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/config/site';
import ToolsPageClient from './ToolsPageClient';

export const metadata: Metadata = {
  title: 'AI Tools Directory - Browse 2000+ Tools',
  description: `Explore our complete directory of ${SITE_CONFIG.stats.toolsCount}+ AI tools. Filter by category, pricing, and features to find the perfect AI solution for your needs.`,
  keywords: ['AI tools', 'artificial intelligence', 'machine learning', 'AI software', 'AI directory'],
  alternates: { canonical: '/tools' },
  openGraph: {
    title: 'AI Tools Directory - Browse 2000+ Tools',
    description: `Explore our directory of ${SITE_CONFIG.stats.toolsCount}+ AI tools.`,
    url: '/tools',
    type: 'website',
  },
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: string; sort?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: 'AI Tools Directory - Browse 2000+ Tools',
          description: `Explore our complete directory of ${SITE_CONFIG.stats.toolsCount}+ AI tools.`,
          url: '/tools',
        })}
      />
      <StructuredData data={generateToolsListSchema(aiTools)} />

      <div className="shell pt-8 pb-20">
        <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }]} />

        <header className="mt-8 max-w-3xl">
          <p className="folio">№ 002 — The Full Index</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            Every entry,
            <br />
            on <em className="display-it u-wavy text-[var(--acc-text)]">one page.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            All {aiTools.length} tools across {categories.length} sections. Filter as you type,
            steer with the keyboard, and read each entry in the dock without leaving the list.
          </p>
        </header>

        <div className="mt-10">
          <ToolsPageClient
            tools={aiTools}
            categories={categories}
            initialQuery={params.q}
            initialCategory={params.category}
            initialPricing={params.pricing}
            initialSort={params.sort}
          />
        </div>
      </div>
    </>
  );
}
