const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one question
router.get("/:id", getQuestion, (req, res) => {
  res.json(res.question);
});

// Create one question
router.post("/", async (req, res) => {
  const question = new Question({
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    author: req.body.author,
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add an answer
router.post("/:id/answers", getQuestion, async (req, res) => {
  if (req.body.text != null) {
    res.question.answers.push({
      text: req.body.text,
      author: req.body.author,
    });
    res.question.answersCount += 1;
    try {
      const updatedQuestion = await res.question.save();
      res.status(201).json(updatedQuestion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

// Vote in a Question
router.patch("/:id/vote", getQuestion, async (req, res) => {
  if (req.body.value != null) {
    res.question.votes += req.body.value;
    try {
      const updatedQuestion = await res.question.save();
      res.json(updatedQuestion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
});

// Vote in an Answer
router.patch("/:id/answers/:answerId/vote", getQuestion, async (req, res) => {
  const answer = res.question.answers.id(req.params.answerId);
  if (answer && req.body.value != null) {
    answer.votes += req.body.value;
    try {
      await res.question.save();
      res.json(res.question);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: "Answer not found" });
  }
});

// Accept an answer
router.patch("/:id/answers/:answerId/accept", getQuestion, async (req, res) => {
  const answer = res.question.answers.id(req.params.answerId);

  if (answer) {
    // Toggle if same, otherwise set true and unaccept others?
    // Logic: Unaccept all others, toggle targeted one.
    if (answer.accepted) {
      answer.accepted = false;
    } else {
      res.question.answers.forEach((a) => (a.accepted = false));
      answer.accepted = true;
    }

    try {
      await res.question.save();
      res.json(res.question);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(404).json({ message: "Answer not found" });
  }
});

// Middleware function to get question by ID
async function getQuestion(req, res, next) {
  let question;
  try {
    question = await Question.findById(req.params.id);
    if (question == null) {
      return res.status(404).json({ message: "Cannot find question" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.question = question;
  next();
}

module.exports = router;
