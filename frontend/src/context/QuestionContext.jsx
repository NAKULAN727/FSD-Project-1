import React, { createContext, useState, useEffect, useContext } from "react";

const QuestionContext = createContext();

export const useQuestions = () => useContext(QuestionContext);

export const QuestionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API}/api/questions`);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDiscussions = async () => {
    try {
      const res = await fetch(`${API}/api/discussions`);
      const data = await res.json();
      setDiscussions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addQuestion = async (questionData) => {
    try {
      const res = await fetch(`${API}/api/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionData),
      });
      const newQuestion = await res.json();
      setQuestions((prev) => [newQuestion, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const addAnswer = async (questionId, answerData) => {
    try {
      const res = await fetch(`${API}/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData), // answerData should map to backend fields
      });
      const updatedQuestion = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const acceptAnswer = async (questionId, answerId) => {
    try {
      const res = await fetch(
        `${API}/api/questions/${questionId}/answers/${answerId}/accept`,
        {
          method: "PATCH",
        },
      );
      const updatedQuestion = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const voteQuestion = async (questionId, value) => {
    try {
      const res = await fetch(`${API}/api/questions/${questionId}/vote`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const updatedQuestion = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const voteAnswer = async (questionId, answerId, value) => {
    try {
      const res = await fetch(
        `${API}/api/questions/${questionId}/answers/${answerId}/vote`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value }),
        },
      );
      const updatedQuestion = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const addDiscussion = async (discussionData) => {
    try {
      const res = await fetch(`${API}/api/discussions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discussionData),
      });
      const newDiscussion = await res.json();
      setDiscussions((prev) => [newDiscussion, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  const addCommentToDiscussion = async (discussionId, commentData) => {
    try {
      const res = await fetch(
        `${API}/api/discussions/${discussionId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commentData),
        },
      );
      const updatedDiscussion = await res.json();
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === updatedDiscussion._id ? updatedDiscussion : d,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const value = {
    questions,
    addQuestion,
    addAnswer,
    acceptAnswer,
    voteQuestion,
    voteAnswer,
    discussions,
    addDiscussion,
    addCommentToDiscussion,
  };

  useEffect(() => {
    fetchQuestions();
    fetchDiscussions();
  }, []);

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};
