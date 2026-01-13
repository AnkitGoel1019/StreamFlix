import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTVShowDetails } from "../services/api";
import { getImageUrl, formatDate } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import MediaCard from "../components/MediaCard";

const TVDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTVDetails();
    }, [id]);

    const fetchTVDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTVShowDetails(id);
            setShow(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load TV show details.");
            setLoading(false);
            console.error("Error fetching TV details:", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <LoadingSpinner message="Loading TV show details..." />
            </div>
        );
    }

    if (error || !show) {
        return (
            <div className="min-h-screen bg-slate-900">
                <ErrorMessage message={error} onRetry={fetchTVDetails} />
            </div>
        );
    }

    const backdropUrl = getImageUrl(show.backdrop_path, "backdrop", "original");
    const posterUrl = getImageUrl(show.poster_path, "poster", "large");
    const trailer = show.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Backdrop Header */}
            <div className="relative h-[60vh] min-h-[400px]">
                {backdropUrl && (
                    <>
                        <img src={backdropUrl} alt={show.name} className="w-full h-full object-cover" />
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
                            <img src={posterUrl} alt={show.name} className="w-64 rounded-lg shadow-2xl" />
                        </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-5xl font-bold text-white mb-2">{show.name}</h1>
                        {show.tagline && (
                            <p className="text-xl text-slate-400 italic mb-4">{show.tagline}</p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {show.vote_average > 0 && (
                                <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full">
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                    <span className="text-white font-bold">{show.vote_average.toFixed(1)}</span>
                                </div>
                            )}
                            {show.first_air_date && (
                                <span className="text-slate-300">{new Date(show.first_air_date).getFullYear()}</span>
                            )}
                            {show.number_of_seasons && (
                                <span className="text-slate-300">{show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
                            )}
                            {show.number_of_episodes && (
                                <span className="text-slate-300">{show.number_of_episodes} Episodes</span>
                            )}
                        </div>

                        {/* Genres */}
                        {show.genres && show.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {show.genres.map(genre => (
                                    <span key={genre.id} className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Overview</h2>
                            <p className="text-slate-300 text-lg leading-relaxed">{show.overview}</p>
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
                            {show.first_air_date && (
                                <div>
                                    <h3 className="text-slate-400 font-semibold">First Air Date</h3>
                                    <p className="text-white text-lg">{formatDate(show.first_air_date)}</p>
                                </div>
                            )}
                            {show.last_air_date && (
                                <div>
                                    <h3 className="text-slate-400 font-semibold">Last Air Date</h3>
                                    <p className="text-white text-lg">{formatDate(show.last_air_date)}</p>
                                </div>
                            )}
                            {show.status && (
                                <div>
                                    <h3 className="text-slate-400 font-semibold">Status</h3>
                                    <p className="text-white text-lg">{show.status}</p>
                                </div>
                            )}
                            {show.networks && show.networks.length > 0 && (
                                <div>
                                    <h3 className="text-slate-400 font-semibold">Network</h3>
                                    <p className="text-white text-lg">{show.networks[0].name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cast */}
                {show.credits?.cast && show.credits.cast.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-white mb-6">Top Cast</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {show.credits.cast.slice(0, 12).map(person => (
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

                {/* Similar Shows */}
                {show.similar?.results && show.similar.results.length > 0 && (
                    <div className="mt-12 pb-12">
                        <h2 className="text-3xl font-bold text-white mb-6">Similar TV Shows</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {show.similar.results.slice(0, 10).map(item => (
                                <MediaCard key={item.id} item={item} mediaType="tv" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TVDetails;
