'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * THE FRIDAY DISPATCH — inverted ink block, typeset like a subscription
 * card bound into a magazine.
 */
export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Subscription failed');
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="shell pt-20">
      {/* Inverted block: ink ground, paper type — swaps cleanly across themes */}
      <div className="reveal relative overflow-hidden bg-[var(--ink)] px-7 py-12 text-[var(--paper)] md:px-14 md:py-16">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--acc)]" aria-hidden="true" />
        {/* Halftone screen along the bottom edge, like a press test strip */}
        <div
          className="absolute inset-x-0 bottom-0 h-12"
          style={{
            backgroundImage: 'radial-gradient(var(--paper) 1px, transparent 1.5px)',
            backgroundSize: '7px 7px',
            opacity: 0.25,
            maskImage: 'linear-gradient(to top, black, transparent)',
          }}
          aria-hidden="true"
        />

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.18em] opacity-60">
              The Friday Dispatch — weekly, free
            </p>
            <h2 className="display mt-4 text-4xl md:text-6xl">
              One tool worth
              <br />
              your time. <em className="display-it u-wavy text-[var(--acc)]">Weekly.</em>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed opacity-70">
              A short note on the single most interesting AI tool we found that week — what it
              does, what it costs, and whether it earns a place in your stack. No ads, ever.
            </p>
          </div>

          <div>
            {isSubmitted ? (
              <div className="border border-[var(--acc)] p-5">
                <p className="serif text-2xl italic">You’re on the list.</p>
                <p className="mono mt-2 text-[11px] uppercase tracking-[0.12em] opacity-60">
                  Check your inbox to confirm — first dispatch Friday.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="dispatch-email"
                  className="mono block text-[10px] uppercase tracking-[0.16em] opacity-60"
                >
                  Your address
                </label>
                <div className="mt-2 flex items-center gap-4 border-b-2 border-[var(--paper)] pb-2 focus-within:border-[var(--acc)]">
                  <input
                    id="dispatch-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@work.com"
                    required
                    className="serif w-full bg-transparent text-xl italic outline-none placeholder:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mono whitespace-nowrap bg-[var(--acc)] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? 'Filing…' : 'Subscribe'}
                  </button>
                </div>
                {error && (
                  <p className="mono mt-3 text-[11px] uppercase tracking-[0.1em] text-[var(--acc)]">
                    {error}
                  </p>
                )}
                <p className="mono mt-3 text-[10px] uppercase tracking-[0.12em] opacity-50">
                  No spam · unsubscribe anytime ·{' '}
                  <Link href="/submit" className="underline underline-offset-2">
                    or suggest a tool
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
