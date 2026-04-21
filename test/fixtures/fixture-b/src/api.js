const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { authenticateToken, requireAdmin } = require('./auth');

const app = express();
app.use(express.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
});

// No input validation on any endpoint
app.post('/users', (req, res) => {
  const { username, password } = req.body;
  // SQL injection risk — string concatenation in query
  const query = `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`;
  db.run(query, function(err) {
    if (err) {
      // Leaks database error details to client
      return res.status(500).json({ error: err.message, query: query });
    }
    res.json({ id: this.lastID, username });
  });
});

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  // SQL injection risk
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

app.delete('/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;
  // SQL injection risk
  const query = `DELETE FROM users WHERE id = ${userId}`;
  db.run(query, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

// Tight coupling: routes directly access db, no service layer
function getDb() {
  return db;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: db.filename });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server on port ${PORT}`);
});

module.exports = { app, getDb };
