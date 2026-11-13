# PR82 Streaming Guide: Testing Repository Documentation

## Overview

This repository demonstrates a minimal Node.js testing setup using the built-in Node.js test runner
with ES modules. The project includes a simple arithmetic function with comprehensive test coverage
and a Space Checkers game implementation.

## Repository Structure

```
testing/
├── docs/                           # Documentation directory
├── galaxy-background.jpg           # Background asset (344KB)
├── luminas_art-new-year-background-3608029_1920.jpg  # Background asset (344KB)
├── index.html                      # Space Checkers game (830 lines)
├── package.json                    # Project configuration
├── sum.js                          # Core arithmetic module
└── sum.test.js                     # Test suite for sum module
```

## Package Configuration

**File:** `package.json`

The project uses ES modules (`"type": "module"`) and Node's built-in test runner:

```json
{
  "name": "testing",
  "version": "1.0.0",
  "description": "A simple testing example",
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

**Key Points:**
- No external testing dependencies (Jest, Mocha, etc.)
- Uses Node.js native test runner (available in Node 18+)
- ES module syntax throughout
- Single test script command

## Core Module: sum.js

**File:** `sum.js` (4 lines)

A minimal arithmetic function demonstrating testable code:

```javascript
export function sum(a, b) {
  return a + b;
}
```

**Characteristics:**
- Pure function with no side effects
- Named export for tree-shaking compatibility
- Simple addition operation
- No input validation (tests verify behavior)

## Test Suite: sum.test.js

**File:** `sum.test.js` (11 lines)

Comprehensive test coverage using Node's native test API:

```javascript
import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './sum.js';

