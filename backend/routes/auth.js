const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Social Login (Google, Facebook, LinkedIn)
router.post("/social-login", async (req, res) => {
  try {
    const { token: socialToken, provider } = req.body;
    let email, name;

    if (provider === "google") {
      const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: { Authorization: `Bearer ${socialToken}` }
      });
      email = googleRes.data.email;
      name = googleRes.data.name;
    } else if (provider === "facebook") {
      const fbRes = await axios.get(`https://graph.facebook.com/me?fields=name,email&access_token=${socialToken}`);
      email = fbRes.data.email;
      name = fbRes.data.name;
    } else if (provider === "linkedin") {
      // In a real app, you would exchange the code for an access token first
      // But here we assume the frontend sends the access token
      const liRes = await axios.get("https://api.linkedin.com/v2/me", {
        headers: { Authorization: `Bearer ${socialToken}` }
      });
      const liEmailRes = await axios.get("https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))", {
        headers: { Authorization: `Bearer ${socialToken}` }
      });
      name = `${liRes.data.localizedFirstName} ${liRes.data.localizedLastName}`;
      email = liEmailRes.data.elements[0]["handle~"].emailAddress;
    }

    if (!email) {
      return res.status(400).json({ error: "Could not retrieve email from social provider" });
    }

    // Check if user already exists
    let result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    let user;

    if (result.rows.length === 0) {
      // Create a new user if they don't exist
      const insertSQL = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      // Use a random password for social users
      const randomPassword = Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      const insertRes = await db.query(insertSQL, [name, email, hashedPassword]);
      user = insertRes.rows[0];
    } else {
      user = result.rows[0];
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Remove password from response
    delete user.password;

    res.status(200).json({
      token,
      user,
      provider
    });
  } catch (error) {
    console.error("Social Login Error:", error.message);
    res.status(500).json({ error: "Social login failed. " + error.message });
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


