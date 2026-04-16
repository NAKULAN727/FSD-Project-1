const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch comments for a discussion
router.get("/:discussionId", async (req, res) => {
  try {
    const { discussionId } = req.params;
    const result = await db.query(`
      SELECT c.*, u.name as author
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.discussion_id = $1
      ORDER BY c.created_at ASC
    `, [discussionId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert comment
router.post("/", async (req, res) => {
  try {
    const { body, discussion_id, user_id } = req.body;
    
    const insertSQL = `
      INSERT INTO comments (body, discussion_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(insertSQL, [body, discussion_id, user_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
