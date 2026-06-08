import { Metadata } from 'next';
import { Suspense } from 'react';
import { aiTools } from '@/data/tools';
import { categories } from '@/data/categories';
import ToolGrid from '@/components/tools/ToolGrid';
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

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-10 pb-20">
        <Breadcrumbs items={[{ label: 'Tools', href: '/tools' }]} />

        <header className="mt-6 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
            Directory
          </span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">
            All AI tools
          </h1>
          <p className="mt-3 text-[var(--fg-soft)]">
            Browse {aiTools.length}+ AI tools across {categories.length} categories. Filter by
            pricing, sort by what you care about — no neon, no noise.
          </p>
        </header>

        <div className="mt-10">
          <Suspense fallback={<ToolGrid tools={[]} isLoading={true} />}>
            <ToolsPageClient
              tools={aiTools}
              categories={categories}
              initialQuery={params.q}
              initialCategory={params.category}
              initialPricing={params.pricing}
              initialSort={params.sort}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
