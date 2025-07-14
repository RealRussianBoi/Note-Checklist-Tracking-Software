const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./notes.sqlite');

// ===== USER TABLE =====
// (Weak: no email uniqueness, no password hashing, no validation)
db.run(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    username TEXT,
    email TEXT,
    password TEXT
  )
`);

// ===== NOTES TABLE =====
// (Weak: no foreign key to user, no indexing, plain text content)
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    created_at TEXT
  )
`);

// ===== CHECKLIST TABLE =====
// (Weak: no relational integrity, items stored as text)
db.run(`
  CREATE TABLE IF NOT EXISTS checklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    items TEXT
  )
`);

module.exports = db;