import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  MessageCircle,
  HelpCircle,
  Hash,
  Award,
  User,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import QuestionCard from "../components/QuestionCard";
import { useQuestions } from "../context/QuestionContext";

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { questions } = useQuestions();

  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError("");

      const idToFetch = userId || currentUser?._id || currentUser?.id;

      if (!idToFetch) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/users/profile/${idToFetch}`);
        setProfileUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Could not load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios.put(`/api/users/profile/${profileUser._id || profileUser.id}`, editFormData);
      setProfileUser(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = () => {
    setEditFormData({
      name: profileUser.name || "",
      age: profileUser.age || "",
      dob: profileUser.dob ? new Date(profileUser.dob).toISOString().split('T')[0] : "",
      address: profileUser.address || "",
      college: profileUser.college || "",
      bio: profileUser.bio || "",
      role: profileUser.role || "",
      profilePicture: profileUser.profilePicture || ""
    });
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500">{error || "User not found"}</p>
      </div>
    );
  }

  const isOwnProfile = (currentUser?._id || currentUser?.id) === (profileUser._id || profileUser.id);

  // Filter content for the user
  const userQuestions = questions.filter(
    (q) => q.author === profileUser.name,
  );

  const dateString = profileUser.createdAt || null;
  const joinDate = dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
    : "Unknown Date";

  // Formatting DOB
  const dobString = profileUser.dob || null;
  const dobDate = dobString
    ? new Date(dobString).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Not provided";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 transition-transform duration-300 hover:shadow-2xl">
        {/* Cover Image */}
        <div className="h-56 bg-gradient-to-r from-teal-400 via-emerald-500 to-indigo-500 relative">
          <div className="absolute inset-0 bg-white/10 opacity-50 block mix-blend-overlay"></div>
          {isOwnProfile && (
            <button className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/40 text-white px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-md transition-all">
              Change Cover
            </button>
          )}
        </div>

        {/* Profile Info Bar */}
        <div className="px-6 sm:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-20 md:-mt-16 mb-6 text-center md:text-left">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-4xl sm:text-5xl font-bold bg-white z-10 relative box-content transition-transform duration-300 group-hover:scale-[1.02]">
                {profileUser.profilePicture ? (
                  <img src={profileUser.profilePicture} alt={profileUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white">
                    {profileUser?.name ? profileUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Title */}
            <div className="md:ml-8 mt-5 md:mt-0 flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 break-words tracking-tight">
                  {profileUser.name}
                </h1>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider md:ml-2">
                  {profileUser.role || "User"}
                </span>
              </div>
              <p className="text-gray-500 font-medium text-sm sm:text-base mt-1 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {profileUser.email}
              </p>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="mt-6 md:mt-0 flex gap-3 w-full md:w-auto">
                <button
                  onClick={openEditModal}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-white sticky top-0 md:static z-10 -mx-6 px-6 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === "about"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
                }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === "activity"
                ? "border-teal-500 text-teal-600"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-t-lg"
                }`}
            >
              Activity Details
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Sidebar (Stats and Details) */}
        <div className="space-y-8">

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Award className="text-yellow-500" size={20} /> Activity Stats
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-xl text-center shadow-sm border border-teal-100 hover:bg-teal-100 transition-colors">
                <div className="flex justify-center mb-1 text-teal-500"><HelpCircle size={24} /></div>
                <div className="text-3xl font-black text-teal-700">
                  {profileUser.questionsAsked || 0}
                </div>
                <div className="text-xs text-teal-600 mt-1 uppercase font-bold tracking-wide">
                  Asked
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl text-center shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors">
                <div className="flex justify-center mb-1 text-indigo-500"><MessageCircle size={24} /></div>
                <div className="text-3xl font-black text-indigo-700">
                  {profileUser.answersGiven || 0}
                </div>
                <div className="text-xs text-indigo-600 mt-1 uppercase font-bold tracking-wide">
                  Answered
                </div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl text-center shadow-sm border border-amber-100 hover:bg-amber-100 transition-colors">
                <div className="flex justify-center mb-1 text-amber-500"><Award size={24} /></div>
                <div className="text-3xl font-black text-amber-700">
                  {profileUser.votesReceived || 0}
                </div>
                <div className="text-xs text-amber-600 mt-1 uppercase font-bold tracking-wide">
                  Votes
                </div>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl text-center shadow-sm border border-rose-100 hover:bg-rose-100 transition-colors">
                <div className="flex justify-center mb-1 text-rose-500"><Hash size={24} /></div>
                <div className="text-3xl font-black text-rose-700">
                  {profileUser.discussionsCreated || 0}
                </div>
                <div className="text-xs text-rose-600 mt-1 uppercase font-bold tracking-wide">
                  Discussions
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-5">Personal Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Briefcase size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Role</p>
                  <p className="font-semibold text-gray-900">{profileUser.role || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <GraduationCap size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">College/Company</p>
                  <p className="font-semibold text-gray-900">{profileUser.college || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Address</p>
                  <p className="font-semibold text-gray-900">{profileUser.address || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Age</p>
                    <p className="font-semibold text-gray-900">{profileUser.age || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Date of Birth</p>
                    <p className="font-semibold text-gray-900">{dobDate}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-teal-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Joined Flow</p>
                  <p className="font-semibold text-gray-900">{joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">

          {activeTab === "about" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow animation-slide-up">
              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Bio</h3>
              {profileUser.bio ? (
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line font-light">
                  {profileUser.bio}
                </p>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 italic">No bio provided yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-6 animation-slide-up">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Recent Questions</h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
                  {userQuestions.length} Total
                </span>
              </div>

              {userQuestions.length > 0 ? (
                <div className="grid gap-4">
                  {userQuestions.map((q) => (
                    <QuestionCard key={q._id || q.id} question={q} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle size={40} className="text-gray-300" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-700 mb-2">No questions yet</h4>
                  <p className="text-gray-500">
                    {isOwnProfile
                      ? "You haven't asked any questions. Start participating!"
                      : "This user hasn't asked any questions."}
                  </p>
                  {isOwnProfile && (
                    <Link to="/ask" className="inline-block mt-4 px-6 py-2 bg-teal-500 text-white font-semibold rounded-full shadow-md hover:bg-teal-600 transition-colors">
                      Ask a Question
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in shadow-2xl transition-all">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                <span className="text-3xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Name</label>
                  <input type="text" name="name" value={editFormData.name || ""} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Role</label>
                  <select name="role" value={editFormData.role || ""} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors">
                    <option value="Student">Student</option>
                    <option value="Working Professional">Working Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Age</label>
                  <input type="number" name="age" value={editFormData.age || ""} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Date of Birth</label>
                  <input type="date" name="dob" value={editFormData.dob || ""} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">College/Company</label>
                  <input type="text" name="college" value={editFormData.college || ""} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Address</label>
                  <input type="text" name="address" value={editFormData.address || ""} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Profile Picture URL</label>
                <input type="text" name="profilePicture" value={editFormData.profilePicture || ""} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Bio</label>
                <textarea name="bio" value={editFormData.bio || ""} onChange={handleEditChange} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white transition-colors resize-none"></textarea>
              </div>
              <div className="pt-6 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-6 py-2.5 text-white bg-[#2DD4BF] hover:bg-[#14b8a6] shadow-lg rounded-full font-bold min-w-[140px] transition-all transform hover:scale-[1.02] disabled:opacity-70">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
