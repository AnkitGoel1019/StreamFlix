import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/constants";

const MediaCard = ({ item, mediaType }) => {
    const title = item.title || item.name;
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
    const rating = item.vote_average?.toFixed(1) || "N/A";
    const posterUrl = getImageUrl(item.poster_path, "poster", "medium");
    const linkPath = `/${mediaType}/${item.id}`;

    return (
        <Link to={linkPath} className="group block">
            <div className="relative bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-700">
                    {posterUrl ? (
                        <img
                            src={posterUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-20 h-20 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 3H3c-1.11 0-2 .89-2 2v12a2 2 0 002 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5a2 2 0 00-2-2zm0 14H3V5h18v12z" />
                            </svg>
                        </div>
                    )}

                    {/* Rating Badge */}
                    {rating !== "N/A" && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded-full flex items-center space-x-1">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <span className="text-white text-sm font-bold">{rating}</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white text-sm line-clamp-3">{item.overview || "No description available."}</p>
                        </div>
                    </div>
                </div>

                {/* Card Info */}
                <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-1" title={title}>
                        {title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>{year}</span>
                        <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <span>{item.vote_count || 0}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MediaCard;
