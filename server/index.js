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
app.get('/notes/get', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//Adds a note to database.
app.post('/notes/add', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const query = `
    INSERT INTO notes (title, content)
    VALUES (?, ?)
  `;

  db.run(query, [title, JSON.stringify(content)], function (err) {
    if (err) {
      console.error('Failed to add note:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ message: 'Note added', noteId: this.lastID });
  });
});

//#Checklist Section Start