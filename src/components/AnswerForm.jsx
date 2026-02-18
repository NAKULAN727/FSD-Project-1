import React, { useState } from "react";

const AnswerForm = ({ onAddAnswer }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddAnswer(text);
    setText("");
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Answer</h3>
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          rows={10}
          className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md p-3 font-mono mb-4 resize-y min-h-[150px]"
          placeholder="Write your answer..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Post Your Answer
        </button>
      </form>
    </div>
  );
};

export default AnswerForm;
