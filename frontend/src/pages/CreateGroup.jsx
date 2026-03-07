import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CreateGroup = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Programming",
        privacy: "Public",
    });
    const [error, setError] = useState("");
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/groups", {
                ...formData,
                createdBy: currentUser._id
            });
            navigate(`/groups/${response.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Error creating group");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6">Create a Study Group</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a95ff]" placeholder="e.g. React Developers 2026" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a95ff] resize-none" placeholder="What is this group about?"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a95ff]">
                            <option value="Programming">Programming</option>
                            <option value="Academics">Academics</option>
                            <option value="Career">Career</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Privacy</label>
                        <select name="privacy" value={formData.privacy} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0a95ff]">
                            <option value="Public">Public (Anyone can join)</option>
                            <option value="Private">Private (Invite / Approval only)</option>
                        </select>
                    </div>

                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                    <div className="pt-4 flex justify-end">
                        <button type="button" onClick={() => navigate("/groups")} className="text-gray-500 mr-4 font-medium hover:text-gray-700">Cancel</button>
                        <button type="submit" className="bg-[#0a95ff] text-white px-6 py-2 rounded-md font-medium hover:bg-[#0074cc] transition-colors">Create Group</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroup;
