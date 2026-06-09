import Link from 'next/link';
import {
  ArrowRight,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Code,
  Video,
  Music,
  Zap,
  Search,
  Palette,
  TrendingUp,
  BarChart3,
  Headphones,
  GraduationCap,
  DollarSign,
  Heart,
} from 'lucide-react';
import { Category } from '@/types';
import { getAccent } from '@/lib/accent';

const iconMap: Record<string, React.ElementType> = {
  MessageSquare,
  Image: ImageIcon,
  FileText,
  Code,
  Video,
  Music,
  Zap,
  Search,
  Palette,
  TrendingUp,
  BarChart3,
  Headphones,
  GraduationCap,
  DollarSign,
  Heart,
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] ?? Zap;
  const accent = getAccent(category.slug);
  const accentStyle = {
    '--accent-from': accent.from,
    '--accent-to': accent.to,
  } as React.CSSProperties;

  return (
    <Link
      href={`/categories/${category.slug}`}
      style={accentStyle}
      className="group lift relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
    >
      <span className="accent-bar" aria-hidden="true" />
      <span className="corner-glow" aria-hidden="true" />

      {/* Tinted header — matches ToolCard so all cards share one visual language */}
      <div
        className="relative flex items-center justify-between p-5 pb-3"
        style={{
          background: `linear-gradient(135deg, ${accent.tile}, transparent 70%)`,
        }}
      >
        <span className="dot-bg absolute inset-0 opacity-30" aria-hidden="true" />
        <div
          className="relative grid h-14 w-14 place-items-center rounded-xl text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
          style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
        >
          <Icon className="wobble h-6 w-6" strokeWidth={2} />
        </div>
        <span className="relative rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-semibold text-[var(--fg-soft)] shadow-soft transition group-hover:border-transparent group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand-strong)]">
          {category.toolCount} tools
        </span>
      </div>

      {/* Body */}
      <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-2">
        <h3 className="text-lg font-semibold tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
          {category.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-[var(--fg-soft)]">
          {category.description}
        </p>

        <div className="mt-auto inline-flex items-center gap-1 border-t border-[var(--border)] pt-3 text-sm font-medium text-[var(--brand)]">
          Browse <ArrowRight className="h-3.5 w-3.5 nudge" />
        </div>
      </div>
    </Link>
  );
}
