/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') {
    return '';
  }
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Repeats a label string a specified number of times with HTML escaping
 * @param {string} label - The label text to repeat
 * @param {number} count - The number of times to repeat the label
 * @returns {string} The repeated label, HTML-escaped, separated by spaces
 */
function repeatLabel(label, count) {
  // Handle edge cases
  if (typeof label !== 'string') {
    label = '';
  }
  
  if (typeof count !== 'number' || !Number.isFinite(count)) {
    count = 0;
  }
  
  // Negative counts should return empty string
  if (count < 0) {
    return '';
  }
  
  // Round down to integer
  count = Math.floor(count);
  
  // Handle zero or empty label
  if (count === 0 || label === '') {
    return '';
  }
  
  // Escape the label once
  const escapedLabel = escapeHtml(label);
  
  // Repeat the escaped label
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(escapedLabel);
  }
  
  return result.join(' ');
}

module.exports = { repeatLabel, escapeHtml };
