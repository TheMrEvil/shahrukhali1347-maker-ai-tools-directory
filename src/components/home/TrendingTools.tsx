import { TrendingUp } from 'lucide-react';
import { getTrendingTools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';
import { SectionHead } from './FeaturedTools';

export default function TrendingTools() {
  const trendingTools = getTrendingTools().slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-20">
      <SectionHead
        kicker="Trending"
        title="What's hot this week"
        description="Most-viewed tools across the directory in the last 7 days."
        href="/tools?sort=popular"
        linkLabel="See more"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {trendingTools.map((tool, i) => (
          <div key={tool.id} className={`reveal delay-${(i % 6) + 1} relative`}>
            <span className="absolute -top-2.5 -left-2.5 z-10 grid h-7 w-7 place-items-center rounded-full bg-[var(--fg)] text-white text-xs font-semibold shadow-soft">
              {i + 1}
            </span>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--muted)]">
        <TrendingUp className="h-3.5 w-3.5" />
        Rankings refresh every Monday at 9 AM UTC
      </div>
    </section>
  );
}
