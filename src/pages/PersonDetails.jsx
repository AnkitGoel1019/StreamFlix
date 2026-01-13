import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPersonDetails } from "../services/api";
import { getImageUrl, formatDate } from "../utils/constants";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import MediaCard from "../components/MediaCard";

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonDetails();
  }, [id]);

  const fetchPersonDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPersonDetails(id);
      setPerson(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load person details.");
      setLoading(false);
      console.error("Error fetching person details:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-slate-900">
        <ErrorMessage message={error} onRetry={fetchPersonDetails} />
      </div>
    );
  }

  const profileUrl = getImageUrl(person.profile_path, "profile", "large");

  // Get all credits and sort by popularity
  const movieCredits = (person.movie_credits?.cast || []).map(item => ({ ...item, media_type: "movie" }));
  const tvCredits = (person.tv_credits?.cast || []).map(item => ({ ...item, media_type: "tv" }));
  const allCredits = [...movieCredits, ...tvCredits].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const credits = allCredits.slice(0, 10);

  // Use the backdrop of the most popular credit as the page header background
  const bestBackdrop = allCredits.find(c => c.backdrop_path)?.backdrop_path;
  const backdropUrl = getImageUrl(bestBackdrop, "backdrop", "original");

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Backdrop Header (Themed by their most famous work) */}
      <div className="relative h-[40vh] min-h-[300px]">
        {backdropUrl ? (
          <>
            <img src={backdropUrl} alt={person.name} className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-slate-800 opacity-50"></div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Side - Profile Image & Sidebar Info */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="sticky top-24">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={person.name}
                  className="w-full rounded-2xl shadow-2xl mb-8 border-4 border-slate-800"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-slate-800 rounded-2xl flex items-center justify-center mb-8 border-4 border-slate-800">
                  <svg className="w-32 h-32 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}

              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 space-y-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Personal Info</h2>

                <div>
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Known For</h3>
                  <p className="text-white font-medium">{person.known_for_department}</p>
                </div>

                {person.birthday && (
                  <div>
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Birthday</h3>
                    <p className="text-white font-medium">{formatDate(person.birthday)}</p>
                  </div>
                )}

                {person.place_of_birth && (
                  <div>
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Place of Birth</h3>
                    <p className="text-white font-medium">{person.place_of_birth}</p>
                  </div>
                )}

                {person.also_known_as && person.also_known_as.length > 0 && (
                  <div>
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Also Known As</h3>
                    <div className="space-y-1">
                      {person.also_known_as.slice(0, 3).map((name, i) => (
                        <p key={i} className="text-white text-sm opacity-80">{name}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Biography & Credits */}
          <div className="flex-1 mt-8 md:mt-20">
            <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">
              {person.name}
            </h1>

            <div className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-b from-purple-600 to-pink-600 w-1.5 h-8 rounded-full mr-3"></span>
                Biography
              </h2>
              <div className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap max-w-4xl">
                {person.biography || `We don't have a biography for ${person.name}.`}
              </div>
            </div>

            {credits.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <span className="bg-gradient-to-b from-pink-600 to-orange-600 w-1.5 h-8 rounded-full mr-3"></span>
                  Popular Credits
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
                  {credits.map((item) => (
                    <MediaCard key={`${item.media_type}-${item.id}`} item={item} mediaType={item.media_type} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
