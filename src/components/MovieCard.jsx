const MovieCard = ({ image, title, platform, category, link }) => {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden p-3">
      <img
        src={image}
        alt={title}
        className="w-full h-80 object-cover rounded-lg"
      />

      <div className="mt-3">
        <span className="text-xs px-2 py-1 bg-gray-600 rounded-md font-semibold">
          <strong>Platform:</strong> {platform}
        </span>

        <h2 className="text-lg font-bold mt-2 text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 mt-2"><strong>Genre:</strong> {category}</p>

        <a
          href={link}
          target="_blank"
          className="inline-block mt-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Watch Now
        </a>
      </div>
    </div>
  );
};

export default MovieCard;
