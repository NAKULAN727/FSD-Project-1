const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, dob, address, college, role, bio } = req.body;

    // Check if user already exists
    const checkUserRes = await db.query("SELECT * FROM users WHERE email = $1 OR name = $2", [email, name]);
    if (checkUserRes.rows.length > 0) {
      return res.status(400).json({ error: "User already exists with that email or name" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into PostgreSQL
    // For simplicity with optional fields, we insert only the core fields based on standard structures
    // and assume users table has: name, email, password, role, bio, college, address, age, dob
    // If some columns don't exist, it might fail, but we'll include them as they were in mongo.
    // The instructions said "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)"
    // We'll follow the exact example from instructions.
    
    // Actually, preserving the other fields if they exist is good, but let's stick to the core first to ensure it matches the user's DB. 
    // The user said: "Example SQL: INSERT INTO users (name, email, password) VALUES ($1, $2, $3)"
    // But they pass role, bio, etc. I'll include all standard fields dynamically or hardcode the basics. 
    // Let's stick to name, email, password to be safe, or include all. Let's include all using a safe query.
    // Wait, the safest is to only insert name, email, password, returning id.
    
    const insertSQL = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `;
    const result = await db.query(insertSQL, [name, email, hashedPassword]);
    const newUser = result.rows[0];

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Fetch user
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id }, // postgres usually uses id, not _id
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Remove password from response
    delete user.password;

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT id, name, email FROM users");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
