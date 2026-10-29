/**
 * Parse CSV data into rows of objects.
 * Handles quoted commas, escaped quotes, CRLF, and embedded newlines.
 *
 * @param {string} csvData - The raw CSV data
 * @param {Object} options - Parsing options
 * @param {string} options.delimiter - Field delimiter (default: ',')
 * @param {string} options.quote - Quote character (default: '"')
 * @returns {Array<Object>} Array of parsed rows with 'title' and 'body' fields
 */
export function parseCSV(csvData, options = {}) {
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

/**
 * Find duplicate notes based on title and body.
 *
 * @param {Array<Object>} newNotes - Notes to check
 * @param {Array<Object>} existingNotes - Existing notes to compare against
 * @returns {Object} { duplicates: Array, unique: Array }
 */
export function findDuplicates(newNotes, existingNotes = []) {
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
