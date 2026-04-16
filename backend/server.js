const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const questionRoutes = require("./routes/questions");
const authRoutes = require("./routes/auth");
const discussionRoutes = require("./routes/discussions");
const userRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Middleware
// const mongoose = require("mongoose");
// require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

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
// app.use("/api/groups", require("./routes/groups")); // MongoDB groups code disabled

// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
