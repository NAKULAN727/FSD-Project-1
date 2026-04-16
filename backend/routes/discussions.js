const express = require("express");
const router = express.Router();
const db = require("../db");

// Fetch all discussions
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.*, u.name as author
      FROM discussions d
      LEFT JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Insert discussion
router.post("/", async (req, res) => {
  try {
    const { title, body, user_id } = req.body;
    
    // assuming user_id maps to creator of the discussion. The schema logic corresponds to this.
    const insertSQL = `
      INSERT INTO discussions (title, body, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(insertSQL, [title, body, user_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


/* --- ORIGINAL MONGODB CODE (DISABLED) ---
// const express = require("express");
// const router = express.Router();
// const Discussion = require("../models/Discussion");
// const User = require("../models/User");
// 
// // Get all discussions
// router.get("/", async (req, res) => {
//   try {
//     const discussions = await Discussion.find().sort({ createdAt: -1 });
//     res.json(discussions);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// 
// // Create a new discussion
// router.post("/", async (req, res) => {
//   const discussion = new Discussion({
//     title: req.body.title,
//     body: req.body.body,
//     author: req.body.author,
//     groupId: req.body.groupId || null,
//   });
// 
//   try {
//     const newDiscussion = await discussion.save();
// 
//     // Increment User's discussionsCreated
//     await User.findOneAndUpdate(
//       { name: req.body.author },
//       { $inc: { discussionsCreated: 1 } }
//     );
// 
//     res.status(201).json(newDiscussion);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// 
// // Add a comment to a discussion
// router.post("/:id/comments", async (req, res) => {
//   try {
//     const discussion = await Discussion.findById(req.params.id);
//     if (!discussion)
//       return res.status(404).json({ message: "Discussion not found" });
// 
//     discussion.comments.push({
//       text: req.body.text,
//       author: req.body.author,
//     });
//     discussion.commentsCount += 1;
// 
//     const updatedDiscussion = await discussion.save();
//     res.json(updatedDiscussion);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// 
// module.exports = router;
// 
*/
