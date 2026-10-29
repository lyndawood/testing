import { test } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:3000';

test('GET /api/health returns ok:true', async () => {
  const response = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.headers.get('content-type'), 'application/json; charset=utf-8');
  
  const data = await response.json();
  assert.deepStrictEqual(data, { ok: true });
});

test('GET / returns HTML page', async () => {
  const response = await fetch(BASE_URL);
  assert.strictEqual(response.status, 200);
  
  const contentType = response.headers.get('content-type');
  assert.ok(contentType.includes('text/html'), 'Response should be HTML');
  
  const html = await response.text();
  assert.ok(html.includes('PR45 Readiness Test'), 'Page should have correct title');
  assert.ok(html.includes('Server Status'), 'Page should have status indicator');
  assert.ok(html.includes('Refresh Status'), 'Page should have refresh button');
});

test('GET /api/health has correct JSON structure', async () => {
  const response = await fetch(`${BASE_URL}/api/health`);
  const data = await response.json();
  
  assert.ok(typeof data === 'object', 'Response should be an object');
  assert.ok('ok' in data, 'Response should have ok property');
  assert.strictEqual(typeof data.ok, 'boolean', 'ok property should be boolean');
  assert.strictEqual(data.ok, true, 'ok property should be true');
});
