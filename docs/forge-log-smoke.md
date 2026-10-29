# Forge Log Smoke Test Repository

## Overview

This repository serves as a smoke test environment for Forge's logging and merge preview validation system. It contains a minimal JavaScript project with:

- **sum.js**: A simple addition function that serves as the test subject
- **sum.test.js**: Unit tests using Node.js's built-in test runner
- **index.html**: A static HTML page for validating merge preview functionality
- **package.json**: Project configuration with ES module support and test script

The repository is intentionally minimal to provide a clean baseline for testing Forge's automated workflows, pull request previews, and continuous integration processes. It uses no external dependencies beyond Node.js built-in modules, making it fast and reliable for smoke testing purposes.

## Contributor Checklist

Before submitting changes to this repository:

1. **Run the test suite** with `npm test` and ensure all tests pass. The tests verify the sum function's behavior with positive, negative, and zero values.

2. **Verify the HTML preview** by opening `index.html` in a browser to confirm the merge preview validation page renders correctly with the expected heading and content.

3. **Keep it minimal** – this is a smoke test repo. Avoid adding external dependencies, complex logic, or features beyond what's needed to validate Forge's core functionality.

## Troubleshooting

### Tests fail with "Cannot find module"

**Symptom:** Running `npm test` produces an error about missing modules or import failures.

**Cause:** The project uses ES modules (`"type": "module"` in package.json), which requires Node.js 14+ and proper file extensions in imports.

**Solution:** Ensure you're using Node.js 14 or later, and verify that all import statements include the `.js` file extension (e.g., `import { sum } from './sum.js'`).

### HTML preview shows outdated content

**Symptom:** The merge preview validation page displays old commit hashes or PR numbers.

**Cause:** The HTML file contains hardcoded references to specific commits and PRs for validation purposes.

**Solution:** This is expected behavior. The content in `index.html` reflects the state at the time of the last merge validation test. Update the heading and paragraph text if you're running a new validation cycle.

### npm test command not found

**Symptom:** Running `npm test` fails with "command not found" or similar error.

**Cause:** Node.js and npm are not installed, or the project dependencies haven't been initialized.

**Solution:** Install Node.js 14 or later from nodejs.org. No `npm install` is required for this project since it has no external dependencies – the test script runs directly with Node.js's built-in test runner.
