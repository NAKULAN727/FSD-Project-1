const express = require("express");
const mongoose = require("mongoose");
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

// Connect to MongoDB
require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Root Route for testing deployment
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

// Use Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", require("./routes/groups"));
app.use("/api/private-questions", require("./routes/privateQuestions"));

// Server Startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