test('sum adds two numbers correctly', () => {
  assert.strictEqual(sum(2, 3), 5);
  assert.strictEqual(sum(0, 0), 0);
  assert.strictEqual(sum(-1, 1), 0);
  assert.strictEqual(sum(10, 20), 30);
});
```

**Test Coverage:**
1. **Positive integers:** `sum(2, 3) === 5`
2. **Zero handling:** `sum(0, 0) === 0`
3. **Negative numbers:** `sum(-1, 1) === 0`
4. **Larger values:** `sum(10, 20) === 30`

**Testing Patterns:**
- Single test block with multiple assertions
- Uses `assert.strictEqual()` for exact equality (no type coercion)
- Tests edge cases (zero, negatives)
- No setup/teardown needed for pure functions

## Running Tests

### Basic Test Execution

```bash
npm test
```

**Expected Output:**
```
✔ sum adds two numbers correctly (0.5ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 50.2
```

### Direct Node Execution

```bash
node --test sum.test.js
```

### Watch Mode (Node 19+)

```bash
node --test --watch
```

### Test with Coverage (Node 20+)

```bash
node --test --experimental-test-coverage
```

## Node.js Test Runner Features

### Available Imports

```javascript
import { test, describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
```

### Test Organization

**Single test:**
```javascript
test('description', () => {
  // assertions
});
```

**Grouped tests:**
```javascript
describe('sum function', () => {
  it('adds positive numbers', () => {
    assert.strictEqual(sum(1, 2), 3);
  });
  
  it('handles negatives', () => {
    assert.strictEqual(sum(-5, 5), 0);
  });
});
```

### Async Tests

```javascript
test('async operation', async () => {
  const result = await someAsyncFunction();
  assert.strictEqual(result, expected);
});
```

### Test Hooks

```javascript
describe('with setup', () => {
  let testData;
  
  before(() => {
    // Runs once before all tests
    testData = setupData();
  });
  
  after(() => {
    // Runs once after all tests
    cleanup();
  });
  
  beforeEach(() => {
    // Runs before each test
  });
  
  afterEach(() => {
    // Runs after each test
  });
});
```

## Assertion Methods

The `node:assert` module provides:

```javascript
// Equality
assert.strictEqual(actual, expected);        // ===
assert.deepStrictEqual(obj1, obj2);         // Deep comparison

// Truthiness
assert.ok(value);                           // Truthy check
assert.equal(actual, expected);             // == (loose)

// Exceptions
assert.throws(() => { throw new Error(); });
assert.rejects(async () => { throw new Error(); });

// Negations
assert.notStrictEqual(actual, unexpected);
assert.notDeepStrictEqual(obj1, obj2);
```

## Space Checkers Game

**File:** `index.html` (830 lines)

A complete browser-based checkers game with:

### Game Features
- 8x8 checkerboard with diagonal movement
- Two-player turn-based gameplay
- Piece capture mechanics with mandatory captures
- Multi-jump combo system
- King promotion at opposite end
- Win condition detection

### Technical Implementation

**Board State:**
```javascript
// 8x8 array of pieces
board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

// Piece structure
{ player: 1, king: false }
{ player: 2, king: true }
```

**Game Logic Functions:**
- `initBoard()` - Initialize 12 pieces per player
- `renderBoard()` - DOM rendering with event listeners
- `handleSquareClick(row, col)` - User interaction handler
- `getValidMoves(row, col)` - Calculate legal moves
- `movePiece(from, to, captures)` - Execute move with capture
- `checkWin()` - Detect victory conditions
- `updateMustCapture()` - Enforce mandatory capture rule

**Styling:**
- CSS custom properties for theming
- Futuristic space aesthetic with gradients
- Responsive grid layout (desktop/tablet/mobile)
- Clip-path for geometric shapes
- Animations for piece selection and valid moves
- Accessibility features (ARIA labels, keyboard support)

## Adding New Tests

### Step 1: Create a new module

```javascript
// multiply.js
export function multiply(a, b) {
  return a * b;
}
```

### Step 2: Create test file

```javascript
// multiply.test.js
import { test } from 'node:test';
import assert from 'node:assert';
import { multiply } from './multiply.js';

test('multiply multiplies two numbers', () => {
  assert.strictEqual(multiply(2, 3), 6);
  assert.strictEqual(multiply(0, 5), 0);
  assert.strictEqual(multiply(-2, 3), -6);
});
```

### Step 3: Run tests

```bash
npm test
# Runs all *.test.js files automatically
```

## Best Practices

### Test Organization
1. One test file per module (`module.test.js`)
2. Group related tests with `describe()`
3. Use descriptive test names
4. Test edge cases and error conditions

### Assertion Strategy
5. Use `strictEqual` for primitives
6. Use `deepStrictEqual` for objects/arrays
7. Test both success and failure paths
8. Verify error messages, not just that errors occur

### Code Structure
9. Keep functions pure when possible
10. Export testable units
11. Avoid global state
12. Mock external dependencies

### Performance
13. Run tests in parallel (default behavior)
14. Use `--test-only` flag to skip certain tests
15. Profile slow tests with `--test-reporter=spec`

## Troubleshooting

### Common Issues

**"Cannot find module"**
- Ensure `"type": "module"` in package.json
- Use `.js` extension in imports: `import { sum } from './sum.js'`

**"SyntaxError: Unexpected token 'export'"**
- Missing `"type": "module"` in package.json
- Or use `.mjs` file extension

**Tests not discovered**
- Test files must match pattern: `**/*.test.js`, `**/*_test.js`, or `**/test-*.js`
- Or specify files explicitly: `node --test path/to/test.js`

**Assertion failures**
- Check for type mismatches (use `strictEqual` not `equal`)
- Verify async tests use `await` or return promises
- Ensure test timeout is sufficient for slow operations

## Advanced Testing Patterns

### Mocking with test context

```javascript
import { test, mock } from 'node:test';

test('with mock', (t) => {
  const mockFn = t.mock.fn(() => 'mocked');
  assert.strictEqual(mockFn(), 'mocked');
  assert.strictEqual(mockFn.mock.calls.length, 1);
});
```

### Subtests

```javascript
test('parent test', async (t) => {
  await t.test('subtest 1', () => {
    assert.ok(true);
  });
  
  await t.test('subtest 2', () => {
    assert.ok(true);
  });
});
```

### Test timeouts

```javascript
test('slow operation', { timeout: 5000 }, async () => {
  await slowAsyncOperation();
});
```

### Skipping tests

```javascript
test('not ready yet', { skip: true }, () => {
  // This test won't run
});

test('conditional skip', { skip: process.env.CI }, () => {
  // Skipped in CI environment
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm test
```

### Test Coverage in CI

```bash
node --test --experimental-test-coverage --test-reporter=lcov > coverage.lcov
```

## Resources

- **Node.js Test Runner Docs:** https://nodejs.org/api/test.html
- **Node.js Assert Docs:** https://nodejs.org/api/assert.html
- **ES Modules Guide:** https://nodejs.org/api/esm.html

## Summary

This repository demonstrates modern Node.js testing without external dependencies. The test setup is
minimal yet powerful, leveraging Node's built-in test runner for fast, reliable test execution. The
sum module provides a simple example of testable code with comprehensive coverage of edge cases.
