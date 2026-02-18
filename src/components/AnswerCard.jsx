import React from "react";
import VoteButtons from "./VoteButtons";

const AnswerCard = ({ answer, onVote, onAccept, isQuestionAuthor }) => {
  return (
    <div
      className={`flex gap-4 py-6 border-b border-gray-200 last:border-0 transition-colors ${answer.accepted ? "bg-green-50/30" : "hover:bg-gray-50/50"}`}
    >
      <div className="flex flex-col items-center gap-2">
        <VoteButtons initialVotes={answer.votes} size="md" onVote={onVote} />

        <div
          className={`mt-2 p-1 rounded-full cursor-pointer transition-colors ${answer.accepted ? "text-green-500" : "text-gray-300 hover:text-green-400"}`}
          title={answer.accepted ? "Accepted Answer" : "Mark as Accepted"}
          onClick={isQuestionAuthor ? onAccept : undefined}
          style={{ cursor: isQuestionAuthor ? "pointer" : "default" }}
        >
          <svg aria-hidden="true" className="w-8 h-8" viewBox="0 0 40 40">
            <path
              d="M6 20L16 30L34 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="prose prose-slate max-w-none text-gray-800 text-base leading-relaxed whitespace-pre-line">
          {answer.text}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-gray-600 text-xs font-medium">
              Share
            </button>
            <button className="text-gray-400 hover:text-gray-600 text-xs font-medium">
              Edit
            </button>
            <button className="text-gray-400 hover:text-gray-600 text-xs font-medium">
              Follow
            </button>
          </div>

          <div className="flex items-center gap-2 bg-blue-50/50 p-2 rounded-sm border border-blue-100">
            <div className="w-8 h-8 bg-blue-200 rounded-sm"></div>
            <div className="flex flex-col text-xs">
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                {answer.author}
              </span>
              <span className="text-gray-500">
                answered {new Date(answer.createdAt).toLocaleDateString()} at{" "}
                {new Date(answer.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
