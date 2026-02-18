import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const result = onLogin(email, password);
      if (result.success) {
        navigate("/questions");
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#f1f2f3] px-4">
      {/* Top Left Logo */}
      <div
        className="absolute top-6 left-6 flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded transition-colors"
        onClick={() => navigate("/")}
      >
        <svg
          aria-hidden="true"
          className="native w-[32px] h-[37px]"
          viewBox="0 0 32 37"
        >
          <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB"></path>
          <path
            d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.79.68-2.95-16.1-3.35L7 23l16.1 2.99ZM23 30H7v-3h16v3Z"
            fill="#F48024"
          ></path>
        </svg>
        <span className="font-bold text-gray-700 text-xl">Query Flow</span>
      </div>

      <div className="mb-6 text-center">
        <svg
          aria-hidden="true"
          className="native w-[32px] h-[37px] mx-auto"
          viewBox="0 0 32 37"
        >
          <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB"></path>
          <path
            d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.79.68-2.95-16.1-3.35L7 23l16.1 2.99ZM23 30H7v-3h16v3Z"
            fill="#F48024"
          ></path>
        </svg>
      </div>

      <div className="bg-white p-6 rounded-[7px] shadow-[0_1px_4px_rgba(0,0,0,0.05),0_5px_10px_-5px_rgba(0,0,0,0.05)] w-full max-w-[290px] mx-auto border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-1 text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-[3px] focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-shadow text-sm"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800"
              >
                Password
              </label>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-[3px] focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-shadow text-sm"
              required
            />
          </div>

          {error && (
            <div className="p-2 bg-red-100 border border-red-200 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0a95ff] hover:bg-[#0074cc] text-white py-2 rounded-[3px] text-sm font-medium shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
