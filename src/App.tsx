import { useState, useEffect, useRef } from 'react';
import {
  type NewsArticle,
  NEWS_CATEGORIES,
  fetchNews,
  searchNews,
  timeAgo,
} from './api/news';
import PrivacyPolicy from './pages/PrivacyPolicy';
import About from './pages/About';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';
import {
  Search, RefreshCw, ExternalLink, Clock, TrendingUp,
  Menu, X, ChevronRight, Zap, Globe, Share2
} from 'lucide-react';

type Page = 'home' | 'privacy' | 'about' | 'contact' | 'disclaimer';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('top');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh] = useState(true);

  const searchTimeoutRef = useRef<number | null>(null);

  // Load news
  useEffect(() => {
    if (currentPage !== 'home') return;
    loadNews(activeCategory);
  }, [activeCategory, currentPage]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh || currentPage !== 'home') return;
    const interval = setInterval(() => {
      loadNews(activeCategory);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeCategory, autoRefresh, currentPage]);

  const loadNews = async (category: string) => {
    setLoading(true);
    const news = await fetchNews(category);
    setArticles(news);
    setLastUpdated(new Date());
    setLoading(false);
  };

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = window.setTimeout(async () => {
      const results = await searchNews(searchQuery);
      setSearchResults(results);
      setSearching(false);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleRefresh = () => {
    if (searchQuery.trim()) {
      setSearching(true);
      searchNews(searchQuery).then(setSearchResults).finally(() => setSearching(false));
    } else {
      loadNews(activeCategory);
    }
  };

  const handleShare = async (article: NewsArticle) => {
    if (navigator.share) {
      await navigator.share({ title: article.title, text: article.description, url: article.url });
    } else {
      navigator.clipboard.writeText(article.url);
      alert('Link copied!');
    }
  };

  const goHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0 });
  };

  // Render pages
  if (currentPage === 'privacy') return <PrivacyPolicy onBack={goHome} />;
  if (currentPage === 'about') return <About onBack={goHome} />;
  if (currentPage === 'contact') return <Contact onBack={goHome} />;
  if (currentPage === 'disclaimer') return <Disclaimer onBack={goHome} />;

  const displayArticles = searchQuery.trim() ? searchResults : articles;
  const featuredArticle = displayArticles[0];
  const gridArticles = displayArticles.slice(1);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white">
      {/* ===== AD SPACE: TOP BANNER ===== */}
      <div className="w-full bg-[#1a1a1f] border-b border-gray-800 py-2 text-center">
        <div className="max-w-[728px] h-[90px] mx-auto bg-gray-800/50 rounded flex items-center justify-center text-gray-600 text-sm">
          {/* PROPELLERADS/ADSTERRA AD CODE YAHAN PASTE KARNA */}
          <span>Advertisement</span>
        </div>
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 bg-[#0f0f12]/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
              <Zap className="w-7 h-7 text-yellow-500" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-black leading-none">KHABAR<span className="text-red-500">BLAST</span></h1>
                <p className="text-[9px] text-gray-500 tracking-widest">24/7 AUTO UPDATES</p>
              </div>
            </div>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any news..."
                  className="w-full bg-white/5 border border-gray-700/50 text-white pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:border-yellow-500/50 placeholder-gray-500"
                />
                {searching && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-500 animate-spin" />}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleRefresh} disabled={loading || searching} className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-yellow-500' : 'text-gray-400'}`} />
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id && !searchQuery ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 p-4 grid grid-cols-3 gap-2">
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); setMobileMenuOpen(false); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id && !searchQuery ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ===== TICKER ===== */}
      <div className="bg-red-600 text-white py-1.5 overflow-hidden">
        <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
          <span className="flex items-center gap-1 font-bold text-xs"><TrendingUp className="w-3 h-3" /> LIVE</span>
          {articles.slice(0, 5).map((a, i) => <span key={i} className="text-xs">• {a.title.slice(0, 60)}...</span>)}
          <span className="flex items-center gap-1 font-bold text-xs"><TrendingUp className="w-3 h-3" /> LIVE</span>
          {articles.slice(0, 5).map((a, i) => <span key={`d-${i}`} className="text-xs">• {a.title.slice(0, 60)}...</span>)}
        </div>
      </div>

      {/* ===== MAIN ===== */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3" />
            <span>{searchQuery ? `Searching: "${searchQuery}"` : NEWS_CATEGORIES.find(c => c.id === activeCategory)?.name}</span>
            <span>•</span>
            <span>{displayArticles.length} articles</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>Updated {timeAgo(lastUpdated.toISOString())}</span>
            <span className="flex items-center gap-1 text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Auto
            </span>
          </div>
        </div>

        {loading && displayArticles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="bg-white/5 rounded-xl aspect-[4/3] animate-pulse" />)}
          </div>
        ) : displayArticles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No news found</h3>
            <p className="text-gray-500">Try a different search or category</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featuredArticle && (
              <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer" className="block mb-6 group">
                <div className="relative rounded-2xl overflow-hidden bg-white/5">
                  <div className="aspect-[21/9] md:aspect-[3/1]">
                    <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'; }} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">BREAKING</span>
                      <span className="text-gray-400 text-xs">{timeAgo(featuredArticle.publishedAt)}</span>
                    </div>
                    <h2 className="text-xl md:text-3xl font-black mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2">{featuredArticle.title}</h2>
                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl">{featuredArticle.description}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-gray-400">{featuredArticle.source.name}</span>
                      <span className="flex items-center gap-1 text-yellow-500 text-xs font-medium group-hover:gap-2 transition-all">Read More <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </div>
              </a>
            )}

            {/* ===== AD SPACE: AFTER FEATURED ===== */}
            <div className="mb-6 bg-[#1a1a1f] rounded-xl py-3 text-center">
              <div className="max-w-[728px] h-[90px] mx-auto bg-gray-800/50 rounded flex items-center justify-center text-gray-600 text-sm">
                {/* AD CODE HERE */}
                <span>Advertisement</span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gridArticles.slice(0, 6).map((article) => (
                <article key={article.id} className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'; }} />
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded">{article.source.name}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">{article.title}</h3>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-3">{article.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(article.publishedAt)}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.preventDefault(); handleShare(article); }} className="p-1 hover:text-yellow-500 transition-colors"><Share2 className="w-3.5 h-3.5" /></button>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>

            {/* ===== AD SPACE: MIDDLE ===== */}
            <div className="my-6 bg-[#1a1a1f] rounded-xl py-3 text-center">
              <div className="max-w-[336px] h-[280px] mx-auto bg-gray-800/50 rounded flex items-center justify-center text-gray-600 text-sm">
                {/* AD CODE HERE */}
                <span>Advertisement</span>
              </div>
            </div>

            {/* More Articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gridArticles.slice(6).map((article) => (
                <article key={article.id} className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'; }} />
                      <div className="absolute top-2 left-2">
                        <span className="bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded">{article.source.name}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">{article.title}</h3>
                      <p className="text-gray-400 text-xs line-clamp-2 mb-3">{article.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(article.publishedAt)}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-yellow-500 transition-colors" />
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#080809] border-t border-gray-800/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Categories</h4>
              <div className="flex flex-col gap-1">
                {NEWS_CATEGORIES.slice(0, 6).map((cat) => (
                  <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); window.scrollTo({ top: 0 }); }}
                    className="text-gray-500 text-xs text-left hover:text-yellow-500 transition-colors">{cat.name}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">More</h4>
              <div className="flex flex-col gap-1">
                {NEWS_CATEGORIES.slice(6).map((cat) => (
                  <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); window.scrollTo({ top: 0 }); }}
                    className="text-gray-500 text-xs text-left hover:text-yellow-500 transition-colors">{cat.name}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Company</h4>
              <div className="flex flex-col gap-1">
                <button onClick={() => setCurrentPage('about')} className="text-gray-500 text-xs text-left hover:text-yellow-500 transition-colors">About Us</button>
                <button onClick={() => setCurrentPage('contact')} className="text-gray-500 text-xs text-left hover:text-yellow-500 transition-colors">Contact</button>
                <button onClick={() => setCurrentPage('privacy')} className="text-gray-500 text-xs text-left hover:text-yellow-500 transition-colors">Privacy Policy</button>
                <button onClick={() => setCurrentPage('disclaimer')} className="text-gray-500 text-xs text-left hover:text-yellow-500 transition-colors">Disclaimer</button>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-3">Features</h4>
              <p className="text-gray-500 text-xs">✅ 24/7 Auto Updates</p>
              <p className="text-gray-500 text-xs">✅ 12+ Categories</p>
              <p className="text-gray-500 text-xs">✅ Live Search</p>
              <p className="text-gray-500 text-xs">✅ Mobile Friendly</p>
            </div>
          </div>
          <div className="border-t border-gray-800/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-black">KHABAR<span className="text-red-500">BLAST</span></span>
            </div>
            <p className="text-gray-600 text-xs text-center">© {new Date().getFullYear()} KhabarBlast • Auto-Updated 24/7 • khabarblast.online</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
}

export default App;
