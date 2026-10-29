// DOM elements
const notesGrid = document.getElementById('notesGrid');
const newNoteBtn = document.getElementById('newNoteBtn');
const noteModal = document.getElementById('noteModal');
const noteForm = document.getElementById('noteForm');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const noteTitleInput = document.getElementById('noteTitle');
const noteBodyInput = document.getElementById('noteBody');

let allNotes = [];

// Format timestamp
function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Render notes
function renderNotes(notes) {
  if (notes.length === 0) {
    notesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--color-text-light);">
        <p style="font-size: 1.1rem;">No notes yet. Start capturing your ideas!</p>
      </div>
    `;
    return;
  }
  
  notesGrid.innerHTML = notes.map(note => `
    <article class="note-card">
      <div class="note-category">${note.category}</div>
      <h3 class="note-title">${escapeHtml(note.title)}</h3>
      <p class="note-body">${escapeHtml(note.body)}</p>
      <div class="note-timestamp">${formatTimestamp(note.timestamp)}</div>
    </article>
  `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fetch and display notes
async function loadNotes() {
  try {
    const response = await fetch('/api/notes');
    if (!response.ok) throw new Error('Failed to fetch notes');
    allNotes = await response.json();
    renderNotes(allNotes);
  } catch (error) {
    console.error('Error loading notes:', error);
    notesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--color-button);">
        <p>Failed to load notes. Please refresh the page.</p>
      </div>
    `;
  }
}

// Create new note
async function createNote(title, body) {
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body })
    });
    
    if (!response.ok) throw new Error('Failed to create note');
    
    await loadNotes();
    closeModal();
    noteForm.reset();
  } catch (error) {
    console.error('Error creating note:', error);
    alert('Failed to create note. Please try again.');
  }
}

// Modal controls
function openModal() {
  noteModal.classList.add('active');
  noteTitleInput.focus();
}

function closeModal() {
  noteModal.classList.remove('active');
  noteForm.reset();
}

// Search functionality
function filterNotes(searchTerm) {
  const filtered = allNotes.filter(note => {
    const term = searchTerm.toLowerCase();
    return note.title.toLowerCase().includes(term) || 
           note.body.toLowerCase().includes(term);
  });
  renderNotes(filtered);
}

// Event listeners
newNoteBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);

noteModal.addEventListener('click', (e) => {
  if (e.target === noteModal) {
    closeModal();
  }
});

noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = noteTitleInput.value.trim();
  const body = noteBodyInput.value.trim();
  
  if (title && body) {
    createNote(title, body);
  }
});

searchInput.addEventListener('input', (e) => {
  filterNotes(e.target.value);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Escape to close modal
  if (e.key === 'Escape' && noteModal.classList.contains('active')) {
    closeModal();
  }
  
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
  }
  
  // Ctrl/Cmd + N to create new note
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    openModal();
  }
});

// Initial load
loadNotes();
