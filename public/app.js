// DOM Elements
const notesGrid = document.getElementById('notesGrid');
const newNoteBtn = document.getElementById('newNoteBtn');
const noteModal = document.getElementById('noteModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const noteForm = document.getElementById('noteForm');
const searchInput = document.getElementById('searchInput');

// State
let notes = [];

// Fetch and display notes
async function fetchNotes() {
  try {
    const response = await fetch('/api/notes');
    notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

// Render notes to the grid
function renderNotes(notesToRender) {
  if (notesToRender.length === 0) {
    notesGrid.innerHTML = `
      <div class="empty-state">
        <p>No notes yet. Create your first note to get started.</p>
      </div>
    `;
    return;
  }
  
  notesGrid.innerHTML = notesToRender.map(note => {
    const date = new Date(note.timestamp);
    const timeAgo = formatTimeAgo(date);
    
    return `
      <article class="note-card" tabindex="0" role="button" aria-label="Note: ${note.title}">
        <span class="note-category">PERSONAL / NOTES</span>
        <h3 class="note-title">${escapeHtml(note.title)}</h3>
        <p class="note-body">${escapeHtml(note.body)}</p>
        <time class="note-timestamp" datetime="${note.timestamp}">${timeAgo}</time>
      </article>
    `;
  }).join('');
}

// Format timestamp as relative time
function formatTimeAgo(date) {
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

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(noteForm);
  const title = formData.get('title').trim();
  const body = formData.get('body').trim();
  
  if (!title || !body) {
    return;
  }
  
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

// Search functionality
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (!query) {
    renderNotes(notes);
    return;
  }
  
  const filtered = notes.filter(note => 
    note.title.toLowerCase().includes(query) || 
    note.body.toLowerCase().includes(query)
  );
  
  renderNotes(filtered);
}

// Event listeners
newNoteBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
cancelBtn.addEventListener('click', closeModalHandler);
noteForm.addEventListener('submit', handleSubmit);
searchInput.addEventListener('input', handleSearch);

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && noteModal.classList.contains('active')) {
    closeModalHandler();
  }
});

// Close modal on backdrop click
noteModal.addEventListener('click', (e) => {
  if (e.target === noteModal) {
    closeModalHandler();
  }
});

// Initialize
fetchNotes();
