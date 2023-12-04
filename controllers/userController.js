// controllers/userController.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

//1 Register a new user details
function validateRegisterRequest(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }
  next();
}

async function registerUser(req, res) {
  try {
    const { username, password } = req.body;
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds);

    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hash,
    ]);

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

//2Login and checking the user is available
async function LoginUser(req, res) {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    // Check if the user exists
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const storedHash = rows[0].password;

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, storedHash);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }


    const token = jwt.sign(
      { username: rows[0].username, userId: rows[0].id },
      process.env.secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, message: "Login successful." });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

module.exports = {
  validateRegisterRequest,
  registerUser,
  LoginUser,
};
