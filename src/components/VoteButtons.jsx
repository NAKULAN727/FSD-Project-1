import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const VoteButtons = ({ initialVotes, size = "md" }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(0); // 0: none, 1: up, -1: down

  const handleUpvote = () => {
    if (userVote === 1) {
      setVotes(votes - 1);
      setUserVote(0);
    } else if (userVote === -1) {
      setVotes(votes + 2);
      setUserVote(1);
    } else {
      setVotes(votes + 1);
      setUserVote(1);
    }
  };

  const handleDownvote = () => {
    if (userVote === -1) {
      setVotes(votes + 1);
      setUserVote(0);
    } else if (userVote === 1) {
      setVotes(votes - 2);
      setUserVote(-1);
    } else {
      setVotes(votes - 1);
      setUserVote(-1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 text-gray-500">
      <button
        onClick={handleUpvote}
        className={`p-1 rounded-full hover:bg-orange-100 active:bg-orange-200 transition-colors ${userVote === 1 ? "text-orange-600 bg-orange-50" : "text-gray-400 hover:text-orange-500"}`}
        aria-label="Upvote"
      >
        <ChevronUp size={size === "lg" ? 36 : 24} />
      </button>

      <span
        className={`font-semibold text-gray-700 ${size === "lg" ? "text-xl" : "text-lg"}`}
      >
        {votes}
      </span>

      <button
        onClick={handleDownvote}
        className={`p-1 rounded-full hover:bg-orange-100 active:bg-orange-200 transition-colors ${userVote === -1 ? "text-orange-600 bg-orange-50" : "text-gray-400 hover:text-orange-500"}`}
        aria-label="Downvote"
      >
        <ChevronDown size={size === "lg" ? 36 : 24} />
      </button>
    </div>
  );
};

export default VoteButtons;
