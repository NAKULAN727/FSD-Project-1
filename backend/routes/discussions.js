const express = require("express");
const router = express.Router();
const Discussion = require("../models/Discussion");

// Get all discussions
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new discussion
router.post("/", async (req, res) => {
  const discussion = new Discussion({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
  });

  try {
    const newDiscussion = await discussion.save();
    res.status(201).json(newDiscussion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a comment to a discussion
router.post("/:id/comments", async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    discussion.comments.push({
      text: req.body.text,
      author: req.body.author,
    });
    discussion.commentsCount += 1;

    const updatedDiscussion = await discussion.save();
    res.json(updatedDiscussion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
