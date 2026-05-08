// ============================================
// NEWS API - KhabarBlast Auto News
// Uses ok.surf free Google News API (No key needed!)
// ============================================

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
  category?: string;
}

export const NEWS_CATEGORIES = [
  { id: 'general', name: '🔥 Top Stories', apiCat: 'Top stories' },
  { id: 'india', name: '🇮🇳 India', apiCat: 'India' },
  { id: 'world', name: '🌍 World', apiCat: 'World' },
  { id: 'tech', name: '💻 Technology', apiCat: 'Technology' },
  { id: 'entertainment', name: '🎬 Entertainment', apiCat: 'Entertainment' },
  { id: 'sports', name: '⚽ Sports', apiCat: 'Sports' },
  { id: 'business', name: '💼 Business', apiCat: 'Business' },
  { id: 'health', name: '🏥 Health', apiCat: 'Health' },
  { id: 'science', name: '🔬 Science', apiCat: 'Science' },
];

const API_URL = "https://ok.surf/api/v1/cors/news-feed";

// Cache
const cache = new Map<string, { data: NewsArticle[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 min

const genId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

// Fetch all news from ok.surf
export async function fetchAllNews(): Promise<Record<string, NewsArticle[]>> {
  const cacheKey = 'all-news';
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return { all: cached.data };
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const data = await res.json();

    const result: Record<string, NewsArticle[]> = {};
    const allArticles: NewsArticle[] = [];

    for (const [key, items] of Object.entries(data)) {
      if (!Array.isArray(items)) continue;
      const catArticles: NewsArticle[] = [];

      for (const item of items as any[]) {
        if (!item.title || !item.link) continue;
        const article: NewsArticle = {
          id: genId(),
          title: item.title,
          description: item.title,
          url: item.link,
          image: item.og || '',
          publishedAt: new Date().toISOString(),
          source: {
            name: item.source || 'News',
            url: item.link,
          },
          category: key,
        };
        catArticles.push(article);
        allArticles.push(article);
      }

      result[key] = catArticles;
    }

    cache.set(cacheKey, { data: allArticles, ts: Date.now() });
    result['all'] = allArticles;
    return result;
  } catch (err) {
    console.error('News fetch error:', err);
    return { all: [] };
  }
}

// Fetch news by category
export async function fetchNews(categoryId: string = 'general'): Promise<NewsArticle[]> {
  const allNews = await fetchAllNews();

  // Map our category to API category key
  const cat = NEWS_CATEGORIES.find(c => c.id === categoryId);
  const apiCat = cat?.apiCat || '';

  // Try matching API category key
  for (const [key, articles] of Object.entries(allNews)) {
    if (key.toLowerCase().includes(apiCat.toLowerCase()) || apiCat.toLowerCase().includes(key.toLowerCase())) {
      if (articles.length > 0) return articles;
    }
  }

  // Fallback: return all articles
  return allNews['all'] || [];
}

// Search news (filter from fetched data)
export async function searchNews(query: string): Promise<NewsArticle[]> {
  if (!query.trim()) return [];

  const allNews = await fetchAllNews();
  const allArticles = allNews['all'] || [];
  const q = query.toLowerCase();

  return allArticles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.source.name.toLowerCase().includes(q)
  );
}

// Format relative time
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
