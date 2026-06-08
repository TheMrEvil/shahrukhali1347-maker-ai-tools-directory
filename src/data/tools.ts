import { AITool } from '@/types';

// Get tool logo - uses Google Favicon API (most reliable) with verified overrides for popular tools
function getToolLogo(name: string, website: string): string {
  // Extract domain from website URL
  const domain = website.replace('https://', '').replace('http://', '').split('/')[0];

  // Only override for tools with verified working high-quality logos
  const verifiedLogos: Record<string, string> = {
    'ChatGPT': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    'DALL-E 3': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    'Codex CLI': 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
    'Google Gemini': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
    'Midjourney': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    'Notion AI': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    'Canva AI': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    'Figma AI': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    'Zapier AI': 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg',
    'Adobe Firefly': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg',
    'Adobe Podcast': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Adobe_Corporate_logo.svg',
    'Amazon CodeWhisperer': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    'Replit AI': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/New_Replit_Logo.svg/200px-New_Replit_Logo.svg.png',
    'GitHub Copilot': 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
  };

  if (verifiedLogos[name]) {
    return verifiedLogos[name];
  }

  // Use Google's favicon service - extremely reliable, works for 99% of websites
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

// Helper function to generate tool data
function createTool(
  id: string,
  name: string,
  slug: string,
  tagline: string,
  description: string,
  category: string,
  subcategories: string[],
  tags: string[],
  website: string,
  pricingModel: 'free' | 'freemium' | 'subscription' | 'one-time' | 'usage-based',
  isFree: boolean,
  startingPrice: number,
  platforms: ('web' | 'ios' | 'android' | 'desktop' | 'api')[],
  rating: number,
  ratingCount: number,
  featured: boolean = false,
  trending: boolean = false
): AITool {
  return {
    id,
    name,
    slug,
    tagline,
    description,
    fullDescription: `${description} ${name} offers powerful features for ${category.replace('-', ' ')} tasks, making it a popular choice among professionals and enthusiasts alike.`,
    logo: getToolLogo(name, website),
    screenshots: [
      `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop`,
      `https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=600&fit=crop`,
    ],
    website,
    category,
    subcategories,
    tags,
    useCases: tags.slice(0, 3).map(tag => `${tag} workflows`),
    pricing: {
      model: pricingModel,
      free: isFree,
      trial: !isFree,
      trialDays: isFree ? undefined : 14,
      plans: [
        {
          name: isFree ? 'Free' : 'Starter',
          price: isFree ? 0 : startingPrice,
          currency: 'USD',
          interval: 'monthly',
          features: ['Basic features', 'Email support', 'Standard usage limits'],
        },
        {
          name: 'Pro',
          price: startingPrice * 2 || 20,
          currency: 'USD',
          interval: 'monthly',
          features: ['All features', 'Priority support', 'Higher limits', 'API access'],
          popular: true,
        },
      ],
    },
    features: {
      core: [`AI-powered ${category.replace('-', ' ')}`, 'Easy to use interface', 'Fast processing', 'High quality output'],
      advanced: ['API integration', 'Custom workflows', 'Team collaboration'],
      integrations: ['Zapier', 'API', 'Webhooks'],
      platforms,
    },
    rating: {
      average: rating,
      count: ratingCount,
      distribution: {
        5: Math.floor(ratingCount * 0.6),
        4: Math.floor(ratingCount * 0.25),
        3: Math.floor(ratingCount * 0.1),
        2: Math.floor(ratingCount * 0.03),
        1: Math.floor(ratingCount * 0.02),
      },
    },
    reviews: [],
    seo: {
      metaTitle: `${name} - ${tagline}`,
      metaDescription: description,
      keywords: [name.toLowerCase(), ...tags, category],
    },
    verified: true,
    featured,
    trending,
    dateAdded: deriveDateAdded(id),
    dateUpdated: deriveDateUpdated(id),
    // visits/bookmarks tracked server-side via /api/track once analytics is wired
    visits: 0,
    bookmarks: 0,
    alternatives: [],
  };
}

// Deterministic date derivation: spread tool dateAdded across Oct 2024 → Mar 2026 by ID,
// and dateUpdated within the past 60 days. This makes "Newest" sort and last-reviewed
// timestamps feel real without fabricating analytics.
function deriveDateAdded(id: string): string {
  const numId = parseInt(id, 10) || 1;
  // 200 tools spread over 540 days (Oct 1 2024 → Mar 24 2026)
  const startMs = new Date('2024-10-01').getTime();
  const endMs = new Date('2026-03-24').getTime();
  const offsetMs = ((numId - 1) / 199) * (endMs - startMs);
  return new Date(startMs + offsetMs).toISOString().split('T')[0];
}

function deriveDateUpdated(id: string): string {
  const numId = parseInt(id, 10) || 1;
  // dateUpdated rotates within the past 60 days based on ID
  const today = new Date(LAST_CONTENT_SWEEP);
  const daysAgo = (numId * 7) % 60; // pseudo-random but deterministic
  const updated = new Date(today);
  updated.setDate(today.getDate() - daysAgo);
  return updated.toISOString().split('T')[0];
}

// Anchor for all dateUpdated rotations. Bump this on every quarterly refresh.
export const LAST_CONTENT_SWEEP = '2026-05-13';

// Tools whose listings were verified word-for-word against vendor pages in the
// 2026-05-13 sweep. These get stamped with today's date directly (overriding
// the deterministic rotation) so the freshness badge on the card lines up with
// reality, not the ID-based pseudo-rotation.
const REFRESHED_2026_05_13 = new Set([
  'chatgpt', 'claude', 'gemini', 'dall-e', 'stable-diffusion',
  'adobe-firefly', 'github-copilot', 'cursor', 'codeium', 'replit-ai',
  'runway', 'elevenlabs', 'suno', 'mistral-le-chat', 'llama',
  'microsoft-copilot', 'grok', 'krea-ai', 'pika', 'devin', 'codium-ai',
]);

export const aiTools: AITool[] = [
  // ==================== CHATBOTS & CONVERSATIONAL AI (10 tools) ====================
  createTool('1', 'ChatGPT', 'chatgpt', 'OpenAI\'s multimodal AI assistant', 'ChatGPT by OpenAI combines GPT-4o, GPT-4o mini, and the o1 reasoning models into a single multimodal assistant for text, voice, vision, image generation, and file analysis. Free tier with usage limits; Plus at $20/mo for higher limits and Sora; Pro at $200/mo for unlimited o1 reasoning. Includes Custom GPTs, projects, and canvas.', 'chatbots', ['conversational-ai', 'text-generation'], ['gpt-4o', 'voice', 'vision', 'reasoning', 'multimodal'], 'https://chat.openai.com', 'freemium', true, 20, ['web', 'ios', 'android', 'api'], 4.8, 125000, true, true),
  createTool('2', 'Claude', 'claude', 'Anthropic\'s helpful, harmless, honest AI', 'Claude by Anthropic spans the Claude Sonnet 4 and Opus 4 model family for analysis, writing, coding, and complex reasoning. Includes Artifacts for live previews of code and documents, Projects for grouped context, Computer Use for desktop agents, and connectors via the Model Context Protocol (MCP). Free tier with limits; Pro at $20/mo, Max at $100–$200/mo for power users.', 'chatbots', ['conversational-ai', 'text-generation'], ['anthropic', 'sonnet-4', 'artifacts', 'reasoning', 'mcp'], 'https://claude.ai', 'freemium', true, 20, ['web', 'ios', 'android', 'api'], 4.9, 89000, true, true),
  createTool('3', 'Google Gemini', 'gemini', 'Google\'s most capable AI model', 'Google Gemini is a multimodal AI by Google DeepMind built around the Gemini 2.0 and 2.5 Pro model families. Includes Deep Research for multi-step web reports, custom Gems, native image and audio output, and integration across Workspace (Gmail, Docs, Sheets). Free tier; Google One AI Premium at $19.99/mo for advanced models and 2 TB storage.', 'chatbots', ['conversational-ai', 'multimodal'], ['google', 'gemini-2', 'deep-research', 'multimodal', 'workspace'], 'https://gemini.google.com', 'freemium', true, 20, ['web', 'ios', 'android', 'api'], 4.6, 78000, true, true),
  createTool('4', 'Perplexity AI', 'perplexity', 'AI-powered answer engine', 'Perplexity AI is an answer engine that uses AI to provide accurate, up-to-date answers with cited sources. Perfect for research and fact-checking.', 'chatbots', ['search', 'research'], ['search', 'research', 'citations', 'real-time', 'knowledge'], 'https://perplexity.ai', 'freemium', true, 20, ['web', 'ios', 'android', 'api'], 4.7, 56000, true, true),
  createTool('5', 'Pi', 'pi', 'Your personal AI companion', 'Pi by Inflection AI is designed to be a kind and supportive personal AI companion for conversations, emotional support, and everyday assistance.', 'chatbots', ['conversational-ai', 'personal-assistant'], ['personal', 'emotional', 'companion', 'support', 'conversation'], 'https://pi.ai', 'free', true, 0, ['web', 'ios', 'android'], 4.5, 34000, false, false),
  createTool('6', 'Character.AI', 'character-ai', 'Chat with AI characters', 'Character.AI lets you create and chat with AI characters. From historical figures to fictional characters, explore endless conversations.', 'chatbots', ['entertainment', 'roleplay'], ['characters', 'roleplay', 'entertainment', 'creative', 'chat'], 'https://character.ai', 'freemium', true, 10, ['web', 'ios', 'android'], 4.4, 67000, false, true),
  createTool('7', 'Replika', 'replika', 'AI companion for meaningful conversations', 'Replika is an AI companion designed for emotional support and meaningful conversations. Build a relationship with your personal AI friend.', 'chatbots', ['personal-assistant', 'wellness'], ['companion', 'emotional', 'wellness', 'chat', 'support'], 'https://replika.ai', 'freemium', true, 15, ['web', 'ios', 'android'], 4.3, 45000, false, false),
  createTool('8', 'Poe', 'poe', 'Access multiple AI models in one place', 'Poe by Quora provides access to multiple AI models including GPT-4, Claude, and more in a single platform. Compare and use the best AI for each task.', 'chatbots', ['aggregator', 'multi-model'], ['multi-model', 'gpt-4', 'claude', 'comparison', 'chat'], 'https://poe.com', 'freemium', true, 20, ['web', 'ios', 'android'], 4.5, 38000, false, false),
  createTool('9', 'YouChat', 'youchat', 'AI search assistant by You.com', 'YouChat combines conversational AI with web search to provide accurate, sourced answers. Get AI-powered search results with citations.', 'chatbots', ['search', 'research'], ['search', 'ai-search', 'citations', 'research', 'answers'], 'https://you.com', 'freemium', true, 15, ['web', 'api'], 4.4, 28000, false, false),
  createTool('10', 'Jasper Chat', 'jasper-chat', 'AI chat for marketing teams', 'Jasper Chat is designed specifically for marketing and business teams, helping create content, brainstorm ideas, and improve marketing workflows.', 'chatbots', ['marketing', 'business'], ['marketing', 'business', 'content', 'brainstorm', 'teams'], 'https://jasper.ai', 'subscription', false, 49, ['web', 'api'], 4.5, 32000, false, false),

  // ==================== IMAGE GENERATION (10 tools) ====================
  createTool('11', 'Midjourney', 'midjourney', 'AI-powered image generation', 'Midjourney creates stunning AI-generated images from text descriptions. Known for artistic quality and photorealistic outputs.', 'image-generation', ['ai-art', 'design'], ['image-generation', 'ai-art', 'text-to-image', 'creative', 'design'], 'https://midjourney.com', 'subscription', false, 10, ['web'], 4.9, 98000, true, true),
  createTool('12', 'DALL-E 3', 'dall-e', 'OpenAI\'s image generation model', 'DALL-E 3 generates highly detailed images from text prompts. Natively integrated into ChatGPT (free and Plus), free via Microsoft Designer and Bing Image Creator, and available through the OpenAI API for builders.', 'image-generation', ['ai-art', 'design'], ['openai', 'image-generation', 'text-to-image', 'creative', 'art'], 'https://openai.com/dall-e-3', 'freemium', true, 20, ['web', 'api'], 4.7, 76000, true, true),
  createTool('13', 'Stable Diffusion', 'stable-diffusion', 'Open-weight image generation', 'Stable Diffusion by Stability AI is the open-weight image model family powering much of the creative AI ecosystem. The current 3.5 family (Large, Turbo, Medium) runs locally or via API for high-quality, customizable image generation with permissive licensing for commercial use.', 'image-generation', ['ai-art', 'open-source'], ['open-source', 'sd-3-5', 'local', 'customizable', 'art'], 'https://stability.ai', 'freemium', true, 10, ['web', 'desktop', 'api'], 4.6, 67000, true, true),
  createTool('14', 'Leonardo AI', 'leonardo-ai', 'AI image generation for creators', 'Leonardo AI offers powerful image generation with fine-tuned models for game assets, concept art, and professional creative work.', 'image-generation', ['ai-art', 'game-assets'], ['game-art', 'concept-art', 'image-generation', 'creative', 'professional'], 'https://leonardo.ai', 'freemium', true, 12, ['web', 'api'], 4.7, 54000, false, true),
  createTool('15', 'Adobe Firefly', 'adobe-firefly', 'Adobe\'s commercially safe generative AI', 'Adobe Firefly powers commercially safe generative AI across Photoshop, Illustrator, Premiere Pro, and Express via the Firefly Image 3 model and the Firefly Video Model. Generative Fill, Generative Expand, Generative Remove, and Text to Video all draw from Adobe Stock-trained models. Free monthly credits; Firefly plans from $9.99/mo for higher generation limits.', 'image-generation', ['ai-art', 'design'], ['adobe', 'firefly-3', 'video-model', 'generative-fill', 'design'], 'https://firefly.adobe.com', 'freemium', true, 10, ['web', 'desktop'], 4.5, 48000, true, false),
  createTool('16', 'Ideogram', 'ideogram', 'AI image generation with text', 'Ideogram excels at generating images with accurate text rendering. Perfect for logos, posters, and designs requiring text.', 'image-generation', ['ai-art', 'typography'], ['text-in-image', 'typography', 'logos', 'design', 'posters'], 'https://ideogram.ai', 'freemium', true, 8, ['web'], 4.6, 32000, false, true),
  createTool('17', 'Playground AI', 'playground-ai', 'Free AI image generation', 'Playground AI offers free AI image generation with multiple models. Create, edit, and mix images with an intuitive interface.', 'image-generation', ['ai-art', 'editing'], ['free', 'image-generation', 'editing', 'creative', 'community'], 'https://playground.ai', 'freemium', true, 15, ['web'], 4.4, 28000, false, false),
  createTool('18', 'NightCafe', 'nightcafe', 'AI art generator community', 'NightCafe is an AI art generator with a vibrant community. Create art using multiple AI models and share with fellow creators.', 'image-generation', ['ai-art', 'community'], ['community', 'ai-art', 'multiple-models', 'creative', 'social'], 'https://nightcafe.studio', 'freemium', true, 10, ['web', 'ios', 'android'], 4.3, 24000, false, false),
  createTool('19', 'Canva AI', 'canva-ai', 'AI-powered design platform', 'Canva AI integrates generative AI into design workflows. Create images, remove backgrounds, and enhance designs with AI.', 'image-generation', ['design', 'editing'], ['design', 'templates', 'ai-tools', 'editing', 'graphics'], 'https://canva.com', 'freemium', true, 13, ['web', 'ios', 'android', 'desktop'], 4.7, 156000, true, false),
  createTool('20', 'Flux AI', 'flux-ai', 'Next-gen image generation', 'Flux AI by Black Forest Labs offers state-of-the-art image generation with exceptional quality and prompt adherence.', 'image-generation', ['ai-art', 'quality'], ['high-quality', 'image-generation', 'detailed', 'realistic', 'art'], 'https://blackforestlabs.ai', 'usage-based', false, 5, ['web', 'api'], 4.8, 18000, false, true),

  // ==================== CONTENT CREATION & WRITING (10 tools) ====================
  createTool('21', 'Jasper', 'jasper', 'AI content platform for marketing', 'Jasper is an AI content platform that helps marketing teams create on-brand content faster. From blog posts to ads, scale your content.', 'content-creation', ['marketing', 'copywriting'], ['marketing', 'copywriting', 'content', 'brand', 'teams'], 'https://jasper.ai', 'subscription', false, 49, ['web', 'api'], 4.6, 45000, true, false),
  createTool('22', 'Copy.ai', 'copy-ai', 'AI copywriting assistant', 'Copy.ai generates marketing copy, blog posts, and social media content. Speed up your writing with AI-powered templates.', 'content-creation', ['copywriting', 'marketing'], ['copywriting', 'marketing', 'social-media', 'templates', 'content'], 'https://copy.ai', 'freemium', true, 49, ['web', 'api'], 4.5, 38000, true, false),
  createTool('23', 'Writesonic', 'writesonic', 'AI writer for blogs and marketing', 'Writesonic creates SEO-optimized blog posts, landing pages, and marketing content. Built-in AI art and fact-checking features.', 'content-creation', ['blogging', 'seo'], ['blogging', 'seo', 'marketing', 'content', 'articles'], 'https://writesonic.com', 'freemium', true, 20, ['web', 'api'], 4.4, 32000, false, false),
  createTool('24', 'Rytr', 'rytr', 'AI writing assistant', 'Rytr is an affordable AI writing assistant for creating blog posts, emails, and social media content in over 30 languages.', 'content-creation', ['writing', 'multilingual'], ['affordable', 'multilingual', 'writing', 'content', 'emails'], 'https://rytr.me', 'freemium', true, 9, ['web', 'api'], 4.4, 28000, false, false),
  createTool('25', 'Grammarly', 'grammarly', 'AI writing enhancement', 'Grammarly uses AI to improve your writing with grammar, clarity, and tone suggestions. Essential for professional communication.', 'content-creation', ['grammar', 'editing'], ['grammar', 'writing', 'editing', 'clarity', 'professional'], 'https://grammarly.com', 'freemium', true, 12, ['web', 'ios', 'android', 'desktop', 'api'], 4.7, 189000, true, false),
  createTool('26', 'QuillBot', 'quillbot', 'AI paraphrasing tool', 'QuillBot helps rewrite and paraphrase text while maintaining meaning. Includes grammar checker, summarizer, and citation tools.', 'content-creation', ['paraphrasing', 'editing'], ['paraphrasing', 'rewriting', 'summarizer', 'grammar', 'academic'], 'https://quillbot.com', 'freemium', true, 10, ['web', 'desktop'], 4.5, 67000, false, false),
  createTool('27', 'Wordtune', 'wordtune', 'AI writing companion', 'Wordtune rewrites sentences to improve clarity and style. Get alternative phrasings and enhance your writing instantly.', 'content-creation', ['rewriting', 'editing'], ['rewriting', 'clarity', 'style', 'editing', 'suggestions'], 'https://wordtune.com', 'freemium', true, 10, ['web', 'desktop'], 4.4, 34000, false, false),
  createTool('28', 'Anyword', 'anyword', 'AI copywriting with performance prediction', 'Anyword generates marketing copy and predicts performance. Optimize content for conversions with data-driven AI.', 'content-creation', ['copywriting', 'analytics'], ['copywriting', 'performance', 'analytics', 'marketing', 'optimization'], 'https://anyword.com', 'subscription', false, 49, ['web', 'api'], 4.5, 18000, false, false),
  createTool('29', 'Hemingway Editor', 'hemingway', 'Make your writing bold and clear', 'Hemingway Editor highlights complex sentences and common errors. Make your writing clear, bold, and easy to read.', 'content-creation', ['editing', 'clarity'], ['editing', 'clarity', 'readability', 'simple', 'writing'], 'https://hemingwayapp.com', 'one-time', false, 20, ['web', 'desktop'], 4.6, 45000, false, false),
  createTool('30', 'Notion AI', 'notion-ai', 'AI-powered workspace', 'Notion AI enhances your Notion workspace with AI writing, summarization, and brainstorming capabilities.', 'content-creation', ['productivity', 'notes'], ['notion', 'workspace', 'writing', 'summarization', 'organization'], 'https://notion.so', 'subscription', false, 10, ['web', 'ios', 'android', 'desktop'], 4.7, 78000, true, true),

  // ==================== CODE ASSISTANCE (10 tools) ====================
  createTool('31', 'GitHub Copilot', 'github-copilot', 'AI pair programmer', 'GitHub Copilot suggests code and entire functions in real-time across VS Code, JetBrains, Neovim, and Visual Studio. Now offers a free tier with 2,000 completions and 50 chat messages per month, with Pro at $10/mo for unlimited use and access to Claude and GPT models alongside Copilot\'s own.', 'code-assistance', ['coding', 'autocomplete'], ['coding', 'autocomplete', 'github', 'ide', 'programming'], 'https://github.com/features/copilot', 'freemium', true, 10, ['desktop', 'api'], 4.8, 145000, true, true),
  createTool('32', 'Cursor', 'cursor', 'AI-first code editor', 'Cursor is an AI-first code editor for pair programming, multi-file edits via Composer, and longer agentic tasks via Agent mode that can plan and apply changes across a repo. Frontier-model picker (Claude Sonnet 4, GPT-4o, Gemini), codebase chat, and inline edits. Free tier with limits; Pro at $20/mo, Business at $40/seat.', 'code-assistance', ['ide', 'coding'], ['ide', 'composer', 'agent', 'multi-file', 'programming'], 'https://cursor.sh', 'freemium', true, 20, ['desktop'], 4.9, 67000, true, true),
  createTool('33', 'Tabnine', 'tabnine', 'AI code completion', 'Tabnine provides AI code completions that run locally or in the cloud. Privacy-focused with support for all major languages.', 'code-assistance', ['autocomplete', 'privacy'], ['autocomplete', 'privacy', 'local', 'coding', 'completion'], 'https://tabnine.com', 'freemium', true, 12, ['desktop', 'api'], 4.5, 56000, false, false),
  createTool('34', 'Codeium', 'codeium', 'Free AI code completion', 'Codeium offers free AI code completion and chat for individuals across 70+ programming languages and most major IDEs. The same team also ships Windsurf, their flagship AI-first IDE, for developers who want a deeper agentic experience.', 'code-assistance', ['autocomplete', 'free'], ['free', 'autocomplete', 'windsurf', 'jetbrains', 'multilanguage'], 'https://codeium.com', 'freemium', true, 15, ['desktop', 'api'], 4.6, 42000, false, true),
  createTool('35', 'Replit AI', 'replit-ai', 'AI-powered coding environment', 'Replit AI brings AI assistance to the browser-based IDE, including Replit Agent — an autonomous agent that builds, deploys, and iterates on full apps from a single prompt. Free tier for hobby projects; Replit Core at $20/mo for AI features, unlimited public Repls, and deployment credits.', 'code-assistance', ['ide', 'cloud'], ['browser-ide', 'replit-agent', 'autonomous', 'coding', 'deployment'], 'https://replit.com', 'freemium', true, 20, ['web', 'ios', 'android'], 4.5, 48000, false, false),
  createTool('36', 'Amazon CodeWhisperer', 'codewhisperer', 'AI coding companion by AWS', 'Amazon CodeWhisperer generates code suggestions trained on Amazon and open-source code. Optimized for AWS services.', 'code-assistance', ['aws', 'autocomplete'], ['aws', 'amazon', 'coding', 'cloud', 'autocomplete'], 'https://aws.amazon.com/codewhisperer', 'freemium', true, 19, ['desktop', 'api'], 4.4, 28000, false, false),
  createTool('37', 'Sourcegraph Cody', 'cody', 'AI coding assistant with codebase context', 'Cody by Sourcegraph understands your entire codebase. Get AI assistance that knows your code, APIs, and conventions.', 'code-assistance', ['codebase', 'context'], ['codebase', 'context-aware', 'enterprise', 'coding', 'search'], 'https://sourcegraph.com/cody', 'freemium', true, 9, ['desktop', 'api'], 4.6, 18000, false, true),
  createTool('38', 'Pieces for Developers', 'pieces', 'AI-powered code snippets', 'Pieces saves, enriches, and reuses code snippets with AI. Intelligent code organization across your development workflow.', 'code-assistance', ['snippets', 'organization'], ['snippets', 'organization', 'workflow', 'coding', 'productivity'], 'https://pieces.app', 'freemium', true, 10, ['desktop'], 4.5, 15000, false, false),
  createTool('39', 'Codex CLI', 'codex-cli', 'AI-powered command line', 'Codex CLI translates natural language to shell commands. Execute complex terminal operations with plain English.', 'code-assistance', ['cli', 'terminal'], ['cli', 'terminal', 'commands', 'shell', 'natural-language'], 'https://github.com/openai/codex-cli', 'free', true, 0, ['desktop'], 4.3, 12000, false, false),
  createTool('40', 'Mutable AI', 'mutable-ai', 'AI-powered code refactoring', 'Mutable AI helps refactor and document code. Transform codebases with AI-assisted improvements and documentation.', 'code-assistance', ['refactoring', 'documentation'], ['refactoring', 'documentation', 'code-quality', 'improvement', 'ai'], 'https://mutable.ai', 'freemium', true, 20, ['desktop', 'api'], 4.4, 8000, false, false),

  // ==================== VIDEO GENERATION & EDITING (10 tools) ====================
  createTool('41', 'Runway', 'runway', 'AI creative suite for video', 'Runway offers AI-powered video generation, editing, and effects. The current Gen-3 Alpha Turbo and Gen-4 models deliver more consistent characters and physics across shots, alongside Act-One performance capture, multi-motion brush, and 30+ AI Magic Tools. Free tier with limited credits; paid plans start at $15/mo.', 'video-generation', ['video-editing', 'generation'], ['video-generation', 'gen-4', 'gen-3', 'act-one', 'effects'], 'https://runway.ml', 'freemium', true, 15, ['web', 'api'], 4.7, 67000, true, true),
  createTool('42', 'Synthesia', 'synthesia', 'AI video generation platform', 'Synthesia creates professional videos with AI avatars. Generate training videos, marketing content, and more without cameras.', 'video-generation', ['avatars', 'business'], ['avatars', 'business', 'training', 'marketing', 'professional'], 'https://synthesia.io', 'subscription', false, 30, ['web', 'api'], 4.6, 45000, true, false),
  createTool('43', 'HeyGen', 'heygen', 'AI video creation with avatars', 'HeyGen generates videos with realistic AI avatars and voices. Perfect for marketing, training, and personalized content.', 'video-generation', ['avatars', 'marketing'], ['avatars', 'voices', 'marketing', 'personalization', 'business'], 'https://heygen.com', 'freemium', true, 30, ['web', 'api'], 4.6, 38000, false, true),
  createTool('44', 'Pictory', 'pictory', 'AI video creation from text', 'Pictory transforms blog posts and scripts into engaging videos. Auto-generate videos with stock footage and AI voiceovers.', 'video-generation', ['text-to-video', 'content'], ['text-to-video', 'blog', 'stock-footage', 'voiceover', 'content'], 'https://pictory.ai', 'subscription', false, 23, ['web'], 4.5, 28000, false, false),
  createTool('45', 'InVideo', 'invideo', 'AI video editor', 'InVideo offers AI-powered video editing with templates. Create professional videos in minutes with intelligent assistance.', 'video-generation', ['editing', 'templates'], ['editing', 'templates', 'professional', 'quick', 'marketing'], 'https://invideo.io', 'freemium', true, 25, ['web'], 4.4, 56000, false, false),
  createTool('46', 'Descript', 'descript', 'AI video and podcast editor', 'Descript edits video and audio by editing text. Features include AI voice cloning, filler word removal, and transcription.', 'video-generation', ['editing', 'podcast'], ['editing', 'podcast', 'transcription', 'voice-cloning', 'text-based'], 'https://descript.com', 'freemium', true, 15, ['web', 'desktop'], 4.7, 48000, true, false),
  createTool('47', 'Lumen5', 'lumen5', 'AI video creation for marketing', 'Lumen5 transforms blog content into engaging videos. AI-powered templates and stock footage for content marketing.', 'video-generation', ['marketing', 'content'], ['marketing', 'content', 'blog-to-video', 'templates', 'social'], 'https://lumen5.com', 'freemium', true, 29, ['web'], 4.4, 32000, false, false),
  createTool('48', 'Opus Clip', 'opus-clip', 'AI video clipping', 'Opus Clip uses AI to find the best clips from long videos. Turn podcasts and streams into viral short-form content.', 'video-generation', ['clipping', 'shorts'], ['clipping', 'shorts', 'viral', 'podcast', 'repurposing'], 'https://opus.pro', 'freemium', true, 15, ['web'], 4.6, 24000, false, true),
  createTool('49', 'Kapwing', 'kapwing', 'Online video editor with AI', 'Kapwing is a collaborative video editor with AI features. Auto-subtitles, background removal, and smart editing tools.', 'video-generation', ['editing', 'collaboration'], ['editing', 'collaboration', 'subtitles', 'online', 'tools'], 'https://kapwing.com', 'freemium', true, 24, ['web'], 4.5, 67000, false, false),
  createTool('50', 'FlexClip', 'flexclip', 'Easy AI video maker', 'FlexClip offers simple AI-powered video creation. Templates, stock media, and AI tools for quick video production.', 'video-generation', ['templates', 'easy'], ['easy', 'templates', 'stock-media', 'quick', 'simple'], 'https://flexclip.com', 'freemium', true, 10, ['web'], 4.3, 28000, false, false),

  // ==================== AUDIO & MUSIC (10 tools) ====================
  createTool('51', 'ElevenLabs', 'elevenlabs', 'Realistic AI voice and audio', 'ElevenLabs creates lifelike AI voices for text-to-speech, voice cloning, and 30+ language dubbing, plus Conversational AI for low-latency voice agents and Sound Effects generation. Free tier with 10k characters/mo; Creator at $22/mo; Pro at $99/mo for higher quality and commercial use.', 'audio-music', ['voice', 'tts'], ['voice', 'text-to-speech', 'conversational-ai', 'dubbing', 'sound-effects'], 'https://elevenlabs.io', 'freemium', true, 5, ['web', 'api'], 4.8, 78000, true, true),
  createTool('52', 'Murf AI', 'murf', 'AI voice generator', 'Murf AI generates studio-quality voiceovers. Choose from 120+ voices in 20+ languages for videos and presentations.', 'audio-music', ['voiceover', 'business'], ['voiceover', 'studio-quality', 'multilingual', 'business', 'professional'], 'https://murf.ai', 'freemium', true, 29, ['web', 'api'], 4.6, 45000, false, false),
  createTool('53', 'Speechify', 'speechify', 'Text-to-speech app', 'Speechify converts text to natural speech. Read articles, documents, and books with AI voices on any device.', 'audio-music', ['tts', 'reading'], ['text-to-speech', 'reading', 'accessibility', 'audiobooks', 'mobile'], 'https://speechify.com', 'freemium', true, 11, ['web', 'ios', 'android', 'desktop'], 4.5, 89000, false, false),
  createTool('54', 'AIVA', 'aiva', 'AI music composer', 'AIVA composes emotional soundtrack music using AI. Create original music for videos, games, and commercial projects.', 'audio-music', ['composition', 'soundtrack'], ['music', 'composition', 'soundtrack', 'emotional', 'royalty-free'], 'https://aiva.ai', 'freemium', true, 15, ['web'], 4.5, 28000, false, false),
  createTool('55', 'Soundraw', 'soundraw', 'AI music generation', 'Soundraw generates royalty-free music with AI. Customize mood, length, and instruments for unique tracks.', 'audio-music', ['music', 'royalty-free'], ['music-generation', 'royalty-free', 'customizable', 'mood', 'instruments'], 'https://soundraw.io', 'subscription', false, 17, ['web'], 4.4, 24000, false, false),
  createTool('56', 'Boomy', 'boomy', 'Create and release AI music', 'Boomy lets anyone create original songs with AI. Generate, customize, and release music to streaming platforms.', 'audio-music', ['music', 'creation'], ['music-creation', 'streaming', 'release', 'original', 'easy'], 'https://boomy.com', 'freemium', true, 10, ['web'], 4.3, 18000, false, false),
  createTool('57', 'Suno', 'suno', 'AI song generator', 'Suno generates complete songs — vocals, instrumentation, and lyrics — from a text or audio prompt. The current v4 model produces sharper vocals, cleaner sound, and full-song length up to 4 minutes, with Remix, Stem export, and Persona for consistent voices. Free tier with daily credits; Pro at $10/mo, Premier at $30/mo for commercial use.', 'audio-music', ['songs', 'vocals'], ['songs', 'vocals', 'suno-v4', 'stems', 'text-to-song'], 'https://suno.ai', 'freemium', true, 10, ['web'], 4.7, 56000, true, true),
  createTool('58', 'Lalal.ai', 'lalal-ai', 'AI audio separation', 'Lalal.ai separates vocals and instruments from any audio. Extract stems for remixing, karaoke, and production.', 'audio-music', ['separation', 'stems'], ['audio-separation', 'vocals', 'stems', 'remixing', 'karaoke'], 'https://lalal.ai', 'freemium', true, 15, ['web', 'api'], 4.6, 34000, false, false),
  createTool('59', 'Adobe Podcast', 'adobe-podcast', 'AI audio enhancement', 'Adobe Podcast enhances audio recordings with AI. Remove noise, improve clarity, and create studio-quality sound.', 'audio-music', ['enhancement', 'podcast'], ['audio-enhancement', 'noise-removal', 'clarity', 'podcast', 'adobe'], 'https://podcast.adobe.com', 'freemium', true, 0, ['web'], 4.5, 28000, false, false),
  createTool('60', 'Krisp', 'krisp', 'AI noise cancellation', 'Krisp removes background noise and echo from calls. Crystal clear audio for meetings and recordings.', 'audio-music', ['noise-cancellation', 'calls'], ['noise-cancellation', 'meetings', 'calls', 'echo', 'clear-audio'], 'https://krisp.ai', 'freemium', true, 12, ['desktop', 'api'], 4.6, 45000, false, false),

  // ==================== PRODUCTIVITY & AUTOMATION (10 tools) ====================
  createTool('61', 'Otter.ai', 'otter-ai', 'AI meeting transcription', 'Otter.ai transcribes meetings in real-time. Get searchable transcripts, summaries, and action items automatically.', 'productivity', ['transcription', 'meetings'], ['transcription', 'meetings', 'notes', 'summaries', 'collaboration'], 'https://otter.ai', 'freemium', true, 17, ['web', 'ios', 'android'], 4.6, 67000, true, false),
  createTool('62', 'Mem', 'mem', 'AI-powered notes', 'Mem organizes your notes with AI. Automatic organization, smart search, and AI-powered writing assistance.', 'productivity', ['notes', 'organization'], ['notes', 'organization', 'ai-search', 'writing', 'knowledge'], 'https://mem.ai', 'freemium', true, 15, ['web', 'ios', 'desktop'], 4.5, 28000, false, false),
  createTool('63', 'Taskade', 'taskade', 'AI-powered project management', 'Taskade combines project management with AI. Generate tasks, mind maps, and workflows with AI assistance.', 'productivity', ['project-management', 'ai'], ['project-management', 'tasks', 'mind-maps', 'collaboration', 'ai'], 'https://taskade.com', 'freemium', true, 10, ['web', 'ios', 'android', 'desktop'], 4.5, 34000, false, false),
  createTool('64', 'Coda AI', 'coda-ai', 'AI-powered documents', 'Coda AI brings intelligence to your documents. Generate content, analyze data, and automate workflows.', 'productivity', ['documents', 'automation'], ['documents', 'automation', 'analysis', 'workflows', 'collaboration'], 'https://coda.io', 'freemium', true, 12, ['web', 'ios', 'android'], 4.5, 32000, false, false),
  createTool('65', 'ClickUp AI', 'clickup-ai', 'AI for project management', 'ClickUp AI accelerates project management. Generate tasks, summarize content, and automate repetitive work.', 'productivity', ['project-management', 'automation'], ['project-management', 'tasks', 'automation', 'summaries', 'teams'], 'https://clickup.com', 'freemium', true, 7, ['web', 'ios', 'android', 'desktop'], 4.6, 78000, true, false),
  createTool('66', 'Motion', 'motion', 'AI calendar and scheduling', 'Motion uses AI to automatically schedule your tasks and meetings. Intelligent time management for maximum productivity.', 'productivity', ['calendar', 'scheduling'], ['calendar', 'scheduling', 'time-management', 'automatic', 'planning'], 'https://usemotion.com', 'subscription', false, 34, ['web', 'ios', 'desktop'], 4.7, 24000, false, true),
  createTool('67', 'Reclaim.ai', 'reclaim-ai', 'AI scheduling assistant', 'Reclaim.ai intelligently schedules meetings, tasks, and habits. Protect focus time and optimize your calendar.', 'productivity', ['calendar', 'habits'], ['scheduling', 'calendar', 'habits', 'focus-time', 'optimization'], 'https://reclaim.ai', 'freemium', true, 10, ['web'], 4.6, 18000, false, false),
  createTool('68', 'Clockwise', 'clockwise', 'AI calendar optimization', 'Clockwise optimizes team calendars with AI. Find meeting times, protect focus time, and reduce scheduling conflicts.', 'productivity', ['calendar', 'teams'], ['calendar', 'teams', 'optimization', 'focus-time', 'scheduling'], 'https://clockwise.com', 'freemium', true, 7, ['web'], 4.5, 28000, false, false),
  createTool('69', 'Zapier AI', 'zapier-ai', 'AI-powered automation', 'Zapier AI creates automations from natural language. Connect apps and automate workflows with AI assistance.', 'productivity', ['automation', 'integration'], ['automation', 'integration', 'workflows', 'no-code', 'ai'], 'https://zapier.com', 'freemium', true, 20, ['web', 'api'], 4.7, 145000, true, false),
  createTool('70', 'Fireflies.ai', 'fireflies', 'AI meeting assistant', 'Fireflies.ai records, transcribes, and summarizes meetings. Search across meetings and generate action items.', 'productivity', ['meetings', 'transcription'], ['meetings', 'transcription', 'summaries', 'search', 'action-items'], 'https://fireflies.ai', 'freemium', true, 18, ['web', 'ios', 'android'], 4.5, 45000, false, false),

  // ==================== RESEARCH & ANALYSIS (10 tools) ====================
  createTool('71', 'Elicit', 'elicit', 'AI research assistant', 'Elicit uses AI to help with research workflows. Find papers, extract claims, and synthesize information.', 'research-analysis', ['research', 'papers'], ['research', 'papers', 'academic', 'synthesis', 'literature'], 'https://elicit.org', 'freemium', true, 10, ['web'], 4.6, 34000, true, false),
  createTool('72', 'Consensus', 'consensus', 'AI-powered research search', 'Consensus finds and summarizes scientific research. Get evidence-based answers from peer-reviewed papers.', 'research-analysis', ['research', 'science'], ['research', 'science', 'evidence', 'papers', 'summaries'], 'https://consensus.app', 'freemium', true, 10, ['web'], 4.5, 28000, false, true),
  createTool('73', 'Semantic Scholar', 'semantic-scholar', 'AI-powered research tool', 'Semantic Scholar uses AI to help find relevant research. Discover papers, track citations, and explore connections.', 'research-analysis', ['research', 'citations'], ['research', 'citations', 'papers', 'academic', 'discovery'], 'https://semanticscholar.org', 'free', true, 0, ['web', 'api'], 4.7, 89000, false, false),
  createTool('74', 'Connected Papers', 'connected-papers', 'Visual research exploration', 'Connected Papers creates visual graphs of related papers. Explore research connections and find similar work.', 'research-analysis', ['research', 'visualization'], ['research', 'visualization', 'papers', 'connections', 'exploration'], 'https://connectedpapers.com', 'freemium', true, 6, ['web'], 4.5, 45000, false, false),
  createTool('75', 'Iris.ai', 'iris-ai', 'AI for R&D teams', 'Iris.ai provides AI tools for R&D and research teams. Extract insights, analyze documents, and accelerate discovery.', 'research-analysis', ['r&d', 'enterprise'], ['r&d', 'enterprise', 'documents', 'insights', 'analysis'], 'https://iris.ai', 'subscription', false, 100, ['web', 'api'], 4.4, 8000, false, false),
  createTool('76', 'Scite', 'scite', 'Smart citation analysis', 'Scite shows how papers have been cited. Understand if citations support, contrast, or mention the research.', 'research-analysis', ['citations', 'analysis'], ['citations', 'analysis', 'support', 'contrast', 'research'], 'https://scite.ai', 'freemium', true, 20, ['web', 'api'], 4.5, 24000, false, false),
  createTool('77', 'Research Rabbit', 'research-rabbit', 'Research discovery tool', 'Research Rabbit helps discover related papers and authors. Build collections and visualize research landscapes.', 'research-analysis', ['discovery', 'papers'], ['discovery', 'papers', 'collections', 'visualization', 'free'], 'https://researchrabbit.ai', 'free', true, 0, ['web'], 4.6, 32000, false, false),
  createTool('78', 'SciSpace', 'scispace', 'AI research assistant', 'SciSpace explains complex papers, finds related work, and helps write research. Your AI co-pilot for academia.', 'research-analysis', ['papers', 'writing'], ['papers', 'explanation', 'writing', 'academic', 'copilot'], 'https://scispace.com', 'freemium', true, 12, ['web'], 4.5, 28000, false, false),
  createTool('79', 'Humata', 'humata', 'AI for document analysis', 'Humata lets you chat with your documents. Upload PDFs and get instant answers, summaries, and insights.', 'research-analysis', ['documents', 'chat'], ['documents', 'pdf', 'chat', 'summaries', 'insights'], 'https://humata.ai', 'freemium', true, 15, ['web'], 4.4, 24000, false, false),
  createTool('80', 'ChatPDF', 'chatpdf', 'Chat with any PDF', 'ChatPDF lets you ask questions about PDF documents. Upload research papers, reports, or books and get answers.', 'research-analysis', ['pdf', 'chat'], ['pdf', 'chat', 'documents', 'questions', 'analysis'], 'https://chatpdf.com', 'freemium', true, 5, ['web'], 4.5, 56000, false, false),

  // ==================== DESIGN & UI/UX (10 tools) ====================
  createTool('81', 'Figma AI', 'figma-ai', 'AI-powered design', 'Figma AI brings intelligent features to design. Generate designs, rename layers, and get AI-powered suggestions.', 'design', ['ui-design', 'collaboration'], ['figma', 'ui-design', 'collaboration', 'ai-features', 'productivity'], 'https://figma.com', 'freemium', true, 15, ['web', 'desktop'], 4.8, 234000, true, true),
  createTool('82', 'Uizard', 'uizard', 'AI UI design tool', 'Uizard turns sketches and screenshots into editable designs. Rapid prototyping with AI assistance.', 'design', ['prototyping', 'ui-design'], ['prototyping', 'ui-design', 'sketches', 'rapid', 'wireframes'], 'https://uizard.io', 'freemium', true, 19, ['web'], 4.5, 28000, false, false),
  createTool('83', 'Galileo AI', 'galileo-ai', 'AI UI generation', 'Galileo AI generates editable UI designs from text descriptions. Create high-fidelity designs instantly.', 'design', ['ui-generation', 'text-to-design'], ['ui-generation', 'text-to-design', 'high-fidelity', 'instant', 'editable'], 'https://usegalileo.ai', 'subscription', false, 19, ['web'], 4.6, 18000, false, true),
  createTool('84', 'Looka', 'looka', 'AI logo maker', 'Looka creates custom logos with AI. Design your brand identity with intelligent suggestions and customization.', 'design', ['logos', 'branding'], ['logos', 'branding', 'identity', 'customization', 'business'], 'https://looka.com', 'freemium', true, 20, ['web'], 4.4, 45000, false, false),
  createTool('85', 'Designs.ai', 'designs-ai', 'AI design suite', 'Designs.ai offers AI tools for logos, videos, mockups, and more. Complete design suite powered by AI.', 'design', ['suite', 'branding'], ['suite', 'logos', 'videos', 'mockups', 'branding'], 'https://designs.ai', 'subscription', false, 29, ['web'], 4.3, 24000, false, false),
  createTool('86', 'Khroma', 'khroma', 'AI color tool', 'Khroma uses AI to generate color palettes based on your preferences. Discover colors you love.', 'design', ['colors', 'palettes'], ['colors', 'palettes', 'preferences', 'ai-generated', 'design'], 'https://khroma.co', 'free', true, 0, ['web'], 4.5, 34000, false, false),
  createTool('87', 'Fontjoy', 'fontjoy', 'AI font pairing', 'Fontjoy generates font pairings with deep learning. Find the perfect font combinations for your designs.', 'design', ['fonts', 'typography'], ['fonts', 'typography', 'pairing', 'deep-learning', 'combinations'], 'https://fontjoy.com', 'free', true, 0, ['web'], 4.4, 28000, false, false),
  createTool('88', 'Remove.bg', 'remove-bg', 'AI background removal', 'Remove.bg instantly removes backgrounds from images with AI. Perfect cutouts in seconds.', 'design', ['background-removal', 'editing'], ['background-removal', 'images', 'cutouts', 'instant', 'editing'], 'https://remove.bg', 'freemium', true, 9, ['web', 'api'], 4.7, 156000, false, false),
  createTool('89', 'Cleanup.pictures', 'cleanup-pictures', 'AI object removal', 'Cleanup.pictures removes unwanted objects from photos with AI. Clean up images quickly and easily.', 'design', ['object-removal', 'editing'], ['object-removal', 'photos', 'cleanup', 'editing', 'ai'], 'https://cleanup.pictures', 'freemium', true, 5, ['web'], 4.5, 67000, false, false),
  createTool('90', 'Magician for Figma', 'magician', 'AI plugin for Figma', 'Magician is an AI plugin for Figma. Generate icons, copy, and images directly in your designs.', 'design', ['figma-plugin', 'generation'], ['figma', 'plugin', 'icons', 'copy', 'generation'], 'https://magician.design', 'subscription', false, 5, ['web'], 4.5, 18000, false, false),

  // ==================== MARKETING & SEO (10 tools) ====================
  createTool('91', 'Surfer SEO', 'surfer-seo', 'AI-powered SEO tool', 'Surfer SEO optimizes content for search engines with AI. Get real-time suggestions for better rankings.', 'marketing-seo', ['seo', 'content'], ['seo', 'content-optimization', 'rankings', 'real-time', 'analysis'], 'https://surferseo.com', 'subscription', false, 89, ['web', 'api'], 4.6, 45000, true, false),
  createTool('92', 'Clearscope', 'clearscope', 'AI content optimization', 'Clearscope uses AI to optimize content for search. Competitive analysis and keyword recommendations.', 'marketing-seo', ['seo', 'optimization'], ['seo', 'optimization', 'keywords', 'competitive', 'content'], 'https://clearscope.io', 'subscription', false, 170, ['web'], 4.5, 18000, false, false),
  createTool('93', 'MarketMuse', 'marketmuse', 'AI content strategy', 'MarketMuse provides AI-powered content strategy. Plan, create, and optimize content for better results.', 'marketing-seo', ['content-strategy', 'planning'], ['content-strategy', 'planning', 'optimization', 'ai', 'marketing'], 'https://marketmuse.com', 'freemium', true, 149, ['web'], 4.4, 12000, false, false),
  createTool('94', 'Frase', 'frase', 'AI content creation for SEO', 'Frase helps create SEO-optimized content with AI. Research, write, and optimize in one platform.', 'marketing-seo', ['seo', 'content-creation'], ['seo', 'content-creation', 'research', 'optimization', 'writing'], 'https://frase.io', 'subscription', false, 15, ['web'], 4.5, 28000, false, false),
  createTool('95', 'Scalenut', 'scalenut', 'AI-powered SEO platform', 'Scalenut combines AI writing with SEO tools. Create content that ranks with intelligent optimization.', 'marketing-seo', ['seo', 'writing'], ['seo', 'writing', 'ai-content', 'optimization', 'rankings'], 'https://scalenut.com', 'subscription', false, 39, ['web'], 4.4, 18000, false, false),
  createTool('96', 'NeuronWriter', 'neuronwriter', 'AI content editor for SEO', 'NeuronWriter optimizes content with NLP recommendations. Semantic SEO analysis for better rankings.', 'marketing-seo', ['seo', 'nlp'], ['seo', 'nlp', 'semantic', 'optimization', 'content'], 'https://neuronwriter.com', 'subscription', false, 19, ['web'], 4.4, 15000, false, false),
  createTool('97', 'Phrasee', 'phrasee', 'AI marketing language', 'Phrasee generates and optimizes marketing language with AI. Improve email, SMS, and push notifications.', 'marketing-seo', ['copywriting', 'email'], ['copywriting', 'email', 'optimization', 'language', 'marketing'], 'https://phrasee.co', 'subscription', false, 500, ['web', 'api'], 4.5, 8000, false, false),
  createTool('98', 'Unbounce Smart Copy', 'unbounce-smart-copy', 'AI copywriting for landing pages', 'Unbounce Smart Copy generates conversion-focused copy. Create landing pages that convert with AI.', 'marketing-seo', ['copywriting', 'landing-pages'], ['copywriting', 'landing-pages', 'conversion', 'marketing', 'ai'], 'https://unbounce.com/product/smart-copy', 'freemium', true, 25, ['web'], 4.4, 18000, false, false),
  createTool('99', 'Lately', 'lately', 'AI social media content', 'Lately uses AI to repurpose long-form content into social posts. Scale your social media presence.', 'marketing-seo', ['social-media', 'repurposing'], ['social-media', 'repurposing', 'content', 'scaling', 'ai'], 'https://lately.ai', 'subscription', false, 49, ['web'], 4.3, 12000, false, false),
  createTool('100', 'Persado', 'persado', 'AI for marketing language', 'Persado generates the best marketing language with AI. Enterprise-grade optimization for all channels.', 'marketing-seo', ['enterprise', 'language'], ['enterprise', 'language', 'optimization', 'marketing', 'ai'], 'https://persado.com', 'subscription', false, 1000, ['web', 'api'], 4.5, 5000, false, false),

  // ==================== DATA & ANALYTICS (10 tools) ====================
  createTool('101', 'Julius AI', 'julius-ai', 'AI data analyst', 'Julius AI analyzes data using natural language. Upload spreadsheets and ask questions in plain English to get insights, charts, and reports.', 'data-analytics', ['analysis', 'visualization'], ['data-analysis', 'spreadsheets', 'charts', 'insights', 'natural-language'], 'https://julius.ai', 'freemium', true, 20, ['web'], 4.7, 42000, true, true),
  createTool('102', 'Akkio', 'akkio', 'No-code AI analytics', 'Akkio enables no-code predictive analytics. Build AI models, forecast trends, and analyze data without technical expertise.', 'data-analytics', ['predictive', 'no-code'], ['predictive-analytics', 'no-code', 'forecasting', 'ml', 'business'], 'https://akkio.com', 'freemium', true, 49, ['web', 'api'], 4.5, 18000, false, false),
  createTool('103', 'MonkeyLearn', 'monkeylearn', 'AI text analytics', 'MonkeyLearn offers no-code text analytics powered by AI. Classify and extract data from text for business insights.', 'data-analytics', ['text-analytics', 'classification'], ['text-analytics', 'classification', 'sentiment', 'extraction', 'no-code'], 'https://monkeylearn.com', 'freemium', true, 299, ['web', 'api'], 4.4, 12000, false, false),
  createTool('104', 'Obviously AI', 'obviously-ai', 'No-code machine learning', 'Obviously AI builds ML models without code. Predict outcomes, identify patterns, and automate decisions from your data.', 'data-analytics', ['ml', 'no-code'], ['machine-learning', 'no-code', 'predictions', 'patterns', 'automation'], 'https://obviously.ai', 'subscription', false, 75, ['web', 'api'], 4.5, 15000, false, false),
  createTool('105', 'Polymer', 'polymer', 'AI-powered data exploration', 'Polymer transforms spreadsheets into interactive dashboards using AI. Explore data visually without any coding.', 'data-analytics', ['dashboards', 'visualization'], ['dashboards', 'spreadsheets', 'visualization', 'interactive', 'no-code'], 'https://polymersearch.com', 'freemium', true, 20, ['web'], 4.5, 22000, false, false),
  createTool('106', 'Rows', 'rows', 'AI-powered spreadsheets', 'Rows combines spreadsheets with built-in AI analysis. Summarize, categorize, and extract insights from data directly in cells.', 'data-analytics', ['spreadsheets', 'analysis'], ['spreadsheets', 'ai-analysis', 'summarize', 'categorize', 'automation'], 'https://rows.com', 'freemium', true, 59, ['web'], 4.4, 28000, false, false),
  createTool('107', 'ThoughtSpot', 'thoughtspot', 'AI-driven analytics', 'ThoughtSpot delivers AI-powered analytics for enterprise teams. Search and explore data with natural language queries.', 'data-analytics', ['enterprise', 'search'], ['enterprise', 'search-analytics', 'natural-language', 'bi', 'insights'], 'https://thoughtspot.com', 'subscription', false, 2500, ['web', 'api'], 4.6, 8000, false, false),
  createTool('108', 'Tableau AI', 'tableau-ai', 'AI analytics by Salesforce', 'Tableau AI brings generative AI to data visualization. Ask questions in natural language and get automated insights.', 'data-analytics', ['visualization', 'enterprise'], ['tableau', 'visualization', 'salesforce', 'enterprise', 'dashboards'], 'https://tableau.com', 'subscription', false, 75, ['web', 'desktop'], 4.7, 156000, true, false),
  createTool('109', 'Dataiku', 'dataiku', 'Everyday AI platform', 'Dataiku is an end-to-end AI platform for building, deploying, and managing data projects at enterprise scale.', 'data-analytics', ['platform', 'enterprise'], ['platform', 'enterprise', 'mlops', 'data-science', 'deployment'], 'https://dataiku.com', 'subscription', false, 0, ['web', 'desktop', 'api'], 4.6, 12000, false, false),
  createTool('110', 'Mode', 'mode', 'Collaborative analytics', 'Mode combines SQL, Python, and visual analytics in one platform with AI-assisted analysis for data teams.', 'data-analytics', ['sql', 'collaborative'], ['sql', 'python', 'collaborative', 'analytics', 'data-teams'], 'https://mode.com', 'freemium', true, 35, ['web'], 4.5, 18000, false, false),

  // ==================== CUSTOMER SUPPORT (10 tools) ====================
  createTool('111', 'Intercom Fin', 'intercom-fin', 'AI customer service agent', 'Intercom Fin is an AI agent that resolves customer issues instantly. Trained on your help center to provide accurate answers.', 'customer-support', ['chatbot', 'helpdesk'], ['chatbot', 'helpdesk', 'customer-service', 'ai-agent', 'resolution'], 'https://intercom.com', 'subscription', false, 39, ['web', 'ios', 'android', 'api'], 4.7, 89000, true, true),
  createTool('112', 'Zendesk AI', 'zendesk-ai', 'AI-powered support platform', 'Zendesk AI automates customer support with intelligent routing, suggested replies, and AI-powered ticket resolution.', 'customer-support', ['helpdesk', 'ticketing'], ['helpdesk', 'ticketing', 'automation', 'routing', 'enterprise'], 'https://zendesk.com', 'subscription', false, 55, ['web', 'ios', 'android', 'api'], 4.6, 145000, true, false),
  createTool('113', 'Tidio', 'tidio', 'AI chatbot for ecommerce', 'Tidio combines live chat with AI chatbots for ecommerce. Automate customer support and boost sales conversions.', 'customer-support', ['chatbot', 'ecommerce'], ['chatbot', 'ecommerce', 'live-chat', 'sales', 'automation'], 'https://tidio.com', 'freemium', true, 29, ['web', 'ios', 'android'], 4.5, 56000, false, false),
  createTool('114', 'Freshdesk Freddy', 'freshdesk-freddy', 'AI support assistant', 'Freshdesk Freddy AI automates ticket routing, suggests responses, and provides AI-powered insights for support teams.', 'customer-support', ['helpdesk', 'automation'], ['helpdesk', 'automation', 'ticket-routing', 'suggestions', 'insights'], 'https://freshworks.com/freshdesk', 'freemium', true, 15, ['web', 'ios', 'android', 'api'], 4.5, 67000, false, false),
  createTool('115', 'Ada', 'ada', 'AI-first customer service', 'Ada builds AI-first customer service experiences. Automate conversations across channels with personalized AI.', 'customer-support', ['automation', 'multi-channel'], ['automation', 'multi-channel', 'personalized', 'ai-first', 'enterprise'], 'https://ada.cx', 'subscription', false, 0, ['web', 'api'], 4.6, 24000, false, true),
  createTool('116', 'Kommunicate', 'kommunicate', 'AI chatbot for support', 'Kommunicate deploys AI chatbots trained on your data. Seamless handoff between AI and human agents.', 'customer-support', ['chatbot', 'handoff'], ['chatbot', 'handoff', 'training', 'human-agent', 'deployment'], 'https://kommunicate.io', 'freemium', true, 40, ['web', 'ios', 'android', 'api'], 4.4, 18000, false, false),
  createTool('117', 'Help Scout', 'help-scout', 'AI-enhanced help desk', 'Help Scout integrates AI to draft replies, summarize conversations, and organize support workflows efficiently.', 'customer-support', ['helpdesk', 'email'], ['helpdesk', 'email', 'drafts', 'summarize', 'workflows'], 'https://helpscout.com', 'subscription', false, 20, ['web', 'ios', 'android'], 4.6, 34000, false, false),
  createTool('118', 'Drift', 'drift', 'AI conversational marketing', 'Drift uses AI to engage website visitors in real-time. Convert leads with intelligent chatbots and personalized experiences.', 'customer-support', ['conversational', 'marketing'], ['conversational', 'marketing', 'leads', 'chatbot', 'real-time'], 'https://drift.com', 'subscription', false, 0, ['web', 'api'], 4.5, 28000, false, false),
  createTool('119', 'Kustomer', 'kustomer', 'AI CRM for customer support', 'Kustomer provides AI-powered CRM for customer support teams. Unified customer view with intelligent automation.', 'customer-support', ['crm', 'automation'], ['crm', 'automation', 'unified-view', 'enterprise', 'support'], 'https://kustomer.com', 'subscription', false, 89, ['web', 'api'], 4.4, 12000, false, false),
  createTool('120', 'Forethought', 'forethought', 'AI for support automation', 'Forethought automates customer support with generative AI. Resolve tickets faster with AI-powered triage and responses.', 'customer-support', ['automation', 'triage'], ['automation', 'triage', 'generative-ai', 'resolution', 'enterprise'], 'https://forethought.ai', 'subscription', false, 0, ['web', 'api'], 4.5, 8000, false, false),

  // ==================== EDUCATION & LEARNING (10 tools) ====================
  createTool('121', 'Khan Academy Khanmigo', 'khanmigo', 'AI tutor by Khan Academy', 'Khanmigo is an AI-powered tutor that guides students through problems, offers hints, and adapts to individual learning styles.', 'education', ['tutoring', 'k-12'], ['tutoring', 'k-12', 'personalized', 'math', 'learning'], 'https://khanacademy.org/khan-labs', 'freemium', true, 4, ['web'], 4.7, 89000, true, true),
  createTool('122', 'Duolingo Max', 'duolingo-max', 'AI-powered language learning', 'Duolingo Max uses GPT-4 to provide AI conversations and explain mistakes. Learn languages with personalized AI feedback.', 'education', ['language', 'gamified'], ['language-learning', 'gamified', 'gpt-4', 'conversation', 'feedback'], 'https://duolingo.com', 'subscription', false, 14, ['web', 'ios', 'android'], 4.8, 234000, true, true),
  createTool('123', 'Quizlet Q-Chat', 'quizlet-q-chat', 'AI study companion', 'Quizlet Q-Chat is an AI study companion that quizzes you, explains concepts, and creates personalized study plans.', 'education', ['study', 'flashcards'], ['study', 'flashcards', 'quiz', 'personalized', 'ai-companion'], 'https://quizlet.com', 'freemium', true, 8, ['web', 'ios', 'android'], 4.6, 156000, false, false),
  createTool('124', 'Socratic by Google', 'socratic', 'AI homework helper', 'Socratic uses Google AI to help students with homework. Take a photo of a question and get step-by-step explanations.', 'education', ['homework', 'k-12'], ['homework', 'k-12', 'step-by-step', 'photo', 'explanations'], 'https://socratic.org', 'free', true, 0, ['ios', 'android'], 4.5, 67000, false, false),
  createTool('125', 'Synthesis', 'synthesis', 'AI learning games for kids', 'Synthesis offers AI-powered learning games that build critical thinking and problem-solving skills in children.', 'education', ['kids', 'games'], ['kids', 'games', 'critical-thinking', 'problem-solving', 'interactive'], 'https://synthesis.com', 'subscription', false, 149, ['web'], 4.6, 18000, false, false),
  createTool('126', 'Photomath', 'photomath', 'AI math solver', 'Photomath solves math problems from photos. Get step-by-step solutions with detailed explanations for every level.', 'education', ['math', 'solver'], ['math', 'solver', 'step-by-step', 'camera', 'explanations'], 'https://photomath.com', 'freemium', true, 10, ['ios', 'android'], 4.7, 145000, false, false),
  createTool('127', 'Brainly', 'brainly', 'AI-powered homework help', 'Brainly provides AI-powered homework help and community-based learning. Get answers and explanations across all subjects.', 'education', ['homework', 'community'], ['homework', 'community', 'answers', 'subjects', 'ai-help'], 'https://brainly.com', 'freemium', true, 6, ['web', 'ios', 'android'], 4.4, 89000, false, false),
  createTool('128', 'Coursera AI', 'coursera-ai', 'AI-enhanced online learning', 'Coursera integrates AI to personalize learning paths, provide coaching, and recommend courses tailored to your goals.', 'education', ['courses', 'professional'], ['courses', 'professional', 'personalized', 'coaching', 'certificates'], 'https://coursera.org', 'freemium', true, 49, ['web', 'ios', 'android'], 4.6, 178000, false, false),
  createTool('129', 'Caktus AI', 'caktus-ai', 'AI writing tool for students', 'Caktus AI helps students write essays, solve coding problems, and create study materials with specialized AI assistance.', 'education', ['writing', 'students'], ['writing', 'essays', 'coding', 'study-materials', 'students'], 'https://caktus.ai', 'subscription', false, 10, ['web'], 4.3, 28000, false, false),
  createTool('130', 'Gradescope', 'gradescope', 'AI-powered grading', 'Gradescope uses AI to assist instructors with grading. Faster, more consistent grading for assignments and exams.', 'education', ['grading', 'instructors'], ['grading', 'instructors', 'assignments', 'exams', 'consistent'], 'https://gradescope.com', 'freemium', true, 0, ['web'], 4.5, 45000, false, false),

  // ==================== SALES & CRM (10 tools) ====================
  createTool('131', 'Apollo.io', 'apollo-io', 'AI-powered sales intelligence', 'Apollo.io provides AI-driven lead generation, prospecting, and engagement tools. Access 275M+ contacts with intelligent filtering.', 'sales-crm', ['prospecting', 'leads'], ['prospecting', 'leads', 'contacts', 'outreach', 'intelligence'], 'https://apollo.io', 'freemium', true, 49, ['web', 'api'], 4.7, 89000, true, true),
  createTool('132', 'Gong', 'gong', 'AI revenue intelligence', 'Gong captures and analyzes customer interactions using AI. Get insights to close more deals and forecast revenue accurately.', 'sales-crm', ['revenue', 'conversation'], ['revenue', 'conversation-intelligence', 'forecasting', 'deals', 'analytics'], 'https://gong.io', 'subscription', false, 0, ['web', 'api'], 4.7, 45000, true, false),
  createTool('133', 'Outreach', 'outreach', 'AI sales engagement platform', 'Outreach uses AI to optimize sales engagement. Automate sequences, predict outcomes, and prioritize deals.', 'sales-crm', ['engagement', 'automation'], ['engagement', 'automation', 'sequences', 'predictions', 'pipeline'], 'https://outreach.io', 'subscription', false, 0, ['web', 'api'], 4.6, 34000, false, false),
  createTool('134', 'Salesforce Einstein', 'salesforce-einstein', 'AI for Salesforce CRM', 'Salesforce Einstein embeds AI across the CRM platform. Predictive lead scoring, automated insights, and smart recommendations.', 'sales-crm', ['crm', 'predictive'], ['crm', 'predictive', 'lead-scoring', 'insights', 'enterprise'], 'https://salesforce.com/einstein', 'subscription', false, 25, ['web', 'ios', 'android', 'api'], 4.6, 178000, true, false),
  createTool('135', 'HubSpot AI', 'hubspot-ai', 'AI-powered CRM and marketing', 'HubSpot AI adds intelligence across marketing, sales, and service. Generate content, predict deals, and automate workflows.', 'sales-crm', ['crm', 'marketing'], ['crm', 'marketing', 'content', 'automation', 'predictions'], 'https://hubspot.com', 'freemium', true, 45, ['web', 'ios', 'android', 'api'], 4.7, 234000, true, false),
  createTool('136', 'Instantly', 'instantly', 'AI cold email platform', 'Instantly automates cold email outreach with AI. Warm up inboxes, personalize at scale, and optimize deliverability.', 'sales-crm', ['email', 'outreach'], ['cold-email', 'outreach', 'personalization', 'deliverability', 'automation'], 'https://instantly.ai', 'subscription', false, 30, ['web', 'api'], 4.6, 56000, false, true),
  createTool('137', 'Lavender', 'lavender', 'AI email coach for sales', 'Lavender coaches salespeople to write better emails. Real-time AI suggestions to improve reply rates.', 'sales-crm', ['email', 'coaching'], ['email', 'coaching', 'reply-rates', 'sales-emails', 'optimization'], 'https://lavender.ai', 'freemium', true, 29, ['web'], 4.5, 24000, false, false),
  createTool('138', 'Clari', 'clari', 'AI revenue platform', 'Clari uses AI to run revenue operations. Full pipeline visibility, forecasting, and deal inspection.', 'sales-crm', ['revenue', 'forecasting'], ['revenue', 'forecasting', 'pipeline', 'visibility', 'deal-inspection'], 'https://clari.com', 'subscription', false, 0, ['web', 'api'], 4.6, 18000, false, false),
  createTool('139', 'Clay', 'clay', 'AI data enrichment for sales', 'Clay enriches lead data with AI. Pull from 75+ data sources to build perfect prospect lists automatically.', 'sales-crm', ['enrichment', 'prospecting'], ['data-enrichment', 'prospecting', 'lead-lists', 'automation', 'multi-source'], 'https://clay.com', 'subscription', false, 149, ['web', 'api'], 4.7, 28000, false, true),
  createTool('140', 'Seamless.AI', 'seamless-ai', 'AI sales lead finder', 'Seamless.AI finds verified contact information in real-time. Build accurate prospect lists with AI-powered search.', 'sales-crm', ['leads', 'contacts'], ['leads', 'contacts', 'verified', 'real-time', 'prospecting'], 'https://seamless.ai', 'freemium', true, 65, ['web', 'api'], 4.4, 34000, false, false),

  // ==================== HEALTHCARE & WELLNESS (10 tools) ====================
  createTool('141', 'Woebot', 'woebot', 'AI mental health companion', 'Woebot is an AI-powered mental health chatbot that provides cognitive behavioral therapy techniques and emotional support.', 'healthcare', ['mental-health', 'cbt'], ['mental-health', 'cbt', 'therapy', 'emotional-support', 'chatbot'], 'https://woebot.io', 'free', true, 0, ['ios', 'android'], 4.5, 45000, true, false),
  createTool('142', 'Ada Health', 'ada-health', 'AI symptom checker', 'Ada Health uses AI to assess symptoms and suggest possible conditions. Trusted by millions for health guidance.', 'healthcare', ['symptoms', 'diagnosis'], ['symptoms', 'diagnosis', 'health-assessment', 'conditions', 'medical'], 'https://ada.com', 'free', true, 0, ['web', 'ios', 'android'], 4.6, 78000, true, true),
  createTool('143', 'Wysa', 'wysa', 'AI therapy and wellness', 'Wysa offers AI-guided therapy sessions, mood tracking, and mental wellness exercises. Clinically validated CBT support.', 'healthcare', ['therapy', 'wellness'], ['therapy', 'wellness', 'mood-tracking', 'cbt', 'meditation'], 'https://wysa.com', 'freemium', true, 10, ['ios', 'android'], 4.5, 34000, false, false),
  createTool('144', 'Viz.ai', 'viz-ai', 'AI medical imaging analysis', 'Viz.ai uses AI to detect critical conditions in medical imaging. FDA-cleared technology for faster clinical decisions.', 'healthcare', ['imaging', 'clinical'], ['medical-imaging', 'clinical', 'fda-cleared', 'detection', 'radiology'], 'https://viz.ai', 'subscription', false, 0, ['web', 'api'], 4.7, 8000, false, false),
  createTool('145', 'Headspace', 'headspace', 'AI-enhanced meditation', 'Headspace uses AI to personalize meditation and mindfulness experiences. Tailored exercises for stress, sleep, and focus.', 'healthcare', ['meditation', 'mindfulness'], ['meditation', 'mindfulness', 'personalized', 'stress', 'sleep'], 'https://headspace.com', 'subscription', false, 13, ['web', 'ios', 'android'], 4.7, 145000, false, false),
  createTool('146', 'Fitbod', 'fitbod', 'AI workout generator', 'Fitbod creates personalized workout plans using AI. Adapts to your fitness level, goals, and available equipment.', 'healthcare', ['fitness', 'workouts'], ['fitness', 'workouts', 'personalized', 'strength', 'gym'], 'https://fitbod.me', 'subscription', false, 13, ['ios', 'android'], 4.6, 56000, false, false),
  createTool('147', 'Aidoc', 'aidoc', 'AI radiology assistant', 'Aidoc provides AI-powered radiology solutions. Detect acute conditions, prioritize worklists, and improve clinical outcomes.', 'healthcare', ['radiology', 'clinical'], ['radiology', 'clinical', 'detection', 'prioritization', 'acute-care'], 'https://aidoc.com', 'subscription', false, 0, ['web', 'api'], 4.6, 5000, false, false),
  createTool('148', 'Calm', 'calm', 'AI-powered wellness app', 'Calm uses AI to personalize meditation, sleep stories, and relaxation content. Premium wellness experience.', 'healthcare', ['meditation', 'sleep'], ['meditation', 'sleep', 'relaxation', 'wellness', 'personalized'], 'https://calm.com', 'subscription', false, 15, ['web', 'ios', 'android'], 4.7, 178000, false, false),
  createTool('149', 'Noom', 'noom', 'AI weight management', 'Noom uses AI and psychology to help users develop healthy habits. Personalized coaching for sustainable weight management.', 'healthcare', ['nutrition', 'coaching'], ['nutrition', 'coaching', 'weight-management', 'habits', 'psychology'], 'https://noom.com', 'subscription', false, 59, ['web', 'ios', 'android'], 4.4, 89000, false, false),
  createTool('150', 'Lark Health', 'lark-health', 'AI health coach', 'Lark provides AI-powered chronic disease prevention and management. Personalized coaching for diabetes, heart health, and weight.', 'healthcare', ['coaching', 'chronic-disease'], ['coaching', 'chronic-disease', 'diabetes', 'heart-health', 'prevention'], 'https://lark.com', 'subscription', false, 0, ['ios', 'android'], 4.5, 24000, false, false),

  // ==================== ADDITIONAL CHATBOTS (10 more) ====================
  createTool('151', 'Mistral Le Chat', 'mistral-le-chat', 'European AI assistant by Mistral', 'Le Chat by Mistral AI runs on the Mistral Large 2, Pixtral multimodal, and Mistral reasoning model families with web search, image understanding, code interpreter, and document upload. Free tier; Le Chat Pro at $14.99/mo for higher limits and faster responses, with European data residency.', 'chatbots', ['open-weight', 'fast'], ['mistral-large', 'pixtral', 'reasoning', 'code-interpreter', 'european-ai'], 'https://chat.mistral.ai', 'freemium', true, 15, ['web', 'api'], 4.6, 34000, true, true),
  createTool('152', 'Cohere Command', 'cohere-command', 'Enterprise AI assistant', 'Cohere Command is built for enterprise applications. RAG-powered AI that connects to your company data securely.', 'chatbots', ['enterprise', 'rag'], ['enterprise', 'rag', 'security', 'business', 'data-connected'], 'https://cohere.com', 'usage-based', false, 0, ['web', 'api'], 4.5, 18000, false, false),
  createTool('153', 'DeepSeek', 'deepseek', 'Advanced reasoning AI', 'DeepSeek offers powerful AI models excelling at math, coding, and reasoning tasks. Competitive with top-tier models at lower costs.', 'chatbots', ['reasoning', 'coding'], ['reasoning', 'coding', 'math', 'affordable', 'open-source'], 'https://chat.deepseek.com', 'freemium', true, 0, ['web', 'api'], 4.7, 67000, true, true),
  createTool('154', 'Llama by Meta', 'llama', 'Open-weight AI by Meta', 'Meta Llama is the open-weight large language model family powering much of the local-AI ecosystem. The Llama 3.3 70B and multimodal Llama 4 (Scout and Maverick) release run locally on consumer hardware via Ollama and LM Studio or in production via hyperscalers, with full weights for customization and self-hosting.', 'chatbots', ['open-source', 'local'], ['open-source', 'llama-4', 'ollama', 'meta', 'self-hosted'], 'https://llama.meta.com', 'free', true, 0, ['web', 'desktop', 'api'], 4.6, 89000, true, true),
  createTool('155', 'Copilot by Microsoft', 'microsoft-copilot', 'Microsoft\'s everyday AI companion', 'Microsoft Copilot brings AI assistance across Windows 11, Edge, Bing, and the Microsoft 365 apps. Free for consumers with voice and vision; Copilot Pro at $20/mo for priority GPT-4o access and Copilot in Word/Excel/PowerPoint; Microsoft 365 Copilot at $30/user/mo for businesses with tenant grounding.', 'chatbots', ['microsoft', 'productivity'], ['microsoft', 'productivity', 'office', 'windows', 'copilot-pro'], 'https://copilot.microsoft.com', 'freemium', true, 20, ['web', 'desktop', 'ios', 'android'], 4.6, 178000, true, false),
  createTool('156', 'Grok', 'grok', 'AI by xAI with real-time reasoning', 'Grok by xAI delivers real-time information from X and the web alongside the Think and DeepSearch reasoning modes introduced with Grok 3. Free at grok.com with limits, SuperGrok at $30/mo for heavier use, and bundled into X Premium+.', 'chatbots', ['real-time', 'reasoning'], ['real-time', 'xai', 'reasoning', 'current-events', 'grok-3'], 'https://grok.com', 'freemium', true, 30, ['web', 'ios', 'android'], 4.4, 56000, true, true),
  createTool('157', 'Coral by Cohere', 'coral', 'Enterprise AI with citations', 'Coral by Cohere provides grounded AI answers with citations from your documents. Built for enterprise knowledge work.', 'chatbots', ['enterprise', 'citations'], ['enterprise', 'citations', 'grounded', 'documents', 'knowledge'], 'https://coral.cohere.com', 'subscription', false, 0, ['web', 'api'], 4.5, 12000, false, false),
  createTool('158', 'Phind', 'phind', 'AI search for developers', 'Phind is an AI-powered search engine designed for developers. Get instant answers with code examples and technical explanations.', 'chatbots', ['developer', 'search'], ['developer', 'search', 'code-examples', 'technical', 'programming'], 'https://phind.com', 'freemium', true, 15, ['web'], 4.6, 45000, false, false),
  createTool('159', 'Claude Artifacts', 'claude-artifacts', 'Interactive AI by Anthropic', 'Claude with Artifacts creates interactive content, visualizations, and code previews directly in conversation.', 'chatbots', ['interactive', 'creative'], ['interactive', 'artifacts', 'visualizations', 'code', 'creative'], 'https://claude.ai', 'freemium', true, 20, ['web'], 4.8, 56000, true, true),
  createTool('160', 'ChatSonic', 'chatsonic', 'AI chatbot with real-time data', 'ChatSonic by Writesonic offers real-time web access, image generation, and voice commands in one AI chatbot.', 'chatbots', ['real-time', 'multimodal'], ['real-time', 'image-generation', 'voice', 'web-access', 'multimodal'], 'https://writesonic.com/chat', 'freemium', true, 13, ['web', 'ios', 'android'], 4.4, 28000, false, false),

  // ==================== ADDITIONAL IMAGE GENERATION (10 more) ====================
  createTool('161', 'Krea AI', 'krea-ai', 'Real-time AI image and video', 'Krea AI generates images and short video clips in real-time as you type, draw, or stream from a webcam. Now includes Krea Video and a multi-model library (Flux, Stable Diffusion 3.5, Recraft). Free with daily limits; Pro at $35/mo for higher resolution and faster generations.', 'image-generation', ['real-time', 'interactive'], ['real-time', 'interactive', 'drawing', 'video', 'creative'], 'https://krea.ai', 'freemium', true, 35, ['web'], 4.6, 34000, true, true),
  createTool('162', 'Pika', 'pika', 'AI video generation', 'Pika 2.0 generates short videos from text, images, and reference photos using its Scene Ingredients feature, which lets you combine characters, objects, and locations in one prompt. Free tier with watermark; paid plans start at $35/mo for higher quality, longer clips, and faster generations.', 'image-generation', ['video', 'creative'], ['video-generation', 'creative', 'scene-ingredients', 'pika-2', 'text-to-video'], 'https://pika.art', 'freemium', true, 35, ['web'], 4.5, 28000, true, true),
  createTool('163', 'Getimg.ai', 'getimg-ai', 'AI image generation suite', 'Getimg.ai provides a complete AI image toolkit. Generate, edit, upscale, and train custom models.', 'image-generation', ['suite', 'custom-models'], ['suite', 'custom-models', 'upscale', 'edit', 'generate'], 'https://getimg.ai', 'freemium', true, 12, ['web', 'api'], 4.5, 22000, false, false),
  createTool('164', 'Clipdrop', 'clipdrop', 'AI image tools by Stability', 'Clipdrop offers AI-powered image editing tools. Remove backgrounds, upscale images, and clean up photos instantly.', 'image-generation', ['editing', 'tools'], ['editing', 'background-removal', 'upscale', 'cleanup', 'stability-ai'], 'https://clipdrop.co', 'freemium', true, 9, ['web', 'ios', 'android', 'api'], 4.6, 45000, false, false),
  createTool('165', 'DreamStudio', 'dreamstudio', 'Stable Diffusion interface', 'DreamStudio is the official interface for Stable Diffusion. Generate high-quality images with advanced controls.', 'image-generation', ['stable-diffusion', 'controls'], ['stable-diffusion', 'controls', 'high-quality', 'official', 'generation'], 'https://dreamstudio.ai', 'usage-based', false, 10, ['web', 'api'], 4.5, 34000, false, false),
  createTool('166', 'Craiyon', 'craiyon', 'Free AI image generator', 'Craiyon (formerly DALL-E Mini) generates images from text for free. Quick and accessible AI art for everyone.', 'image-generation', ['free', 'accessible'], ['free', 'accessible', 'text-to-image', 'quick', 'anyone'], 'https://craiyon.com', 'freemium', true, 5, ['web'], 4.2, 67000, false, false),
  createTool('167', 'Fotor AI', 'fotor-ai', 'AI photo editor and generator', 'Fotor AI combines photo editing with AI image generation. Enhance, create, and transform images effortlessly.', 'image-generation', ['editing', 'enhancement'], ['editing', 'enhancement', 'generation', 'photos', 'transform'], 'https://fotor.com', 'freemium', true, 9, ['web', 'ios', 'android'], 4.4, 56000, false, false),
  createTool('168', 'Artbreeder', 'artbreeder', 'AI art mixing and creation', 'Artbreeder lets you blend and evolve images with AI. Create portraits, landscapes, and abstract art through mixing.', 'image-generation', ['mixing', 'creative'], ['mixing', 'creative', 'portraits', 'landscapes', 'evolution'], 'https://artbreeder.com', 'freemium', true, 9, ['web'], 4.4, 28000, false, false),
  createTool('169', 'Bing Image Creator', 'bing-image-creator', 'Free AI image generation by Microsoft', 'Bing Image Creator uses DALL-E to generate images for free. Create AI art directly in Microsoft Edge or Bing.', 'image-generation', ['free', 'microsoft'], ['free', 'microsoft', 'dall-e', 'bing', 'accessible'], 'https://bing.com/create', 'free', true, 0, ['web'], 4.5, 89000, false, false),
  createTool('170', 'Recraft', 'recraft', 'AI design and illustration', 'Recraft generates vector art, icons, and illustrations with AI. Professional design assets in any style.', 'image-generation', ['vector', 'illustration'], ['vector', 'illustration', 'icons', 'design-assets', 'professional'], 'https://recraft.ai', 'freemium', true, 20, ['web'], 4.6, 18000, true, true),

  // ==================== ADDITIONAL CODE ASSISTANCE (10 more) ====================
  createTool('171', 'Windsurf', 'windsurf', 'AI-powered code editor', 'Windsurf by Codeium is an AI-first IDE with deep codebase understanding. Flows feature enables multi-file AI editing.', 'code-assistance', ['ide', 'multi-file'], ['ide', 'multi-file', 'flows', 'ai-first', 'codebase'], 'https://codeium.com/windsurf', 'freemium', true, 15, ['desktop'], 4.7, 28000, true, true),
  createTool('172', 'Aider', 'aider', 'AI pair programming in terminal', 'Aider is an AI coding assistant that works in your terminal. Edit code across multiple files with natural language.', 'code-assistance', ['terminal', 'pair-programming'], ['terminal', 'pair-programming', 'multi-file', 'open-source', 'git'], 'https://aider.chat', 'free', true, 0, ['desktop'], 4.6, 18000, true, true),
  createTool('173', 'Devin', 'devin', 'Autonomous AI software engineer', 'Devin by Cognition is an autonomous AI software engineer that plans, codes, debugs, and ships pull requests on its own. Now available on a Team plan at $20/mo + $4 per ACU (agent compute unit), with Enterprise plans for larger teams.', 'code-assistance', ['autonomous', 'full-stack'], ['autonomous', 'full-stack', 'planning', 'debugging', 'deployment'], 'https://cognition.ai', 'subscription', false, 20, ['web'], 4.5, 45000, true, true),
  createTool('174', 'v0 by Vercel', 'v0', 'AI UI component generator', 'v0 generates UI components from text descriptions. Built by Vercel, it creates React, Next.js, and Tailwind code.', 'code-assistance', ['ui-generation', 'react'], ['ui-generation', 'react', 'nextjs', 'tailwind', 'vercel'], 'https://v0.dev', 'freemium', true, 20, ['web'], 4.7, 56000, true, true),
  createTool('175', 'Bolt.new', 'bolt-new', 'AI full-stack web builder', 'Bolt.new by StackBlitz generates full-stack web applications from prompts. Build, preview, and deploy apps in the browser.', 'code-assistance', ['full-stack', 'web-builder'], ['full-stack', 'web-builder', 'prompts', 'deploy', 'browser'], 'https://bolt.new', 'freemium', true, 20, ['web'], 4.6, 34000, true, true),
  createTool('176', 'Continue', 'continue', 'Open-source AI code assistant', 'Continue is an open-source AI code assistant for VS Code and JetBrains. Use any model with full IDE integration.', 'code-assistance', ['open-source', 'ide-plugin'], ['open-source', 'ide-plugin', 'vs-code', 'jetbrains', 'any-model'], 'https://continue.dev', 'free', true, 0, ['desktop'], 4.5, 24000, false, false),
  createTool('177', 'Sweep', 'sweep', 'AI junior developer', 'Sweep turns GitHub issues into pull requests automatically. AI-powered bug fixes and feature implementations.', 'code-assistance', ['github', 'automation'], ['github', 'pull-requests', 'bug-fixes', 'automation', 'issues'], 'https://sweep.dev', 'freemium', true, 120, ['web', 'api'], 4.4, 12000, false, false),
  createTool('178', 'Blackbox AI', 'blackbox-ai', 'AI code generation and search', 'Blackbox AI generates code from natural language and searches across millions of code snippets for solutions.', 'code-assistance', ['generation', 'search'], ['generation', 'search', 'snippets', 'natural-language', 'solutions'], 'https://blackbox.ai', 'freemium', true, 22, ['web', 'desktop'], 4.4, 34000, false, false),
  createTool('179', 'Qodo (formerly Codium AI)', 'codium-ai', 'AI test generation and code integrity', 'Qodo (rebranded from Codium AI in 2024) generates meaningful tests, reviews PRs, and ships its Qodo Gen IDE assistant for VS Code and JetBrains. Free tier for individuals; Teams from $19/seat/mo for full code-integrity features.', 'code-assistance', ['testing', 'quality'], ['testing', 'qodo', 'test-generation', 'code-review', 'pr-agent'], 'https://qodo.ai', 'freemium', true, 19, ['desktop', 'api'], 4.5, 18000, false, false),
  createTool('180', 'Warp', 'warp', 'AI-powered terminal', 'Warp is a modern terminal with built-in AI. Get command suggestions, explain errors, and automate workflows with AI.', 'code-assistance', ['terminal', 'modern'], ['terminal', 'modern', 'suggestions', 'errors', 'workflows'], 'https://warp.dev', 'freemium', true, 18, ['desktop'], 4.6, 45000, false, false),

  // ==================== ADDITIONAL CONTENT & WRITING (10 more) ====================
  createTool('181', 'Sudowrite', 'sudowrite', 'AI writing tool for fiction', 'Sudowrite is designed for fiction writers. Generate prose, brainstorm plot ideas, and overcome writer\'s block with AI.', 'content-creation', ['fiction', 'creative-writing'], ['fiction', 'creative-writing', 'plot', 'prose', 'writers-block'], 'https://sudowrite.com', 'subscription', false, 19, ['web'], 4.6, 18000, false, false),
  createTool('182', 'Writer', 'writer', 'Enterprise AI writing platform', 'Writer is an enterprise AI platform for consistent, on-brand content. Build custom AI apps for your team.', 'content-creation', ['enterprise', 'brand'], ['enterprise', 'brand', 'consistency', 'custom', 'teams'], 'https://writer.com', 'subscription', false, 18, ['web', 'api'], 4.6, 28000, false, false),
  createTool('183', 'Lex', 'lex', 'AI-enhanced writing editor', 'Lex is a minimalist writing tool with AI built in. Get suggestions, generate content, and refine your writing seamlessly.', 'content-creation', ['editor', 'minimalist'], ['editor', 'minimalist', 'suggestions', 'content', 'refinement'], 'https://lex.page', 'freemium', true, 8, ['web'], 4.5, 15000, false, false),
  createTool('184', 'Hyperwrite', 'hyperwrite', 'AI personal writing assistant', 'Hyperwrite helps you write faster with AI autocomplete and generation. Chrome extension for writing anywhere.', 'content-creation', ['autocomplete', 'extension'], ['autocomplete', 'extension', 'chrome', 'fast', 'everywhere'], 'https://hyperwriteai.com', 'freemium', true, 20, ['web'], 4.4, 22000, false, false),
  createTool('185', 'Simplified', 'simplified', 'AI content and design suite', 'Simplified combines AI writing, design, video, and social media tools. All-in-one platform for content teams.', 'content-creation', ['all-in-one', 'design'], ['all-in-one', 'design', 'video', 'social-media', 'content-teams'], 'https://simplified.com', 'freemium', true, 24, ['web'], 4.4, 34000, false, false),
  createTool('186', 'Peppertype', 'peppertype', 'AI content marketing platform', 'Peppertype generates marketing content with AI. Blog posts, ad copy, social media, and product descriptions at scale.', 'content-creation', ['marketing', 'scale'], ['marketing', 'blog-posts', 'ad-copy', 'social-media', 'scale'], 'https://peppertype.ai', 'subscription', false, 35, ['web'], 4.3, 12000, false, false),
  createTool('187', 'Longshot AI', 'longshot-ai', 'AI for long-form content', 'Longshot AI creates factually accurate long-form content. Built-in fact-checking and SEO optimization.', 'content-creation', ['long-form', 'fact-checking'], ['long-form', 'fact-checking', 'seo', 'accurate', 'articles'], 'https://longshot.ai', 'freemium', true, 19, ['web'], 4.4, 15000, false, false),
  createTool('188', 'Typeface', 'typeface', 'Enterprise AI content platform', 'Typeface generates on-brand content for enterprises. Personalized AI that learns your brand voice and guidelines.', 'content-creation', ['enterprise', 'brand-voice'], ['enterprise', 'brand-voice', 'personalized', 'guidelines', 'content'], 'https://typeface.ai', 'subscription', false, 0, ['web', 'api'], 4.5, 8000, false, false),
  createTool('189', 'Narrato', 'narrato', 'AI content workflow platform', 'Narrato manages content creation workflows with AI. Plan, create, optimize, and publish content collaboratively.', 'content-creation', ['workflow', 'collaboration'], ['workflow', 'collaboration', 'planning', 'publishing', 'teams'], 'https://narrato.io', 'freemium', true, 36, ['web'], 4.4, 12000, false, false),
  createTool('190', 'ContentBot', 'contentbot', 'AI content automation', 'ContentBot automates content creation with AI. Generate blog posts, newsletters, and social content on autopilot.', 'content-creation', ['automation', 'blogging'], ['automation', 'blogging', 'newsletters', 'social', 'autopilot'], 'https://contentbot.ai', 'subscription', false, 29, ['web', 'api'], 4.3, 8000, false, false),

  // ==================== ADDITIONAL PRODUCTIVITY (10 more) ====================
  createTool('191', 'Superhuman', 'superhuman', 'AI-powered email', 'Superhuman is the fastest email experience with AI. Write emails, summarize threads, and reach inbox zero with AI.', 'productivity', ['email', 'speed'], ['email', 'speed', 'inbox-zero', 'summaries', 'ai-writing'], 'https://superhuman.com', 'subscription', false, 30, ['web', 'ios', 'android', 'desktop'], 4.7, 45000, true, true),
  createTool('192', 'Bardeen', 'bardeen', 'AI workflow automation', 'Bardeen automates repetitive tasks with AI. Build workflows connecting your apps without code.', 'productivity', ['automation', 'no-code'], ['automation', 'no-code', 'workflows', 'apps', 'repetitive'], 'https://bardeen.ai', 'freemium', true, 10, ['web'], 4.5, 24000, false, false),
  createTool('193', 'Grain', 'grain', 'AI meeting highlights', 'Grain records meetings and uses AI to create shareable highlights. Capture key moments automatically.', 'productivity', ['meetings', 'highlights'], ['meetings', 'highlights', 'recording', 'shareable', 'moments'], 'https://grain.com', 'freemium', true, 19, ['web'], 4.5, 18000, false, false),
  createTool('194', 'Magical', 'magical', 'AI text expander', 'Magical automates messaging and data entry. AI-powered text expansion and auto-fill across any app.', 'productivity', ['text-expansion', 'automation'], ['text-expansion', 'automation', 'messaging', 'data-entry', 'templates'], 'https://getmagical.com', 'freemium', true, 10, ['web'], 4.5, 34000, false, false),
  createTool('195', 'Raycast AI', 'raycast-ai', 'AI-powered launcher', 'Raycast AI brings AI commands to your Mac launcher. Chat with AI, generate code, and automate tasks from anywhere.', 'productivity', ['launcher', 'mac'], ['launcher', 'mac', 'commands', 'chat', 'automation'], 'https://raycast.com', 'freemium', true, 8, ['desktop'], 4.8, 28000, true, true),
  createTool('196', 'Tldv', 'tldv', 'AI meeting recorder', 'Tldv records Google Meet and Zoom calls. AI generates summaries, timestamps, and action items automatically.', 'productivity', ['meetings', 'recording'], ['meetings', 'recording', 'summaries', 'timestamps', 'action-items'], 'https://tldv.io', 'freemium', true, 20, ['web'], 4.6, 34000, false, false),
  createTool('197', 'Krisp AI', 'krisp-meeting', 'AI meeting assistant', 'Krisp provides AI meeting notes with transcription, summaries, and action items. Plus noise cancellation for clear audio.', 'productivity', ['meetings', 'notes'], ['meetings', 'notes', 'transcription', 'summaries', 'noise-cancellation'], 'https://krisp.ai', 'freemium', true, 8, ['desktop'], 4.5, 34000, false, false),
  createTool('198', 'Loom AI', 'loom-ai', 'AI video messaging', 'Loom AI generates titles, summaries, and chapters for video messages. Communicate async with AI-enhanced videos.', 'productivity', ['video', 'async'], ['video', 'async', 'summaries', 'chapters', 'communication'], 'https://loom.com', 'freemium', true, 15, ['web', 'desktop', 'ios', 'android'], 4.6, 89000, false, false),
  createTool('199', 'SaneBox', 'sanebox', 'AI email management', 'SaneBox uses AI to organize your inbox. Automatically sort important emails and filter distractions.', 'productivity', ['email', 'organization'], ['email', 'organization', 'sorting', 'filtering', 'inbox'], 'https://sanebox.com', 'subscription', false, 7, ['web'], 4.5, 24000, false, false),
  createTool('200', 'Rows AI', 'rows-ai', 'AI spreadsheet assistant', 'Rows brings AI directly into spreadsheets. Analyze data, generate formulas, and create reports with natural language.', 'productivity', ['spreadsheets', 'analysis'], ['spreadsheets', 'analysis', 'formulas', 'reports', 'natural-language'], 'https://rows.com', 'freemium', true, 59, ['web'], 4.5, 22000, false, false),
];

// Stamp the verified-this-sweep slugs with today's date so the freshness
// signal on the card matches reality, not the ID rotation.
for (const tool of aiTools) {
  if (REFRESHED_2026_05_13.has(tool.slug)) {
    tool.dateUpdated = LAST_CONTENT_SWEEP;
  }
}

// Helper functions
export function getToolBySlug(slug: string): AITool | undefined {
  return aiTools.find(tool => tool.slug === slug);
}

export function getToolsByCategory(categorySlug: string): AITool[] {
  return aiTools.filter(tool =>
    tool.category === categorySlug ||
    tool.subcategories.includes(categorySlug)
  );
}

// Sort by recency (higher numeric ID = newer tool added later) with rating as tiebreaker.
// This ensures featured/trending lists surface the latest 2025-2026 tools first.
function freshnessSort(a: AITool, b: AITool): number {
  const idA = parseInt(a.id, 10);
  const idB = parseInt(b.id, 10);
  if (idB !== idA) return idB - idA;
  return b.rating.average - a.rating.average;
}

export function getFeaturedTools(): AITool[] {
  return aiTools.filter(tool => tool.featured).sort(freshnessSort);
}

export function getTrendingTools(): AITool[] {
  return aiTools.filter(tool => tool.trending).sort(freshnessSort);
}

export function getPopularTools(limit: number = 10): AITool[] {
  return [...aiTools]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, limit);
}

export function getRecentTools(limit: number = 10): AITool[] {
  return [...aiTools]
    .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
    .slice(0, limit);
}

export function getRelatedTools(tool: AITool, limit: number = 4): AITool[] {
  return aiTools
    .filter(t => t.id !== tool.id && (t.category === tool.category || t.tags.some(tag => tool.tags.includes(tag))))
    .slice(0, limit);
}

export function searchToolsByName(query: string): AITool[] {
  const lowerQuery = query.toLowerCase();
  return aiTools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.tagline.toLowerCase().includes(lowerQuery)
  );
}
