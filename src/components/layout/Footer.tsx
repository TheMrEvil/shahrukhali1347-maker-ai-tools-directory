import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';
import { aiTools } from '@/data/tools';

const footerLinks = {
  Index: [
    { label: 'All tools', href: '/tools' },
    { label: 'Categories', href: '/categories' },
    { label: 'Head-to-head', href: '/compare' },
    { label: 'Collections', href: '/collections' },
    { label: 'Field notes', href: '/guides' },
  ],
  Masthead: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Submit a tool', href: '/submit' },
    { label: 'Contact', href: '/contact' },
  ],
  Record: [
    { label: 'Methodology', href: '/methodology' },
    { label: 'Disclosure', href: '/disclosure' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="rule-strong-t mt-24 bg-[var(--paper)]">
      <div className="shell">
        {/* Sign-off */}
        <div className="rule-b grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="folio">№ 999 — Colophon</p>
            <h2 className="display misprint mt-4 text-4xl text-[var(--ink)] md:text-6xl">
              Choose tools like
              <br />
              <em className="display-it u-wavy text-[var(--acc-text)]">you mean it.</em>
            </h2>
          </div>
          <Link href="/tools" className="btn-ink self-end">
            Open the index ↗
          </Link>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="serif text-xl font-semibold text-[var(--ink)]">Best AI Tools</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--ink-soft)]">
              An independent index of {aiTools.length}+ AI tools. Every entry is reviewed by an
              editor before publication — no affiliate ranking, no exceptions.
            </p>
            <a
              href="mailto:info@bestaitools4u.com"
              className="u-link mono mt-5 inline-block text-xs uppercase tracking-[0.12em] text-[var(--ink-soft)]"
            >
              info@bestaitools4u.com
            </a>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p className="kicker">{heading}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--acc-text)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Colophon line */}
        <div className="ornament text-sm" aria-hidden="true">
          ※ ❦ ※
        </div>
        <div className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between">
          <p className="mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            © {year} {SITE_CONFIG.name} — set in Fraunces &amp; Geist Mono
          </p>
          <p className="mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            <span className="live-dot" />
            All systems operational
          </p>
        </div>
      </div>
      <div className="flag" aria-hidden="true" />
    </footer>
  );
}
