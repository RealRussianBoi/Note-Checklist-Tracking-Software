const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./notes.sqlite');

db.run(`PRAGMA foreign_keys = ON`);

// ===== NOTES TABLE =====
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    created_at TEXT,
    updated_at TEXT
  )
`);

// ===== CHECKLIST TABLE =====
db.run(`
  CREATE TABLE IF NOT EXISTS checklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT,
    updated_at TEXT
  )
`);

// ===== CHECKLIST ITEMS TABLE =====
db.run(`
  CREATE TABLE IF NOT EXISTS checklist_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    checklist_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    checked INTEGER DEFAULT 0,
    FOREIGN KEY (checklist_id) REFERENCES checklist(id) ON DELETE CASCADE
  )
`);

module.exports = db;