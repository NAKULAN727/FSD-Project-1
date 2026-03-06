import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Linkedin, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    dob: "",
    address: "",
    college: "",
    role: "Student",
    bio: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic regex checks
    if (!formData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      setError("Invalid email format");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    const { name, email, password, age, dob, address, college, role, bio } = formData;

    const result = await register({ name, email, password, age, dob, address, college, role, bio });
    if (result.success) {
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-8">
      {/* Main Container */}
      <div className="relative flex flex-col m-6 bg-white shadow-2xl rounded-2xl md:flex-row max-w-5xl w-full overflow-hidden">
        {/* Left Side - Welcome Back (Teal Gradient) */}
        <div className="relative flex flex-col justify-center items-center p-8 md:w-2/5 md:min-h-full bg-gradient-to-br from-[#2DD4BF] to-[#10B981] text-white text-center order-2 md:order-1 hidden md:flex">
          <h2 className="text-3xl font-bold mb-4">One of Us?</h2>
          <p className="mb-8 font-light text-white/90 max-w-[280px]">
            If you already have an account, just sign in. We've missed you!
          </p>
          <Link to="/login">
            <button className="bg-white text-[#10B981] font-bold py-3 px-10 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              Sign In
            </button>
          </Link>

          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-white/5 skew-x-12 pointer-events-none"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 rounded-full bg-white/10 pointer-events-none"></div>
        </div>

        {/* Right Side - Register Form (White) */}
        <div className="flex flex-col justify-center p-8 md:p-14 md:w-3/5 w-full order-1 md:order-2">
          {/* Logo */}
          <div
            className="flex items-center gap-2 mb-6 cursor-pointer justify-center md:justify-start"
            onClick={() => navigate("/")}
          >
            <svg
              aria-hidden="true"
              className="native w-[28px] h-[32px]"
              viewBox="0 0 32 37"
            >
              <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB"></path>
              <path
                d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.79.68-2.95-16.1-3.35L7 23l16.1 2.99ZM23 30H7v-3h16v3Z"
                fill="#F48024"
              ></path>
            </svg>
            <span className="font-bold text-gray-700 text-lg">Query Flow</span>
          </div>

          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Create Account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <div className="flex flex-col justify-center">
                <label className="text-xs text-gray-500 mb-1 ml-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-600"
                />
              </div>
              <input
                type="text"
                name="college"
                placeholder="College/Company"
                value={formData.college}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 self-end"
              />
            </div>

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-600"
            >
              <option value="Student">Student</option>
              <option value="Working Professional">Working Professional</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              name="bio"
              placeholder="Brief Bio (Optional)"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            ></textarea>

            {error && (
              <div className="p-2 bg-red-100 border border-red-200 text-red-700 text-xs rounded text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2DD4BF] hover:bg-[#14b8a6] text-white font-bold py-3 px-4 rounded-full shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Mobile Sign In Link */}
            <div className="md:hidden text-center mt-4">
              <span className="text-gray-500 text-sm">Already have an account? </span>
              <Link to="/login" className="text-[#10B981] font-bold text-sm">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
