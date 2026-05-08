import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type TMDBMovie, type TMDBDetail, getTitle, getMediaType, getEmbedUrl, getTVDetail } from '../api/tmdb';

interface PlayerModalProps {
  item: TMDBMovie;
  detail?: TMDBDetail;
  onClose: () => void;
}

const PlayerModal = ({ item, detail: initialDetail, onClose }: PlayerModalProps) => {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [detail, setDetail] = useState<TMDBDetail | null>(initialDetail || null);

  const type = getMediaType(item);
  const isTv = type === 'tv';

  useEffect(() => {
    if (isTv && !detail) {
      getTVDetail(item.id).then(setDetail).catch(() => {});
    }
  }, [item.id, isTv, detail]);

  const totalSeasons = detail?.number_of_seasons || item.number_of_seasons || 1;
  const seasons = detail?.seasons?.filter(s => s.season_number > 0) || [];
  const currentSeason = seasons.find(s => s.season_number === season);
  const maxEpisodes = currentSeason?.episode_count || 10;

  const embedUrl = getEmbedUrl(item.id, type, season, episode);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-black/90 border-b border-gray-800/50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div>
            <h2 className="text-white font-bold text-base md:text-lg">{getTitle(item)}</h2>
            {isTv && <p className="text-gray-400 text-xs md:text-sm">Season {season} • Episode {episode}</p>}
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-black">
        <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; encrypted-media; fullscreen" />
      </div>

      {isTv && (
        <div className="bg-[#0a0a0f] border-t border-gray-800 px-4 md:px-8 py-3 max-h-[35vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-3 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <span className="text-gray-400 text-xs font-medium flex-shrink-0">Season:</span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                <button key={s} onClick={() => { setSeason(s); setEpisode(1); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${season === s ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  S{s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            <span className="text-gray-400 text-xs font-medium flex-shrink-0">Episode:</span>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(ep => (
                <button key={ep} onClick={() => setEpisode(ep)}
                  className={`w-9 h-9 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${episode === ep ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {ep}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => { if (episode > 1) setEpisode(episode - 1); else if (season > 1) { setSeason(season - 1); setEpisode(1); } }}
              disabled={season === 1 && episode === 1}
              className="flex items-center gap-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors text-xs">
              <ChevronLeft className="w-4 h-4" />Prev
            </button>
            <button onClick={() => { if (episode < maxEpisodes) setEpisode(episode + 1); else if (season < totalSeasons) { setSeason(season + 1); setEpisode(1); } }}
              disabled={season === totalSeasons && episode === maxEpisodes}
              className="flex items-center gap-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors text-xs">
              Next<ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerModal;
