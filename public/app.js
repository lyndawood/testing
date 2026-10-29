// DOM elements
const noteForm = document.getElementById('noteForm');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesList = document.getElementById('notesList');
const notesCount = document.getElementById('notesCount');
const toast = document.getElementById('toast');

// Load notes on page load
document.addEventListener('DOMContentLoaded', loadNotes);

// Handle form submission
noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  
  if (!title || !content) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    
    const newNote = await response.json();
    
    // Clear form
    noteForm.reset();
    noteTitle.focus();
    
    // Reload notes
    await loadNotes();
    
    showToast('Note added successfully!', 'success');
  } catch (error) {
    console.error('Error creating note:', error);
    showToast('Failed to create note. Please try again.', 'error');
  }
});

// Load and display notes
async function loadNotes() {
  try {
    const response = await fetch('/api/notes');
    
    if (!response.ok) {
      throw new Error('Failed to load notes');
    }
    
    const notes = await response.json();
    displayNotes(notes);
  } catch (error) {
    console.error('Error loading notes:', error);
    showToast('Failed to load notes', 'error');
  }
}

// Display notes in the UI
function displayNotes(notes) {
  notesCount.textContent = notes.length;
  
  if (notes.length === 0) {
    notesList.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <p>No notes yet. Create your first note above!</p>
      </div>
    `;
    return;
  }
  
  notesList.innerHTML = notes.map(note => createNoteCard(note)).join('');
}

// Create HTML for a note card
function createNoteCard(note) {
  const date = new Date(note.createdAt);
  const formattedDate = formatDate(date);
  
  return `
    <article class="note-card">
      <div class="note-header">
        <h3 class="note-title">${escapeHtml(note.title)}</h3>
        <time class="note-date" datetime="${note.createdAt}">${formattedDate}</time>
      </div>
      <p class="note-content">${escapeHtml(note.content)}</p>
    </article>
  `;
}

// Format date for display
function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show toast notification
function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  
  // Trigger reflow to restart animation
  void toast.offsetWidth;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
