import { SiteConfig } from '@/types';

export const SITE_CONFIG: SiteConfig = {
  name: "Best AI Tools",
  description: "Discover, compare, and choose from 2000+ AI tools across 50+ categories. Find the perfect AI solution for your needs with detailed reviews, comparisons, and implementation guides.",
  url: "https://bestaitools4u.com",
  ogImage: "https://bestaitools4u.com/og-image.jpg",
  social: {
    twitter: "https://twitter.com/bestaitools4u",
    linkedin: "https://linkedin.com/company/bestaitools4u",
    youtube: "https://youtube.com/@bestaitools4u",
  },
  analytics: {
    googleAnalyticsId: "G-06ZHNQ8FG8",
  },
  stats: {
    toolsCount: 2100,
    categoriesCount: 55,
    reviewsCount: 18000,
    usersCount: 125000,
  },
};

export interface NavChild {
  label: string;
  href: string;
}
export interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "Tools", href: "/tools" },
  { label: "Categories", href: "/categories" },
  { label: "Collections", href: "/collections" },
  {
    label: "Resources",
    href: "/blog",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Compare", href: "/compare" },
      { label: "Guides", href: "/guides" },
      { label: "Contact", href: "/contact" },
    ],
  },
  { label: "Submit", href: "/submit" },
];

export const FEATURED_CATEGORIES = [
  "chatbots",
  "image-generation",
  "content-creation",
  "code-assistance",
  "video-generation",
  "productivity",
];

export const PRICING_FILTERS = [
  { label: "Free", value: "free" },
  { label: "Freemium", value: "freemium" },
  { label: "Paid", value: "paid" },
];

export const PLATFORM_FILTERS = [
  { label: "Web", value: "web" },
  { label: "iOS", value: "ios" },
  { label: "Android", value: "android" },
  { label: "Desktop", value: "desktop" },
  { label: "API", value: "api" },
];

export const RATING_FILTERS = [
  { label: "4+ Stars", value: 4 },
  { label: "3+ Stars", value: 3 },
  { label: "2+ Stars", value: 2 },
];

export const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Highest Rated", value: "rating" },
  { label: "Name A-Z", value: "name" },
];
