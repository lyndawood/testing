# testing

A simple testing example

## Utils

### wikiDate

A standalone TypeScript utility for formatting dates consistently in wiki contexts.

#### Usage

```typescript
import { formatWikiDate } from './utils/wikiDate.js';

const date = new Date('2024-10-30T12:00:00Z');
const formatted = formatWikiDate(date);
// Returns: "30 Oct 2024"
```

The function formats dates in UTC using the format "DD MMM YYYY" (e.g., "30 Oct 2024").

#### Architecture Decision

This utility is intentionally **dependency-free**. It uses `Intl.DateTimeFormat` with explicit locale and timezone settings instead of external date libraries to:
- Avoid external dependencies
- Ensure UTC-stable formatting
- Keep the codebase lightweight

#### Known Limitation

Locale data (month abbreviations, formatting rules) varies between JavaScript runtimes (Node.js versions, browsers, Deno, Bun). While the format structure is consistent, the exact byte representation may differ slightly across environments.

**If you need byte-identical strings across different systems**, pin the JavaScript runtime version in your deployment and CI/CD pipeline.
