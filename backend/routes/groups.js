const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all public groups
router.get("/", async (req, res) => {
    try {
        const result = await db.query(`
            SELECT g.*, 
                   json_agg(gm.user_id) FILTER (WHERE gm.status = 'joined') as members,
                   json_agg(gm.user_id) FILTER (WHERE gm.status = 'pending') as pending_members
            FROM groups g
            LEFT JOIN group_members gm ON g.id = gm.group_id
            WHERE g.privacy = 'Public'
            GROUP BY g.id
            ORDER BY g.created_at DESC
        `);
        // Format for frontend mapping
        const groups = result.rows.map(g => ({
            _id: g.id,
            id: g.id,
            name: g.name,
            description: g.description,
            category: g.category,
            privacy: g.privacy,
            createdBy: g.created_by,
            createdAt: g.created_at,
            members: (g.members || []).filter(m => m !== null),
            pendingMembers: (g.pending_members || []).filter(m => m !== null)
        }));
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
        const existing = await db.query("SELECT id FROM groups WHERE name = $1", [name]);
        if (existing.rows.length > 0) return res.status(400).json({ message: "Group name already taken" });

        const groupResult = await db.query(
            "INSERT INTO groups (name, description, category, privacy, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, category, privacy || "Public", createdBy]
        );
        const newGroup = groupResult.rows[0];

        // Creator is automatically a member
        await db.query("INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, 'joined')", [newGroup.id, createdBy]);

        res.status(201).json({
            _id: newGroup.id,
            ...newGroup,
            members: [createdBy]
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get a specific group details
router.get("/:id", async (req, res) => {
    try {
        const groupId = req.params.id;
        const groupRes = await db.query("SELECT * FROM groups WHERE id = $1", [groupId]);
        if (groupRes.rows.length === 0) return res.status(404).json({ message: "Group not found" });

        const group = groupRes.rows[0];
        group._id = group.id;

        // Fetch members
        const membersRes = await db.query(`
            SELECT u.id as _id, u.id, u.name, u.email 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = $1 AND gm.status = 'joined'
        `, [groupId]);
        group.members = membersRes.rows;

        // Fetch pending members
        const pendingRes = await db.query(`
            SELECT u.id as _id, u.id, u.name, u.email 
            FROM users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE gm.group_id = $1 AND gm.status = 'pending'
        `, [groupId]);
        group.pendingMembers = pendingRes.rows;

        // Fetch creator
        const creatorRes = await db.query("SELECT id as _id, id, name FROM users WHERE id = $1", [group.created_by]);
        group.createdBy = creatorRes.rows[0];

        // Questions and discussions aren't linked to groups in the Postgres schema yet, returning empty
        const questions = [];
        const discussions = [];

        res.json({ group, questions, discussions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Join Group
router.post("/:id/join", async (req, res) => {
    try {
        const { userId } = req.body;
        const groupId = req.params.id;

        const groupRes = await db.query("SELECT privacy FROM groups WHERE id = $1", [groupId]);
        if (groupRes.rows.length === 0) return res.status(404).json({ message: "Group not found" });
        const privacy = groupRes.rows[0].privacy;

        const memberCheck = await db.query("SELECT status FROM group_members WHERE group_id = $1 AND user_id = $2", [groupId, userId]);
        
        if (memberCheck.rows.length > 0) {
            const status = memberCheck.rows[0].status;
            if (status === 'joined') return res.status(400).json({ message: "Already a member" });
            if (status === 'pending') return res.status(400).json({ message: "Request already sent" });
        }

        if (privacy === "Private") {
            await db.query("INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, 'pending')", [groupId, userId]);
            return res.json({ message: "Join request sent", status: "pending" });
        } else {
            await db.query("INSERT INTO group_members (group_id, user_id, status) VALUES ($1, $2, 'joined')", [groupId, userId]);
            return res.json({ message: "Joined group successfully", status: "joined" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
