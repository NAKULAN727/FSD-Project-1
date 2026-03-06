const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Question = require("../models/Question");
const Discussion = require("../models/Discussion");

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

module.exports = router;
