const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

// Register User Controller
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if the user already exists
  const userExists =
    await sql`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;
  if (userExists.length > 0) {
    return res
      .status(400)
      .json({ message: "User already exists with that email or username." });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user into the database
  try {
    await sql`
      INSERT INTO users (username, email, password, role)
      VALUES (${username}, ${email}, ${hashedPassword}, ${role})
    `;
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user." });
  }
};

// Login User Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (user.length === 0) {
    return res.status(400).json({ message: "Invalid credentials." });
  }

  // Compare the password
  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials." });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user[0].id, username: user[0].username, role: user[0].role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ message: "Login successful", token });
};

// Protect Routes Middleware (for secured routes)
const protectRoute = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
  }
};

module.exports = { registerUser, loginUser, protectRoute };
