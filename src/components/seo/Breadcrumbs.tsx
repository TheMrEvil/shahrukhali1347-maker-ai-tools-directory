import Link from 'next/link';
import StructuredData from './StructuredData';
import { generateBreadcrumbSchema } from '@/lib/schema';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: 'default' | 'light';
}

/** Mono path line: INDEX / TOOLS / CHATGPT */
export default function Breadcrumbs({ items, variant = 'default' }: BreadcrumbsProps) {
  const base =
    variant === 'light' ? 'text-white/70' : 'text-[var(--ink-faint)]';
  const hover =
    variant === 'light' ? 'hover:text-white' : 'hover:text-[var(--acc-text)]';

  return (
    <>
      <StructuredData data={generateBreadcrumbSchema(items)} />
      <nav
        aria-label="Breadcrumb"
        className={`mono flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.14em] ${base}`}
      >
        <Link href="/" className={`transition-colors ${hover}`}>
          Index
        </Link>
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {i === items.length - 1 ? (
              <span
                aria-current="page"
                className={variant === 'light' ? 'text-white' : 'text-[var(--ink)]'}
              >
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className={`transition-colors ${hover}`}>
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
