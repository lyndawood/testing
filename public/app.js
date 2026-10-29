// DOM elements
const notesGrid = document.getElementById('notesGrid');
const newNoteBtn = document.getElementById('newNoteBtn');
const noteModal = document.getElementById('noteModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const noteForm = document.getElementById('noteForm');
const searchInput = document.getElementById('searchInput');

let allNotes = [];

// Fetch and display notes
async function fetchNotes() {
  try {
    const response = await fetch('/api/notes');
    allNotes = await response.json();
    displayNotes(allNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

// Display notes in the grid
function displayNotes(notes) {
  if (notes.length === 0) {
    notesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--color-text-muted);">
        <p>No notes yet. Create your first thought.</p>
      </div>
    `;
    return;
  }
  
  notesGrid.innerHTML = notes.map((note, index) => {
    // Alternate card colors for visual variety
    const cardClass = index % 3 === 1 ? 'warm' : index % 3 === 2 ? 'cool' : '';
    const timestamp = formatTimestamp(note.timestamp);
    
    return `
      <div class="note-card ${cardClass}">
        <div class="note-header">
          <span class="note-category">Personal / Notes</span>
        </div>
        <h3 class="note-title">${escapeHtml(note.title)}</h3>
        <p class="note-body">${escapeHtml(note.body)}</p>
        <span class="note-timestamp">${timestamp}</span>
      </div>
    `;
  }).join('');
}

// Format timestamp
function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Open modal
function openModal() {
  noteModal.classList.add('active');
  document.getElementById('noteTitle').focus();
}

// Close modal
function closeModalHandler() {
  noteModal.classList.remove('active');
  noteForm.reset();
}

// Create new note
async function createNote(event) {
  event.preventDefault();
  
  const title = document.getElementById('noteTitle').value.trim();
  const body = document.getElementById('noteBody').value.trim();
  
  if (!title || !body) return;
  
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body })
    });
    
    if (response.ok) {
      closeModalHandler();
      await fetchNotes();
    } else {
      console.error('Error creating note');
    }
  } catch (error) {
    console.error('Error creating note:', error);
  }
}

// Search notes
function searchNotes(query) {
  const filtered = allNotes.filter(note => 
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    note.body.toLowerCase().includes(query.toLowerCase())
  );
  displayNotes(filtered);
}

// Event listeners
newNoteBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
cancelBtn.addEventListener('click', closeModalHandler);
noteForm.addEventListener('submit', createNote);
searchInput.addEventListener('input', (e) => searchNotes(e.target.value));

// Close modal on outside click
noteModal.addEventListener('click', (e) => {
  if (e.target === noteModal) {
    closeModalHandler();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && noteModal.classList.contains('active')) {
    closeModalHandler();
  }
});

// Initialize
fetchNotes();
