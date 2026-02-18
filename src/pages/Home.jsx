import React from "react";
import { Link } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

const Home = ({ questions }) => {
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
        <div className="flex gap-1 border border-gray-300 rounded-[3px] overflow-hidden ml-auto">
          <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 border-r border-gray-300">
            Interesting
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-500 text-xs hover:bg-gray-100 border-r border-gray-300">
            Hot
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-500 text-xs hover:bg-gray-100 border-r border-gray-300">
            Week
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-500 text-xs hover:bg-gray-100">
            Month
          </button>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 -mx-4 sm:mx-0 sm:border sm:rounded-md shadow-sm">
        {questions.length > 0 ? (
          questions.map((q) => <QuestionCard key={q.id} question={q} />)
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
