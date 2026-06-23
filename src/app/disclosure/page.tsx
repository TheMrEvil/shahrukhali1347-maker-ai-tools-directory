import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure | Best AI Tools',
  description: 'Affiliate and sponsorship disclosure for Best AI Tools. How we make money and our commitment to editorial independence.',
  alternates: {
    canonical: '/disclosure',
  },
  openGraph: {
    title: 'Affiliate Disclosure | Best AI Tools',
    description: 'How we make money and our commitment to editorial independence.',
    url: '/disclosure',
    type: 'website',
  },
  twitter: {
    title: 'Affiliate Disclosure | Best AI Tools',
    description: 'How we make money and our commitment to editorial independence.',
  },
};

export default function DisclosurePage() {
  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: 'Affiliate Disclosure — Best AI Tools',
          description: 'Affiliate and sponsorship disclosure. How we make money and our editorial independence.',
          url: '/disclosure',
        })}
      />

      <div className="shell pt-8 pb-24">
        <Breadcrumbs items={[{ label: 'Disclosure', href: '/disclosure' }]} />

        <header className="mt-8 max-w-3xl">
          <p className="folio">№ — Transparency</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            Affiliate <em className="display-it u-wavy text-[var(--acc-text)]">disclosure.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            How we make money — and our commitment to editorial independence.
          </p>
        </header>

        <div className="rule-strong-t mt-12 max-w-3xl space-y-12 pt-10">
          <section>
            <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">Affiliate links</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              Some links on Best AI Tools are affiliate links. If you click an affiliate link and make
              a purchase, we may receive a small commission at no extra cost to you. These commissions
              help us maintain the site and pay our editors.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              <strong className="text-[var(--ink)]">
                Affiliate links never affect our rankings or reviews.
              </strong>{' '}
              A tool&apos;s placement on our directory is determined entirely by our{' '}
              <Link href="/methodology" className="u-link">
                editorial methodology
              </Link>{' '}
              — never by the size of an affiliate payout.
            </p>
          </section>

          <section>
            <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">FTC compliance</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              In compliance with the U.S. Federal Trade Commission&apos;s 16 CFR Part 255 guidelines,
              we disclose any material connection between us and the products or services we recommend.
              This page serves as a standing disclosure across the entire site.
            </p>
          </section>

          <section>
            <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">Sponsored content</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              We do not currently publish sponsored articles or paid placements. If we ever do,
              sponsored content will be:
            </p>
            <ul className="mt-4">
              {[
                'Clearly labeled “Sponsored” in the title and meta tags',
                'Visually distinct from editorial content (different background, badge)',
                'Subject to the same factual standards as our editorial reviews',
              ].map((li) => (
                <li
                  key={li}
                  className="rule-b flex items-baseline gap-3 py-2.5 text-[15px] leading-relaxed text-[var(--ink-soft)]"
                >
                  <span className="mono shrink-0 text-[10px] text-[var(--acc-text)]">—</span>
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Editorial callout — replaces the old amber box */}
          <section className="border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
            <p className="kicker text-[var(--acc-text)]">No paid inclusion</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              Tool makers cannot pay to be listed. They cannot pay to be featured. They cannot pay to
              remove negative reviews. If a tool is on our site, it&apos;s because an editor decided it
              deserves to be there.
            </p>
          </section>

          <section>
            <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">
              Questions or corrections
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              If you spot something that looks like undisclosed sponsorship, or a tool that&apos;s
              ranked unfairly high or low, email{' '}
              <a href="mailto:info@bestaitools4u.com" className="u-link">
                info@bestaitools4u.com
              </a>
              . We treat all complaints seriously.
            </p>
          </section>

          <p className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Last updated · April 28, 2026
          </p>
        </div>
      </div>
    </>
  );
}
