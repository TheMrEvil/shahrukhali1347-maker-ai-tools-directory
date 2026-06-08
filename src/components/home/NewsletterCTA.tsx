'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Mail } from 'lucide-react';

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
    <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-20">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 md:p-14">
        <div className="dot-bg absolute inset-0 opacity-50" />
        <div
          className="blob"
          style={{ right: '-6%', top: '-30%', height: 320, width: 320, background: 'var(--primary-500)' }}
        />
        <div className="relative grid gap-8 md:grid-cols-2">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-strong)]">
              <Mail className="h-3 w-3" />
              Newsletter
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              One AI tool worth your time. Every Friday.
            </h2>
            <p className="mt-3 text-[var(--fg-soft)]">
              A short weekly note with the most interesting AI tool we found that week — no ads, no fluff,
              unsubscribe anytime.
            </p>
            <p className="mt-4 text-xs text-[var(--muted)]">
              Already have a favorite? <Link href="/submit" className="underline">Suggest a tool</Link>.
            </p>
          </div>

          <div className="flex items-center md:justify-end">
            {isSubmitted ? (
              <div className="anim-pop flex items-center gap-3 rounded-2xl border border-[var(--brand)] bg-[var(--brand-soft)] p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand)] text-white">
                  <Check className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-[var(--fg)]">You&apos;re in.</p>
                  <p className="text-sm text-[var(--fg-soft)]">
                    Check your inbox to confirm.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@work.com"
                    required
                    className="flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/30"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-1 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--brand-strong)] disabled:opacity-60"
                  >
                    {isLoading ? 'Subscribing…' : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </div>
                {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
                <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <Check className="h-3 w-3 text-emerald-500" /> No spam. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
