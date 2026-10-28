const { test } = require('node:test');
const assert = require('node:assert');
const { clamp } = require('./phase-track-smoke.cjs');

test('clamp: value in range returns value unchanged', () => {
  assert.strictEqual(clamp(5, 0, 10), 5);
  assert.strictEqual(clamp(0, 0, 10), 0);
  assert.strictEqual(clamp(10, 0, 10), 10);
});

test('clamp: value below minimum returns minimum', () => {
  assert.strictEqual(clamp(-5, 0, 10), 0);
  assert.strictEqual(clamp(-100, -50, 50), -50);
});

test('clamp: value above maximum returns maximum', () => {
  assert.strictEqual(clamp(15, 0, 10), 10);
  assert.strictEqual(clamp(100, -50, 50), 50);
});
