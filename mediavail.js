const express = require('express');
const bodyParser = require('body-parser');
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

app.get('/medicine/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const result = await pool.query('SELECT available FROM medicine WHERE name = $1', [name]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Medicine not found' });
    } else {
      const available = result.rows[0].available;
      res.json({ available });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/medicine', async (req, res) => {
    // const name = req.params.name;
    try {
      const result = await pool.query('SELECT * FROM medicine');
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Medicine not found' });
      } else {
        // const available = result.rows[0].available;
        res.json({ result });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



app.listen(3000, () => console.log('Server is running'));

