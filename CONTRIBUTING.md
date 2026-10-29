# Contributing

## Getting Started

This is a simple testing example project demonstrating Node.js native test runner with a basic arithmetic function.

## Running Tests

To run the test suite:

```bash
npm test
```

This command runs all `.test.js` files using Node.js's built-in test runner.

## Project Structure

- `sum.js` – exports the `sum()` function that adds two numbers
- `sum.test.js` – test suite for the `sum()` function
- `package.json` – project metadata and scripts

## What the Tests Cover

The test suite verifies that the `sum()` function correctly:
- Adds two positive numbers
- Handles zero values
- Works with negative numbers
- Processes larger values

## Technology Stack

- **Node.js** – native test runner and assert module
- **ES modules** – modern JavaScript module syntax
