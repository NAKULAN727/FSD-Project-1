import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useAuth } from "../context/AuthContext";

const AskQuestionForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addQuestion } = useQuestions();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !tags.trim()) return;

    setIsSubmitting(true);

    // Simulate Network Delay for better UX
    setTimeout(() => {
      const newQuestion = {
        id: Date.now(),
        title,
        description: body,
        tags: tags.split(",").map((t) => t.trim()),
        votes: 0,
        answersCount: 0,
        author: currentUser?.displayName || "Anonymous", // Use context user
        createdAt: new Date().toISOString(),
        views: 0,
        answers: [],
      };

      addQuestion(newQuestion);
      setIsSubmitting(false);
      navigate("/");
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-200 shadow-sm rounded-lg my-10 relative">
      <div className="absolute top-0 right-0 p-4">
        <svg
          className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => navigate(-1)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-4">
        Ask a public question
      </h1>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md text-sm mb-6">
        <h4 className="font-semibold mb-2">Writing a good question</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>
            Add “tags” which help surface your question to members of the
            community.
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-900 mb-1"
          >
            Title
            <span className="block text-xs font-normal text-gray-500 mt-1">
              Be specific and imagine you’re asking a question to another
              person.
            </span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
            placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
            required
          />
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-semibold text-gray-900 mb-1"
          >
            Body
            <span className="block text-xs font-normal text-gray-500 mt-1">
              Include all the information someone would need to answer your
              question.
            </span>
          </label>
          <textarea
            id="body"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono placeholder-gray-400"
            placeholder="Explain the problem you are solving..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-semibold text-gray-900 mb-1"
          >
            Tags
            <span className="block text-xs font-normal text-gray-500 mt-1">
              Add up to 5 tags to describe what your question is about. Separate
              with comma.
            </span>
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm placeholder-gray-400"
            placeholder="e.g. (javascript react tailwind-css)"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Posting..." : "Post your question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AskQuestionForm;
