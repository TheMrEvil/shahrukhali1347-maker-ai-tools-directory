import { Metadata } from 'next';
import { Sparkles, Target, Users, Zap } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateOrganizationSchema, generateWebPageSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'About Best AI Tools — Our Mission & Story',
  description: `Best AI Tools helps you discover, compare, and choose from 2100+ AI tools across 55+ categories. Learn about our mission and unbiased review process.`,
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Best AI Tools — Our Mission & Story',
    description: `Best AI Tools helps individuals and teams discover, compare, and choose from 2000+ AI tools across 50+ categories with honest, unbiased reviews.`,
    url: '/about',
    type: 'website',
  },
  twitter: {
    title: 'About Best AI Tools — Our Mission & Story',
    description: `Best AI Tools helps individuals and teams discover, compare, and choose from 2000+ AI tools across 50+ categories with honest, unbiased reviews.`,
  },
};

const features = [
  {
    icon: Sparkles,
    title: 'Comprehensive Directory',
    description: `We curate and maintain a directory of ${SITE_CONFIG.stats.toolsCount}+ AI tools across ${SITE_CONFIG.stats.categoriesCount}+ categories.`,
  },
  {
    icon: Target,
    title: 'Unbiased Reviews',
    description: 'Our reviews are honest, detailed, and designed to help you make informed decisions.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'User reviews and ratings help surface the best tools for specific use cases.',
  },
  {
    icon: Zap,
    title: 'Always Updated',
    description: 'We continuously add new tools and update existing entries to keep information current.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Organization + WebPage schema for rich results */}
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateWebPageSchema({
        name: 'About Best AI Tools — Our Mission & Story',
        description: 'Best AI Tools helps individuals and teams discover, compare, and choose from 2000+ AI tools across 50+ categories.',
        url: '/about',
      })} />

      <div className="shell pt-8 pb-20">
        <Breadcrumbs items={[{ label: 'About', href: '/about' }]} />

        {/* Editorial hero */}
        <header className="mt-8 max-w-3xl">
          <p className="folio">№ — Our Mission &amp; Story</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            About
            <br />
            <em className="display-it u-wavy text-[var(--acc-text)]">{SITE_CONFIG.name}.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            Your trusted guide to discovering, comparing, and choosing the best AI tools
            for your needs.
          </p>
        </header>

        {/* Mission */}
        <section className="rule-strong-t mt-12 pt-10">
          <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">
            Our Mission
          </h2>
          <div className="mt-6 max-w-2xl space-y-4">
            <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
              The AI landscape is evolving rapidly, with new tools launching every day.
              Our mission is to help individuals, teams, and businesses navigate this
              exciting but overwhelming space.
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
              We believe everyone should have access to the transformative power of AI.
              By providing comprehensive, unbiased information about AI tools, we help
              you find the perfect solutions for your unique needs and budget.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="rule-strong-t mt-12 pt-10">
          <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">
            What we stand for
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="border border-[var(--rule)] bg-[var(--paper)] p-6"
                >
                  <span className="grid h-11 w-11 place-items-center border border-[var(--rule)] text-[var(--ink)]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="display mt-4 text-[1.2rem] text-[var(--ink)]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="rule-strong-t mt-12 pt-10">
          <div className="relative overflow-hidden bg-[var(--ink)] px-8 py-12 text-center text-[var(--paper)]">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--acc)]" aria-hidden="true" />
            <h2 className="display text-[1.6rem] text-[var(--paper)] md:text-[1.9rem]">
              Have a tool to share?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--paper)]/80">
              Help others discover great AI tools by submitting your favorite tools to our directory.
            </p>
            <a
              href="/submit"
              className="mono mt-6 inline-flex bg-[var(--acc)] px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Submit a Tool ↗
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
