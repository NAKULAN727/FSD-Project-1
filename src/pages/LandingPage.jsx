import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Search, Globe, Lock, Shield } from "lucide-react";

const LandingPage = ({ currentUser }) => {
  if (currentUser) {
    return <Navigate to="/questions" replace />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-50px)] bg-[#f8f9f9]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#2d2d2d] text-white py-20 px-4 sm:px-8">
        <div className="max-w-[1264px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              We <span className="text-[#F48024]">Query</span> people who{" "}
              <span className="text-[#F48024]">code</span>
            </h1>
            <p className="text-lg text-gray-300">
              Query Overflow is a community-based space to find and contribute
              answers to technical challenges, and one of the most popular
              websites in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-[#F48024] hover:bg-[#da680b] text-white rounded-[3px] font-medium text-center transition-colors"
              >
                Join the community
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-transparent border border-white hover:bg-[#3d3d3d] text-white rounded-[3px] font-medium text-center transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative w-[400px] h-[300px] bg-[#3d3d3d] rounded-lg shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                <div className="h-32 bg-gray-700 rounded w-full mt-4 flex items-center justify-center text-gray-500">
                  Code Snippet...
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#F48024]/10 transform skew-x-12 translate-x-20"></div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-8 max-w-[1264px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4 bg-blue-100 rounded-full text-blue-600">
              <Globe size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Public Q&A</h3>
            <p className="text-gray-600">
              Get answers to more than 16.5 million questions and give back by
              sharing your knowledge with others.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4 bg-orange-100 rounded-full text-orange-600">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Private Q&A</h3>
            <p className="text-gray-600">
              Level up with Query Overflow for Teams, our private SaaS platform
              for knowledge sharing and collaboration.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4 bg-purple-100 rounded-full text-purple-600">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Community</h3>
            <p className="text-gray-600">
              Join the community of over 100 million developers and tech
              enthusiasts to learn and grow together.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#f1f2f3] py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Looking for a solution?
        </h2>
        <div className="flex justify-center gap-4">
          <Link
            to="/questions"
            className="text-[#0a95ff] hover:text-[#0074cc] font-medium"
          >
            Browse Questions
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            to="/register"
            className="text-[#0a95ff] hover:text-[#0074cc] font-medium"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
