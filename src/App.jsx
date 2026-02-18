import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetails from "./pages/QuestionDetails";
import Tags from "./pages/Tags";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import { dummyQuestions } from "./data/dummyData";

const ProtectedRoute = ({ children, currentUser }) => {
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const location = useLocation();
  const [questions, setQuestions] = useState(() => {
    const stored = localStorage.getItem("so_clone_questions");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback if parsing fails
        return dummyQuestions;
      }
    }
    return dummyQuestions;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("so_clone_current_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("so_clone_users");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("so_clone_questions", JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "so_clone_current_user",
        JSON.stringify(currentUser),
      );
    } else {
      localStorage.removeItem("so_clone_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("so_clone_users", JSON.stringify(users));
  }, [users]);

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      return { success: true };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const handleRegister = (displayName, email, password) => {
    if (users.some((u) => u.email === email)) {
      return { success: false, message: "Email already exists" };
    }
    const newUser = { id: Date.now(), displayName, email, password };
    setUsers([...users, newUser]);
    return { success: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addQuestion = (question) => {
    setQuestions([
      { ...question, author: currentUser.displayName },
      ...questions,
    ]);
  };

  const addAnswer = (questionId, answerText) => {
    const newAnswer = {
      id: Date.now(),
      text: answerText,
      author: currentUser.displayName,
      votes: 0,
      accepted: false,
      createdAt: new Date().toISOString(),
    };

    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...(q.answers || []), newAnswer],
            answersCount: (q.answersCount || 0) + 1,
          };
        }
        return q;
      }),
    );
  };

  // Hide Navbar on Login, Register, and Landing pages
  const shouldShowNavbar = !["/login", "/register", "/"].includes(
    location.pathname,
  );

  return (
    <div className="min-h-screen bg-[#f8f9f9] flex flex-col font-sans transition-colors duration-200">
      {shouldShowNavbar && (
        <Navbar currentUser={currentUser} onLogout={handleLogout} />
      )}
      <div className="flex-1 w-full max-w-[1264px] mx-auto sm:px-4 md:px-6 lg:px-8 py-0 sm:py-6">
        <Routes>
          <Route path="/" element={<LandingPage currentUser={currentUser} />} />
          <Route
            path="/questions"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <Home questions={questions} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <AskQuestion onAddQuestion={addQuestion} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/question/:id"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <QuestionDetails
                  questions={questions}
                  onAddAnswer={addAnswer}
                  currentUser={currentUser}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <Tags questions={questions} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
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
              A frontend clone of Query Overflow built with React, Vite, and
              Tailwind CSS.
              <br />
              Designed for educational purposes.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <h5 className="font-bold text-[#babfc4] uppercase mb-2">
                Query Overflow
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
            &copy; 2024 Query Overflow Inc; user contributions licensed under CC
            BY-SA.
          </span>
          <span className="mt-2 sm:mt-0">rev 2024.11.15.4326</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
