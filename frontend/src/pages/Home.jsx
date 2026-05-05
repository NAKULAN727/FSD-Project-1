import React, { useState } from "react";
import { Link } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { useQuestions } from "../context/QuestionContext";

const Home = () => {
  const { questions } = useQuestions();
  const [filter, setFilter] = useState("Interesting");

  const sortedQuestions = [...questions].sort((a, b) => {
    if (filter === "Hot") {
      return (b.votes || 0) - (a.votes || 0);
    }
    if (filter === "Week" || filter === "Month") {
      // In a real app, we would filter by date first, then sort by votes
      return (b.votes || 0) - (a.votes || 0);
    }
    // Default: Interesting (Newest)
    return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
  });

  return (
    <div className="max-w-5xl mx-auto sm:px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-normal text-gray-900">Top Questions</h1>
        <Link
          to="/ask"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-[3px] text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
        >
          Ask Question
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex gap-1 border border-gray-300 rounded-[3px] overflow-x-auto no-scrollbar sm:ml-auto bg-white">
          {["Interesting", "Hot", "Week", "Month"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 border-gray-300 whitespace-nowrap ${
                filter === f
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 -mx-4 sm:mx-0 sm:border sm:rounded-md shadow-sm">
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map((q, index) => (
            <QuestionCard key={q._id || q.id || index} question={q} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No questions found. Be the first to ask!
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
