import { useState, useEffect } from "react";
import MediaCard from "../components/MediaCard";

const MyList = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("streamflix_watchlist") || "[]");
    setWatchlist(saved);
  }, []);

  const removeFromWatchlist = (id) => {
    const updated = watchlist.filter(item => item.id !== id);
    setWatchlist(updated);
    localStorage.setItem("streamflix_watchlist", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My List
          </h1>
          <p className="text-slate-400">Your personal watchlist of movies and TV shows</p>
        </div>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {watchlist.map((item) => (
              <div key={item.id} className="relative group">
                <MediaCard item={item} mediaType={item.media_type || "movie"} />
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  title="Remove from list"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-slate-800 rounded-lg border-2 border-dashed border-slate-700">
            <svg className="w-20 h-20 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-white text-2xl font-bold mb-2">Your list is empty</h2>
            <p className="text-slate-400 mb-6">Start adding your favorite movies and shows to watch them later.</p>
            <a
              href="/movies"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:scale-105"
            >
              Browse Content
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
