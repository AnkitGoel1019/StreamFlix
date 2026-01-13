import MovieData from "../data/MoviesData";
import MovieCard from "./MovieCard";
import Heading from './Heading';

const MovieList = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6 flex flex-col justify-center">
      
      <Heading
        title="Top Picks Across OTT Platforms"
        subtitle="Explore blockbuster hits from Netflix, Prime Video, Hotstar, and Zee5."
      />

      <div className="grid justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {MovieData.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>

    </div>
  );
};

export default MovieList;

