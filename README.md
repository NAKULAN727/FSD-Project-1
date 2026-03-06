# Query Flow

This is a frontend clone of **Stack Overflow** built with **React**, **Vite**, and **Tailwind CSS**. It is designed to be a fully dynamic, persistent Q&A platform running entirely on the client side using `localStorage`.

## Features

- **Authentication**: Fully functional Login and Registration using Context API and `localStorage`.
- **Questions**:
  - Ask Questions with title, body, and tags.
  - View Question Details with rich text.
  - Vote on Questions (Upvote/Downvote).
- **Answers**:
  - Submit Answers to questions.
  - Mark Answers as **Accepted** (only by the question author).
  - Vote on Answers (Upvote/Downvote).
- **Discussions**:
  - Start new Discussion topics.
  - Add Comments to discussions.
- **Tags**: Filter questions by tags.
- **Profile**: View user profile stats (reputation, questions asked, answers given).
- **Search**: Search questions by keyword.
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS.
- **Persistence**: All data (users, questions, answers, discussions, votes) is saved to `localStorage`, so it persists across page reloads.

## Technology Stack

- **Frontend**: React, React Router DOM
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Context API (`AuthContext`, `QuestionContext`)
- **Build Tool**: Vite

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

## Project Structure

- `src/components`: Reusable UI components (Navbar, QuestionCard, AnswerCard, etc.)
- `src/context`: Global state providers (AuthContext, QuestionContext)
- `src/pages`: Main application pages (Home, AskQuestion, QuestionDetails, Profile, etc.)
- `src/data`: Dummy data for initial populate (if localStorage is empty).

## Notes

- This project does **not** use a backend server. All logic is handled on the frontend.
- Network requests are simulated with timeouts to mimic real-world interactions.
