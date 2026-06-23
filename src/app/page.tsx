import { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedTools from '@/components/home/FeaturedTools';
import HomeIndex from '@/components/home/HomeIndex';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import FieldNotes from '@/components/home/FieldNotes';
import NewsletterCTA from '@/components/home/NewsletterCTA';
import StructuredData from '@/components/seo/StructuredData';
import { generateFAQSchema, generateWebPageSchema } from '@/lib/schema';
import { getGeneralFAQs } from '@/data/faqs';

export const metadata: Metadata = {
  title: { absolute: 'Best AI Tools - Discover & Compare the Best AI Tools' },
  description: 'Discover, compare, and choose from 2000+ AI tools across 50+ categories. Find the perfect AI solution with reviews, pricing, and expert guides.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Best AI Tools - Discover & Compare the Best AI Tools',
    description: 'Discover, compare, and choose from 2000+ AI tools across 50+ categories. Find the perfect AI solution with reviews, pricing, and expert guides.',
    url: '/',
    type: 'website',
  },
  twitter: {
    title: 'Best AI Tools - Discover & Compare the Best AI Tools',
    description: 'Discover, compare, and choose from 2000+ AI tools across 50+ categories. Find the perfect AI solution with reviews, pricing, and expert guides.',
  },
};

export default function Home() {
  const faqs = getGeneralFAQs();

  return (
    <>
      {/* WebPage + FAQ Schema for rich results */}
      <StructuredData data={generateWebPageSchema({
        name: 'Best AI Tools - Discover & Compare the Best AI Tools',
        description: 'Discover, compare, and choose from 2000+ AI tools across 50+ categories. Find the perfect AI solution with reviews, pricing, and expert guides.',
        url: '/',
      })} />
      <StructuredData data={generateFAQSchema(faqs)} />

      <HeroSection />
      <FeaturedTools />
      <HomeIndex />
      <CategoriesGrid />
      <FieldNotes />
      <NewsletterCTA />
    </>
  );
}
