import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetails from "./pages/QuestionDetails";
import Tags from "./pages/Tags";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import Discussions from "./pages/Discussions";
import DiscussionDetails from "./pages/DiscussionDetails";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QuestionProvider } from "./context/QuestionContext";

// Wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Main App Content wrapped in providers
const AppContent = () => {
  const location = useLocation();
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // Hide Navbar on Login, Register, and Landing pages
  const shouldShowNavbar = !["/login", "/register", "/"].includes(
    location.pathname,
  );

  // Hide Footer on Login and Register pages
  const shouldShowFooter = !["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans transition-colors duration-200">
      {shouldShowNavbar && (
        <Navbar /> // Navbar handles auth internally
      )}
      <div className="flex-1 w-full max-w-[1264px] mx-auto sm:px-4 md:px-6 lg:px-8 py-0 sm:py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/questions"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/question/:id"
            element={
              <ProtectedRoute>
                <QuestionDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions/:id"
            element={<Navigate to="/question/:id" replace />}
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute>
                <Tags />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discussions"
            element={
              <ProtectedRoute>
                <Discussions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discussions/:id"
            element={
              <ProtectedRoute>
                <DiscussionDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {shouldShowFooter && (
        <footer className="bg-[#232629] text-[#9fa6ad] py-10 px-4 text-xs mt-10 border-t border-[#3d3d3d]">
          <div className="max-w-[1264px] mx-auto grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-8">
            <div className="flex flex-col items-start gap-4">
              <svg
                aria-hidden="true"
                className="native w-[32px] h-[37px]"
                viewBox="0 0 32 37"
              >
                <path d="M26 33v-9h4v13H0V24h4v9h22Z" fill="#BCBBBB"></path>
                <path
                  d="m21.5 0-2.7 2 9.9 13.3 2.7-2L21.5 0ZM26 18.4 13.3 7.8l2.1-2.5 12.7 10.6-2.1 2.5ZM9.1 15.2l15 7 1.4-3-15-7-1.4 3Zm14 10.79.68-2.95-16.1-3.35L7 23l16.1 2.99ZM23 30H7v-3h16v3Z"
                  fill="#F48024"
                ></path>
              </svg>
              <p className="mt-2">
                A frontend clone of Query Flow built with React, Vite, and
                Tailwind CSS.
                <br />
                Designed for educational purposes.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-[#babfc4] uppercase mb-2">
                  Query Flow
                </h5>
                <a href="#" className="hover:text-[#babfc4] text-[#9fa6ad]">
                  Questions
                </a>
                <a href="#" className="hover:text-[#babfc4] text-[#9fa6ad]">
                  Help
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-[#babfc4] uppercase mb-2">
                  Products
                </h5>
                <a href="#" className="hover:text-[#babfc4] text-[#9fa6ad]">
                  Teams
                </a>
                <a href="#" className="hover:text-[#babfc4] text-[#9fa6ad]">
                  Advertising
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="font-bold text-[#babfc4] uppercase mb-2">
                  Company
                </h5>
                <a href="#" className="hover:text-[#babfc4] text-[#9fa6ad]">
                  About
                </a>
                <a href="#" className="hover:text-[#babfc4] text-[#9fa6ad]">
                  Work Here
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-[1264px] mx-auto mt-8 pt-8 border-t border-[#3d3d3d] flex flex-col sm:flex-row justify-between items-center text-[10px]">
            <span>
              &copy; 2024 Query Flow Inc; user contributions licensed under CC
              BY-SA.
            </span>
            <span className="mt-2 sm:mt-0">rev 2024.11.15.4326</span>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <QuestionProvider>
        <AppContent />
      </QuestionProvider>
    </AuthProvider>
  );
}

export default App;
