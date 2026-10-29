# Notes App

A simple notes application with an Express backend and JSON file storage.

## Features

- Create and view notes with title and content
- RESTful JSON API at `/api/notes`
- Persistent storage in a JSON file
- Responsive design with light/dark mode support
- Clean, modern UI with toast notifications

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser to `http://localhost:3000`

## API Endpoints

### GET /api/notes
Returns all notes as JSON array.

**Response:**
```json
[
  {
    "id": "1234567890",
    "title": "My Note",
    "content": "Note content here",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/notes
Creates a new note.

**Request Body:**
```json
{
  "title": "My Note",
  "content": "Note content here"
}
```

**Response:**
```json
{
  "id": "1234567890",
  "title": "My Note",
  "content": "Note content here",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## Storage

Notes are stored in `notes.json` in the project root directory.
