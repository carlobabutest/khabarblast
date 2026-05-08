import { X, Play, Star, Calendar, Tv, Film } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type TMDBMovie, type TMDBDetail, getBackdropUrl, getImgUrl, getTitle, getYear, getGenreNames, getMediaType, getMovieDetail, getTVDetail } from '../api/tmdb';

interface DetailModalProps {
  item: TMDBMovie;
  onClose: () => void;
  onPlay: (item: TMDBMovie, detail?: TMDBDetail) => void;
}

const DetailModal = ({ item, onClose, onPlay }: DetailModalProps) => {
  const [detail, setDetail] = useState<TMDBDetail | null>(null);
  const type = getMediaType(item);

  useEffect(() => {
    const fetchDetail = type === 'movie' ? getMovieDetail : getTVDetail;
    fetchDetail(item.id).then(setDetail).catch(() => {});
  }, [item.id, type]);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl bg-[#181820] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ scrollbarWidth: 'none' }}>
        <div className="relative aspect-video">
          <img src={getBackdropUrl(item.backdrop_path, "w1280")} alt={getTitle(item)} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181820] via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => onPlay(item, detail || undefined)} className="absolute inset-0 flex items-center justify-center group/play">
            <div className="bg-red-600 hover:bg-red-700 p-5 rounded-full transition-all duration-300 group-hover/play:scale-110 shadow-2xl shadow-red-600/40">
              <Play className="w-8 h-8 fill-white text-white" />
            </div>
          </button>
        </div>
        <div className="p-6 md:p-8 -mt-10 relative">
          <div className="flex gap-6">
            <div className="hidden sm:block flex-shrink-0 -mt-20">
              <img src={getImgUrl(item.poster_path, "w342")} alt={getTitle(item)} className="w-32 rounded-xl shadow-2xl border-2 border-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{getTitle(item)}</h2>
              {detail?.tagline && <p className="text-gray-400 italic text-sm mb-3">"{detail.tagline}"</p>}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="flex items-center gap-1.5 text-yellow-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-yellow-400" />{item.vote_average?.toFixed(1)} / 10
                </span>
                <span className="flex items-center gap-1.5 text-gray-400 text-sm"><Calendar className="w-4 h-4" />{getYear(item)}</span>
                <span className="flex items-center gap-1.5 text-gray-400 text-sm">{type === 'tv' ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}{type === 'tv' ? 'TV Series' : 'Movie'}</span>
                {detail?.runtime && <span className="text-gray-400 text-sm">{detail.runtime} min</span>}
                {detail?.number_of_seasons && <span className="text-gray-400 text-sm">{detail.number_of_seasons} Season{detail.number_of_seasons > 1 ? 's' : ''}</span>}
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30">HD</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(detail?.genres || []).map((g) => (
                  <span key={g.id} className="text-xs px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10">{g.name}</span>
                ))}
                {!detail && getGenreNames(item.genre_ids).map((g) => (
                  <span key={g} className="text-xs px-3 py-1 bg-white/5 text-gray-300 rounded-full border border-white/10">{g}</span>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{item.overview}</p>
              {detail?.imdb_id && <p className="text-xs text-gray-500 mb-4">IMDB: <span className="text-gray-400">{detail.imdb_id}</span></p>}
              {detail?.external_ids?.imdb_id && <p className="text-xs text-gray-500 mb-4">IMDB: <span className="text-gray-400">{detail.external_ids.imdb_id}</span></p>}
              <button onClick={() => onPlay(item, detail || undefined)} className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/30 w-full sm:w-auto justify-center">
                <Play className="fill-white w-5 h-5" />{type === 'tv' ? 'Start Watching' : 'Watch Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
