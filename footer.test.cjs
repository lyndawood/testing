const { test, describe } = require('node:test');
const assert = require('node:assert');
const { renderFooter } = require('./footer.cjs');
const { renderPage } = require('./page.cjs');

describe('renderFooter', () => {
  test('renders footer with valid email', () => {
    const result = renderFooter('test@example.com');
    assert.ok(result.includes('<footer>'));
    assert.ok(result.includes('mailto:test@example.com'));
    assert.ok(result.includes('>test@example.com</a>'));
  });

  test('renders footer with empty string', () => {
    const result = renderFooter('');
    assert.ok(result.includes('No contact information available'));
  });

  test('renders footer with null', () => {
    const result = renderFooter(null);
    assert.ok(result.includes('No contact information available'));
  });

  test('renders footer with undefined', () => {
    const result = renderFooter(undefined);
    assert.ok(result.includes('No contact information available'));
  });

  test('renders footer with non-string value', () => {
    const result = renderFooter(123);
    assert.ok(result.includes('No contact information available'));
  });

  test('escapes HTML special characters in email', () => {
    const result = renderFooter('test<script>@example.com');
    assert.ok(result.includes('&lt;script&gt;'));
    assert.ok(!result.includes('<script>'));
  });

  test('escapes quotes in email', () => {
    const result = renderFooter('test"quote\'@example.com');
    assert.ok(result.includes('&quot;'));
    assert.ok(result.includes('&#039;'));
  });

  test('escapes ampersand in email', () => {
    const result = renderFooter('test&user@example.com');
    assert.ok(result.includes('&amp;'));
    assert.ok(!result.includes('test&user'));
  });
});

describe('renderPage', () => {
  test('renders complete page with title and email', () => {
    const result = renderPage('My Page', 'contact@example.com');
    assert.ok(result.includes('<!DOCTYPE html>'));
    assert.ok(result.includes('<title>My Page</title>'));
    assert.ok(result.includes('<h1>My Page</h1>'));
    assert.ok(result.includes('mailto:contact@example.com'));
  });

  test('renders page with default title when empty', () => {
    const result = renderPage('', 'test@example.com');
    assert.ok(result.includes('<title>Untitled Page</title>'));
    assert.ok(result.includes('<h1>Untitled Page</h1>'));
  });

  test('renders page with default title when null', () => {
    const result = renderPage(null, 'test@example.com');
    assert.ok(result.includes('<title>Untitled Page</title>'));
  });

  test('includes footer in page', () => {
    const result = renderPage('Test', 'info@example.com');
    assert.ok(result.includes('<footer>'));
    assert.ok(result.includes('mailto:info@example.com'));
  });

  test('page has proper HTML structure', () => {
    const result = renderPage('Test', 'test@example.com');
    assert.ok(result.includes('<html lang="en">'));
    assert.ok(result.includes('<meta charset="UTF-8">'));
    assert.ok(result.includes('<meta name="viewport"'));
    assert.ok(result.includes('<main>'));
    assert.ok(result.includes('</body>'));
    assert.ok(result.includes('</html>'));
  });

  test('escapes HTML special characters in title', () => {
    const result = renderPage('<script>alert("XSS")</script>', 'test@example.com');
    assert.ok(result.includes('&lt;script&gt;'));
    assert.ok(!result.includes('<script>alert'));
  });

  test('escapes quotes in title', () => {
    const result = renderPage('My "Awesome" Page', 'test@example.com');
    assert.ok(result.includes('&quot;Awesome&quot;'));
  });

  test('escapes ampersand in title', () => {
    const result = renderPage('Rock & Roll', 'test@example.com');
    assert.ok(result.includes('Rock &amp; Roll'));
  });
});
