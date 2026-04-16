const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch all questions
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT q.*, u.name as author
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
    const result = await db.query(`
      SELECT q.*, u.name as author
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = $1
    `, [questionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert question
router.post("/", async (req, res) => {
  try {
    const { title, body, user_id, topic } = req.body;
    
    const insertSQL = `
      INSERT INTO questions (title, body, user_id, topic)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(insertSQL, [title, body, user_id, topic]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
