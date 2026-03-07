const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const Question = require("../models/Question");
const Discussion = require("../models/Discussion");
const User = require("../models/User");

// Get all public groups
router.get("/", async (req, res) => {
    try {
        const groups = await Group.find({ privacy: "Public" }).sort({ createdAt: -1 });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a group
router.post("/", async (req, res) => {
    try {
        const { name, description, category, privacy, createdBy } = req.body;

        // Check if group already exists
        const existingGroup = await Group.findOne({ name });
        if (existingGroup) return res.status(400).json({ message: "Group name already taken" });

        const group = new Group({
            name,
            description,
            category,
            privacy: privacy || "Public",
            createdBy,
            members: [createdBy], // Creator is automatically a member
        });

        const newGroup = await group.save();
        res.status(201).json(newGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a specific group details
router.get("/:id", async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate("members", "name email profilePicture _id")
            .populate("pendingMembers", "name email profilePicture _id")
            .populate("createdBy", "name _id");

        if (!group) return res.status(404).json({ message: "Group not found" });

        // Fetch associated questions and discussions
        const questions = await Question.find({ groupId: group._id }).sort({ createdAt: -1 });
        const discussions = await Discussion.find({ groupId: group._id }).sort({ createdAt: -1 });

        res.json({ group, questions, discussions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Join Group
router.post("/:id/join", async (req, res) => {
    try {
        const { userId } = req.body;
        const group = await Group.findById(req.params.id);

        if (!group) return res.status(404).json({ message: "Group not found" });
        if (group.members.includes(userId)) return res.status(400).json({ message: "Already a member" });

        if (group.privacy === "Private") {
            if (group.pendingMembers.includes(userId)) return res.status(400).json({ message: "Request already sent" });
            group.pendingMembers.push(userId);
            await group.save();
            return res.json({ message: "Join request sent", status: "pending" });
        } else {
            group.members.push(userId);
            await group.save();
            return res.json({ message: "Joined group successfully", status: "joined" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
