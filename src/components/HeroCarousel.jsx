import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/constants";
import { getMovieVideos, getTVShowVideos } from "../services/api";

const HeroCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoKey, setVideoKey] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const carouselItems = items?.slice(0, 10) || [];

  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const videoDelayRef = useRef(null);

  // Intersection Observer to stop playback when scrolled away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.3 } // 30% of the component must be visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  }, [carouselItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  }, [carouselItems.length]);

  // Auto-scroll logic
  useEffect(() => {
    if (!isIntersecting || isHovered) return;

    timeoutRef.current = setInterval(nextSlide, 8000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [nextSlide, isIntersecting, isHovered]);

  // Video playback logic
  useEffect(() => {
    setVideoKey(null);
    setShowVideo(false);
    if (videoDelayRef.current) clearTimeout(videoDelayRef.current);

    if (!isIntersecting) return;

    const fetchVideo = async () => {
      const item = carouselItems[currentIndex];
      if (!item) return;

      try {
        const mediaType = item.media_type || (item.title ? "movie" : "tv");
        const videoData = mediaType === "movie"
          ? await getMovieVideos(item.id)
          : await getTVShowVideos(item.id);

        const trailer = videoData.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        if (trailer) {
          setVideoKey(trailer.key);
          // Start video after 2 seconds of being on the slide
          videoDelayRef.current = setTimeout(() => {
            setShowVideo(true);
          }, 2000);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();

    return () => {
      if (videoDelayRef.current) clearTimeout(videoDelayRef.current);
    };
  }, [currentIndex, isIntersecting]);

  if (carouselItems.length === 0) return null;

  const currentItem = carouselItems[currentIndex];
  const title = currentItem.title || currentItem.name;
  const backdropUrl = getImageUrl(currentItem.backdrop_path, "backdrop", "original");
  const rating = currentItem.vote_average?.toFixed(1);
  const mediaType = currentItem.media_type || (currentItem.title ? "movie" : "tv");
  const linkPath = `/${mediaType}/${currentItem.id}`;

  return (
    <div
      ref={containerRef}
      className="relative h-[85vh] min-h-[600px] w-full bg-slate-900 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {/* Fallback Image */}
        <img
          src={backdropUrl}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${showVideo && videoKey ? 'opacity-0' : 'opacity-100'}`}
        />

        {/* Video Layer */}
        {showVideo && videoKey && (
          <div className="absolute inset-0 w-full h-full scale-125 pointer-events-none">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoKey}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
              title="Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Hotstar-style Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl pt-20">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tighter transition-all duration-700 transform">
            {title}
          </h1>

          <div className="flex items-center space-x-6 mb-8 text-white/90 font-bold text-lg">
            {rating && (
              <div className="flex items-center space-x-2">
                <svg className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>{rating}</span>
              </div>
            )}
            <span>•</span>
            <span>{new Date(currentItem.release_date || currentItem.first_air_date).getFullYear()}</span>
            <span>•</span>
            <span className="uppercase tracking-widest text-sm bg-white/20 px-2 py-0.5 rounded">{mediaType}</span>
          </div>

          <p className="text-slate-200 text-xl md:text-2xl mb-10 line-clamp-3 leading-relaxed font-medium drop-shadow-lg max-w-xl">
            {currentItem.overview}
          </p>

          <div className="flex items-center space-x-4">
            <Link
              to={linkPath}
              className="flex items-center space-x-3 bg-white hover:bg-slate-200 text-black font-black px-10 py-4 rounded-xl transition-all transform hover:scale-105 shadow-2xl"
            >
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-lg">More Info</span>
            </Link>

            <button className="flex items-center space-x-3 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-md text-white font-black px-10 py-4 rounded-xl transition-all shadow-2xl border border-white/10">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-lg">My List</span>
            </button>

            {videoKey && showVideo && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20"
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Navigation Buttons (Glassy) */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
        aria-label="Previous slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/10"
        aria-label="Next slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Carousel Indicators (Hotstar Style) */}
      <div className="absolute bottom-10 right-10 flex space-x-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${index === currentIndex
              ? "w-10 h-2 bg-white"
              : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
