import { useState, useEffect } from "react";
import { getTrending, getPopularMovies, getPopularTVShows } from "../services/api";
import HeroBanner from "../components/HeroBanner";
import ContentCarousel from "../components/ContentCarousel";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Home = () => {
  const [heroItem, setHeroItem] = useState(null);
  const [trendingToday, setTrendingToday] = useState([]);
  const [trendingWeek, setTrendingWeek] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendingTab, setTrendingTab] = useState("week");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [trendingDayData, trendingWeekData, moviesData, tvData] = await Promise.all([
        getTrending("all", "day"),
        getTrending("all", "week"),
        getPopularMovies(),
        getPopularTVShows()
      ]);

      setTrendingToday(trendingDayData.results || []);
      setTrendingWeek(trendingWeekData.results || []);
      setPopularMovies(moviesData.results || []);
      setPopularTV(tvData.results || []);

      if (trendingWeekData.results && trendingWeekData.results.length > 0) {
        setHeroItem(trendingWeekData.results[0]);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load content. Please try again.");
      setLoading(false);
      console.error("Error fetching home data:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner message="Loading amazing content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ErrorMessage message={error} onRetry={fetchHomeData} />
      </div>
    );
  }

  const activeTrending = trendingTab === "day" ? trendingToday : trendingWeek;

  return (
    <div className="min-h-screen bg-slate-900">
      {heroItem && <HeroBanner item={heroItem} mediaType={heroItem.media_type || "movie"} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-3xl font-bold text-white">Trending</h2>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setTrendingTab("day")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${trendingTab === "day"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                Today
              </button>
              <button
                onClick={() => setTrendingTab("week")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${trendingTab === "week"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                This Week
              </button>
            </div>
          </div>
          <ContentCarousel items={activeTrending.slice(0, 20)} mediaType="movie" />
        </div>

        <ContentCarousel title="Popular Movies" items={popularMovies.slice(0, 20)} mediaType="movie" />
        <ContentCarousel title="Popular TV Shows" items={popularTV.slice(0, 20)} mediaType="tv" />

        <div className="mt-16 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to StreamFlix</h2>
          <p className="text-slate-200 text-lg mb-6">
            Discover millions of movies, TV shows and people. Explore now.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="/movies"
              className="bg-white hover:bg-slate-200 text-black font-bold px-8 py-3 rounded-lg transition-all"
            >
              Browse Movies
            </a>
            <a
              href="/tv"
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-8 py-3 rounded-lg transition-all"
            >
              Browse TV Shows
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
