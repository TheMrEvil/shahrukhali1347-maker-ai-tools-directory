'use client';

import { useState } from 'react';
import { Mail, Clock, MapPin } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

const faqs = [
  {
    q: 'How do I submit my AI tool?',
    a: 'Visit our Submit Tool page and fill out the form with your tool details. Our team will review it within 2-3 business days.',
  },
  {
    q: 'How are tools reviewed and rated?',
    a: 'Our team tests each tool and considers user feedback, features, pricing, and ease of use to provide comprehensive reviews.',
  },
  {
    q: 'Can I update my tool listing?',
    a: 'Yes! Contact us with your tool name and the updates you\'d like to make, and we\'ll process your request.',
  },
  {
    q: 'Do you offer sponsored listings?',
    a: 'Yes, we offer featured placements for tools. Contact us for partnership opportunities and pricing.',
  },
];

const fieldClass =
  'w-full border border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-3 text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] focus:border-[var(--acc)]';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shell pt-8 pb-20">
      <Breadcrumbs items={[{ label: 'Contact', href: '/contact' }]} />

      <header className="mt-8 max-w-3xl">
        <p className="folio">№ — Get In Touch</p>
        <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
          Questions, notes,
          <br />
          <em className="display-it u-wavy text-[var(--acc-text)]">say hello.</em>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
          Have questions or feedback? We&apos;d love to hear from you. Use the form and we&apos;ll
          get back to you within 24-48 hours.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Contact Form */}
        <div>
          <p className="kicker mb-6 text-[var(--ink-faint)]">Send us a message</p>

          {isSubmitted ? (
            <div className="border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
              <p className="kicker text-[var(--acc-text)]">Message sent</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                Thanks for reaching out. We&apos;ll get back to you within 24-48 hours.
              </p>
              <button onClick={() => setIsSubmitted(false)} className="btn-line mt-4">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-5 py-4">
                  <p className="text-sm text-[var(--acc-text)]">{error}</p>
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="kicker mb-2 block">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="kicker mb-2 block">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="kicker mb-2 block">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={fieldClass}
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="tool">Tool Submission</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="bug">Report a Bug</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="kicker mb-2 block">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button type="submit" disabled={isLoading} className="btn-ink w-full justify-center">
                {isLoading ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>

        {/* Info & FAQ */}
        <aside className="space-y-10">
          {/* Contact Info */}
          <div>
            <p className="kicker mb-4 text-[var(--ink-faint)]">Other ways to reach us</p>
            <dl className="border-t border-[var(--rule)]">
              {[
                { Icon: Mail, label: 'Email', value: 'info@bestaitools4u.com' },
                { Icon: Clock, label: 'Response time', value: 'Within 24-48 hours' },
                { Icon: MapPin, label: 'Location', value: 'San Francisco, CA' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 border-b border-[var(--rule)] py-4">
                  <span className="grid h-9 w-9 flex-shrink-0 place-items-center border border-[var(--rule)] text-[var(--ink)]">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div>
                    <dt className="text-sm font-medium text-[var(--ink)]">{label}</dt>
                    <dd className="text-sm text-[var(--ink-soft)]">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* FAQ */}
          <div>
            <p className="kicker mb-4 text-[var(--ink-faint)]">Frequently asked questions</p>
            <div className="border-t border-[var(--rule)]">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-[var(--rule)] py-4">
                  <h3 className="text-sm font-medium text-[var(--ink)]">{faq.q}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
