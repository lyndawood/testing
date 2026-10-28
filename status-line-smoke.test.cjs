const { test } = require('node:test');
const assert = require('node:assert');
const { clamp } = require('./status-line-smoke.cjs');

test('clamp returns value when in range', () => {
  assert.strictEqual(clamp(5, 0, 10), 5);
  assert.strictEqual(clamp(0, 0, 10), 0);
  assert.strictEqual(clamp(10, 0, 10), 10);
});

test('clamp returns min when value is below range', () => {
  assert.strictEqual(clamp(-5, 0, 10), 0);
  assert.strictEqual(clamp(0, 5, 10), 5);
});

test('clamp returns max when value is above range', () => {
  assert.strictEqual(clamp(15, 0, 10), 10);
  assert.strictEqual(clamp(100, 0, 10), 10);
  assert.strictEqual(clamp(11, 5, 10), 10);
});

test('clamp works with negative ranges', () => {
  assert.strictEqual(clamp(-5, -10, -1), -5);
  assert.strictEqual(clamp(-15, -10, -1), -10);
  assert.strictEqual(clamp(0, -10, -1), -1);
  assert.strictEqual(clamp(-10, -10, -1), -10);
  assert.strictEqual(clamp(-1, -10, -1), -1);
});
