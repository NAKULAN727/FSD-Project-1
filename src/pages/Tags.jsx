import React from "react";
import { useSearchParams } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { allTags } from "../data/dummyData";
import Tag from "../components/Tag";

const Tags = ({ questions }) => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  const filteredQuestions = filter
    ? questions.filter((q) => q.tags.includes(filter))
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-screen bg-white">
      <h1 className="text-2xl font-normal text-gray-800 mb-2">Tags</h1>
      <p className="text-sm text-gray-600 mb-6 max-w-3xl leading-relaxed">
        A tag is a keyword or label that categorizes your question with other,
        similar questions. Using the right tags makes it easier for others to
        find and answer your question.
      </p>

      {!filter && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {allTags.map((tag) => (
            <div
              key={tag.id}
              className="border border-gray-200 p-3 rounded-[3px] bg-white shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <div className="mb-2">
                <Tag name={tag.name} />
              </div>
              <p className="text-xs text-slate-500 line-clamp-4 flex-1 mb-3 leading-snug">
                {tag.description}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-auto border-t border-gray-50 pt-2">
                <span>{tag.count} questions</span>
                <span>12 today</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filter && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-normal text-gray-800">
              Questions tagged with{" "}
              <span className="font-semibold text-gray-900">[{filter}]</span>
            </h2>
            <a href="/tags" className="text-sm text-blue-600 hover:underline">
              Show all tags
            </a>
          </div>

          {filteredQuestions.length > 0 ? (
            <div className="bg-white border-t border-gray-200 -mx-4 sm:mx-0 sm:border sm:rounded-md shadow-sm divide-y divide-gray-200">
              {filteredQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded border border-gray-200 border-dashed">
              <p className="text-gray-500 mb-2">
                No questions found with this tag.
              </p>
              <a href="/" className="text-blue-600 hover:underline text-sm">
                Browse all questions
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tags;
