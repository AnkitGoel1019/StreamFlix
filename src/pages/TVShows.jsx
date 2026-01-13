import { useState, useEffect } from "react";
import { getTrending, getPopularTVShows, getTopRatedTVShows, getAiringTodayTVShows, getOnTheAirTVShows, discoverTV, getTVGenres } from "../services/api";
import MediaCard from "../components/MediaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const TVShows = () => {
  const [shows, setShows] = useState([]);
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
    fetchTVShows(1, true);
  }, [activeTab, selectedGenre, sortBy]);

  const fetchGenres = async () => {
    try {
      const data = await getTVGenres();
      setGenres(data.genres || []);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  };

  const fetchTVShows = async (pageNum, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      let data;

      if (selectedGenre || sortBy !== "popularity.desc" || activeTab === "discover") {
        data = await discoverTV({
          page: pageNum,
          withGenres: selectedGenre,
          sortBy: sortBy
        });
      } else {
        switch (activeTab) {
          case "trending":
            data = await getTrending("tv", "week");
            break;
          case "popular":
            data = await getPopularTVShows(pageNum);
            break;
          case "topRated":
            data = await getTopRatedTVShows(pageNum);
            break;
          case "airingToday":
            data = await getAiringTodayTVShows(pageNum);
            break;
          case "onTheAir":
            data = await getOnTheAirTVShows(pageNum);
            break;
          default:
            data = await getPopularTVShows(pageNum);
        }
      }

      if (reset) {
        setShows(data.results || []);
      } else {
        setShows(prev => [...prev, ...(data.results || [])]);
      }

      setTotalResults(data.total_results || 0);
      setPage(pageNum);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch TV shows. Please check your connection.");
      setLoading(false);
      console.error("Error fetching TV shows:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedGenre("");
    setSortBy("popularity.desc");
  };

  const handleLoadMore = () => {
    fetchTVShows(page + 1);
  };

  if (error && shows.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ErrorMessage message={error} onRetry={() => fetchTVShows(1, true)} />
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
              TV Shows
            </h1>
            <p className="text-slate-400">Bing-worthy series just for you</p>
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
                <option value="first_air_date.desc">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "trending", label: "🔥 Trending" },
            { id: "popular", label: "⭐ Popular" },
            { id: "topRated", label: "🏆 Top Rated" },
            { id: "airingToday", label: "📅 Airing Today" },
            { id: "onTheAir", label: "📺 On The Air" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id && !selectedGenre
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {shows.map((show) => (
            <MediaCard key={show.id} item={show} mediaType="tv" />
          ))}
        </div>

        {/* Loading state for pagination */}
        {loading && (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Load More */}
        {!loading && shows.length < totalResults && (
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
        {!loading && shows.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-xl">No TV shows found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVShows;
