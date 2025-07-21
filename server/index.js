const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

//#Notes Section Start

//Gets all data from notes table.
app.get('/notes/get/:id', (req, res) => {
  const noteId = req.params.id;

  db.get('SELECT * FROM notes WHERE id = ?', [noteId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(row);
  });
});

//Adds a note to database.
app.post('/notes/add', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const query = `
    INSERT INTO notes (title, content, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `;

  const now = new Date().toISOString();

  db.run(query, [title, JSON.stringify(content), now, now], function (err) {
    if (err) {
      console.error('Failed to add note:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ message: 'Note added', noteId: this.lastID });
  });
});

//Edits an existing note in the database.
app.post('/notes/edit', (req, res) => {
  const { id, title, content } = req.body;

  if (!id || !title || !content) {
    return res.status(400).json({ error: 'ID, title, and content are required.' });
  }

  const query = `
    UPDATE notes
    SET title = ?, content = ?, updated_at = ?
    WHERE id = ?
  `;

  const now = new Date().toISOString();

  db.run(query, [title, JSON.stringify(content), now, id], function (err) {
    if (err) {
      console.error('Failed to update note:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Note not found.' });
    }

    res.json({ message: 'Note updated successfully.', noteId: id });
  });
});

//#Checklist Section Start

//Gets all checklists with its associated data.
app.get('/checklists/get', (req, res) => {
  db.all('SELECT * FROM checklist', [], (err, checklists) => {
    if (err) return res.status(500).json({ error: err.message });

    // Now get all checklist items
    db.all('SELECT * FROM checklist_item', [], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });

      // Map checklist items to their respective checklist
      const checklistMap = checklists.map(cl => ({
        ...cl,
        items: items.filter(item => item.checklist_id === cl.id)
      }));

      return res.status(200).json({ checklists: checklistMap });
    });
  });
});

//#Combined Section

//Gets both notes and checklists.
app.get('/combined/get', (req, res) => {
  const sql = `
    SELECT 
      id,
      title,
      content,
      created_at,
      updated_at,
      'note' AS type
    FROM notes
    UNION ALL
    SELECT 
      id,
      name AS title,
      NULL AS content,
      created_at,
      updated_at,
      'checklist' AS type
    FROM checklist
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('DB error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    res.json({ data: rows });
  });
});