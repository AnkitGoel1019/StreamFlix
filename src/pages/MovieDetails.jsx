import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import { getImageUrl, formatRuntime, formatCurrency, formatDate } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import MediaCard from "../components/MediaCard";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMovieDetails(id);
      setMovie(data);
      setLoading(false);

      // Check if in watchlist
      const watchlist = JSON.parse(localStorage.getItem("streamflix_watchlist") || "[]");
      setIsInWatchlist(watchlist.some(item => item.id === parseInt(id)));
    } catch (err) {
      setError("Failed to load movie details.");
      setLoading(false);
      console.error("Error fetching movie details:", err);
    }
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("streamflix_watchlist") || "[]");
    if (isInWatchlist) {
      const updated = watchlist.filter(item => item.id !== parseInt(id));
      localStorage.setItem("streamflix_watchlist", JSON.stringify(updated));
      setIsInWatchlist(false);
    } else {
      const itemToAdd = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        media_type: "movie"
      };
      watchlist.push(itemToAdd);
      localStorage.setItem("streamflix_watchlist", JSON.stringify(watchlist));
      setIsInWatchlist(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner message="Loading movie details..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ErrorMessage message={error} onRetry={fetchMovieDetails} />
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, "backdrop", "original");
  const posterUrl = getImageUrl(movie.poster_path, "poster", "large");
  const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Backdrop Header */}
      <div className="relative h-[60vh] min-h-[400px]">
        {backdropUrl && (
          <>
            <img src={backdropUrl} alt={movie.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {posterUrl && (
            <div className="flex-shrink-0">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-64 rounded-lg shadow-2xl"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-slate-400 italic mb-4">{movie.tagline}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {movie.vote_average > 0 && (
                <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-white font-bold">{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {movie.release_date && (
                <span className="text-slate-300">{new Date(movie.release_date).getFullYear()}</span>
              )}
              {movie.runtime && (
                <span className="text-slate-300">{formatRuntime(movie.runtime)}</span>
              )}

              <button
                onClick={toggleWatchlist}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-bold transition-all ${isInWatchlist
                  ? "bg-slate-700 text-purple-400 border border-purple-400"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg"
                  }`}
              >
                <svg className="w-5 h-5" fill={isInWatchlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>{isInWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
              </button>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Overview</h2>
              <p className="text-slate-300 text-lg leading-relaxed">{movie.overview}</p>
            </div>

            {/* Trailer */}
            {trailer && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {movie.budget > 0 && (
                <div>
                  <h3 className="text-slate-400 font-semibold">Budget</h3>
                  <p className="text-white text-lg">{formatCurrency(movie.budget)}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <h3 className="text-slate-400 font-semibold">Revenue</h3>
                  <p className="text-white text-lg">{formatCurrency(movie.revenue)}</p>
                </div>
              )}
              {movie.release_date && (
                <div>
                  <h3 className="text-slate-400 font-semibold">Release Date</h3>
                  <p className="text-white text-lg">{formatDate(movie.release_date)}</p>
                </div>
              )}
              {movie.status && (
                <div>
                  <h3 className="text-slate-400 font-semibold">Status</h3>
                  <p className="text-white text-lg">{movie.status}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {movie.credits.cast.slice(0, 12).map(person => (
                <Link key={person.id} to={`/person/${person.id}`} className="group">
                  <div className="bg-slate-800 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                    {person.profile_path ? (
                      <img
                        src={getImageUrl(person.profile_path, "profile", "medium")}
                        alt={person.name}
                        className="w-full aspect-[2/3] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-slate-700 flex items-center justify-center">
                        <svg className="w-12 h-12 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm line-clamp-1">{person.name}</p>
                      <p className="text-slate-400 text-xs line-clamp-1">{person.character}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="mt-12 pb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.similar.results.slice(0, 10).map(item => (
                <MediaCard key={item.id} item={item} mediaType="movie" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
