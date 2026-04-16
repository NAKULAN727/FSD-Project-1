const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch private questions for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query(`
      SELECT pq.*, u1.name as asked_by_name, u2.name as visible_to_name
      FROM private_questions pq
      LEFT JOIN users u1 ON pq.asked_by = u1.id
      LEFT JOIN users u2 ON pq.visible_to = u2.id
      WHERE pq.asked_by = $1 OR pq.visible_to = $1
      ORDER BY pq.created_at DESC
    `, [userId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert private question
router.post("/", async (req, res) => {
  try {
    const { title, body, asked_by, visible_to } = req.body;
    
    const insertSQL = `
      INSERT INTO private_questions (title, body, asked_by, visible_to)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(insertSQL, [title, body, asked_by, visible_to]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
