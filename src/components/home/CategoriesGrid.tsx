import { categories } from '@/data/categories';
import CategoryCard from '@/components/categories/CategoryCard';
import { SectionHead } from './FeaturedTools';

export default function CategoriesGrid() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-20">
      <SectionHead
        kicker="Browse"
        title="Explore by category"
        description={`${categories.length}+ focused categories — pick the one closest to your use case.`}
        href="/categories"
        linkLabel="All categories"
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.slice(0, 12).map((category, i) => (
          <div key={category.id} className={`reveal delay-${(i % 6) + 1}`}>
            <CategoryCard category={category} />
          </div>
        ))}
      </div>
    </section>
  );
}
