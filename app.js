require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Create the pool from env variables and enable SSL for Azure PostgreSQL
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  ssl: {
    rejectUnauthorized: false
  }
});

// Check connection before starting server
pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL!");

    // Start server only after DB connection is established
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("PostgreSQL connection error:", err);
    process.exit(1); // Exit app if DB connection fails
  });

// Example GET endpoint to fetch users from the database
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

// Add your other API endpoints here similarly...
