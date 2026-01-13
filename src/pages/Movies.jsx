import { useState, useEffect } from "react";

const Movies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("trending");

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Trending Movies
      const trendingResponse = await fetch(
        `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
      );
      const trendingData = await trendingResponse.json();

      // Fetch Popular Movies
      const popularResponse = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}`
      );
      const popularData = await popularResponse.json();

      // Fetch Top Rated Movies
      const topRatedResponse = await fetch(
        `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
      );
      const topRatedData = await topRatedResponse.json();

      setTrendingMovies(trendingData.results || []);
      setPopularMovies(popularData.results || []);
      setTopRatedMovies(topRatedData.results || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch movies. Please check your API credentials.");
      setLoading(false);
      console.error("Error fetching movies:", err);
    }
  };

  const getActiveMovies = () => {
    switch (activeTab) {
      case "trending":
        return trendingMovies;
      case "popular":
        return popularMovies;
      case "topRated":
        return topRatedMovies;
      default:
        return trendingMovies;
    }
  };

  const MovieCard = ({ movie }) => (
    <div className="group relative bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="relative aspect-[2/3] overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <svg className="w-20 h-20 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 002 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5a2 2 0 00-2-2zm0 14H3V5h18v12z" />
            </svg>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded-full flex items-center space-x-1">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-white text-sm font-bold">{movie.vote_average.toFixed(1)}</span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white text-sm line-clamp-3">{movie.overview}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{new Date(movie.release_date).getFullYear()}</span>
          <span className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{movie.vote_count}</span>
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-8 max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-white text-2xl font-bold mb-2 text-center">Error</h2>
          <p className="text-red-200 text-center">{error}</p>
          <button
            onClick={fetchMovies}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Discover Movies
          </h1>
          <p className="text-slate-400">Powered by The Movie Database (TMDB) API</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "trending"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
          >
            🔥 Trending This Week
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "popular"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
          >
            ⭐ Popular
          </button>
          <button
            onClick={() => setActiveTab("topRated")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "topRated"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
          >
            🏆 Top Rated
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {getActiveMovies().slice(0, 20).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 bg-slate-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-400">{trendingMovies.length}</p>
              <p className="text-slate-400">Trending Movies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-pink-400">{popularMovies.length}</p>
              <p className="text-slate-400">Popular Movies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">{topRatedMovies.length}</p>
              <p className="text-slate-400">Top Rated Movies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
