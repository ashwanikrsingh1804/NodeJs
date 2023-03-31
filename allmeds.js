const express = require('express');
const { Pool } = require('pg');

const app = express();

const pool = new Pool({
    user: "admin123",
    host: "medicaldb1.c7dcqmwvm5db.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "Password#098",
    port: "5432",
});

pool.connect()
.then(() => console.log('Connected to PostgreSQL'))
.catch(error => console.log("Connection failed", error));

app.get('/medicine', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM medicine WHERE available = true');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => console.log('Server is running'));
