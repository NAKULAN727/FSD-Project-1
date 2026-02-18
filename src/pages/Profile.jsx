import React, { useState } from "react";
import {
  User,
  MapPin,
  Mail,
  Calendar,
  Link as LinkIcon,
  Github,
  Briefcase,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

import { useAuth } from "../context/AuthContext";
import { useQuestions } from "../context/QuestionContext";

const Profile = () => {
  const { currentUser } = useAuth();
  const { questions } = useQuestions();
  const [activeTab, setActiveTab] = useState("about");

  // Filter content for the current user
  const userQuestions = questions.filter(
    (q) => q.author === currentUser?.displayName,
  );

  const userAnswersCount = questions.reduce((acc, q) => {
    return (
      acc +
      (q.answers?.filter((a) => a.author === currentUser?.displayName).length ||
        0)
    );
  }, 0);

  const reputation =
    userQuestions.reduce((acc, q) => acc + (q.votes || 0), 0) * 5 +
    userAnswersCount * 10; // Simple rep calc

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">Please log in to view your profile.</p>
        <Link to="/login" className="ml-2 text-blue-600 hover:underline">
          Log in
        </Link>
      </div>
    );
  }

  const dateString = currentUser.createdAt || null;
  const joinDate = dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Unknown Date";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-teal-400 to-emerald-500 relative">
          <button className="absolute bottom-4 right-4 bg-black/20 hover:bg-black/30 text-white px-3 py-1.5 rounded text-sm font-medium backdrop-blur-sm transition-colors">
            Edit Cover
          </button>
        </div>

        {/* Profile Info Bar */}
        <div className="px-8 pb-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-400 bg-gray-100">
                {/* Placeholder Avatar if no image */}
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="md:ml-6 mt-4 md:mt-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {currentUser.displayName}
              </h1>
              <p className="text-gray-500 font-medium">Full Stack Developer</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 md:mt-0 flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "about"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "questions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Questions{" "}
              <span className="ml-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                {userQuestions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar (About Summary) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Intro</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 text-gray-600">
                <Briefcase size={18} className="mt-0.5 text-gray-400" />
                <span>
                  Works at{" "}
                  <span className="font-semibold text-gray-900">
                    Query Flow Inc.
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="mt-0.5 text-gray-400" />
                <span>
                  Lives in{" "}
                  <span className="font-semibold text-gray-900">
                    San Francisco, CA
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Calendar size={18} className="mt-0.5 text-gray-400" />
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <Github size={18} className="mt-0.5 text-gray-400" />
                <a href="#" className="text-blue-600 hover:underline">
                  github.com/
                  {currentUser.displayName.replace(/\s+/g, "").toLowerCase()}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reputation}
                </div>
                <div className="text-xs text-blue-600 uppercase font-semibold">
                  Reputation
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {userQuestions.length}
                </div>
                <div className="text-xs text-orange-600 uppercase font-semibold">
                  Questions
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">14</div>
                <div className="text-xs text-green-600 uppercase font-semibold">
                  Answers
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-xs text-purple-600 uppercase font-semibold">
                  Badges
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "about" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Passionate full-stack developer with a love for clean code and
                modern web technologies. I enjoy solving complex problems and
                contributing to open-source projects. Currently exploring the
                depths of React and Node.js ecosystems.
              </p>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "JavaScript",
                  "Node.js",
                  "Tailwind CSS",
                  "GraphQL",
                  "MongoDB",
                  "Git",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div className="space-y-4">
              {userQuestions.length > 0 ? (
                userQuestions.map((q) => (
                  <QuestionCard key={q._id || q.id} question={q} />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                  You haven't asked any questions yet.
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Account Settings
              </h3>
              <form className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={currentUser.displayName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={currentUser.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
                <div className="pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
