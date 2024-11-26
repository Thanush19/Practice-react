// Import required packages
require("dotenv").config();
const express = require("express");
const { neon } = require("@neondatabase/serverless");

// Initialize the database connection
const sql = neon(process.env.DATABASE_URL);

// Initialize express app
const app = express();

// Define a route to fetch the PostgreSQL version
app.get("/", async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    res.status(200).send(version);
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).send("Error fetching database version");
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
