import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMulti } from "../services/api";
import MediaCard from "../components/MediaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (query) {
      handleSearch(1, true);
    }
  }, [query]);

  const handleSearch = async (pageNum, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchMulti(query, pageNum);

      if (reset) {
        setResults(data.results || []);
      } else {
        setResults((prev) => [...prev, ...(data.results || [])]);
      }

      setTotalResults(data.total_results || 0);
      setPage(pageNum);
      setLoading(false);
    } catch (err) {
      setError("Failed to search. Please try again.");
      setLoading(false);
      console.error("Search error:", err);
    }
  };

  const loadMore = () => {
    handleSearch(page + 1);
  };

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400 text-xl">Please enter a search term.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Results for: <span className="text-purple-400">"{query}"</span>
          </h1>
          <p className="text-slate-400">Found {totalResults} matches</p>
        </div>

        {error && <ErrorMessage message={error} onRetry={() => handleSearch(1, true)} />}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item) => (
            <MediaCard key={`${item.media_type}-${item.id}`} item={item} mediaType={item.media_type} />
          ))}
        </div>

        {loading && (
          <div className="py-12 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!loading && results.length < totalResults && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={loadMore}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg"
            >
              Load More Results
            </button>
          </div>
        )}

        {!loading && results.length === 0 && !error && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-xl text-center">No results found for "{query}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
