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

// In-memory data store with seed note
let notes = [
  {
    id: 1,
    title: 'Welcome to Fieldnotes',
    body: 'Your personal idea garden starts here.',
    category: 'PERSONAL / NOTES',
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
    id: nextId++,
    title,
    body,
    category: 'PERSONAL / NOTES',
    timestamp: new Date().toISOString()
  };
  
  notes.unshift(newNote);
  res.status(201).json(newNote);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fieldnotes app running on http://0.0.0.0:${PORT}`);
});
