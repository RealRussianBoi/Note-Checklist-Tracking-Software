const express = require('express');
const cors = require('cors');
const db = require('./db'); // ✅ load DB and create tables

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

//#User Section Start



//#Notes Section Start

//Gets all data from notes table.
app.get('/notes/get', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//#Checklist Section Start

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});