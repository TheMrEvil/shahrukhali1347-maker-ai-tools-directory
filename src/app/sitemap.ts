import { MetadataRoute } from 'next';
import { aiTools } from '@/data/tools';
import { categories } from '@/data/categories';
import { guides } from '@/data/guides';
import { blogPosts } from '@/data/blog';
import { SITE_CONFIG } from '@/config/site';

const COMPARE_COMBOS: Array<[string, string]> = [
  ['chatgpt', 'claude'], ['chatgpt', 'gemini'], ['claude', 'gemini'],
  ['chatgpt', 'perplexity'], ['claude', 'deepseek'], ['claude', 'mistral-le-chat'],
  ['chatgpt', 'microsoft-copilot'], ['gemini', 'grok'], ['perplexity', 'phind'],
  ['cursor', 'github-copilot'], ['cursor', 'windsurf'], ['cursor', 'v0'],
  ['v0', 'bolt-new'], ['windsurf', 'aider'], ['github-copilot', 'tabnine'],
  ['github-copilot', 'codeium'], ['cursor', 'devin'],
  ['midjourney', 'dall-e'], ['midjourney', 'stable-diffusion'], ['midjourney', 'flux-ai'],
  ['dall-e', 'leonardo-ai'], ['krea-ai', 'pika'],
  ['jasper', 'copy-ai'], ['grammarly', 'quillbot'], ['notion-ai', 'jasper'],
  ['runway', 'pika'], ['synthesia', 'heygen'],
  ['notion-ai', 'mem'], ['otter-ai', 'fireflies'], ['raycast-ai', 'superhuman'],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;

  // Homepage
  const homepage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  // Comparison pages — high SEO value
  const comparePages: MetadataRoute.Sitemap = COMPARE_COMBOS.map(([a, b]) => ({
    url: `${baseUrl}/compare/${a}-vs-${b}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Secondary pages
  const secondaryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Legal & trust pages
  const legalPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/methodology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/disclosure`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Individual tool pages
  const toolPages: MetadataRoute.Sitemap = aiTools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: new Date(tool.dateUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Blog posts — high SEO/AEO value
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Guide pages
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.dateUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...homepage, ...corePages, ...comparePages, ...secondaryPages, ...legalPages, ...toolPages, ...categoryPages, ...blogPages, ...guidePages];
}
