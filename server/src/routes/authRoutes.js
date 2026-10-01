const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: { message: "Name, email, and password are required." },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: { message: "An account with this email address already exists." },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `,
      [name.trim(), normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      error: { message: "Unable to register user." },
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: "Email and password are required." },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      `
        SELECT id, name, email, password_hash, created_at
        FROM users
        WHERE LOWER(email) = LOWER($1)
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: { message: "Invalid email or password." },
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: { message: "Invalid email or password." },
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: { message: "Unable to log in." },
    });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = $1
      `,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: { message: "User not found." },
      });
    }

    return res.status(200).json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Current user error:", error);

    return res.status(500).json({
      error: { message: "Unable to retrieve user." },
    });
  }
});

module.exports = router;
