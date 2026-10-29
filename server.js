import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory data store
let notes = [
  {
    id: '1',
    title: 'Night study round4',
    body: 'This note belongs to the fresh round4 work branch.',
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
  console.log(`DUSKNOTES server running on http://0.0.0.0:${PORT}`);
});
