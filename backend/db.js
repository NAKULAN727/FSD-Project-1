const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "your_password",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "query",
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

module.exports = pool;
