import Link from 'next/link';
import { Sparkles, Mail, Twitter, Linkedin, Youtube } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

const footerLinks = {
  product: [
    { label: 'All Tools', href: '/tools' },
    { label: 'Categories', href: '/categories' },
    { label: 'Collections', href: '/collections' },
    { label: 'Guides', href: '/guides' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Submit Tool', href: '/submit' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Methodology', href: '/methodology' },
    { label: 'Disclosure', href: '/disclosure' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-soft)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--brand)] text-white">
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Best<span className="text-[var(--brand)]">AI</span>Tools
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-[var(--fg-soft)] leading-relaxed">
              A curated directory of {SITE_CONFIG.stats.toolsCount.toLocaleString()}+ AI tools.
              We review every tool before listing — no pay-to-play, no ranking tricks.
            </p>
            <a
              href="mailto:info@bestaitools4u.com"
              className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--fg-soft)] hover:text-[var(--brand)] transition"
            >
              <Mail className="h-3.5 w-3.5" />
              info@bestaitools4u.com
            </a>
            <div className="mt-5 flex items-center gap-2">
              {[
                { Icon: Twitter, href: SITE_CONFIG.social.twitter ?? '#' },
                { Icon: Linkedin, href: SITE_CONFIG.social.linkedin ?? '#' },
                { Icon: Youtube, href: SITE_CONFIG.social.youtube ?? '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label="social"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg-soft)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {(['product', 'company', 'legal'] as const).map((group) => (
            <div key={group}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {group}
              </h3>
              <ul className="space-y-2.5">
                {footerLinks[group].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--fg-soft)] transition hover:text-[var(--brand)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
