import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { type TMDBMovie, type TMDBResponse } from '../api/tmdb';

interface MovieRowProps {
  title: string;
  emoji: string;
  fetcher: (page: number) => Promise<TMDBResponse>;
  onPlay: (item: TMDBMovie) => void;
  onInfo: (item: TMDBMovie) => void;
}

const MovieRow = ({ title, emoji, fetcher, onPlay, onInfo }: MovieRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TMDBMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher(1)
      .then((data) => {
        if (!cancelled) {
          setItems(data.results.filter((m) => m.poster_path));
          setHasMore(data.page < data.total_pages);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    try {
      const data = await fetcher(nextPage);
      setItems((prev) => [...prev, ...data.results.filter((m) => m.poster_path)]);
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch {}
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScroll = direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 400) {
      loadMore();
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-white px-4 md:px-12 lg:px-16 flex items-center gap-2">
          <span>{emoji}</span> {title}
        </h2>
        <div className="flex gap-3 px-4 md:px-12 lg:px-16 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-none w-[140px] sm:w-[160px] md:w-[185px] aspect-[2/3] bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-3 group/row">
      <h2 className="text-xl md:text-2xl font-bold text-white px-4 md:px-12 lg:px-16 flex items-center gap-2">
        <span>{emoji}</span> {title}
        <span className="text-sm text-gray-500 font-normal ml-1">({items.length}+)</span>
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-30 w-10 bg-gradient-to-r from-[#0a0a0f] to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <div className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
            <ChevronLeft className="text-white w-5 h-5" />
          </div>
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scroll-smooth gap-3 px-4 md:px-12 lg:px-16 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex-none w-[140px] sm:w-[160px] md:w-[185px]">
              <MovieCard item={item} onPlay={onPlay} onInfo={onInfo} />
            </div>
          ))}
          {hasMore && (
            <div className="flex-none w-[140px] sm:w-[160px] md:w-[185px] aspect-[2/3] bg-gray-800/50 rounded-xl flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-30 w-10 bg-gradient-to-l from-[#0a0a0f] to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <div className="bg-white/10 hover:bg-white/20 p-1.5 rounded-full">
            <ChevronRight className="text-white w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
