// ============================================
// TMDB API SERVICE - RAM RAM LADLE!
// ============================================

const TMDB_API_KEY = "a4dbbf30458cbfc90e638af6a70a9d9f";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p";

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  media_type?: string;
  popularity: number;
  adult?: boolean;
  number_of_seasons?: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBDetail extends TMDBMovie {
  imdb_id?: string;
  runtime?: number;
  tagline?: string;
  status?: string;
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: { season_number: number; episode_count: number; name: string }[];
  external_ids?: { imdb_id: string };
}

const GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western", 10759: "Action & Adventure",
  10762: "Kids", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy",
  10766: "Soap", 10767: "Talk", 10768: "War & Politics",
};

// Cache to reduce API calls
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 min

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const qp = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
  const url = `${BASE_URL}${endpoint}?${qp}`;

  const c = cache.get(url);
  if (c && Date.now() - c.ts < CACHE_TTL) return c.data as T;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const data = await res.json();
  cache.set(url, { data, ts: Date.now() });
  return data as T;
}

// ========== ENDPOINTS ==========
export const getTrendingMovies = (p = 1) => fetchTMDB<TMDBResponse>("/trending/movie/week", { page: String(p) });
export const getPopularMovies = (p = 1) => fetchTMDB<TMDBResponse>("/movie/popular", { page: String(p) });
export const getTopRatedMovies = (p = 1) => fetchTMDB<TMDBResponse>("/movie/top_rated", { page: String(p) });
export const getNowPlayingMovies = (p = 1) => fetchTMDB<TMDBResponse>("/movie/now_playing", { page: String(p) });
export const getUpcomingMovies = (p = 1) => fetchTMDB<TMDBResponse>("/movie/upcoming", { page: String(p) });
export const getTrendingTV = (p = 1) => fetchTMDB<TMDBResponse>("/trending/tv/week", { page: String(p) });
export const getPopularTV = (p = 1) => fetchTMDB<TMDBResponse>("/tv/popular", { page: String(p) });
export const getTopRatedTV = (p = 1) => fetchTMDB<TMDBResponse>("/tv/top_rated", { page: String(p) });
export const discoverMovies = (g: number, p = 1) => fetchTMDB<TMDBResponse>("/discover/movie", { page: String(p), with_genres: String(g), sort_by: "popularity.desc" });
export const discoverTV = (g: number, p = 1) => fetchTMDB<TMDBResponse>("/discover/tv", { page: String(p), with_genres: String(g), sort_by: "popularity.desc" });
export const searchMulti = (q: string, p = 1) => fetchTMDB<TMDBResponse>("/search/multi", { query: q, page: String(p) });
export const getMovieDetail = (id: number) => fetchTMDB<TMDBDetail>(`/movie/${id}`, { append_to_response: "external_ids" });
export const getTVDetail = (id: number) => fetchTMDB<TMDBDetail>(`/tv/${id}`, { append_to_response: "external_ids" });

