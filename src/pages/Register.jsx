import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Linkedin, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic regex checks
    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      setError("Invalid email format");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      const result = register(email, password, displayName);
      if (result.success) {
        navigate("/questions");
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Main Container */}
      <div className="relative flex flex-col m-6 bg-white shadow-2xl rounded-2xl md:flex-row max-w-4xl w-full overflow-hidden min-h-[500px]">
        {/* Left Side - Welcome Back (Teal Gradient) */}
        <div className="relative flex flex-col justify-center items-center p-8 md:w-1/2 bg-gradient-to-br from-[#2DD4BF] to-[#10B981] text-white text-center order-2 md:order-1">
          <h2 className="text-3xl font-bold mb-4">One of Us?</h2>
          <p className="mb-8 font-light text-white/90 max-w-[280px]">
            If you already have an account, just sign in. We've missed you!
          </p>
          <Link to="/login">
            <button className="bg-white text-[#10B981] font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Sign In
            </button>
          </Link>

          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 rounded-full bg-white/10 pointer-events-none"></div>
        </div>

        {/* Right Side - Register Form (White) */}
        <div className="flex flex-col justify-center p-8 md:p-14 md:w-1/2 w-full order-1 md:order-2">
          {/* Logo */}
          <div
            className="flex items-center gap-2 mb-8 cursor-pointer justify-center md:justify-start"
            onClick={() => navigate("/")}
          >
            <svg
              aria-hidden="true"
              className="native w-[28px] h-[32px]"
              viewBox="0 0 32 37"
            >
              <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB"></path>
              <path
                d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.79.68-2.95-16.1-3.35L7 23l16.1 2.99ZM23 30H7v-3h16v3Z"
                fill="#F48024"
              ></path>
            </svg>
            <span className="font-bold text-gray-700 text-lg">Query Flow</span>
          </div>

          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Create Account
            </h1>
            <p className="font-light text-gray-400 text-center mb-6 text-sm">
              Sign up using social networks
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-6">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3b5998] text-white hover:opacity-90 transition-opacity">
              <Facebook size={20} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#db4437] text-white hover:opacity-90 transition-opacity">
              <Mail size={20} />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077b5] text-white hover:opacity-90 transition-opacity">
              <Linkedin size={20} />
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-gray-400 text-sm">or</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />

            {error && (
              <div className="p-2 bg-red-100 border border-red-200 text-red-700 text-xs rounded text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2DD4BF] hover:bg-[#14b8a6] text-white font-bold py-3 px-4 rounded-full shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
