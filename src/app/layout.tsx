import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono, Fraunces } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StructuredData from '@/components/seo/StructuredData';
import SearchPalette from '@/components/SearchPalette';
import RevealOnScroll from '@/components/RevealOnScroll';
import { generateWebsiteSchema, generateOrganizationSchema } from '@/lib/schema';
import { SITE_CONFIG } from '@/config/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  // SOFT + WONK are Fraunces' retro display axes — WONK enables the
  // wonky old-style alternates used on display sizes.
  axes: ['SOFT', 'WONK', 'opsz'],
});

const defaultDescription = 'Discover, compare, and choose from 2000+ AI tools across 50+ categories. Find the perfect AI solution with detailed reviews and guides.';

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} - Discover the Best AI Tools`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: defaultDescription,
  keywords: ['AI tools', 'artificial intelligence', 'machine learning', 'ChatGPT', 'Midjourney', 'AI directory', 'AI software', 'best AI tools'],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  metadataBase: new URL(SITE_CONFIG.url),
  // NOTE: No root canonical here — each page sets its own via alternates.canonical
  // to avoid Next.js rendering duplicate <link rel="canonical"> tags
  // openGraph.images and twitter.images come from src/app/opengraph-image.tsx + twitter-image.tsx convention files
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - Discover the Best AI Tools`,
    description: defaultDescription,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bestaitools4u',
    creator: '@bestaitools4u',
    title: `${SITE_CONFIG.name} - Discover the Best AI Tools`,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'theme-color': '#131210',
    'apple-mobile-web-app-title': SITE_CONFIG.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
        <StructuredData data={generateWebsiteSchema()} />
        <StructuredData data={generateOrganizationSchema()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-[var(--bg)]`}
      >
        <ThemeProvider>
          <div className="progress-flag" aria-hidden="true" />
          <Header />
          <main>{children}</main>
          <Footer />
          <SearchPalette />
          <RevealOnScroll />
        </ThemeProvider>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.analytics.googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${SITE_CONFIG.analytics.googleAnalyticsId}');
          `}
        </Script>
      </body>
    </html>
  );
}
