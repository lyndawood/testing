import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './sum.js';

test('sum adds two numbers correctly', () => {
  assert.strictEqual(sum(2, 3), 5);
  assert.strictEqual(sum(0, 0), 0);
  assert.strictEqual(sum(-1, 1), 0);
  assert.strictEqual(sum(10, 20), 30);
});

test('sum handles Infinity correctly', () => {
  // Infinity + number = Infinity
  assert.strictEqual(sum(Infinity, 5), Infinity);
  assert.strictEqual(sum(5, Infinity), Infinity);
  // Infinity + Infinity = Infinity
  assert.strictEqual(sum(Infinity, Infinity), Infinity);
  // Infinity + (-Infinity) = NaN (indeterminate form)
  assert(Number.isNaN(sum(Infinity, -Infinity)));
});

test('sum handles -Infinity correctly', () => {
  // -Infinity + number = -Infinity
  assert.strictEqual(sum(-Infinity, 5), -Infinity);
  assert.strictEqual(sum(5, -Infinity), -Infinity);
  // -Infinity + (-Infinity) = -Infinity
  assert.strictEqual(sum(-Infinity, -Infinity), -Infinity);
  // -Infinity + Infinity = NaN (indeterminate form)
  assert(Number.isNaN(sum(-Infinity, Infinity)));
});

test('sum handles NaN correctly', () => {
  // NaN + any value = NaN
  assert(Number.isNaN(sum(NaN, 5)));
  assert(Number.isNaN(sum(5, NaN)));
  assert(Number.isNaN(sum(NaN, NaN)));
  assert(Number.isNaN(sum(NaN, Infinity)));
  assert(Number.isNaN(sum(NaN, -Infinity)));
});
