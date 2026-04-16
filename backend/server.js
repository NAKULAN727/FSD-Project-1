const express = require("express");
const cors = require("cors");
require("dotenv").config();

const questionRoutes = require("./routes/questions");
const authRoutes = require("./routes/auth");
const discussionRoutes = require("./routes/discussions");
const userRoutes = require("./routes/users");

const app = express();

// Middleware
const allowedOrigins = [
  "https://fsd-project-rust.vercel.app",
  "https://fsd-project-juzthwf4r-nakulans-projects.vercel.app",
  "http://localhost:5173",
];
if (process.env.CLIENT_URL) {
  if (!allowedOrigins.includes(process.env.CLIENT_URL)) {
    allowedOrigins.push(process.env.CLIENT_URL);
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Allows previews or alternative origins by reflecting the origin dynamcially
        callback(null, origin);
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Test DB connection
const db = require("./db");
db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to PostgreSQL:", err);
  } else {
    console.log("PostgreSQL Connected at:", res.rows[0].now);
  }
});

// Root Route for testing deployment
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Use Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/users", userRoutes);

app.use("/api/private-questions", require("./routes/privateQuestions"));
app.use("/api/answers", require("./routes/answers"));
app.use("/api/comments", require("./routes/comments"));

// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
