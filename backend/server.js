const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const questionRoutes = require("./routes/questions");
const authRoutes = require("./routes/auth");
const discussionRoutes = require("./routes/discussions");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/fsd_project")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Use Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/discussions", discussionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
