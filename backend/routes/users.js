const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Question = require("../models/Question");
const Discussion = require("../models/Discussion");

// Search users
router.get("/search", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.json([]);

        const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
        const searchQuery = isObjectId
            ? { _id: query }
            : { name: { $regex: query, $options: "i" } };

        const users = await User.find(searchQuery, "name _id profilePicture").limit(10);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user profile
router.get("/profile/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id, "-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put("/profile/:id", async (req, res) => {
    try {
        const { name, age, dob, address, college, bio, role, profilePicture } = req.body;

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, age, dob, address, college, bio, role, profilePicture },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
