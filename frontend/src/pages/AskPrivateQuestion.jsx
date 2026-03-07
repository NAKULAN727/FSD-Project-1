import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Search } from "lucide-react";

const AskPrivateQuestion = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [error, setError] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Search user endpoint debounce trigger
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                try {
                    const res = await axios.get(`/api/users/search?query=${searchQuery}`);
                    // Don't show current user in results
                    setSearchResults(res.data.filter(u => u._id !== currentUser._id));
                } catch (err) {
                    console.error("Search failed");
                }
            } else {
                setSearchResults([]);
            }
        }, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [searchQuery, currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            setError("Please search and select a user to ask.");
            return;
        }

        try {
            await axios.post("/api/private-questions", {
                ...formData,
                askedBy: currentUser._id,
                visibleTo: selectedUser._id
            });
            navigate("/private-questions");
        } catch (err) {
            setError(err.response?.data?.message || "Error submitting private question");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Ask a Private Question</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">

                {/* User Search Section */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-800 mb-2">Search User</label>
                    <p className="text-xs text-gray-500 mb-2">Type username or User ID to select the recipient.</p>

                    <div className="relative">
                        <div className="flex items-center relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[3px] focus:outline-none focus:ring-4 focus:ring-teal-400/20 focus:border-teal-500 transition-all font-mono"
                                placeholder="e.g. JohnDoe or u123..."
                            />
                            <Search className="absolute left-3 text-gray-400" size={18} />
                        </div>

                        {/* Search Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-10 w-full bg-white mt-1 border border-gray-200 shadow-xl rounded max-h-48 overflow-y-auto">
                                {searchResults.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleSelectUser(user)}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center gap-3"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">ID: {user._id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected User Tag */}
                    {selectedUser && (
                        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded flex items-center justify-between">
                            <div>
                                <span className="text-xs text-teal-600 font-bold uppercase tracking-wider block mb-1">Selected Recipient</span>
                                <span className="font-bold text-gray-800">{selectedUser.name}</span> <span className="text-gray-500 text-sm">(ID: {selectedUser._id})</span>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="text-teal-600 hover:bg-teal-100 p-2 rounded text-sm font-bold transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 border-t border-gray-100 pt-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Title</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-[3px] focus:outline-none focus:ring-4 focus:ring-[#0a95ff]/20 focus:border-[#0a95ff] transition-all" placeholder="e.g. Is there an R function for finding the index of an element in a vector?" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full px-4 py-3 border border-gray-300 rounded-[3px] focus:outline-none focus:ring-4 focus:ring-[#0a95ff]/20 focus:border-[#0a95ff] transition-all resize-y font-mono text-sm" placeholder="Provide complete code and details..."></textarea>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">{error}</div>}

                    <div className="pt-4 border-t">
                        <button type="submit" className="bg-[#0a95ff] hover:bg-[#0074cc] text-white font-bold py-2.5 px-6 rounded shadow-sm transition-colors">
                            Post Privately
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AskPrivateQuestion;
