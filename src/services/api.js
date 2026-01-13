import { API_KEY, BASE_URL, DEFAULT_LANGUAGE, DEFAULT_PAGE } from "../utils/constants";

/**
 * Centralized TMDB API Service
 * All API calls go through this service
 */

// Base fetch function with error handling
const fetchFromAPI = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("language", DEFAULT_LANGUAGE);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

// ==================== TRENDING ====================

export const getTrending = async (mediaType = "all", timeWindow = "week") => {
  return fetchFromAPI(`/trending/${mediaType}/${timeWindow}`);
};

// ==================== MOVIES ====================

export const getPopularMovies = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/movie/popular", { page });
};

export const getTopRatedMovies = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/movie/top_rated", { page });
};

export const getNowPlayingMovies = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/movie/now_playing", { page });
};

export const getUpcomingMovies = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/movie/upcoming", { page });
};

export const getMovieDetails = async (movieId) => {
  return fetchFromAPI(`/movie/${movieId}`, {
    append_to_response: "credits,videos,similar,recommendations,images"
  });
};

export const getMovieCredits = async (movieId) => {
  return fetchFromAPI(`/movie/${movieId}/credits`);
};

export const getMovieVideos = async (movieId) => {
  return fetchFromAPI(`/movie/${movieId}/videos`);
};

export const getSimilarMovies = async (movieId, page = DEFAULT_PAGE) => {
  return fetchFromAPI(`/movie/${movieId}/similar`, { page });
};

export const getMovieRecommendations = async (movieId, page = DEFAULT_PAGE) => {
  return fetchFromAPI(`/movie/${movieId}/recommendations`, { page });
};

// ==================== TV SHOWS ====================

export const getPopularTVShows = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/tv/popular", { page });
};

export const getTopRatedTVShows = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/tv/top_rated", { page });
};

export const getAiringTodayTVShows = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/tv/airing_today", { page });
};

export const getOnTheAirTVShows = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/tv/on_the_air", { page });
};

export const getTVShowDetails = async (tvId) => {
  return fetchFromAPI(`/tv/${tvId}`, {
    append_to_response: "credits,videos,similar,recommendations,images"
  });
};

export const getTVShowCredits = async (tvId) => {
  return fetchFromAPI(`/tv/${tvId}/credits`);
};

export const getTVShowVideos = async (tvId) => {
  return fetchFromAPI(`/tv/${tvId}/videos`);
};

export const getSimilarTVShows = async (tvId, page = DEFAULT_PAGE) => {
  return fetchFromAPI(`/tv/${tvId}/similar`, { page });
};

export const getTVShowRecommendations = async (tvId, page = DEFAULT_PAGE) => {
  return fetchFromAPI(`/tv/${tvId}/recommendations`, { page });
};

export const getTVSeasonDetails = async (tvId, seasonNumber) => {
  return fetchFromAPI(`/tv/${tvId}/season/${seasonNumber}`);
};

// ==================== PEOPLE ====================

export const getPersonDetails = async (personId) => {
  return fetchFromAPI(`/person/${personId}`, {
    append_to_response: "movie_credits,tv_credits,images"
  });
};

export const getPersonMovieCredits = async (personId) => {
  return fetchFromAPI(`/person/${personId}/movie_credits`);
};

export const getPersonTVCredits = async (personId) => {
  return fetchFromAPI(`/person/${personId}/tv_credits`);
};

export const getPopularPeople = async (page = DEFAULT_PAGE) => {
  return fetchFromAPI("/person/popular", { page });
};

// ==================== SEARCH ====================

export const searchMulti = async (query, page = DEFAULT_PAGE) => {
  return fetchFromAPI("/search/multi", { query, page });
};

export const searchMovies = async (query, page = DEFAULT_PAGE) => {
  return fetchFromAPI("/search/movie", { query, page });
};

export const searchTVShows = async (query, page = DEFAULT_PAGE) => {
  return fetchFromAPI("/search/tv", { query, page });
};

export const searchPeople = async (query, page = DEFAULT_PAGE) => {
  return fetchFromAPI("/search/person", { query, page });
};

// ==================== DISCOVER ====================

export const discoverMovies = async (filters = {}) => {
  const {
    page = DEFAULT_PAGE,
    sortBy = "popularity.desc",
    withGenres,
    year,
    voteAverageGte,
    voteAverageLte,
    withRuntimeGte,
    withRuntimeLte
  } = filters;

  return fetchFromAPI("/discover/movie", {
    page,
    sort_by: sortBy,
    with_genres: withGenres,
    year,
    "vote_average.gte": voteAverageGte,
    "vote_average.lte": voteAverageLte,
    "with_runtime.gte": withRuntimeGte,
    "with_runtime.lte": withRuntimeLte
  });
};

export const discoverTV = async (filters = {}) => {
  const {
    page = DEFAULT_PAGE,
    sortBy = "popularity.desc",
    withGenres,
    firstAirDateYear,
    voteAverageGte,
    voteAverageLte
  } = filters;

  return fetchFromAPI("/discover/tv", {
    page,
    sort_by: sortBy,
    with_genres: withGenres,
    first_air_date_year: firstAirDateYear,
    "vote_average.gte": voteAverageGte,
    "vote_average.lte": voteAverageLte
  });
};

// ==================== GENRES ====================

export const getMovieGenres = async () => {
  return fetchFromAPI("/genre/movie/list");
};

export const getTVGenres = async () => {
  return fetchFromAPI("/genre/tv/list");
};

// ==================== CONFIGURATION ====================

export const getConfiguration = async () => {
  return fetchFromAPI("/configuration");
};

export default {
  // Trending
  getTrending,

  // Movies
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getMovieRecommendations,

  // TV Shows
  getPopularTVShows,
  getTopRatedTVShows,
  getAiringTodayTVShows,
  getOnTheAirTVShows,
  getTVShowDetails,
  getTVShowCredits,
  getTVShowVideos,
  getSimilarTVShows,
  getTVShowRecommendations,
  getTVSeasonDetails,

  // People
  getPersonDetails,
  getPersonMovieCredits,
  getPersonTVCredits,
  getPopularPeople,

  // Search
  searchMulti,
  searchMovies,
  searchTVShows,
  searchPeople,

  // Discover
  discoverMovies,
  discoverTV,

  // Genres
  getMovieGenres,
  getTVGenres,

  // Configuration
  getConfiguration
};
