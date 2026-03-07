import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Lock, Search, Send } from "lucide-react";

const PrivateQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyText, setReplyText] = useState({});
    const [expandedId, setExpandedId] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchPrivateQuestions = async () => {
            try {
                const response = await axios.get(`/api/private-questions/user/${currentUser._id}`);
                setQuestions(response.data);
            } catch (err) {
                console.error("Failed to fetch private questions", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (currentUser) {
            fetchPrivateQuestions();
        }
    }, [currentUser]);

    const handleReplyChange = (id, value) => {
        setReplyText((prev) => ({ ...prev, [id]: value }));
    };

    const submitReply = async (questionId) => {
        const text = replyText[questionId];
        if (!text || text.trim() === "") return;

        try {
            const response = await axios.post(`/api/private-questions/${questionId}/answer`, {
                text,
                authorId: currentUser._id,
                authorName: currentUser.name
            });

            // Update the target question locally
            setQuestions(prev => prev.map(q => q._id === questionId ? response.data : q));

            // Clear input
            setReplyText((prev) => ({ ...prev, [questionId]: "" }));
        } catch (err) {
            alert("Failed to send reply");
        }
    };

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;

    const askedByMe = questions.filter(q => q.askedBy?._id === currentUser._id);
    const sentToMe = questions.filter(q => q.visibleTo?._id === currentUser._id);

    const renderQuestionBox = (q) => {
        const isExpanded = expandedId === q._id;
        return (
            <div key={q._id} className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-2">
                    <h2 className="text-xl font-bold text-blue-600">{q.title}</h2>
                    <span className="text-xs text-gray-400">
                        {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-gray-700 mb-4">{q.description}</p>

                <div className="text-sm text-gray-500 flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span>Asked by: <strong>{q.askedBy?.name}</strong></span>
                    <span>Visible to: <strong>{q.visibleTo?.name}</strong></span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 pb-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 text-sm">{q.answers.length} Answers</h3>
                        <button
                            onClick={() => setExpandedId(isExpanded ? null : q._id)}
                            className="text-xs font-bold text-blue-500 hover:underline"
                        >
                            {isExpanded ? "Collapse" : "Reply & View"}
                        </button>
                    </div>

                    {isExpanded && (
                        <div className="space-y-3 mt-4">
                            {/* Answers List */}
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 rounded bg-gray-50 p-3">
                                {q.answers.length === 0 ? <p className="text-xs text-gray-500 italic">No answers yet.</p> : null}
                                {q.answers.map((ans, idx) => (
                                    <div key={idx} className="bg-white p-2 rounded shadow-sm border border-gray-100 text-sm">
                                        <span className="font-bold text-gray-800">{ans.authorName}: </span>
                                        <span className="text-gray-700">{ans.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Input */}
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="Type a reply..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                                    value={replyText[q._id] || ""}
                                    onChange={(e) => handleReplyChange(q._id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") submitReply(q._id);
                                    }}
                                />
                                <button
                                    onClick={() => submitReply(q._id)}
                                    disabled={!replyText[q._id] || replyText[q._id].trim() === ""}
                                    className="bg-[#0a95ff] text-white p-2 rounded shadow-sm hover:bg-[#0074cc] disabled:bg-blue-300"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lock className="text-red-500" /> Private Questions
                </h1>
                <Link to="/ask-private-question" className="bg-[#0a95ff] text-white px-6 py-2 rounded font-medium shadow-sm hover:bg-[#0074cc]">
                    Ask Privately
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Questions I Asked */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Questions I Asked</h2>
                    <div className="space-y-4">
                        {askedByMe.length > 0 ? (
                            askedByMe.map(renderQuestionBox)
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm">You haven't asked any private questions yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Questions Sent To Me */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Questions Sent To Me</h2>
                    <div className="space-y-4">
                        {sentToMe.length > 0 ? (
                            sentToMe.map(renderQuestionBox)
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-sm">No one has sent you a private question yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivateQuestions;
