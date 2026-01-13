import { useRef } from "react";
import MediaCard from "./MediaCard";

const ContentCarousel = ({ title, items, mediaType }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -400 : 400;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="mb-12">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">{title}</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                        aria-label="Scroll left"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                        aria-label="Scroll right"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {items.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-48">
                        <MediaCard item={item} mediaType={mediaType} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentCarousel;
