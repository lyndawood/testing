// CSV Parser functions
function parseCSV(csvData, options = {}) {
  const delimiter = options.delimiter || ',';
  const quote = options.quote || '"';

  if (!csvData || typeof csvData !== 'string') {
    return [];
  }

  // Normalize line endings: CRLF -> LF
  const normalized = csvData.replace(/\r\n/g, '\n');

  // Split into lines, but respect quoted fields that may contain newlines
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < normalized.length) {
    const char = normalized[i];
    const nextChar = normalized[i + 1];

    if (char === quote) {
      if (inQuotes && nextChar === quote) {
        // Escaped quote: "" -> "
        currentField += quote;
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
        continue;
      }
    }

    if (char === delimiter && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
      continue;
    }

    if (char === '\n' && !inQuotes) {
      // End of row
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      }
      i++;
      continue;
    }

    // Regular character
    currentField += char;
    i++;
  }

  // Handle last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }

  // Convert rows to objects with title and body
  return rows.map(row => {
    if (row.length >= 2) {
      return {
        title: row[0],
        body: row[1]
      };
    }
    return null;
  }).filter(row => row !== null);
}

function findDuplicates(newNotes, existingNotes = []) {
  const existingSet = new Set(
    existingNotes.map(note => `${note.title}|||${note.body}`)
  );

  const duplicates = [];
  const unique = [];

  newNotes.forEach(note => {
    const key = `${note.title}|||${note.body}`;
    if (existingSet.has(key)) {
      duplicates.push(note);
    } else {
      unique.push(note);
      existingSet.add(key);
    }
  });

  return { duplicates, unique };
}

