// Tool Types
export interface AITool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  fullDescription: string;
  logo: string;
  screenshots: string[];
  website: string;

  // Categorization
  category: string;
  subcategories: string[];
  tags: string[];
  useCases: string[];

  // Pricing
  pricing: {
    model: 'free' | 'freemium' | 'subscription' | 'one-time' | 'usage-based';
    free: boolean;
    trial: boolean;
    trialDays?: number;
    plans: PricingPlan[];
  };

  // Features
  features: {
    core: string[];
    advanced?: string[];
    integrations: string[];
    platforms: ('web' | 'ios' | 'android' | 'desktop' | 'api')[];
  };

  // Reviews & Ratings
  rating: {
    average: number;
    count: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  reviews: Review[];

  // SEO Data
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
    ogImage?: string;
  };

  // Metadata
  verified: boolean;
  featured: boolean;
  trending: boolean;
  dateAdded: string;
  dateUpdated: string;

  // Analytics
  visits: number;
  bookmarks: number;

  // Alternatives
  alternatives?: string[];

  // Video
  demoVideo?: {
    url: string;
    thumbnail: string;
    duration: number;
    title: string;
    description: string;
  };
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  popular?: boolean;
}

export interface Review {
  id: string;
  toolId: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  date: string;
  helpful: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  parent?: string;
  children?: string[];
  toolCount: number;
  popular: boolean;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tools: string[];
  author: string;
  dateCreated: string;
  dateUpdated: string;
  featured: boolean;
  tags: string[];
}

export interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: string;
  tools: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  steps: GuideStep[];
  datePublished: string;
  dateUpdated: string;
  author: string;
  views: number;
}

export interface GuideStep {
  number: number;
  title: string;
  content: string;
  image?: string;
  video?: string;
  code?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  toolId?: string;
}

// Blog — AEO-first article model. Body is a block list so the template can
// render answer-first prose, tables, and lists from structured data.
export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; label: string; text: string }
  | { type: 'table'; head: string[]; rows: string[][] };

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  tldr: string; // answer-first summary box (AEO)
  category: string; // display label, e.g. "Comparison"
  tags: string[];
  toolSlug?: string; // related tool (sidebar, related links)
  coverIcon?: string; // distinct watermark icon key for the branded cover
  relatedTools?: string[]; // tool slugs
  relatedCompare?: string[]; // compare slugs, e.g. "chatgpt-vs-claude"
  author: string;
  datePublished: string;
  dateUpdated: string;
  readMinutes: number;
  blocks: BlogBlock[];
  faqs: BlogFAQ[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface SearchFilters {
  query?: string;
  categories?: string[];
  pricing?: ('free' | 'freemium' | 'paid')[];
  features?: string[];
  platforms?: string[];
  rating?: number;
  sortBy?: 'popular' | 'newest' | 'rating' | 'name';
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  social: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    plausibleDomain?: string;
  };
  stats: {
    toolsCount: number;
    categoriesCount: number;
    reviewsCount: number;
    usersCount: number;
  };
}
