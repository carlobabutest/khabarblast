import { Play, Info, Star, Calendar, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type TMDBMovie, getTrendingMovies, getBackdropUrl, getTitle, getYear, getGenreNames } from '../api/tmdb';

interface HeroProps {
  onPlay: (item: TMDBMovie) => void;
  onInfo: (item: TMDBMovie) => void;
}

const Hero = ({ onPlay, onInfo }: HeroProps) => {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    getTrendingMovies(1).then((data) => {
      setMovies(data.results.filter((m) => m.backdrop_path && m.overview).slice(0, 10));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
        setFade(true);
      }, 600);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <div className="h-[95vh] w-full bg-gradient-to-b from-gray-900 to-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🙏</span>
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    );
  }

  const movie = movies[currentIndex];
  const ratingPercent = Math.round((movie.vote_average || 0) * 10);

  return (
    <div className="relative h-[95vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <img
          src={getBackdropUrl(movie.backdrop_path)}
          alt={getTitle(movie)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlays - Netflix style */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0a0f]/60 to-transparent" />

      {/* Content */}
      <div className={`relative h-full flex flex-col justify-end pb-36 md:pb-40 px-4 md:px-12 lg:px-16 max-w-3xl transition-all duration-700 ease-out ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        
        {/* Trending Badge */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-red-600/90 px-3 py-1 rounded-md">
            <TrendingUp className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-bold uppercase tracking-wider">Trending #{currentIndex + 1}</span>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-3">
          {getGenreNames(movie.genre_ids).map((g) => (
            <span key={g} className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-white/10 text-white/80 backdrop-blur-sm">{g}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-4 drop-shadow-2xl">
          {getTitle(movie)}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 md:gap-4 mb-4 text-sm flex-wrap">
          <span className="text-green-500 font-bold text-base">{ratingPercent}% Match</span>
          <span className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star className="w-4 h-4 fill-yellow-400" />{movie.vote_average?.toFixed(1)}
          </span>
          <span className="flex items-center gap-1 text-gray-300">
            <Calendar className="w-3.5 h-3.5" />{getYear(movie)}
          </span>
          <span className="px-2 py-0.5 border border-gray-500 rounded text-[10px] text-gray-300 font-medium">HD</span>
          <span className="px-2 py-0.5 border border-gray-500 rounded text-[10px] text-gray-300 font-medium">5.1</span>
        </div>

        {/* Overview */}
        <p className="text-gray-200 text-sm md:text-base line-clamp-3 leading-relaxed mb-6 max-w-xl">
          {movie.overview}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPlay(movie)}
            className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-3 rounded-md font-bold text-sm md:text-base transition-all duration-200 hover:scale-105"
          >
            <Play className="fill-black w-5 h-5" />
            Play
          </button>
          <button
            onClick={() => onInfo(movie)}
            className="flex items-center gap-2 bg-gray-500/50 hover:bg-gray-500/70 text-white px-6 md:px-8 py-3 rounded-md font-bold text-sm md:text-base backdrop-blur-sm transition-all duration-200"
          >
            <Info className="w-5 h-5" />
            More Info
          </button>
        </div>
      </div>

      {/* Side Indicators */}
      <div className="absolute bottom-36 right-4 md:right-12 flex flex-col gap-1.5">
        {movies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setFade(false); setTimeout(() => { setCurrentIndex(idx); setFade(true); }, 400); }}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-2.5 h-6 bg-white'
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Bottom Number Badge - Netflix style */}
      <div className="absolute bottom-36 right-4 md:right-24 hidden lg:flex items-end">
        <span className="text-[120px] font-black text-transparent leading-none" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>
          {currentIndex + 1}
        </span>
      </div>
    </div>
  );
};

export default Hero;