// ========== HELPERS ==========
export const getImgUrl = (path: string | null, size = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "https://via.placeholder.com/500x750/1a1a2e/666?text=No+Poster";

export const getBackdropUrl = (path: string | null, size = "original") =>
  path ? `${IMG_BASE}/${size}${path}` : "https://via.placeholder.com/1920x1080/1a1a2e/666?text=No+Image";

export const getTitle = (item: TMDBMovie) =>
  item.title || item.name || item.original_title || item.original_name || "Unknown";

export const getYear = (item: TMDBMovie) => {
  const d = item.release_date || item.first_air_date;
  return d ? d.split("-")[0] : "N/A";
};

export const getMediaType = (item: TMDBMovie): "movie" | "tv" =>
  (item.media_type as "movie" | "tv") || (item.title ? "movie" : "tv");

export const getGenreNames = (ids: number[]) =>
  ids?.map((id) => GENRES[id]).filter(Boolean) || [];

export const getEmbedUrl = (tmdbId: number, type: "movie" | "tv", s = 1, e = 1) =>
  type === "movie" ? `https://vidrock.net/movie/${tmdbId}` : `https://vidrock.net/tv/${tmdbId}/${s}/${e}`;

// ========== ROW DEFINITIONS ==========
export interface CategoryRow {
  title: string;
  emoji: string;
  fetcher: (page: number) => Promise<TMDBResponse>;
}

export const MOVIE_ROWS: CategoryRow[] = [
  { title: "Trending Now", emoji: "🔥", fetcher: getTrendingMovies },
  { title: "Popular Movies", emoji: "🎬", fetcher: getPopularMovies },
  { title: "Top Rated", emoji: "⭐", fetcher: getTopRatedMovies },
  { title: "Now Playing", emoji: "🆕", fetcher: getNowPlayingMovies },
  { title: "Upcoming", emoji: "📅", fetcher: getUpcomingMovies },
  { title: "Action", emoji: "💥", fetcher: (p) => discoverMovies(28, p) },
  { title: "Comedy", emoji: "😂", fetcher: (p) => discoverMovies(35, p) },
  { title: "Horror", emoji: "👻", fetcher: (p) => discoverMovies(27, p) },
  { title: "Romance", emoji: "❤️", fetcher: (p) => discoverMovies(10749, p) },
  { title: "Sci-Fi", emoji: "🚀", fetcher: (p) => discoverMovies(878, p) },
  { title: "Thriller", emoji: "🔪", fetcher: (p) => discoverMovies(53, p) },
  { title: "Animation", emoji: "🎌", fetcher: (p) => discoverMovies(16, p) },
  { title: "Drama", emoji: "🎭", fetcher: (p) => discoverMovies(18, p) },
  { title: "Adventure", emoji: "🌍", fetcher: (p) => discoverMovies(12, p) },
  { title: "Crime", emoji: "🔍", fetcher: (p) => discoverMovies(80, p) },
  { title: "Fantasy", emoji: "🧙", fetcher: (p) => discoverMovies(14, p) },
  { title: "Documentary", emoji: "📹", fetcher: (p) => discoverMovies(99, p) },
  { title: "War", emoji: "⚔️", fetcher: (p) => discoverMovies(10752, p) },
  { title: "Music", emoji: "🎵", fetcher: (p) => discoverMovies(10402, p) },
  { title: "History", emoji: "📜", fetcher: (p) => discoverMovies(36, p) },
  { title: "Mystery", emoji: "🕵️", fetcher: (p) => discoverMovies(9648, p) },
  { title: "Western", emoji: "🤠", fetcher: (p) => discoverMovies(37, p) },
  { title: "Family", emoji: "👨‍👩‍👧‍👦", fetcher: (p) => discoverMovies(10751, p) },
];

export const TV_ROWS: CategoryRow[] = [
  { title: "Trending TV", emoji: "📺", fetcher: getTrendingTV },
  { title: "Popular TV Shows", emoji: "🔥", fetcher: getPopularTV },
  { title: "Top Rated TV", emoji: "⭐", fetcher: getTopRatedTV },
  { title: "Action & Adventure", emoji: "💥", fetcher: (p) => discoverTV(10759, p) },
  { title: "Sci-Fi & Fantasy", emoji: "🚀", fetcher: (p) => discoverTV(10765, p) },
  { title: "Crime TV", emoji: "🔍", fetcher: (p) => discoverTV(80, p) },
  { title: "Comedy TV", emoji: "😂", fetcher: (p) => discoverTV(35, p) },
  { title: "Drama TV", emoji: "🎭", fetcher: (p) => discoverTV(18, p) },
  { title: "Anime", emoji: "🎌", fetcher: (p) => discoverTV(16, p) },
  { title: "Mystery TV", emoji: "🕵️", fetcher: (p) => discoverTV(9648, p) },
  { title: "Kids", emoji: "👶", fetcher: (p) => discoverTV(10762, p) },
  { title: "War & Politics", emoji: "⚔️", fetcher: (p) => discoverTV(10768, p) },
];
