import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory data store
let notes = [
  {
    id: '1',
    title: 'Branch truth round3',
    body: 'This note exists only on the new Forge work branch.',
    timestamp: new Date().toISOString()
  }
];

let nextId = 2;

// API Routes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }
  
  const newNote = {
    id: String(nextId++),
    title,
    body,
    timestamp: new Date().toISOString()
  };
  
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`FIELDNOTES server running on http://0.0.0.0:${PORT}`);
});
