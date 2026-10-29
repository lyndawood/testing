const { renderFooter } = require('./footer.cjs');

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
 * Renders a complete HTML page with title and footer
 * @param {string} title - The page title
 * @param {string} contactEmail - The contact email address for the footer
 * @returns {string} Complete HTML page string
 */
function renderPage(title, contactEmail) {
  const escapedTitle = escapeHtml(title || 'Untitled Page');
  const footer = renderFooter(contactEmail);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
</head>
<body>
  <main>
    <h1>${escapedTitle}</h1>
  </main>
  ${footer}
</body>
</html>`;
}

module.exports = { renderPage };
