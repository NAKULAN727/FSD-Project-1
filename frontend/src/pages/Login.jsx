import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Facebook, Linkedin, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, currentUser, socialLogin } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setIsLoading(true);
      const result = await socialLogin({
        token: tokenResponse.access_token,
        provider: "google",
      });
      if (result.success) {
        navigate("/home");
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google Login Failed");
      setIsLoading(false);
    },
  });

  const handleSocialLogin = async (provider) => {
    if (provider === "google") {
      googleLogin();
      return;
    }

    setError("");
    setIsLoading(true);

    // For Facebook and LinkedIn, you'd integrate their SDKs here.
    // For now, we'll simulate getting a token and sending it to the backend.
    const mockToken = "mock_token_" + Math.random().toString(36).slice(2);
    
    const result = await socialLogin({
      token: mockToken,
      provider: provider
    });
    
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Main Container */}
      <div className="relative flex flex-col m-6 bg-white shadow-2xl rounded-2xl md:flex-row max-w-4xl w-full overflow-hidden min-h-[500px]">
        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center p-8 md:p-14 md:w-1/2 w-full">
          {/* Logo */}
          <div
            className="flex items-center gap-2 mb-8 cursor-pointer"
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
              Login to Your Account
            </h1>
            <p className="font-light text-gray-400 text-center mb-6 text-sm">
              Login using social networks
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => handleSocialLogin("facebook")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#3b5998] text-white hover:opacity-90 transition-opacity"
            >
              <Facebook size={20} />
            </button>
            <button 
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin("linkedin")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077b5] text-white hover:opacity-90 transition-opacity"
            >
              <Linkedin size={20} />
            </button>
          </div>

          {/* Separator */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="h-px w-24 bg-gray-200"></span>
            <span className="text-gray-400 text-sm">OR</span>
            <span className="h-px w-24 bg-gray-200"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-gray-400 hover:text-[#2DD4BF] text-sm font-medium transition-colors"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>

        {/* Right Side - New Here? */}
        <div className="relative flex flex-col justify-center items-center p-8 md:w-1/2 bg-gradient-to-br from-[#2DD4BF] to-[#10B981] text-white text-center">
          <h2 className="text-3xl font-bold mb-4">New Here?</h2>
          <p className="mb-8 font-light text-white/90 max-w-[280px]">
            Sign up and discover a great amount of new opportunities!
          </p>
          <Link to="/register">
            <button className="bg-white text-[#10B981] font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Sign Up
            </button>
          </Link>

          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 rounded-full bg-white/10 pointer-events-none"></div>
          <div className="absolute top-[20%] right-[10%] w-20 h-20 rounded-full bg-white/10 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
