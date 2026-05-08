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
  { id: 'all', name: '🔥 All News', apiKey: '' },
  { id: 'top', name: '📰 Top Stories', apiKey: 'Top stories' },
  { id: 'business', name: '💼 Business', apiKey: 'Business' },
  { id: 'tech', name: '💻 Technology', apiKey: 'Technology' },
  { id: 'entertainment', name: '🎬 Entertainment', apiKey: 'Entertainment' },
  { id: 'sports', name: '⚽ Sports', apiKey: 'Sports' },
  { id: 'health', name: '🏥 Health', apiKey: 'Health' },
  { id: 'science', name: '🔬 Science', apiKey: 'Science' },
  { id: 'world', name: '🌍 World', apiKey: 'World' },
];

const API_URL = "https://ok.surf/api/v1/cors/news-feed";

let fullCache: Record<string, NewsArticle[]> | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

const genId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

async function loadAllNews(): Promise<Record<string, NewsArticle[]>> {
  if (fullCache && Date.now() - cacheTime < CACHE_TTL) {
    return fullCache;
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const data = await res.json();

    const result: Record<string, NewsArticle[]> = {};
    const allArticles: NewsArticle[] = [];

    const keys = Object.keys(data);

    for (const key of keys) {
      const items = data[key];
      if (!Array.isArray(items)) continue;

      result[key] = [];

      for (const item of items) {
        if (!item.title || !item.link) continue;
        const article: NewsArticle = {
          id: genId(),
          title: item.title,
          description: item.title,
          url: item.link,
          image: item.og || '',
          publishedAt: new Date(Date.now() - Math.random() * 3600000 * 6).toISOString(),
          source: {
            name: item.source || 'News',
            url: item.link,
          },
          category: key,
        };
        result[key].push(article);
        allArticles.push(article);
      }
    }

    result['all'] = allArticles;
    fullCache = result;
    cacheTime = Date.now();

    return result;
  } catch (err) {
    console.error('News fetch error:', err);
    return { all: [] };
  }
}

export async function fetchNews(categoryId: string = 'all'): Promise<NewsArticle[]> {
  const allNews = await loadAllNews();

  if (categoryId === 'all' || !categoryId) {
    return allNews['all'] || [];
  }

  const cat = NEWS_CATEGORIES.find(c => c.id === categoryId);
  if (!cat || !cat.apiKey) {
    return allNews['all'] || [];
  }

  if (allNews[cat.apiKey] && allNews[cat.apiKey].length > 0) {
    return allNews[cat.apiKey];
  }

  for (const key of Object.keys(allNews)) {
    if (key.toLowerCase() === cat.apiKey.toLowerCase() && allNews[key].length > 0) {
      return allNews[key];
    }
  }

  for (const key of Object.keys(allNews)) {
    if (
      (key.toLowerCase().includes(cat.apiKey.toLowerCase()) ||
       cat.apiKey.toLowerCase().includes(key.toLowerCase())) &&
      allNews[key].length > 0
    ) {
      return allNews[key];
    }
  }

  return allNews['all'] || [];
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  if (!query.trim()) return [];
  const allNews = await loadAllNews();
  const all = allNews['all'] || [];
  const q = query.toLowerCase();
  return all.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.source.name.toLowerCase().includes(q)
  );
}

export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
