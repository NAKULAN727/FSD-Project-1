import React from "react";
import { Link } from "react-router-dom";
import { Search, LogOut } from "lucide-react";

const Navbar = ({ currentUser, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-t-[3px] border-t-[#f48225] shadow-sm border-b border-gray-200">
      <div className="max-w-[1264px] mx-auto px-4">
        <div className="flex justify-between items-center h-[50px]">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link
              to={currentUser ? "/questions" : "/"}
              className="flex-shrink-0 flex items-center group -ml-4 px-2 py-1 hover:bg-gray-100"
            >
              <div className="w-[150px] overflow-hidden">
                <svg
                  aria-hidden="true"
                  className="native w-[160px] h-[30px]"
                  width="160"
                  height="30"
                  viewBox="0 0 160 30"
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
                    Query<tspan fontWeight="bold">Overflow</tspan>
                  </text>
                </svg>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-[700px] mx-4 hidden sm:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-[3px] leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:text-sm transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {!currentUser ? (
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  className="bg-[#e1ecf4] text-[#39739d] hover:bg-[#b3d3ea] px-3 py-1.5 rounded-[3px] text-xs font-medium border border-[#7aa7c7] h-[33px] flex items-center whitespace-nowrap transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-[#0a95ff] text-white hover:bg-[#0074cc] px-3 py-1.5 rounded-[3px] text-xs font-medium border border-transparent h-[33px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] flex items-center whitespace-nowrap transition-colors"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                  title={currentUser.displayName}
                >
                  <div className="w-8 h-8 rounded-md bg-[#0095ff] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="flex flex-col text-xs hidden md:flex">
                    <span className="font-semibold text-gray-700">
                      {currentUser.displayName}
                    </span>
                    <span className="text-gray-500 font-bold">
                      1 <span className="font-normal">rep</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-[3px] transition-colors"
                  title="Log out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
