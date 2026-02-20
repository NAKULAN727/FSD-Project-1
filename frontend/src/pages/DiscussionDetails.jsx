import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuestions } from "../context/QuestionContext";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, User } from "lucide-react";

const DiscussionDetails = () => {
  const { id } = useParams();
  const { discussions, addCommentToDiscussion } = useQuestions();
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");

  const discussion = discussions.find(
    (d) => d._id === id || d.id === parseInt(id),
  );

  if (!discussion)
    return <div className="p-8 text-center">Discussion not found.</div>;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    const newComment = {
      text: commentText,
      author: currentUser.displayName,
    };

    addCommentToDiscussion(discussion._id || discussion.id, newComment);
    setCommentText("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white min-h-screen">
      <Link
        to="/discussions"
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
      >
        &larr; Back to questions
      </Link>

      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {discussion.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span className="font-semibold text-blue-600">
            {discussion.author}
          </span>
          <span>&bull;</span>
          <span>{new Date(discussion.createdAt).toLocaleString()}</span>
        </div>
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {discussion.body}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={20} />
          Comments ({discussion.commentsCount})
        </h3>

        <div className="space-y-6">
          {discussion.comments && discussion.comments.length > 0 ? (
            discussion.comments.map((comment) => (
              <div
                key={comment._id || comment.id}
                className="flex gap-3 animate-fade-in"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 flex-shrink-0">
                  <User size={16} />
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No comments yet.</p>
          )}
        </div>
      </div>

      {currentUser ? (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="font-semibold text-sm mb-2">Add a comment</h4>
          <form onSubmit={handleAddComment}>
            <textarea
              className="w-full p-3 border border-gray-300 rounded mb-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Join the discussion..."
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded border border-gray-200 text-sm">
          <Link to="/login" className="text-blue-600 font-medium">
            Log in
          </Link>{" "}
          to join the discussion.
        </div>
      )}
    </div>
  );
};

export default DiscussionDetails;
