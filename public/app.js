// Load notes on page load
document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  
  const form = document.getElementById('noteForm');
  form.addEventListener('submit', handleSubmit);
});

async function loadNotes() {
  try {
    const response = await fetch('/api/notes');
    if (!response.ok) {
      throw new Error('Failed to load notes');
    }
    const notes = await response.json();
    renderNotes(notes);
  } catch (error) {
    showStatus('Failed to load notes. Please refresh the page.', 'error');
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  
  const input = document.getElementById('noteInput');
  const button = document.getElementById('addButton');
  const text = input.value.trim();
  
  if (!text) {
    return;
  }
  
  // Disable form while submitting
  button.disabled = true;
  
  try {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add note');
    }
    
    // Clear input and reload notes
    input.value = '';
    await loadNotes();
    
    // Focus back on input for next note
    input.focus();
  } catch (error) {
    showStatus('Failed to add note. Please try again.', 'error');
  } finally {
    button.disabled = false;
  }
}

function renderNotes(notes) {
  const notesList = document.getElementById('notesList');
  
  if (notes.length === 0) {
    notesList.innerHTML = `
      <li class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
        <p>No notes yet. Add your first note above.</p>
      </li>
    `;
    return;
  }
  
  // Render notes in reverse order (newest first)
  const notesHTML = notes
    .slice()
    .reverse()
    .map(note => {
      const date = new Date(note.createdAt);
      const formattedDate = date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
      
      return `
        <li class="note-item">
          <p class="note-text">${escapeHtml(note.text)}</p>
          <div class="note-meta">
            <time datetime="${note.createdAt}">${formattedDate}</time>
          </div>
        </li>
      `;
    })
    .join('');
  
  notesList.innerHTML = notesHTML;
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type}`;
  
  // Clear after 5 seconds
  setTimeout(() => {
    statusEl.textContent = '';
    statusEl.className = '';
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
