import React from "react";
import { useParams, Link } from "react-router-dom";
import AnswerCard from "../components/AnswerCard";
import AnswerForm from "../components/AnswerForm";
import VoteButtons from "../components/VoteButtons";
import Tag from "../components/Tag";

const QuestionDetails = ({ questions, onAddAnswer }) => {
  const { id } = useParams();
  const question = questions.find((q) => q.id === parseInt(id));

  if (!question) {
    return (
      <div className="p-10 text-center text-gray-500 text-xl">
        Question not found
      </div>
    );
  }

  const handleAddAnswer = (text) => {
    onAddAnswer(question.id, text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-800 break-words flex-1 leading-tight">
            {question.title}
          </h1>
          <Link
            to="/ask"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[3px] text-sm font-medium shadow-sm transition whitespace-nowrap"
          >
            Ask Question
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 pb-2 border-b border-gray-100">
          <span className="flex gap-1" title={question.createdAt}>
            Asked{" "}
            <span className="text-gray-900">
              {new Date(question.createdAt).toLocaleDateString()}
            </span>
          </span>
          <span className="flex gap-1">
            Modified <span className="text-gray-900">today</span>
          </span>
          <span className="flex gap-1">
            Viewed <span className="text-gray-900">{question.views} times</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="min-w-0">
          <div className="flex gap-4 mb-8">
            <div className="flex-shrink-0 pt-1">
              <VoteButtons initialVotes={question.votes} size="lg" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="prose prose-slate max-w-none text-gray-800 text-[15px] leading-relaxed whitespace-pre-line mb-6 break-words">
                {question.description}
              </div>

              <div className="flex gap-2 flex-wrap mb-8">
                {question.tags.map((tag) => (
                  <Tag key={tag} name={tag} />
                ))}
              </div>

              {/* Author / Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-4">
                <div className="flex gap-2 text-xs text-gray-400 items-center">
                  <span className="cursor-pointer hover:text-gray-500">
                    Share
                  </span>
                  <span className="cursor-pointer hover:text-gray-500">
                    Edit
                  </span>
                  <span className="cursor-pointer hover:text-gray-500">
                    Follow
                  </span>
                </div>

                <div className="bg-blue-50/40 p-3 rounded-[3px] border border-blue-100">
                  <span className="text-xs text-gray-500 block mb-1">
                    asked {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-200 rounded-[3px]"></div>
                    <div className="flex flex-col">
                      <Link
                        to="#"
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
                      >
                        {question.author}
                      </Link>
                      <span className="text-gray-500 text-[10px] font-bold">
                        1.2k{" "}
                        <span className="font-normal text-gray-400">
                          reputation
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="mt-8 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-normal text-gray-800">
                {question.answersCount}{" "}
                {question.answersCount === 1 ? "Answer" : "Answers"}
              </h2>
              <div className="flex border border-gray-300 rounded-[3px] text-xs">
                <button className="px-2 py-1.5 bg-gray-100 border-r border-gray-300 font-medium text-gray-600">
                  Score
                </button>
                <button className="px-2 py-1.5 bg-white text-gray-500 hover:bg-gray-50">
                  Date
                </button>
              </div>
            </div>

            <div className="space-y-0 divide-y divide-gray-200">
              {question.answers && question.answers.length > 0 ? (
                question.answers.map((ans) => (
                  <AnswerCard key={ans.id} answer={ans} />
                ))
              ) : (
                <div className="py-8 text-center text-gray-500 italic border-t border-b border-gray-100 bg-gray-50/30 rounded">
                  No answers yet. Be the first to help!
                </div>
              )}
            </div>
          </div>

          <AnswerForm onAddAnswer={handleAddAnswer} />
        </div>

        {/* Sidebar */}
        <div className="hidden md:block space-y-6">
          <div className="bg-[#fdf7e2] border border-[#f1e5bc] rounded-[3px] shadow-sm p-4 text-xs text-gray-700">
            <h4 className="font-bold text-[#525960] border-b border-[#f1e5bc] pb-2 mb-2">
              The Overflow Blog
            </h4>
            <ul className="space-y-2 list-none m-0 p-0 text-gray-800">
              <li className="flex gap-2">
                <span className="text-gray-400">✏️</span>
                <span className="hover:text-black cursor-pointer">
                  The prompt that forced OpenAI to rewrite its system card
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">🎙️</span>
                <span className="hover:text-black cursor-pointer">
                  Re-engineering the developer experience at Atlassian{" "}
                </span>
              </li>
            </ul>
          </div>

          <div className="p-4 border border-gray-200 rounded-[3px] shadow-sm">
            <h4 className="text-gray-600 font-normal mb-4 text-lg">
              Custom Filters
            </h4>
            <div className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 block mb-2">
              Create a custom filter
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-[3px] shadow-sm">
            <h4 className="text-gray-600 font-normal mb-4 text-lg">
              Watched Tags
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((t) => (
                <Tag key={t} name={t} />
              ))}
            </div>
            <div className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
              Watch a tag
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
