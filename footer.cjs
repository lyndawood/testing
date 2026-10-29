/**
 * Escapes HTML special characters in a string
 * @param {string} str - The string to escape
 * @returns {string} The escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders a footer with a contact email link
 * @param {string} contactEmail - The contact email address
 * @returns {string} HTML footer string
 */
function renderFooter(contactEmail) {
  if (!contactEmail || typeof contactEmail !== 'string') {
    return '<footer><p>No contact information available</p></footer>';
  }
  
  const escapedEmail = escapeHtml(contactEmail);
  return `<footer><p>Contact: <a href="mailto:${escapedEmail}">${escapedEmail}</a></p></footer>`;
}

module.exports = { renderFooter };
