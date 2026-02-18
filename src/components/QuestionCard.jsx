import React from "react";
import { Link } from "react-router-dom";
import Tag from "./Tag";

const QuestionCard = ({ question }) => {
  return (
    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-4 p-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Stats */}
      <div className="flex flex-col items-end gap-2 text-xs sm:text-sm text-gray-600">
        <div className="text-gray-800 font-medium whitespace-nowrap">
          {question.votes} votes
        </div>
        <div
          className={`px-2 py-1 rounded w-full text-center ${question.answersCount > 0 ? (question.answers && question.answers.some((a) => a.accepted) ? "bg-green-600 text-white" : "border border-green-600 text-green-600 font-medium") : "text-gray-500"}`}
        >
          <div className="leading-tight">{question.answersCount}</div>
          <div className="text-[10px]">answers</div>
        </div>
        <div className="text-gray-400 text-xs text-right w-full">
          {question.views} views
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 min-w-0">
        <Link
          to={`/question/${question.id}`}
          className="text-blue-600 hover:text-blue-800 text-lg sm:text-xl font-medium line-clamp-2 break-words visited:text-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 rounded-sm"
        >
          {question.title}
        </Link>

        <p className="text-sm text-gray-600 line-clamp-2 break-words">
          {question.description}
        </p>

        <div className="flex justify-between items-center mt-2 flex-wrap gap-y-2">
          <div className="flex gap-2 flex-wrap">
            {question.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer">
                {question.author}
              </span>
            </div>
            <span className="text-gray-500">
              asked {new Date(question.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
