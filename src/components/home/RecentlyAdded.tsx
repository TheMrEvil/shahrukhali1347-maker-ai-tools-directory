import { getRecentTools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';
import { SectionHead } from './FeaturedTools';

export default function RecentlyAdded() {
  const recentTools = getRecentTools(8);

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-20">
      <SectionHead
        kicker="Fresh"
        title="Recently added"
        description="The newest tools to hit the directory — straight off the bench."
        href="/tools?sort=newest"
        linkLabel="View all new"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recentTools.map((tool, i) => (
          <div key={tool.id} className={`reveal delay-${(i % 6) + 1}`}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </section>
  );
}
