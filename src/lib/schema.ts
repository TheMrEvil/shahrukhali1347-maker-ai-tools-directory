import { SITE_CONFIG } from '@/config/site';
import { AITool, Guide, FAQ, Collection, Category } from '@/types';

export function generateToolSchema(tool: AITool) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE_CONFIG.url}/tools/${tool.slug}/#software`,
    name: tool.name,
    description: tool.description,
    url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
    image: tool.logo,
    screenshot: tool.screenshots,
    applicationCategory: 'BusinessApplication',
    operatingSystem: tool.features.platforms.join(', '),
    isAccessibleForFree: tool.pricing.free,

    offers: tool.pricing.plans.map(plan => ({
      '@type': 'Offer',
      name: plan.name,
      price: plan.price,
      priceCurrency: plan.currency,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      availability: 'https://schema.org/InStock',
      url: tool.website,
    })),

    featureList: tool.features.core.join(', '),
    datePublished: tool.dateAdded,
    dateModified: tool.dateUpdated,

    publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/tools/${tool.slug}/#webpage`,
    },
  };

  if (tool.rating.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tool.rating.average,
      ratingCount: tool.rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export function generateVideoSchema(tool: AITool) {
  if (!tool.demoVideo) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: tool.demoVideo.title,
    description: tool.demoVideo.description,
    thumbnailUrl: tool.demoVideo.thumbnail,
    uploadDate: tool.dateAdded,
    duration: `PT${tool.demoVideo.duration}S`,
    contentUrl: tool.demoVideo.url,
    embedUrl: tool.demoVideo.url,
  };
}

export function generateHowToSchema(guide: Guide) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    image: guide.image,
    totalTime: `PT${guide.duration}M`,
    step: guide.steps.map(step => ({
      '@type': 'HowToStep',
      position: step.number,
      name: step.title,
      text: step.content,
      image: step.image,
    })),
  };
}

export function generateFAQSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateCollectionSchema(collection: Collection, tools: AITool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description,
    url: `${SITE_CONFIG.url}/collections/${collection.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.name,
          url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
          image: tool.logo,
        },
      })),
    },
  };
}

export function generateCategorySchema(category: Category, tools: AITool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${SITE_CONFIG.url}/categories/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, 10).map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.name,
          url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
        },
      })),
    },
  };
}

export function generateBreadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url,
      },
      ...items.map((item, index) => {
        const isLast = index === items.length - 1;
        const listItem: Record<string, unknown> = {
          '@type': 'ListItem',
          position: index + 2,
          name: item.label,
        };
        // Last breadcrumb item should NOT have "item" property (it's the current page)
        if (!isLast) {
          listItem.item = `${SITE_CONFIG.url}${item.href}`;
        }
        return listItem;
      }),
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/tools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.url}/logo.png`,
      width: 200,
      height: 60,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'info@bestaitools4u.com',
      url: `${SITE_CONFIG.url}/contact`,
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
    sameAs: [
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.linkedin,
      SITE_CONFIG.social.youtube,
    ].filter(Boolean),
  };
}

export function generateWebPageSchema(page: {
  name: string;
  description: string;
  url: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_CONFIG.url}${page.url}/#webpage`,
    url: `${SITE_CONFIG.url}${page.url}`,
    name: page.name,
    description: page.description,
    isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
    ...(page.dateModified && { dateModified: page.dateModified }),
  };
}

// Tools listing page schema
export function generateToolsListSchema(tools: AITool[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Tools Directory - Browse All Tools',
    description: `Discover and compare ${tools.length}+ AI tools across categories like chatbots, image generation, coding assistants, and more.`,
    url: `${SITE_CONFIG.url}/tools`,
    isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tools.length,
      itemListElement: tools.slice(0, 20).map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.name,
          description: tool.tagline,
          url: `${SITE_CONFIG.url}/tools/${tool.slug}`,
          image: tool.logo,
          applicationCategory: 'BusinessApplication',
        },
      })),
    },
  };
}

// Blog post schema
export function generateBlogPostSchema(post: {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  slug: string;
  category: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
    datePublished: post.date,
    dateModified: post.date,
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    articleSection: post.category,
  };
}

// Rich Article schema for a long-form blog post (author + modified date + section)
export function generateArticleSchema(post: {
  title: string;
  excerpt: string;
  author: string;
  datePublished: string;
  dateUpdated: string;
  slug: string;
  category: string;
  keywords: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: SITE_CONFIG.url,
    },
    publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
    datePublished: post.datePublished,
    dateModified: post.dateUpdated,
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.keywords.join(', '),
  };
}

// Blog listing page schema
export function generateBlogListSchema(posts: Array<{
  title: string;
  excerpt: string;
  slug: string;
  date: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_CONFIG.name} Blog`,
    description: 'Latest news, reviews, and tutorials about AI tools.',
    url: `${SITE_CONFIG.url}/blog`,
    publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_CONFIG.url}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  };
}

// Collections listing page schema
export function generateCollectionsListSchema(collections: Array<{
  title: string;
  description: string;
  slug: string;
  toolCount: number;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Tool Collections - Curated Lists',
    description: 'Handpicked collections of AI tools organized by use case, industry, and workflow.',
    url: `${SITE_CONFIG.url}/collections`,
    isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collections.length,
      itemListElement: collections.map((collection, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description,
          url: `${SITE_CONFIG.url}/tools?collection=${collection.slug}`,
        },
      })),
    },
  };
}

// Guides listing page schema
export function generateGuidesListSchema(guides: Array<{
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  category: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Guides & Tutorials',
    description: 'Comprehensive guides and tutorials to help you get the most out of AI tools.',
    url: `${SITE_CONFIG.url}/guides`,
    isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: guides.length,
      itemListElement: guides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          name: guide.title,
          description: guide.excerpt,
          url: `${SITE_CONFIG.url}/guides/${guide.slug}`,
          author: {
            '@type': 'Person',
            name: guide.author,
          },
          articleSection: guide.category,
        },
      })),
    },
  };
}

// Categories listing page schema
export function generateCategoriesListSchema(categories: Array<{
  name: string;
  description: string;
  slug: string;
  toolCount: number;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Tool Categories',
    description: 'Explore AI tools organized by use case and industry.',
    url: `${SITE_CONFIG.url}/categories`,
    isPartOf: { '@id': `${SITE_CONFIG.url}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CollectionPage',
          name: category.name,
          description: category.description,
          url: `${SITE_CONFIG.url}/categories/${category.slug}`,
        },
      })),
    },
  };
}

// Local business/contact schema
export function generateContactSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: 'info@bestaitools4u.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@bestaitools4u.com',
      availableLanguage: 'English',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
  };
}
