import { useState, useEffect } from "react";
import {
    getPopularTVShows,
    getTopRatedTVShows,
    getAiringTodayTVShows,
    getOnTheAirTVShows
} from "../services/api";
import MediaCard from "../components/MediaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const TVShows = () => {
    const [airingToday, setAiringToday] = useState([]);
    const [onTheAir, setOnTheAir] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("popular");

    useEffect(() => {
        fetchTVShows();
    }, []);

    const fetchTVShows = async () => {
        try {
            setLoading(true);
            setError(null);

            const [airingData, onAirData, popularData, topRatedData] = await Promise.all([
                getAiringTodayTVShows(),
                getOnTheAirTVShows(),
                getPopularTVShows(),
                getTopRatedTVShows()
            ]);

            setAiringToday(airingData.results || []);
            setOnTheAir(onAirData.results || []);
            setPopular(popularData.results || []);
            setTopRated(topRatedData.results || []);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch TV shows. Please check your connection.");
            setLoading(false);
            console.error("Error fetching TV shows:", err);
        }
    };

    const getActiveShows = () => {
        switch (activeTab) {
            case "airingToday":
                return airingToday;
            case "onTheAir":
                return onTheAir;
            case "popular":
                return popular;
            case "topRated":
                return topRated;
            default:
                return popular;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <LoadingSpinner message="Loading TV shows..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900">
                <ErrorMessage message={error} onRetry={fetchTVShows} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        TV Shows
                    </h1>
                    <p className="text-slate-400">Discover the best TV shows from around the world</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab("airingToday")}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "airingToday"
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                    >
                        📺 Airing Today
                    </button>
                    <button
                        onClick={() => setActiveTab("onTheAir")}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === "onTheAir"
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                    >
                        🎬 On The Air
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

                {/* TV Shows Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {getActiveShows().slice(0, 20).map((show) => (
                        <MediaCard key={show.id} item={show} mediaType="tv" />
                    ))}
                </div>

                {/* Stats Footer */}
                <div className="mt-12 bg-slate-800 rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-3xl font-bold text-purple-400">{airingToday.length}</p>
                            <p className="text-slate-400">Airing Today</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-pink-400">{onTheAir.length}</p>
                            <p className="text-slate-400">On The Air</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-yellow-400">{popular.length}</p>
                            <p className="text-slate-400">Popular</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-green-400">{topRated.length}</p>
                            <p className="text-slate-400">Top Rated</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TVShows;
