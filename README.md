# Testing: Sum Function Special Values

This repository documents the behavior of the `sum()` function when handling JavaScript's special numeric values: `Infinity`, `-Infinity`, and `NaN`.

## Implementation

The `sum()` function is a simple addition operation:

```javascript
export function sum(a, b) {
  return a + b;
}
```

## Special Value Behavior

### Infinity

- **Infinity + number = Infinity**: Adding any finite number to positive infinity yields infinity.
- **Infinity + Infinity = Infinity**: Two infinities combine to infinity.
- **Infinity + (-Infinity) = NaN**: This is an indeterminate form; JavaScript returns `NaN`.

### -Infinity

- **-Infinity + number = -Infinity**: Adding any finite number to negative infinity yields negative infinity.
- **-Infinity + (-Infinity) = -Infinity**: Two negative infinities combine to negative infinity.
- **-Infinity + Infinity = NaN**: This is an indeterminate form; JavaScript returns `NaN`.

### NaN

- **NaN + any value = NaN**: Not-a-Number propagates through arithmetic operations. Adding `NaN` to any value (including `Infinity`, `-Infinity`, or another `NaN`) always returns `NaN`.

## Testing

The test suite includes focused tests for each special value case, documenting the existing implementation without modification. Run tests with:

```bash
npm test
```

## Key Findings

The `sum()` function delegates to JavaScript's native `+` operator, which follows IEEE 754 floating-point arithmetic rules. The special-value tests confirm that:

1. Infinity arithmetic behaves as expected per IEEE 754 standards.
2. Indeterminate forms (Infinity - Infinity) correctly return `NaN`.
3. `NaN` propagates through all arithmetic operations, as designed.

These behaviors are inherent to JavaScript's number type and are not specific to this implementation.
