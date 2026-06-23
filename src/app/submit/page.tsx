'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

interface SubmitFormData {
  name: string;
  website: string;
  tagline: string;
  description: string;
  category: string;
  pricing: string;
  email: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

const fieldClass =
  'w-full border border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-3 text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] focus:border-[var(--acc)]';

export default function SubmitPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<SubmitFormData>({
    name: '',
    website: '',
    tagline: '',
    description: '',
    category: '',
    pricing: '',
    email: '',
  });

  const processFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please upload a PNG, JPG, WebP, or SVG image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be under 5MB.');
      return;
    }

    setError(null);
    setLogoFile(file);

    // Generate preview
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    const preview = URL.createObjectURL(file);
    setLogoPreview(preview);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.name.trim() || !formData.website.trim() || !formData.tagline.trim() ||
        !formData.description.trim() || !formData.category || !formData.pricing || !formData.email.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      const url = new URL(formData.website);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch {
      setError('Please enter a valid website URL (including https://).');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          website: formData.website.trim(),
          tagline: formData.tagline.trim(),
          description: formData.description.trim(),
          category: formData.category,
          pricing: formData.pricing,
          email: formData.email.trim(),
          logoFilename: logoFile?.name || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      website: '',
      tagline: '',
      description: '',
      category: '',
      pricing: '',
      email: '',
    });
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <div className="shell pt-8 pb-20">
      <Breadcrumbs items={[{ label: 'Submit Tool', href: '/submit' }]} />

      <header className="mt-8 max-w-3xl">
        <p className="folio">№ — For The Index</p>
        <h1 className="display misprint mt-4 text-5xl text-[var(--ink)] md:text-7xl">
          Submit your
          <br />
          <em className="display-it u-wavy text-[var(--acc-text)]">AI tool.</em>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]">
          Get your AI tool discovered by thousands of users looking for the perfect solution.
        </p>
      </header>

      {/* Form Section */}
      <div className="mx-auto mt-12 max-w-3xl">
        {isSubmitted ? (
          <div className="border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-6 py-5">
            <p className="kicker text-[var(--acc-text)]">Thank you for your submission</p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
              We&apos;ve received your tool submission. Our team will review it within 2-3 business
              days and email you back with paid listing details and next steps.
            </p>
            <button onClick={resetForm} className="btn-line mt-4">
              Submit another tool
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Paid listings callout */}
            <div className="border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-5 py-4">
              <p className="kicker text-[var(--acc-text)]">Paid listings only</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                We currently accept paid listings only. After you submit the form below, our team
                will review your tool and reply with placement details and next steps within 2-3
                business days.
              </p>
            </div>

            {error && (
              <div className="border-l-2 border-[var(--acc)] bg-[var(--paper-2)] px-5 py-4">
                <p className="text-sm text-[var(--acc-text)]">{error}</p>
              </div>
            )}

            {/* Tool Name */}
            <div>
              <label htmlFor="name" className="kicker mb-2 block">
                Tool Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., My Awesome AI Tool"
                className={fieldClass}
              />
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="website" className="kicker mb-2 block">
                Website URL *
              </label>
              <input
                id="website"
                name="website"
                type="url"
                required
                value={formData.website}
                onChange={handleChange}
                placeholder="https://your-tool.com"
                className={fieldClass}
              />
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="tagline" className="kicker mb-2 block">
                Short Description *
              </label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                required
                maxLength={100}
                value={formData.tagline}
                onChange={handleChange}
                placeholder="A brief tagline for your tool (max 100 characters)"
                className={fieldClass}
              />
            </div>

            {/* Full Description */}
            <div>
              <label htmlFor="description" className="kicker mb-2 block">
                Full Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what your tool does, its key features, and who it's for..."
                className={`${fieldClass} resize-none`}
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="kicker mb-2 block">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="">Select a category</option>
                <option value="chatbots">Chatbots & Assistants</option>
                <option value="image-generation">Image Generation</option>
                <option value="writing">Writing & Content</option>
                <option value="coding">Coding & Development</option>
                <option value="video">Video Generation</option>
                <option value="audio">Audio & Music</option>
                <option value="productivity">Productivity</option>
                <option value="research">Research & Analysis</option>
                <option value="design">Design & Creative</option>
                <option value="marketing">Marketing & SEO</option>
              </select>
            </div>

            {/* Pricing */}
            <div>
              <label htmlFor="pricing" className="kicker mb-2 block">
                Pricing Model *
              </label>
              <select
                id="pricing"
                name="pricing"
                required
                value={formData.pricing}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="">Select pricing model</option>
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="contact">Contact for Pricing</option>
              </select>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="kicker mb-2 block">Logo / Screenshot</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload logo or screenshot"
              />
              {logoPreview && logoFile ? (
                <div className="flex items-center gap-4 border border-[var(--rule-strong)] p-4">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden border border-[var(--rule)] bg-[var(--paper-2)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--ink)]">{logoFile.name}</p>
                    <p className="text-xs text-[var(--ink-faint)]">
                      {(logoFile.size / 1024).toFixed(0)} KB
                    </p>
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="u-link mt-1 text-xs text-[var(--acc-text)]"
                    >
                      Change file
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="flex-shrink-0 border border-[var(--rule)] p-2 text-[var(--ink-soft)] transition-colors hover:border-[var(--acc)] hover:text-[var(--acc-text)]"
                    aria-label="Remove logo"
                  >
                    <X className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={openFilePicker}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openFilePicker();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`cursor-pointer border border-dashed p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-[var(--acc)] bg-[var(--paper-2)]'
                      : 'border-[var(--rule-strong)] hover:border-[var(--acc)]'
                  }`}
                >
                  <Upload className="mx-auto mb-3 h-9 w-9 text-[var(--ink-faint)]" strokeWidth={1.5} />
                  <p className="text-sm text-[var(--ink-soft)]">Drag and drop or click to upload</p>
                  <p className="mt-1 text-xs text-[var(--ink-faint)]">PNG, JPG, WebP, or SVG up to 5MB</p>
                </div>
              )}
              {logoFile && (
                <p className="mt-2 text-xs text-[var(--acc-text)]">
                  Please attach this file to the email that opens when you click Submit
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="kicker mb-2 block">
                Your Email *
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

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="btn-ink w-full justify-center">
              {isLoading ? 'Submitting…' : 'Submit tool for review'}
            </button>

            <p className="text-center text-xs text-[var(--ink-faint)]">
              By submitting, you agree to our terms and confirm that you have the right to list this
              tool. Listings are paid only — we&apos;ll email you with details after reviewing your
              submission.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
