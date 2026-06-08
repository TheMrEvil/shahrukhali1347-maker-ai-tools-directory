import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedTools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';

export default function FeaturedTools() {
  const featuredTools = getFeaturedTools().slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-20">
      <SectionHead
        kicker="Editor's choice"
        title="Featured AI tools"
        description="Hand-picked tools our editors find genuinely useful. Updated weekly."
        href="/tools?featured=true"
        linkLabel="See all featured"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featuredTools.map((tool, i) => (
          <div key={tool.id} className={`reveal delay-${(i % 6) + 1}`}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SectionHead({
  kicker,
  title,
  description,
  href,
  linkLabel,
}: {
  kicker: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
          {kicker}
        </span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--fg)] md:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-[var(--fg-soft)]">{description}</p>
      </div>
      <Link
        href={href}
        className="under inline-flex items-center gap-1 text-sm font-medium text-[var(--brand)]"
      >
        {linkLabel} <ArrowRight className="h-4 w-4 nudge" />
      </Link>
    </div>
  );
}
