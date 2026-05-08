import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ onSearch, searchQuery, activeTab, onTabChange }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchRef.current) searchRef.current.focus();
  }, [isSearchExpanded]);

  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'movies', label: 'Movies', icon: '🎬' },
    { id: 'tvshows', label: 'TV Shows', icon: '📺' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-8 lg:px-12",
      isScrolled
        ? "bg-[#0a0a0f]/95 backdrop-blur-xl shadow-2xl shadow-black/30 py-2.5"
        : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4"
    )}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6 md:gap-10">
          <div
            className="flex items-center gap-2 cursor-pointer group select-none"
            onClick={() => { onSearch(""); onTabChange("home"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className="text-2xl md:text-3xl">🙏</span>
            <div className="flex flex-col leading-none">
              <span className="text-lg md:text-xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                RAM RAM
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-orange-500 uppercase">
                LADLE!
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); onSearch(""); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5",
                  activeTab === tab.id
                    ? "text-white bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <span className="text-xs">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center transition-all duration-300 rounded-full overflow-hidden",
            isSearchExpanded
              ? "bg-black/60 border border-gray-600 w-56 sm:w-72 md:w-96"
              : "w-10"
          )}>
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="p-2.5 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <Search className="w-5 h-5" />
            </button>
            {isSearchExpanded && (
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                placeholder="Search any movie or TV show..."
                onChange={(e) => onSearch(e.target.value)}
                className="bg-transparent text-white pr-4 py-2 text-sm focus:outline-none w-full placeholder-gray-500"
              />
            )}
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-white p-2 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden overflow-hidden transition-all duration-300",
        isMobileMenuOpen ? "max-h-80 mt-4" : "max-h-0"
      )}>
        <div className="bg-[#0a0a0f]/95 backdrop-blur-xl rounded-xl border border-gray-800 p-4 flex flex-col gap-2">
          {/* Mobile Search */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              placeholder="Search movies, TV shows..."
              onChange={(e) => { onSearch(e.target.value); }}
              className="w-full bg-white/5 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-orange-500 placeholder-gray-500"
            />
          </div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { onTabChange(tab.id); onSearch(""); setIsMobileMenuOpen(false); }}
              className={cn(
                "px-4 py-3 rounded-lg text-left text-sm font-medium transition-all flex items-center gap-2",
                activeTab === tab.id
                  ? "text-white bg-orange-500/20 border border-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
