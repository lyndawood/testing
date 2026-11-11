import { test } from 'node:test';
import assert from 'node:assert';
import { greet } from './pr76-greet.js';

test('greet returns greeting with name', () => {
  assert.strictEqual(greet('World'), 'Hello, World');
  assert.strictEqual(greet('Alice'), 'Hello, Alice');
});
