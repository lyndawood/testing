import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './sum.js';

test('sum adds two numbers correctly', () => {
  assert.strictEqual(sum(2, 3), 5);
  assert.strictEqual(sum(0, 0), 0);
  assert.strictEqual(sum(-1, 1), 0);
  assert.strictEqual(sum(10, 20), 30);
});

test('sum handles negative numbers', () => {
  assert.strictEqual(sum(-5, -3), -8);
  assert.strictEqual(sum(-10, 5), -5);
  assert.strictEqual(sum(7, -2), 5);
  assert.strictEqual(sum(-100, -50), -150);
});

test('sum handles fractional inputs', () => {
  assert.strictEqual(sum(1.5, 2.5), 4);
  assert.strictEqual(sum(0.1, 0.2), 0.30000000000000004);
  assert.strictEqual(sum(-1.5, 1.5), 0);
  assert.strictEqual(sum(3.14, 2.86), 6);
});
