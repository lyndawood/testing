import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const NOTES_FILE = path.join(__dirname, 'notes.json');

app.use(express.json());
app.use(express.static('public'));

// Initialize notes file if it doesn't exist
async function initNotesFile() {
  if (!existsSync(NOTES_FILE)) {
    await writeFile(NOTES_FILE, JSON.stringify([], null, 2));
  }
}

// Read notes from file
async function readNotes() {
  try {
    const data = await readFile(NOTES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Write notes to file
async function writeNotes(notes) {
  await writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}

// GET /api/notes - Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await readNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

// POST /api/notes - Create a new note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const notes = await readNotes();
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString()
    };
    
    notes.unshift(newNote);
    await writeNotes(notes);
    
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Initialize and start server
await initNotesFile();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Notes app running on http://localhost:${PORT}`);
});
