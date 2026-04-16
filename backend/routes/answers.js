const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch answers for a question
router.get("/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const result = await db.query(`
      SELECT a.*, u.name as author
      FROM answers a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.question_id = $1
      ORDER BY a.created_at ASC
    `, [questionId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert answer
router.post("/", async (req, res) => {
  try {
    const { body, question_id, user_id } = req.body;
    
    const insertSQL = `
      INSERT INTO answers (body, question_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(insertSQL, [body, question_id, user_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