// DOM elements
const notesGrid = document.getElementById('notesGrid');
const newNoteBtn = document.getElementById('newNoteBtn');
const noteModal = document.getElementById('noteModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const noteForm = document.getElementById('noteForm');
const searchInput = document.getElementById('searchInput');

// CSV import elements
const singleNoteTab = document.getElementById('singleNoteTab');
const importCsvTab = document.getElementById('importCsvTab');
const csvImportForm = document.getElementById('csvImportForm');
const csvInput = document.getElementById('csvInput');
const parseCSVBtn = document.getElementById('parseCSVBtn');
const cancelImportBtn = document.getElementById('cancelImportBtn');
const csvPreviewModal = document.getElementById('csvPreviewModal');
const closePreviewModal = document.getElementById('closePreviewModal');
const csvPreviewContent = document.getElementById('csvPreviewContent');
const csvPreviewSummary = document.getElementById('csvPreviewSummary');
const backToImportBtn = document.getElementById('backToImportBtn');
const importSelectedBtn = document.getElementById('importSelectedBtn');

let allNotes = [];
let parsedCSVRows = [];

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

// Tab switching
function switchTab(tab) {
  if (tab === 'single') {
    singleNoteTab.classList.add('active');
    importCsvTab.classList.remove('active');
    noteForm.classList.add('active');
    csvImportForm.classList.remove('active');
  } else {
    singleNoteTab.classList.remove('active');
    importCsvTab.classList.add('active');
    noteForm.classList.remove('active');
    csvImportForm.classList.add('active');
  }
}

// Parse CSV and show preview
async function handleParseCSV() {
  const csvData = csvInput.value.trim();
  
  if (!csvData) {
    alert('Please paste CSV data first.');
    return;
  }
  
  // Parse CSV
  parsedCSVRows = parseCSV(csvData);
  
  if (parsedCSVRows.length === 0) {
    alert('No valid rows found. Please check your CSV format.');
    return;
  }
  
  // Find duplicates
  const { duplicates, unique } = findDuplicates(parsedCSVRows, allNotes);
  
  // Show preview modal
  displayCSVPreview(unique, duplicates);
  noteModal.classList.remove('active');
  csvPreviewModal.classList.add('active');
}

// Display CSV preview with checkboxes
function displayCSVPreview(uniqueRows, duplicateRows) {
  let html = '';
  
  if (uniqueRows.length > 0) {
    html += '<div class="preview-section">';
    html += '<div class="preview-section-header">';
    html += '<label class="checkbox-label">';
    html += '<input type="checkbox" id="selectAllCheckbox" checked> ';
    html += `<span class="preview-section-title">New notes (${uniqueRows.length})</span>`;
    html += '</label>';
    html += '</div>';
    
    uniqueRows.forEach((row, index) => {
      html += `
        <div class="preview-row">
          <label class="checkbox-label">
            <input type="checkbox" class="row-checkbox" data-index="${index}" checked>
            <div class="preview-row-content">
              <div class="preview-row-title">${escapeHtml(row.title)}</div>
              <div class="preview-row-body">${escapeHtml(row.body)}</div>
            </div>
          </label>
        </div>
      `;
    });
    
    html += '</div>';
  }
  
  if (duplicateRows.length > 0) {
    html += '<div class="preview-section preview-section-duplicates">';
    html += `<div class="preview-section-title">Duplicates (${duplicateRows.length} skipped)</div>`;
    
    duplicateRows.forEach(row => {
      html += `
        <div class="preview-row preview-row-duplicate">
          <div class="preview-row-content">
            <div class="preview-row-title">${escapeHtml(row.title)}</div>
            <div class="preview-row-body">${escapeHtml(row.body)}</div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
  }
  
  csvPreviewContent.innerHTML = html;
  
  // Add select all functionality
  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const checkboxes = document.querySelectorAll('.row-checkbox');
      checkboxes.forEach(cb => cb.checked = e.target.checked);
      updatePreviewSummary();
    });
  }
  
  // Add individual checkbox listeners
  const checkboxes = document.querySelectorAll('.row-checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', updatePreviewSummary);
  });
  
  updatePreviewSummary();
}

// Update preview summary
function updatePreviewSummary() {
  const checkboxes = document.querySelectorAll('.row-checkbox');
  const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
  const totalCount = checkboxes.length;
  
  csvPreviewSummary.innerHTML = `
    <p><strong>${selectedCount}</strong> of <strong>${totalCount}</strong> notes selected for import</p>
  `;
  
  importSelectedBtn.disabled = selectedCount === 0;
}

// Import selected notes
async function handleImportSelected() {
  const checkboxes = document.querySelectorAll('.row-checkbox:checked');
  const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
  
  if (selectedIndices.length === 0) {
    alert('Please select at least one note to import.');
    return;
  }
  
  // Get unique rows (duplicates are not in the checkbox list)
  const { unique } = findDuplicates(parsedCSVRows, allNotes);
  const notesToImport = selectedIndices.map(index => unique[index]);
  
  // Import notes one by one
  let successCount = 0;
  let failCount = 0;
  
  importSelectedBtn.disabled = true;
  importSelectedBtn.textContent = 'Importing...';
  
  for (const note of notesToImport) {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: note.title, body: note.body })
      });
      
      if (response.ok) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      console.error('Error importing note:', error);
      failCount++;
    }
  }
  
  // Close modals and refresh
  closePreviewModalHandler();
  closeModalHandler();
  await fetchNotes();
  
  // Show result
  if (failCount > 0) {
    alert(`Imported ${successCount} notes. ${failCount} failed.`);
  }
}

// Close preview modal
function closePreviewModalHandler() {
  csvPreviewModal.classList.remove('active');
  parsedCSVRows = [];
}

// Back to import form
function backToImport() {
  csvPreviewModal.classList.remove('active');
  noteModal.classList.add('active');
}

// Event listeners
newNoteBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalHandler);
cancelBtn.addEventListener('click', closeModalHandler);
noteForm.addEventListener('submit', createNote);
searchInput.addEventListener('input', (e) => searchNotes(e.target.value));

// CSV import event listeners
singleNoteTab.addEventListener('click', () => switchTab('single'));
importCsvTab.addEventListener('click', () => switchTab('csv'));
parseCSVBtn.addEventListener('click', handleParseCSV);
cancelImportBtn.addEventListener('click', closeModalHandler);
closePreviewModal.addEventListener('click', closePreviewModalHandler);
backToImportBtn.addEventListener('click', backToImport);
importSelectedBtn.addEventListener('click', handleImportSelected);

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
