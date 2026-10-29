# Label Demo

An accessible, interactive demonstration of the `repeatLabel` function with comprehensive test coverage and HTML escaping.

## Overview

This demo showcases a small CommonJS module that repeats label text a specified number of times while safely escaping HTML to prevent XSS attacks. The project includes a fully accessible web interface, comprehensive tests, and proper edge case handling.

## Files

- **`labels.cjs`** - CommonJS module exporting `repeatLabel(label, count)` and `escapeHtml(str)`
- **`labels.test.cjs`** - Comprehensive test suite using Node.js test runner
- **`index.html`** - Interactive demo with accessible form controls
- **`labels.css`** - Modern, responsive styling with light/dark mode support
- **`label-demo.md`** - This documentation file

## Usage

### Node.js Module

```javascript
const { repeatLabel } = require('./labels.cjs');

// Basic usage
repeatLabel('Hello', 3);
// Returns: "Hello Hello Hello"

// HTML escaping
repeatLabel('<script>alert("XSS")</script>', 1);
// Returns: "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"

// Edge cases
repeatLabel('Test', 0);        // Returns: ""
repeatLabel('Test', -5);       // Returns: ""
repeatLabel('', 10);           // Returns: ""
repeatLabel('Label', 2.7);     // Returns: "Label Label" (rounds down)
```

### Running Tests

```bash
# Run all tests (includes both sum.test.js and labels.test.cjs)
npm test

# Run only the label tests
node --test labels.test.cjs
```

The test suite includes 14 comprehensive tests covering:
- Basic functionality (repeat N times)
- Zero and negative counts
- Empty strings
- Decimal counts (rounds down)
- Invalid input types (NaN, Infinity, null, undefined, etc.)
- HTML special character escaping
- XSS injection prevention
- Quote escaping
- Large count efficiency
- Whitespace preservation

### Interactive Demo

Open `index.html` in a web browser to use the interactive demo:

1. Enter label text in the "Label Text" field
2. Enter a repeat count in the "Repeat Count" field
3. Click "Generate Labels" to see the result
4. The output will show the repeated, HTML-escaped labels

## Features

### Security
- **HTML Escaping**: All special characters (`<`, `>`, `&`, `"`, `'`) are escaped to prevent XSS attacks
- **Input Validation**: Handles invalid types, negative numbers, and edge cases gracefully

### Accessibility
- **Semantic HTML**: Proper use of `<label>`, `<form>`, and landmark elements
- **ARIA Support**: Live regions for dynamic content updates, descriptive labels, and help text
- **Keyboard Navigation**: Full keyboard support with visible focus states
- **Screen Reader Friendly**: Descriptive labels and status updates
- **WCAG AA Compliance**: 4.5:1 contrast ratios for all text

### Design
- **Responsive**: Works on mobile (360px+) through desktop
- **Dark Mode**: Automatic light/dark theme based on system preference
- **Modern CSS**: Uses custom properties, flexbox, and smooth transitions
- **Reduced Motion**: Respects `prefers-reduced-motion` for accessibility

## API Reference

### `repeatLabel(label, count)`

Repeats a label string a specified number of times with HTML escaping.

**Parameters:**
- `label` (string): The label text to repeat
- `count` (number): The number of times to repeat the label

**Returns:**
- (string): The repeated label, HTML-escaped, separated by spaces

**Behavior:**
- Non-string labels are treated as empty strings
- Non-numeric or invalid counts (NaN, Infinity) are treated as 0
- Negative counts return an empty string
- Decimal counts are rounded down to the nearest integer
- Empty labels or zero counts return an empty string
- HTML special characters are escaped for security

### `escapeHtml(str)`

Escapes HTML special characters to prevent XSS attacks.

**Parameters:**
- `str` (string): The string to escape

**Returns:**
- (string): The escaped string, or empty string if input is not a string

**Escaped Characters:**
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#039;`

## Edge Cases

The implementation handles these edge cases:

1. **Negative counts**: Return empty string (not an error)
2. **Zero count**: Return empty string
3. **Empty label**: Return empty string
4. **Decimal counts**: Round down (2.9 → 2)
5. **Invalid types**: Treat as 0 or empty string
6. **HTML injection**: Escape all special characters
7. **Large counts**: Efficiently handle thousands of repetitions
8. **Whitespace**: Preserve spaces within labels

## Browser Compatibility

The demo works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

The module uses standard JavaScript (ES5+) and works in Node.js 12+.

## Development

### Project Structure
```
testing/
├── labels.cjs           # CommonJS module
├── labels.test.cjs      # Test suite
├── labels.css           # Styles
├── index.html           # Demo page
├── label-demo.md        # Documentation
├── sum.js               # Existing module
├── sum.test.js          # Existing tests
└── package.json         # Project config
```

### Testing Philosophy
- **Comprehensive coverage**: Test happy paths, edge cases, and security
- **Clear test names**: Each test describes what it validates
- **Isolated tests**: Each test is independent and can run in any order
- **Fast execution**: All tests complete in under 1 second

## License

This is a demo project for testing purposes.
