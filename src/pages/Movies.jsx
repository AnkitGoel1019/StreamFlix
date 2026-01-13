import { useState, useEffect } from "react";
import { getTrending, getPopularMovies, getTopRatedMovies, discoverMovies, getMovieGenres } from "../services/api";
import MediaCard from "../components/MediaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Filters
  const [activeTab, setActiveTab] = useState("trending");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies(1, true);
  }, [activeTab, selectedGenre, sortBy]);

  const fetchGenres = async () => {
    try {
      const data = await getMovieGenres();
      setGenres(data.genres || []);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchMovies = async (pageNum, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      let data;

      if (selectedGenre || sortBy !== "popularity.desc" || activeTab === "discover") {
        // Use discover API for filters
        data = await discoverMovies({
          page: pageNum,
          withGenres: selectedGenre,
          sortBy: sortBy
        });
      } else {
        // Use standard endpoints for tabs
        switch (activeTab) {
          case "trending":
            data = await getTrending("movie", "week");
            break;
          case "popular":
            data = await getPopularMovies(pageNum);
            break;
          case "topRated":
            data = await getTopRatedMovies(pageNum);
            break;
          default:
            data = await getPopularMovies(pageNum);
        }
      }

      if (reset) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }

      setTotalResults(data.total_results || 0);
      setPage(pageNum);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch movies. Please check your connection.");
      setLoading(false);
      console.error("Error fetching movies:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedGenre("");
    setSortBy("popularity.desc");
  };

  const handleLoadMore = () => {
    fetchMovies(page + 1);
  };

  if (error && movies.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ErrorMessage message={error} onRetry={() => fetchMovies(1, true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Discover Movies
            </h1>
            <p className="text-slate-400">Explore our vast library of cinema</p>
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Genre Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Category</label>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  setSelectedGenre(e.target.value);
                  setActiveTab("discover");
                }}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px]"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setActiveTab("discover");
                }}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px]"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Top Rated</option>
                <option value="primary_release_date.desc">Newest</option>
                <option value="revenue.desc">Box Office</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleTabChange("trending")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "trending" && !selectedGenre
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
          >
            🔥 Trending
          </button>
          <button
            onClick={() => handleTabChange("popular")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "popular" && !selectedGenre
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
          >
            ⭐ Popular
          </button>
          <button
            onClick={() => handleTabChange("topRated")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "topRated" && !selectedGenre
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
          >
            🏆 Top Rated
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MediaCard key={movie.id} item={movie} mediaType="movie" />
          ))}
        </div>

        {/* Loading state for pagination */}
        {loading && (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Load More */}
        {!loading && movies.length < totalResults && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-10 rounded-lg transition-all border border-slate-700 hover:border-purple-500 shadow-xl"
            >
              Load More
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-xl">No movies found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
