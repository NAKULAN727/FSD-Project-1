import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import QuestionCard from "../components/QuestionCard";

const GroupDetails = () => {
    const { groupId } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("questions");
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(`/api/groups/${groupId}`);
                setData(response.data);
            } catch (err) {
                console.error("Failed to fetch group details", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGroupDetails();
    }, [groupId]);

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;
    if (!data) return <div className="text-center mt-10 text-red-500">Group not found or you don't have access.</div>;

    const { group, questions, discussions } = data;
    const isMember = group.members.some(member => member._id === currentUser._id);

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
                <p className="text-sm text-gray-500 mb-6 bg-gray-100 px-3 py-1 rounded inline-block">{group.category} • {group.privacy}</p>
                <p className="text-gray-700 text-lg">{group.description}</p>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button onClick={() => setActiveTab("questions")} className={`px-4 py-3 font-semibold ${activeTab === 'questions' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:text-gray-800'}`}>Questions ({questions.length})</button>
                <button onClick={() => setActiveTab("discussions")} className={`px-4 py-3 font-semibold ${activeTab === 'discussions' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:text-gray-800'}`}>Discussions ({discussions.length})</button>
                <button onClick={() => setActiveTab("members")} className={`px-4 py-3 font-semibold ${activeTab === 'members' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-gray-500 hover:text-gray-800'}`}>Members ({group.members.length})</button>
            </div>

            {!isMember ? (
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8">
                    <p className="text-orange-700">You must be a member of this group to view details or post new content.</p>
                </div>
            ) : (
                <div>
                    {activeTab === "questions" && (
                        <div>
                            <div className="flex justify-end mb-4">
                                {/* For ask question, we should pass the groupId. Real implementation would send it via state or dedicated route. Will keep simple. */}
                                <Link to="/ask" state={{ groupId: group._id }} className="bg-[#0a95ff] text-white px-4 py-2 rounded shadow-sm hover:bg-[#0074cc]">Ask Question</Link>
                            </div>
                            {questions.length > 0 ? (
                                <div className="space-y-4">
                                    {questions.map(q => <QuestionCard key={q._id} question={q} />)}
                                </div>
                            ) : (
                                <p className="text-gray-500">No questions in this group yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "discussions" && (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button className="bg-[#0a95ff] text-white px-4 py-2 rounded shadow-sm hover:bg-[#0074cc]">Start Discussion</button>
                            </div>
                            {discussions.length > 0 ? (
                                <div className="space-y-4">
                                    {discussions.map(d => (
                                        <div key={d._id} className="p-4 border rounded shadow-sm bg-white">
                                            <Link to={`/discussions/${d._id}`} className="text-lg text-blue-600 font-bold hover:underline mb-2 block">{d.title}</Link>
                                            <p className="text-gray-600 text-sm line-clamp-2">{d.body}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No discussions in this group yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "members" && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {group.members.map(member => (
                                <div key={member._id} className="flex items-center gap-3 p-4 border rounded-lg hover:shadow-sm">
                                    <div className="w-10 h-10 bg-indigo-500 rounded-full text-white flex items-center justify-center font-bold">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-semibold text-gray-800 truncate">{member.name}</p>
                                        {group.createdBy._id === member._id && <span className="text-xs text-green-600 font-medium">Admin</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GroupDetails;
