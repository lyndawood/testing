const { test } = require('node:test');
const assert = require('node:assert');
const { repeatLabel, escapeHtml } = require('./labels.cjs');

test('repeatLabel repeats a label the specified number of times', () => {
  assert.strictEqual(repeatLabel('Hello', 3), 'Hello Hello Hello');
  assert.strictEqual(repeatLabel('Test', 1), 'Test');
  assert.strictEqual(repeatLabel('A', 5), 'A A A A A');
});

test('repeatLabel handles zero count', () => {
  assert.strictEqual(repeatLabel('Hello', 0), '');
});

test('repeatLabel handles negative count', () => {
  assert.strictEqual(repeatLabel('Hello', -1), '');
  assert.strictEqual(repeatLabel('Test', -5), '');
  assert.strictEqual(repeatLabel('Label', -100), '');
});

test('repeatLabel handles empty string', () => {
  assert.strictEqual(repeatLabel('', 5), '');
  assert.strictEqual(repeatLabel('', 0), '');
});

test('repeatLabel handles decimal counts by rounding down', () => {
  assert.strictEqual(repeatLabel('Hello', 2.9), 'Hello Hello');
  assert.strictEqual(repeatLabel('Test', 3.1), 'Test Test Test');
});

test('repeatLabel handles invalid count types', () => {
  assert.strictEqual(repeatLabel('Hello', NaN), '');
  assert.strictEqual(repeatLabel('Hello', Infinity), '');
  assert.strictEqual(repeatLabel('Hello', -Infinity), '');
  assert.strictEqual(repeatLabel('Hello', 'not a number'), '');
  assert.strictEqual(repeatLabel('Hello', null), '');
  assert.strictEqual(repeatLabel('Hello', undefined), '');
});

test('repeatLabel handles invalid label types', () => {
  assert.strictEqual(repeatLabel(null, 3), '');
  assert.strictEqual(repeatLabel(undefined, 3), '');
  assert.strictEqual(repeatLabel(123, 3), '');
  assert.strictEqual(repeatLabel({}, 3), '');
});

test('repeatLabel escapes HTML special characters', () => {
  assert.strictEqual(repeatLabel('<script>', 1), '&lt;script&gt;');
  assert.strictEqual(repeatLabel('<b>Bold</b>', 2), '&lt;b&gt;Bold&lt;/b&gt; &lt;b&gt;Bold&lt;/b&gt;');
  assert.strictEqual(repeatLabel('A & B', 1), 'A &amp; B');
});

test('repeatLabel escapes HTML injection attempts', () => {
  assert.strictEqual(
    repeatLabel('<script>alert("XSS")</script>', 1),
    '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
  );
  assert.strictEqual(
    repeatLabel('<img src=x onerror=alert(1)>', 1),
    '&lt;img src=x onerror=alert(1)&gt;'
  );
  assert.strictEqual(
    repeatLabel('"><script>alert(1)</script>', 1),
    '&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;'
  );
});

test('repeatLabel escapes quotes', () => {
  assert.strictEqual(repeatLabel('"quoted"', 1), '&quot;quoted&quot;');
  assert.strictEqual(repeatLabel("'single'", 1), '&#039;single&#039;');
  assert.strictEqual(repeatLabel(`"double" and 'single'`, 1), '&quot;double&quot; and &#039;single&#039;');
});

test('escapeHtml escapes all special characters', () => {
  assert.strictEqual(escapeHtml('<'), '&lt;');
  assert.strictEqual(escapeHtml('>'), '&gt;');
  assert.strictEqual(escapeHtml('&'), '&amp;');
  assert.strictEqual(escapeHtml('"'), '&quot;');
  assert.strictEqual(escapeHtml("'"), '&#039;');
  assert.strictEqual(escapeHtml('<>&"\''), '&lt;&gt;&amp;&quot;&#039;');
});

test('escapeHtml handles non-string input', () => {
  assert.strictEqual(escapeHtml(null), '');
  assert.strictEqual(escapeHtml(undefined), '');
  assert.strictEqual(escapeHtml(123), '');
});

test('repeatLabel handles large counts efficiently', () => {
  const result = repeatLabel('X', 1000);
  const parts = result.split(' ');
  assert.strictEqual(parts.length, 1000);
  assert.strictEqual(parts[0], 'X');
  assert.strictEqual(parts[999], 'X');
});

test('repeatLabel preserves whitespace in labels', () => {
  assert.strictEqual(repeatLabel('Hello World', 2), 'Hello World Hello World');
  assert.strictEqual(repeatLabel('  spaces  ', 1), '  spaces  ');
});
