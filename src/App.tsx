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
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [searching, setSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh] = useState(true);

  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (currentPage !== 'home') return;
    loadNews(activeCategory);
  }, [activeCategory, currentPage]);

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

  if (currentPage === 'privacy') return <PrivacyPolicy onBack={goHome} />;
  if (currentPage === 'about') return <About onBack={goHome} />;
  if (currentPage === 'contact') return <Contact onBack={goHome} />;
  if (currentPage === 'disclaimer') return <Disclaimer onBack={goHome} />;

  const displayArticles = searchQuery.trim() ? searchResults : articles;
  const featuredArticle = displayArticles[0];
  const gridArticles = displayArticles.slice(1);

  return (
    <div className="min-h-screen bg-[#0f0f12] text-white">
      <div className="w-full bg-[#1a1a1f] border-b border-gray-800 py-2 text-center">
        <div className="max-w-[728px] h-[90px] mx-auto bg-gray-800/50 rounded flex items-center justify-center text-gray-600 text-sm">
          <span>Advertisement</span>
        </div>
      </div>

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
