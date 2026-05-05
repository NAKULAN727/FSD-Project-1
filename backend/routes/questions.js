const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch all questions
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT q.*, u.name as author,
             (SELECT COUNT(*) FROM answers a WHERE a.question_id = q.id) as "answersCount"
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      ORDER BY q.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch single question by ID
router.get("/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const questionResult = await db.query(`
      SELECT q.*, u.name as author
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [questionId]);

    if (questionResult.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const answersResult = await db.query(`
      SELECT a.*, u.name as author
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC
    `, [questionId]);

    const question = questionResult.rows[0];
    question.answers = answersResult.rows;
    question.answersCount = answersResult.rows.length;

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert question
router.post("/", async (req, res) => {
  try {
    const { title, body, user_id, tags } = req.body;
    
    const insertSQL = `
      INSERT INTO questions (title, body, user_id, tags)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(insertSQL, [title, body, user_id, tags]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add an answer
router.post("/:id/answers", async (req, res) => {
  try {
    const { id } = req.params;
    const { body, user_id } = req.body;
    
    await db.query(
      "INSERT INTO answers (body, question_id, user_id) VALUES ($1, $2, $3)",
      [body, id, user_id]
    );
    
    // Fetch updated question with answers
    const questionResult = await db.query(`
      SELECT q.*, u.name as author
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [id]);

    const answersResult = await db.query(`
      SELECT a.*, u.name as author
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC
    `, [id]);

    const question = questionResult.rows[0];
    question.answers = answersResult.rows;
    question.answersCount = answersResult.rows.length;

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote in a Question
router.patch("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    
    const result = await db.query(
      "UPDATE questions SET votes = COALESCE(votes, 0) + $1 WHERE id = $2 RETURNING *",
      [value, id]
    );
    
    if (result.rows.length === 0) return res.status(404).json({ error: "Question not found" });
    
    const question = result.rows[0];
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote in an Answer
router.patch("/:id/answers/:answerId/vote", async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const { value } = req.body;
    
    await db.query(
      "UPDATE answers SET votes = COALESCE(votes, 0) + $1 WHERE id = $2",
      [value, answerId]
    );
    
    // Fetch updated question with answers
    const questionResult = await db.query(`
      SELECT q.*, u.name as author
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [id]);

    const answersResult = await db.query(`
      SELECT a.*, u.name as author
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC
    `, [id]);

    if (questionResult.rows.length === 0) return res.status(404).json({ error: "Question not found" });

    const question = questionResult.rows[0];
    question.answers = answersResult.rows;
    question.answersCount = answersResult.rows.length;

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept an answer
router.patch("/:id/answers/:answerId/accept", async (req, res) => {
  try {
    const { id, answerId } = req.params;

    // Reset all answers for this question to not accepted
    await db.query(
      "UPDATE answers SET accepted = FALSE WHERE question_id = $1",
      [id]
    );

    // Set the specific answer to accepted
    await db.query(
      "UPDATE answers SET accepted = TRUE WHERE id = $1",
      [answerId]
    );

    // Fetch updated question with answers
    const questionResult = await db.query(`
      SELECT q.*, u.name as author
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [id]);

    const answersResult = await db.query(`
      SELECT a.*, u.name as author
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC
    `, [id]);

    if (questionResult.rows.length === 0) return res.status(404).json({ error: "Question not found" });

    const question = questionResult.rows[0];
    question.answers = answersResult.rows;
    question.answersCount = answersResult.rows.length;

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


/* --- ORIGINAL MONGODB CODE (DISABLED) ---
// const express = require("express");
// const router = express.Router();
// const Question = require("../models/Question");
// const User = require("../models/User");
// 
// // Get all questions
// router.get("/", async (req, res) => {
//   try {
//     const questions = await Question.find().sort({ createdAt: -1 });
//     res.json(questions);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// 
// // Get one question
// router.get("/:id", getQuestion, (req, res) => {
//   res.json(res.question);
// });
// 
// // Create one question
// router.post("/", async (req, res) => {
//   const question = new Question({
//     title: req.body.title,
//     description: req.body.description,
//     tags: req.body.tags,
//     author: req.body.author,
//     groupId: req.body.groupId || null,
//   });
// 
//   try {
//     const newQuestion = await question.save();
// 
//     await User.findOneAndUpdate(
//       { name: req.body.author },
//       { $inc: { questionsAsked: 1 } }
//     );
// 
//     res.status(201).json(newQuestion);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// 
// // Add an answer
// router.post("/:id/answers", getQuestion, async (req, res) => {
//   if (req.body.text != null) {
//     res.question.answers.push({
//       text: req.body.text,
//       author: req.body.author,
//     });
//     res.question.answersCount += 1;
//     try {
//       const updatedQuestion = await res.question.save();
// 
//       await User.findOneAndUpdate(
//         { name: req.body.author },
//         { $inc: { answersGiven: 1 } }
//       );
// 
//       res.status(201).json(updatedQuestion);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   }
// });
// 
// // Vote in a Question
// router.patch("/:id/vote", getQuestion, async (req, res) => {
//   if (req.body.value != null) {
//     res.question.votes += req.body.value;
//     try {
//       const updatedQuestion = await res.question.save();
// 
//       if (req.body.value > 0) {
//         await User.findOneAndUpdate(
//           { name: res.question.author },
//           { $inc: { votesReceived: 1 } }
//         );
//       }
// 
//       res.json(updatedQuestion);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   }
// });
// 
// // Vote in an Answer
// router.patch("/:id/answers/:answerId/vote", getQuestion, async (req, res) => {
//   const answer = res.question.answers.id(req.params.answerId);
//   if (answer && req.body.value != null) {
//     answer.votes += req.body.value;
//     try {
//       await res.question.save();
// 
//       if (req.body.value > 0) {
//         await User.findOneAndUpdate(
//           { name: answer.author },
//           { $inc: { votesReceived: 1 } }
//         );
//       }
// 
//       res.json(res.question);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   } else {
//     res.status(404).json({ message: "Answer not found" });
//   }
// });
// 
// // Accept an answer
// router.patch("/:id/answers/:answerId/accept", getQuestion, async (req, res) => {
//   const answer = res.question.answers.id(req.params.answerId);
// 
//   if (answer) {
//     if (answer.accepted) {
//       answer.accepted = false;
//     } else {
//       res.question.answers.forEach((a) => (a.accepted = false));
//       answer.accepted = true;
//     }
// 
//     try {
//       await res.question.save();
//       res.json(res.question);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   } else {
//     res.status(404).json({ message: "Answer not found" });
//   }
// });
// 
// // Middleware function to get question by ID
// async function getQuestion(req, res, next) {
//   let question;
//   try {
//     question = await Question.findById(req.params.id);
//     if (question == null) {
//       return res.status(404).json({ message: "Cannot find question" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// 
//   res.question = question;
//   next();
// }
// 
// module.exports = router;
// 
*/
