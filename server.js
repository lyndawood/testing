import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory notes storage
let notes = [];
let nextId = 1;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Get all notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// Add a new note
app.post('/api/notes', (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Note text is required' });
  }
  
  const note = {
    id: nextId++,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  
  notes.push(note);
  res.status(201).json(note);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Notes app listening on port ${PORT}`);
});
