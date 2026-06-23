import { Metadata } from 'next';
import { CheckCircle, ScrollText, Users, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'How We Review AI Tools — Editorial Methodology | Best AI Tools',
  description: 'Our editorial methodology for evaluating, scoring, and updating AI tool listings. Independence policy, conflict-of-interest disclosures, and how we keep listings accurate.',
  alternates: {
    canonical: '/methodology',
  },
  openGraph: {
    title: 'Editorial Methodology | Best AI Tools',
    description: 'How we review, score, and update AI tools. Our independence and conflict-of-interest policy.',
    url: '/methodology',
    type: 'website',
  },
  twitter: {
    title: 'Editorial Methodology | Best AI Tools',
    description: 'How we review, score, and update AI tools. Our independence and conflict-of-interest policy.',
  },
};

const evaluationCriteria = [
  {
    icon: CheckCircle,
    title: 'Functionality',
    weight: '25%',
    desc: 'Does the tool deliver what it promises? We test core features against real-world tasks.',
  },
  {
    icon: Users,
    title: 'Usability',
    weight: '20%',
    desc: 'Onboarding time, documentation quality, learning curve for non-experts.',
  },
  {
    icon: ScrollText,
    title: 'Pricing transparency',
    weight: '20%',
    desc: 'Clear pricing pages, fair free tiers, no hidden enterprise gating on advertised features.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust signals',
    weight: '15%',
    desc: 'Privacy policy, data handling, security certifications, company longevity.',
  },
  {
    icon: RefreshCw,
    title: 'Update cadence',
    weight: '10%',
    desc: 'How often does the team ship? Stale tools drop in our rankings automatically.',
  },
  {
    icon: AlertCircle,
    title: 'Real-world fit',
    weight: '10%',
    desc: 'Whether the tool solves a problem better than free or open-source alternatives.',
  },
];

const independencePoints = [
  'Tool makers cannot pay for inclusion. Every listing is editorial.',
  'Featured placement is determined by our scoring rubric, not by sponsorships.',
];

export default function MethodologyPage() {
  return (
    <>
      <StructuredData data={generateWebPageSchema({
        name: 'Editorial Methodology — Best AI Tools',
        description: 'How we evaluate and review AI tools, our editorial independence policy, and conflict-of-interest disclosures.',
        url: '/methodology',
      })} />

      <div className="shell pt-8 pb-24">
        <Breadcrumbs items={[{ label: 'Methodology', href: '/methodology' }]} />

        {/* Editorial hero */}
        <header className="mt-8 max-w-3xl">
          <p className="folio">№ — Editorial Independence</p>
          <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
            How we review
            <br />
            <em className="display-it u-wavy text-[var(--acc-text)]">AI tools.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
            Our editorial methodology, scoring rubric, and independence policy. Best AI Tools
            is a curated directory — every tool listed has been reviewed by an editor before it
            appears on the site. We do not auto-import listings from press releases or data feeds.
          </p>
        </header>

        {/* Scoring dimensions */}
        <section className="rule-strong-t mt-12 pt-10">
          <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">
            Six dimensions, weighted
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-soft)]">
            Tools are scored 1–5 across six dimensions. Aggregate scores determine featured status
            and category rankings.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {evaluationCriteria.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  className="border border-[var(--rule)] bg-[var(--paper)] p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center border border-[var(--rule)] text-[var(--ink)]">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <div className="flex-1">
                      <div className="mb-1 flex items-baseline justify-between gap-2">
                        <h3 className="display text-[1.15rem] text-[var(--ink)]">{c.title}</h3>
                        <span className="mono text-xs text-[var(--acc-text)]">{c.weight}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{c.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Editorial independence */}
        <section className="rule-strong-t mt-12 pt-10">
          <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">
            Editorial independence
          </h2>
          <ul className="mt-6 max-w-2xl">
            {independencePoints.map((point) => (
              <li
                key={point}
                className="rule-b flex items-baseline gap-3 py-3 text-[15px] leading-relaxed text-[var(--ink-soft)]"
              >
                <span className="mono shrink-0 text-[10px] text-[var(--acc-text)]">—</span>
                <span>{point}</span>
              </li>
            ))}
            <li className="rule-b flex items-baseline gap-3 py-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              <span className="mono shrink-0 text-[10px] text-[var(--acc-text)]">—</span>
              <span>
                When we use affiliate links, they&apos;re marked and disclosed on our{' '}
                <a href="/disclosure" className="u-link">Disclosure page</a>. Affiliate status
                never affects ranking.
              </span>
            </li>
            <li className="rule-b flex items-baseline gap-3 py-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              <span className="mono shrink-0 text-[10px] text-[var(--acc-text)]">—</span>
              <span>
                Sponsored content, if we ever publish it, will be visually distinct and labeled
                &quot;Sponsored&quot; in the title.
              </span>
            </li>
          </ul>
        </section>

        {/* Keeping listings current */}
        <section className="rule-strong-t mt-12 pt-10">
          <h2 className="display text-[1.6rem] text-[var(--ink)] md:text-[1.9rem]">
            How we keep listings current
          </h2>
          <div className="mt-6 max-w-2xl space-y-6">
            <div>
              <h3 className="kicker">Quarterly re-review</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                Every featured tool is re-checked at least once per quarter. The &quot;Last
                reviewed&quot; date on each tool page is honest — that&apos;s the actual date an
                editor verified the tool&apos;s pricing, features, and availability.
              </p>
            </div>
            <div>
              <h3 className="kicker">Reader-flagged corrections</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                If you spot outdated info, email{' '}
                <a href="mailto:info@bestaitools4u.com" className="u-link">info@bestaitools4u.com</a>.
                Corrections are typically published within 48 hours.
              </p>
            </div>
            <div>
              <h3 className="kicker">Discontinuation policy</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                Tools that shut down, get acquired, or stop shipping updates for &gt;6 months are
                flagged or removed. We don&apos;t leave dead listings to inflate counts.
              </p>
            </div>
          </div>
        </section>

        {/* Submit a tool — callout */}
        <section className="rule-strong-t mt-12 pt-10">
          <div className="max-w-2xl border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
            <p className="kicker text-[var(--acc-text)]">Submit a tool</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              Anyone can submit a tool for review at <a href="/submit" className="u-link">/submit</a>.
              Submission does not guarantee inclusion. Tools must pass our scoring rubric to be
              listed. We respond to every submission within 5 business days regardless of outcome.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
