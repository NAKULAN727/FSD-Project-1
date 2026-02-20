import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/questions?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#f8f9f9] border-t-[3px] border-t-[#F48024] shadow-md">
      <div className="max-w-[1264px] mx-auto px-4 h-[50px] flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center gap-2 sm:gap-6 flex-1">
          {/* Logo */}
          <Link
            to={currentUser ? "/questions" : "/"}
            className="flex-shrink-0 flex items-center group -ml-2 sm:-ml-4 px-1 sm:px-2 py-1 hover:bg-gray-100"
          >
            <div className="w-auto overflow-hidden">
              <svg
                aria-hidden="true"
                className="native w-[100px] sm:w-[150px] h-[24px] sm:h-[30px]"
                width="150"
                height="30"
                viewBox="0 0 150 30"
              >
                <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB"></path>
                <path
                  d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.79.68-2.95-16.1-3.35L7 23l16.1 2.99ZM23 30H7v-3h16v3Z"
                  fill="#F48024"
                ></path>
                <text
                  x="35"
                  y="27"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  fontSize="24"
                  fill="#000000"
                >
                  Query Flow
                </text>
              </svg>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-500 font-medium">
            <Link
              to="/questions"
              className="hover:text-gray-900 transition-colors"
            >
              Questions
            </Link>
            <Link
              to="/discussions"
              className="hover:text-gray-900 transition-colors"
            >
              Discussions
            </Link>
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-grow max-w-[600px] relative hidden sm:block"
        >
          <div className="relative">
            <input
              type="text"
              className="w-full pl-9 pr-4 py-1.5 border border-[#babfc4] rounded-[3px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0a95ff] focus:border-[#0a95ff] shadow-inner transition-shadow placeholder-gray-400"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-2.5 top-1.5 text-gray-400"
              size={18}
            />
          </div>
        </form>

        {/* User Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:bg-gray-100 px-1.5 sm:px-2 py-1 rounded-[3px] transition-colors"
                title="Profile"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-500 rounded text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-sm flex-shrink-0">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-gray-600 hidden lg:block">
                  {currentUser.reputation || 1}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 hover:text-red-500 rounded-[3px] transition-colors flex-shrink-0"
                title="Log out"
              >
                <LogOut size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-2 sm:px-3 py-1.5 bg-[#e1ecf4] text-[#39739d] hover:bg-[#b3d3ea] border border-[#7aa7c7] rounded-[3px] text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-2 sm:px-3 py-1.5 bg-[#0a95ff] text-white hover:bg-[#0074cc] border border-transparent rounded-[3px] text-[10px] sm:text-xs font-medium shadow-sm transition-colors whitespace-nowrap"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={18}
                />
              </div>
            </form>
            <Link
              to="/"
              className="block text-gray-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/questions"
              className="block text-gray-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Questions
            </Link>
            <Link
              to="/discussions"
              className="block text-gray-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Discussions
            </Link>
            <Link
              to="/tags"
              className="block text-gray-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tags
            </Link>
            {!currentUser && (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="block text-center px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
            {currentUser && (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  to="/profile"
                  className="block text-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <div
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block text-center px-4 py-2 text-red-500 cursor-pointer hover:bg-red-50 rounded"
                >
                  Log out
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
