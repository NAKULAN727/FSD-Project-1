import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, ThumbsUp } from "lucide-react";

const Discussions = () => {
  const { discussions, addDiscussion } = useQuestions();
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  const handleCreateDiscussion = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim() || !currentUser) return;

    if (!newTitle.trim() || !newBody.trim() || !currentUser) return;

    const discussion = {
      title: newTitle,
      body: newBody,
      author: currentUser.displayName,
    };

    addDiscussion(discussion);
    setNewTitle("");
    setNewBody("");
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 min-h-screen bg-white">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-normal text-gray-900">Discussions</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-[3px] text-sm font-medium shadow-sm transition-colors"
        >
          {showForm ? "Cancel" : "Start Discussion"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-8 animate-fade-in text-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-800">
            New Discussion Topic
          </h3>
          <form onSubmit={handleCreateDiscussion} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What's on your mind?"
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Body</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                rows="4"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Elaborate on your topic..."
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-[3px] font-medium hover:bg-blue-700 disabled:opacity-50"
              disabled={!currentUser}
            >
              Post Discussion
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {discussions.length > 0 ? (
          discussions.map((discussion) => (
            <div
              key={discussion._id || discussion.id}
              className="p-4 border border-gray-200 rounded-[3px] hover:bg-gray-50 transition-colors flex gap-4"
            >
              <div className="flex flex-col items-center gap-1 min-w-[50px] text-gray-500">
                <ThumbsUp size={18} />
                <span className="text-sm font-medium">{discussion.votes}</span>
              </div>
              <div className="flex-1">
                <Link
                  to={`/discussions/${discussion._id || discussion.id}`}
                  className="text-lg text-blue-700 hover:text-blue-800 font-medium cursor-pointer mb-1 block"
                >
                  {discussion.title}
                </Link>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {discussion.body}
                </p>
                <div className="flex items-center text-xs text-gray-500 gap-4">
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} />
                    {discussion.commentsCount} comments
                  </span>
                  <span>
                    Started by{" "}
                    <span className="text-blue-600 font-medium">
                      {discussion.author}
                    </span>
                  </span>
                  <span>
                    {new Date(discussion.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No discussions yet. Start one!
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussions;
