import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md bg-opacity-95 shadow-lg border-b border-slate-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-br from-red-600 to-purple-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86-.96-7-5.54-7-10V8.3l7-3.11 7 3.11V10c0 4.46-3.14 9.04-7 10z" />
                  <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                StreamFlix
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium">
                Home
              </Link>
              <Link to="/movies" className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium">
                Movies
              </Link>
              <Link to="/tv" className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium">
                TV Shows
              </Link>
              <Link to="/mylist" className="px-4 py-2 rounded-lg hover:bg-slate-700 transition-all duration-200 font-medium">
                My List
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden sm:block relative">
              <form onSubmit={handleSearch} className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="absolute left-0 p-2 hover:bg-slate-700 rounded-full transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {isSearchOpen && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, shows..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    autoFocus
                  />
                )}
              </form>
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-700 rounded-full transition-colors group">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold">
                  U
                </div>
                <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 animate-fadeIn">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-slate-700 transition-colors">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 hover:bg-slate-700 transition-colors">
                    Settings
                  </Link>
                  <Link to="/account" className="block px-4 py-2 hover:bg-slate-700 transition-colors">
                    Account
                  </Link>
                  <hr className="my-2 border-slate-700" />
                  <button className="w-full text-left px-4 py-2 hover:bg-slate-700 transition-colors text-red-400">
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slideDown">
            <Link to="/" className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Home
            </Link>
            <Link to="/movies" className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Movies
            </Link>
            <Link to="/tv" className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              TV Shows
            </Link>
            <Link to="/mylist" className="block px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              My List
            </Link>
            <div className="pt-2">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </form>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
