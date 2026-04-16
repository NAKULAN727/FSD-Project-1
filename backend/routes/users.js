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
                "SELECT id, name FROM users WHERE name ILIKE $1 LIMIT 10",
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
        res.json(result.rows[0]);
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
