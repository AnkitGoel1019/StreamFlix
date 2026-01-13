import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/constants";

const HeroBanner = ({ item, mediaType }) => {
    if (!item) return null;

    const title = item.title || item.name;
    const backdropUrl = getImageUrl(item.backdrop_path, "backdrop", "original");
    const rating = item.vote_average?.toFixed(1);
    const linkPath = `/${mediaType}/${item.id}`;

    return (
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                {backdropUrl ? (
                    <img
                        src={backdropUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-slate-900"></div>
                )}
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-2xl">
                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                        {title}
                    </h1>

                    {/* Rating & Meta */}
                    <div className="flex items-center space-x-4 mb-6">
                        {rating && (
                            <div className="flex items-center space-x-2 bg-black bg-opacity-60 px-3 py-1 rounded-full">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                                <span className="text-white font-bold">{rating}</span>
                            </div>
                        )}
                        {item.release_date && (
                            <span className="text-white text-lg">
                                {new Date(item.release_date).getFullYear()}
                            </span>
                        )}
                        {item.first_air_date && (
                            <span className="text-white text-lg">
                                {new Date(item.first_air_date).getFullYear()}
                            </span>
                        )}
                    </div>

                    {/* Overview */}
                    <p className="text-white text-lg md:text-xl mb-8 line-clamp-3 drop-shadow-md">
                        {item.overview || "No description available."}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                        <Link
                            to={linkPath}
                            className="flex items-center space-x-2 bg-white hover:bg-slate-200 text-black font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>More Info</span>
                        </Link>
                        <button className="flex items-center space-x-2 bg-slate-700 bg-opacity-80 hover:bg-slate-600 text-white font-bold px-8 py-3 rounded-lg transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            <span>My List</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;
