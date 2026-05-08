// ============================================
// NEWS API - Auto News Aggregator
// Uses GNews API + Google News RSS (FREE!)
// ============================================

const GNEWS_API_KEY = ""; // Optional - works without key too using RSS

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category?: string;
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

// Categories with Hindi + English topics
export const NEWS_CATEGORIES = [
  { id: 'top', name: '🔥 Top Stories', query: 'top headlines India' },
  { id: 'india', name: '🇮🇳 India', query: 'India news today' },
  { id: 'world', name: '🌍 World', query: 'world news today' },
  { id: 'tech', name: '💻 Technology', query: 'technology news' },
  { id: 'entertainment', name: '🎬 Entertainment', query: 'Bollywood entertainment news' },
  { id: 'sports', name: '⚽ Sports', query: 'cricket IPL sports India' },
  { id: 'business', name: '💼 Business', query: 'business stock market India' },
  { id: 'politics', name: '🏛️ Politics', query: 'Indian politics news' },
  { id: 'viral', name: '🔥 Viral', query: 'viral trending India' },
  { id: 'gaming', name: '🎮 Gaming', query: 'gaming esports news' },
  { id: 'crypto', name: '₿ Crypto', query: 'cryptocurrency bitcoin news' },
  { id: 'health', name: '🏥 Health', query: 'health fitness news' },
];

// Placeholder images for different categories
const PLACEHOLDER_IMAGES: Record<string, string> = {
  top: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
  india: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800',
  world: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  entertainment: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800',
  sports: 'https://images.unsplash.com/photo-1461896836934- voices-in-sport?w=800',
  business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
  viral: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
  crypto: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
  health: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

// Parse RSS XML to JSON
function parseRSStoArticles(xmlText: string, category: string): NewsArticle[] {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, 'text/xml');
  const items = xml.querySelectorAll('item');
  
  const articles: NewsArticle[] = [];
  
  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const source = item.querySelector('source')?.textContent || 'Google News';
    
    // Extract image from description or media:content
    let image = '';
    const mediaContent = item.querySelector('media\\:content, content');
    if (mediaContent) {
      image = mediaContent.getAttribute('url') || '';
    }
    
    // Try to extract image from description HTML
    if (!image && description) {
      const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) image = imgMatch[1];
    }
    
    // Use placeholder if no image
    if (!image) {
      image = PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.top;
    }
    
    // Clean description
    const cleanDesc = description
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim()
      .slice(0, 200);
    
    if (title && link) {
      articles.push({
        id: generateId(),
        title: title.trim(),
        description: cleanDesc || 'Click to read more...',
        url: link,
        image,
        publishedAt: pubDate || new Date().toISOString(),
        source: { name: source, url: link },
        category,
      });
    }
  });
  
  return articles;
}

// Fetch news from Google News RSS
export async function fetchGoogleNews(query: string, category: string): Promise<NewsArticle[]> {
  try {
    const encodedQuery = encodeURIComponent(query);
    // Using a CORS proxy for RSS
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;
    
    // Try direct fetch first (works in some environments)
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('RSS fetch failed');
    
    const xmlText = await response.text();
    return parseRSStoArticles(xmlText, category);
  } catch (error) {
    console.error('Google News fetch error:', error);
    return [];
  }
}

// Alternative: Fetch from GNews API (if you have key)
export async function fetchGNewsAPI(query: string, category: string): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) return [];
  
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=20&apikey=${GNEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return (data.articles || []).map((a: any) => ({
      id: generateId(),
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      image: a.image || PLACEHOLDER_IMAGES[category],
      publishedAt: a.publishedAt,
      source: a.source,
      category,
    }));
  } catch {
    return [];
  }
}

// Main fetch function - tries multiple sources
export async function fetchNews(category: string = 'top'): Promise<NewsArticle[]> {
  const cat = NEWS_CATEGORIES.find(c => c.id === category) || NEWS_CATEGORIES[0];
  
  // Try GNews API first (if key exists), fallback to Google RSS
  let articles = await fetchGNewsAPI(cat.query, category);
  
  if (articles.length === 0) {
    articles = await fetchGoogleNews(cat.query, category);
  }
  
  // If still no articles, return mock trending data
  if (articles.length === 0) {
    articles = generateMockNews(category);
  }
  
  return articles;
}

// Search news
export async function searchNews(query: string): Promise<NewsArticle[]> {
  if (!query.trim()) return [];
  
  let articles = await fetchGoogleNews(query, 'search');
  
  if (articles.length === 0) {
    articles = await fetchGNewsAPI(query, 'search');
  }
  
  return articles;
}

// Mock news for fallback
function generateMockNews(category: string): NewsArticle[] {
  const mockHeadlines = [
    { title: 'Breaking: Major Tech Company Announces Revolutionary AI Product', desc: 'Industry experts say this could change everything we know about artificial intelligence...' },
    { title: 'Stock Markets Hit All-Time High Amid Economic Recovery', desc: 'Investors celebrate as major indices reach record levels...' },
    { title: 'Sports Update: India Wins Thrilling Match Against Australia', desc: 'A nail-biting finish saw Team India emerge victorious...' },
    { title: 'New Government Policy Expected to Boost Employment', desc: 'Officials announce major reforms targeting job creation...' },
    { title: 'Bollywood Star Announces New Movie Project', desc: 'Fans are excited as details emerge about the upcoming blockbuster...' },
    { title: 'Scientists Make Breakthrough Discovery in Health Research', desc: 'The finding could lead to new treatments for common diseases...' },
    { title: 'Viral Video Takes Internet by Storm', desc: 'Millions of views in just 24 hours as content spreads across platforms...' },
    { title: 'Cryptocurrency Market Shows Signs of Recovery', desc: 'Bitcoin and major altcoins see significant gains...' },
    { title: 'New Smartphone Launch Creates Huge Buzz', desc: 'Tech enthusiasts line up as latest flagship device hits stores...' },
    { title: 'Weather Alert: Heavy Rains Expected in Multiple States', desc: 'Authorities issue advisory as monsoon intensifies...' },
  ];
  
  return mockHeadlines.map((h, i) => ({
    id: generateId(),
    title: h.title,
    description: h.desc,
    url: '#',
    image: PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.top,
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    source: { name: 'News Agency', url: '#' },
    category,
  }));
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
