const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { client } = require('./server');

const app = express();

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(error => console.log("Connection failed", error));
  
// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *';
    const values = [email, hashedPassword];
    const result = await client.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read a single user
app.get('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const result = await client.query(query, values);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { email, password } = req.body;
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userValues = [id];
    const userResult = await client.query(userQuery, userValues);
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updateQuery = 'UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *';
        const updateValues = [email || user.email, hashedPassword, id];
        const updateResult = await client.query(updateQuery, updateValues);
        res.json(updateResult.rows[0]);
      } else {
        const updateQuery = 'UPDATE users SET email = $1 WHERE id = $2 RETURNING *';
        const updateValues = [email || user.email, id];
        const updateResult = await client.query(updateQuery, updateValues);
        res.json(updateResult.rows[0]);
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
}
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
try {
const id = req.params.id;
const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
const values = [id];
const result = await client.query(query, values);
if (result.rows.length > 0) {
res.json({ message: 'User deleted' });
} else {
res.status(404).json({ message: 'User not found' });
}
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// Login endpoint
app.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
const query = 'SELECT * FROM users WHERE email = $1';
const values = [email];
const result = await client.query(query, values);
if (result.rows.length > 0) {
const user = result.rows[0];
const isMatch = await bcrypt.compare(password, user.password);
if (isMatch) {
res.json({ message: 'Login successful' });
} else {
res.status(401).json({ message: 'Incorrect email or password' });
}
} else {
res.status(401).json({ message: 'Incorrect email or password' });
}
} catch (error) {
res.status(500).json({ message: error.message });
}
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
