const express = require("express");
const router = express.Router();
const db = require("../db");

// Search users
router.get("/search", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.json([]);

        let result;
        // Check if query is an integer (id)
        const isId = /^\d+$/.test(query);
        
        if (isId) {
            result = await db.query(
                "SELECT id, name FROM users WHERE id = $1 LIMIT 10",
                [parseInt(query, 10)]
            );
        } else {
            result = await db.query(
                "SELECT id, name, email FROM users WHERE name ILIKE $1 OR email ILIKE $1 LIMIT 10",
                [`%${query}%`]
            );
        }

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user profile
router.get("/profile/:id", async (req, res) => {
    try {
        const result = await db.query("SELECT id, name, email, age, dob, address, college, role, bio FROM users WHERE id = $1", [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        let user = result.rows[0];

        // Ensure default values for new users
        if (!user.role) user.role = "User";
        
        // Fetch counts dynamically
        const qCount = await db.query("SELECT COUNT(*) as count FROM questions WHERE user_id = $1", [req.params.id]);
        user.questionsAsked = parseInt(qCount.rows[0].count || 0, 10);

        // Answers exist inside answers table
        const aCount = await db.query("SELECT COUNT(*) as count FROM answers WHERE user_id = $1", [req.params.id]);
        user.answersGiven = parseInt(aCount.rows[0].count || 0, 10);

        // Discussions
        const dCount = await db.query("SELECT COUNT(*) as count FROM discussions WHERE user_id = $1", [req.params.id]);
        user.discussionsCreated = parseInt(dCount.rows[0].count || 0, 10);

        user.votesReceived = 0; // Defaulting to 0 since votes logic might be decoupled

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put("/profile/:id", async (req, res) => {
    try {
        const { name, age, dob, address, college, bio, role } = req.body;

        const updateSQL = `
            UPDATE users 
            SET name = COALESCE($1, name),
                age = COALESCE($2, age),
                dob = COALESCE($3, dob),
                address = COALESCE($4, address),
                college = COALESCE($5, college),
                bio = COALESCE($6, bio),
                role = COALESCE($7, role)
            WHERE id = $8
            RETURNING id, name, email, age, dob, address, college, role, bio
        `;
        
        const result = await db.query(updateSQL, [name, age, dob, address, college, bio, role, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


/* --- ORIGINAL MONGODB CODE (DISABLED) ---
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const Question = require("../models/Question");
// const Discussion = require("../models/Discussion");
// 
// // Search users
// router.get("/search", async (req, res) => {
//     try {
//         const query = req.query.query;
//         if (!query) return res.json([]);
// 
//         const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
//         const searchQuery = isObjectId
//             ? { _id: query }
//             : { name: { $regex: query, $options: "i" } };
// 
//         const users = await User.find(searchQuery, "name _id profilePicture").limit(10);
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
// 
// // Get user profile
// router.get("/profile/:id", async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id, "-password");
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(user);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
// 
// // Update user profile
// router.put("/profile/:id", async (req, res) => {
//     try {
//         const { name, age, dob, address, college, bio, role, profilePicture } = req.body;
// 
//         // Find and update the user
//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             { name, age, dob, address, college, bio, role, profilePicture },
//             { new: true, runValidators: true }
//         ).select("-password");
// 
//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
// 
//         res.json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
// 
// module.exports = router;
// 
*/
