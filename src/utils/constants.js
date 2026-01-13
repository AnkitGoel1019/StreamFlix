// TMDB API Configuration
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
export const BASE_URL = "https://api.themoviedb.org/3";

// Image Configuration
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const IMAGE_SIZES = {
    poster: {
        small: "/w185",
        medium: "/w342",
        large: "/w500",
        original: "/original"
    },
    backdrop: {
        small: "/w300",
        medium: "/w780",
        large: "/w1280",
        original: "/original"
    },
    profile: {
        small: "/w45",
        medium: "/w185",
        large: "/h632",
        original: "/original"
    },
    logo: {
        small: "/w92",
        medium: "/w154",
        large: "/w300",
        original: "/original"
    }
};

// Media Types
export const MEDIA_TYPES = {
    MOVIE: "movie",
    TV: "tv",
    PERSON: "person",
    ALL: "all"
};

// Time Windows
export const TIME_WINDOWS = {
    DAY: "day",
    WEEK: "week"
};

// Default Values
export const DEFAULT_LANGUAGE = "en-US";
export const DEFAULT_PAGE = 1;
export const ITEMS_PER_PAGE = 20;

// Genre IDs (Movies)
export const MOVIE_GENRES = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western"
};

// Genre IDs (TV)
export const TV_GENRES = {
    10759: "Action & Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
    37: "Western"
};

// Helper function to get image URL
export const getImageUrl = (path, type = "poster", size = "medium") => {
    if (!path) return null;
    const sizeUrl = IMAGE_SIZES[type]?.[size] || IMAGE_SIZES.poster.medium;
    return `${IMAGE_BASE_URL}${sizeUrl}${path}`;
};

// Helper function to format runtime
export const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Helper function to format currency
export const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};

// Helper function to get genre names from IDs
export const getGenreNames = (genreIds, mediaType = "movie") => {
    const genres = mediaType === "movie" ? MOVIE_GENRES : TV_GENRES;
    return genreIds?.map(id => genres[id]).filter(Boolean) || [];
};
