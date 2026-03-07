import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Users, Shield, Plus } from "lucide-react";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("/api/groups");
                setGroups(response.data);
            } catch (err) {
                console.error("Failed to fetch groups", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGroups();
    }, []);

    const handleJoin = async (groupId) => {
        try {
            const response = await axios.post(`/api/groups/${groupId}/join`, { userId: currentUser._id });
            alert(response.data.message);
            // Refresh groups list
            const groupsRes = await axios.get("/api/groups");
            setGroups(groupsRes.data);
        } catch (err) {
            alert(err.response?.data?.message || "Error joining group");
        }
    };

    if (isLoading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Study Groups</h1>
                <Link to="/create-group" className="bg-[#0a95ff] text-white px-4 py-2 rounded-md hover:bg-[#0074cc] transition-colors flex items-center gap-2">
                    <Plus size={18} /> Create Group
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map(group => {
                    const isMember = group.members.includes(currentUser._id);
                    const isPending = group.pendingMembers?.includes(currentUser._id);

                    return (
                        <div key={group._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <Link to={`/groups/${group._id}`} className="text-xl font-bold text-blue-600 hover:underline">
                                    {group.name}
                                </Link>
                                {group.privacy === "Private" ? (
                                    <span className="flex items-center text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full"><Shield size={12} className="mr-1" /> Private</span>
                                ) : (
                                    <span className="flex items-center text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full"><Users size={12} className="mr-1" /> Public</span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{group.description}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                                <span>{group.category}</span>
                                <span>{group.members.length} members</span>
                            </div>

                            {isMember ? (
                                <Link to={`/groups/${group._id}`} className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md font-medium transition-colors">
                                    View Group
                                </Link>
                            ) : isPending ? (
                                <button disabled className="w-full bg-orange-100 text-orange-600 py-2 rounded-md font-medium cursor-not-allowed">
                                    Request Pending
                                </button>
                            ) : (
                                <button onClick={() => handleJoin(group._id)} className="w-full bg-[#e1ecf4] hover:bg-[#b3d3ea] text-[#39739d] py-2 rounded-md font-medium transition-colors">
                                    Join Group
                                </button>
                            )}
                        </div>
                    );
                })}
                {groups.length === 0 && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 bg-gray-50 rounded-xl">
                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No groups found. Be the first to create one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Groups;
