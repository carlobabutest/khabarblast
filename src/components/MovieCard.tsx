import { Play, Star, Info } from 'lucide-react';
import { type TMDBMovie, getImgUrl, getTitle, getYear, getGenreNames, getMediaType } from '../api/tmdb';

interface MovieCardProps {
  item: TMDBMovie;
  onPlay: (item: TMDBMovie) => void;
  onInfo: (item: TMDBMovie) => void;
}

const MovieCard = ({ item, onPlay, onInfo }: MovieCardProps) => {
  const type = getMediaType(item);

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-2xl hover:shadow-black/60"
      onClick={() => onInfo(item)}
    >
      <div className="aspect-[2/3]">
        <img
          src={getImgUrl(item.poster_path, "w342")}
          alt={getTitle(item)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={(e) => { e.stopPropagation(); onPlay(item); }}
            className="bg-red-600 hover:bg-red-700 p-2 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <Play className="fill-white text-white w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onInfo(item); }}
            className="bg-white/15 hover:bg-white/25 backdrop-blur-sm p-2 rounded-full transition-all border border-white/20"
          >
            <Info className="text-white w-3.5 h-3.5" />
          </button>
        </div>
        <h3 className="text-white font-bold text-xs sm:text-sm truncate mb-1">{getTitle(item)}</h3>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs">
          <span className="flex items-center gap-0.5 text-yellow-400 font-bold">
            <Star className="w-3 h-3 fill-yellow-400" />
            {item.vote_average?.toFixed(1)}
          </span>
          <span className="text-gray-400">{getYear(item)}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400 uppercase text-[9px]">{type}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {getGenreNames(item.genre_ids).slice(0, 2).map((g) => (
            <span key={g} className="text-[9px] text-gray-400 bg-white/10 px-1.5 py-0.5 rounded-full">{g}</span>
          ))}
        </div>
      </div>

      {/* Rating Badge */}
      <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
        <span className="text-[10px] font-bold text-white">{item.vote_average?.toFixed(1)}</span>
      </div>

      {type === "tv" && (
        <div className="absolute top-1.5 left-1.5 bg-red-600 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">TV</div>
      )}
    </div>
  );
};

export default MovieCard;
