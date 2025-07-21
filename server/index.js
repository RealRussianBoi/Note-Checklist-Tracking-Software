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

// Adds a new checklist and its items
app.post('/checklists/add', (req, res) => {
  const { title, items } = req.body;

  if (!title || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Title and items are required.' });
  }

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // Step 1: Insert into checklist
  const insertChecklistSQL = `
    INSERT INTO checklist (name, created_at, updated_at)
    VALUES (?, ?, ?)
  `;

  db.run(insertChecklistSQL, [title, createdAt, updatedAt], function (err) {
    if (err) {
      console.error('Error inserting checklist:', err.message);
      return res.status(500).json({ error: 'Failed to insert checklist.' });
    }

    const checklistId = this.lastID;

    // Step 2: Insert each item into checklist_item
    const insertItemSQL = `
      INSERT INTO checklist_item (checklist_id, content, checked)
      VALUES (?, ?, ?)
    `;

    const insertAll = items.map(item => {
      return new Promise((resolve, reject) => {
        db.run(insertItemSQL, [checklistId, item.text, item.checked ? 1 : 0], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(insertAll)
      .then(() => {
        res.status(201).json({ message: 'Checklist added successfully', checklistId });
      })
      .catch(err => {
        console.error('Error inserting checklist items:', err.message);
        res.status(500).json({ error: 'Failed to insert checklist items.' });
      });
  });
});

// Edits an existing checklist and its items
app.post('/checklists/edit', (req, res) => {
  const { id, title, items } = req.body;

  if (!id || !title || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Checklist ID, title, and items are required.' });
  }

  const updateChecklistQuery = `
    UPDATE checklist
    SET name = ?, updated_at = ?
    WHERE id = ?
  `;

  const deleteOldItemsQuery = `
    DELETE FROM checklist_item WHERE checklist_id = ?
  `;

  const insertItemQuery = `
    INSERT INTO checklist_item (checklist_id, content, checked)
    VALUES (?, ?, ?)
  `;

  db.serialize(() => {
    // Update checklist title and timestamp
    db.run(updateChecklistQuery, [title, new Date().toISOString(), id], function (err) {
      if (err) {
        console.error('Failed to update checklist:', err.message);
        return res.status(500).json({ error: 'Failed to update checklist.' });
      }

      // Delete existing items
      db.run(deleteOldItemsQuery, [id], function (err) {
        if (err) {
          console.error('Failed to delete old checklist items:', err.message);
          return res.status(500).json({ error: 'Failed to update checklist items.' });
        }

        // Insert new items
        const stmt = db.prepare(insertItemQuery);
        for (const item of items) {
          stmt.run(id, item.text, item.checked ? 1 : 0);
        }
        stmt.finalize();

        res.status(200).json({ message: 'Checklist updated successfully.' });
      });
    });
  });
});

//#Combined Section

//Gets both notes and checklists.
app.get('/combined/get', (req, res) => {
  const notesQuery = `
    SELECT 
      id,
      title,
      content,
      created_at,
      updated_at,
      'note' AS type
    FROM notes
  `;

  const checklistQuery = `
    SELECT 
      id,
      name AS title,
      created_at,
      updated_at,
      'checklist' AS type
    FROM checklist
  `;

  const itemsQuery = `
    SELECT 
      id,
      checklist_id,
      content,
      checked
    FROM checklist_item
  `;

  db.all(notesQuery, [], (err, notes) => {
    if (err) {
      console.error('Notes query failed:', err.message);
      return res.status(500).json({ error: err.message });
    }

    db.all(checklistQuery, [], (err, checklists) => {
      if (err) {
        console.error('Checklist query failed:', err.message);
        return res.status(500).json({ error: err.message });
      }

      db.all(itemsQuery, [], (err, items) => {
        if (err) {
          console.error('Checklist items query failed:', err.message);
          return res.status(500).json({ error: err.message });
        }

        // Ensure IDs are compared as strings or numbers consistently
        const checklistWithItems = checklists.map(cl => {
          const checklistItems = items.filter(item => Number(item.checklist_id) === Number(cl.id));
          return {
            ...cl,
            items: checklistItems
          };
        });

        const combined = [...notes, ...checklistWithItems].sort((a, b) => {
          const aDate = new Date(a.created_at);
          const bDate = new Date(b.created_at);
          return bDate - aDate;
        });

        res.status(200).json({ data: combined });
      });
    });
  });
});