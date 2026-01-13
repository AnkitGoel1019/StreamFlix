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
  const credits = [...(person.movie_credits?.cast || []), ...(person.tv_credits?.cast || [])]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left Side - Image & Personal Info */}
          <div className="w-full md:w-80 flex-shrink-0">
            {profileUrl ? (
              <img
                src={profileUrl}
                alt={person.name}
                className="w-full rounded-2xl shadow-2xl mb-6 border-4 border-slate-800"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border-4 border-slate-800">
                <svg className="w-32 h-32 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

            <div className="bg-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Known For</h3>
                <p className="text-white font-semibold text-lg">{person.known_for_department}</p>
              </div>

              {person.birthday && (
                <div>
                  <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Birthday</h3>
                  <p className="text-white font-semibold text-lg">{formatDate(person.birthday)}</p>
                </div>
              )}

              {person.place_of_birth && (
                <div>
                  <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Place of Birth</h3>
                  <p className="text-white font-semibold text-lg">{person.place_of_birth}</p>
                </div>
              )}

              {person.also_known_as && person.also_known_as.length > 0 && (
                <div>
                  <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Also Known As</h3>
                  <div className="space-y-1">
                    {person.also_known_as.slice(0, 3).map((name, i) => (
                      <p key={i} className="text-white text-sm opacity-80">{name}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Bio & Credits */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">
              {person.name}
            </h1>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-purple-600 w-2 h-8 rounded-full mr-3"></span>
                Biography
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {person.biography || `We don't have a biography for ${person.name}.`}
              </p>
            </div>

            {credits.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="bg-pink-600 w-2 h-8 rounded-full mr-3"></span>
                  Popular Credits
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
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
