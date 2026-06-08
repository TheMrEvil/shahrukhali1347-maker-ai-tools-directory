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
      className="group lift relative isolate flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <span className="accent-bar" aria-hidden="true" />
      <span className="corner-glow" aria-hidden="true" />

      <div className="relative z-10 flex items-center justify-between">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-soft transition-transform duration-300 group-hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
        >
          <Icon className="wobble h-5 w-5" strokeWidth={2} />
        </div>
        <span className="rounded-full bg-[var(--bg-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--fg-soft)] transition group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand-strong)]">
          {category.toolCount} tools
        </span>
      </div>

      <h3 className="relative z-10 mt-4 text-lg font-semibold tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
        {category.name}
      </h3>
      <p className="relative z-10 mt-1.5 line-clamp-3 text-sm text-[var(--fg-soft)]">
        {category.description}
      </p>

      <div className="relative z-10 mt-4 inline-flex items-center gap-1 border-t border-[var(--border)] pt-4 text-sm font-medium text-[var(--brand)]">
        Browse <ArrowRight className="h-3.5 w-3.5 nudge" />
      </div>
    </Link>
  );
}
