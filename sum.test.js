import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './sum.js';

test('sum adds two numbers correctly', () => {
  assert.strictEqual(sum(2, 3), 5);
  assert.strictEqual(sum(0, 0), 0);
  assert.strictEqual(sum(-1, 1), 0);
  assert.strictEqual(sum(10, 20), 30);
});

test('sum handles zero inputs', () => {
  assert.strictEqual(sum(0, 5), 5, 'zero plus positive number');
  assert.strictEqual(sum(5, 0), 5, 'positive number plus zero');
  assert.strictEqual(sum(0, -3), -3, 'zero plus negative number');
  assert.strictEqual(sum(-3, 0), -3, 'negative number plus zero');
  assert.strictEqual(sum(0, 0), 0, 'zero plus zero');
});

test('sum handles negative numbers', () => {
  assert.strictEqual(sum(-5, -3), -8, 'two negative numbers');
  assert.strictEqual(sum(-10, 4), -6, 'negative plus positive');
  assert.strictEqual(sum(7, -2), 5, 'positive plus negative');
  assert.strictEqual(sum(-1, 1), 0, 'negative and positive cancel out');
  assert.strictEqual(sum(-100, -50), -150, 'large negative numbers');
});

test('sum handles fractional inputs', () => {
  assert.strictEqual(sum(0.5, 0.5), 1, 'two halves');
  assert.strictEqual(sum(1.5, 2.5), 4, 'simple decimals');
  assert.strictEqual(sum(0.1, 0.2), 0.30000000000000004, 'floating point precision issue');
  assert.strictEqual(sum(-0.5, 0.5), 0, 'negative and positive fractions cancel');
  assert.strictEqual(sum(-1.5, -2.5), -4, 'two negative fractions');
  assert.strictEqual(sum(0.25, 0.75), 1, 'fractions summing to integer');
});
