# testing

A simple testing example

## Utils

### wikiDate

A standalone TypeScript utility for formatting dates consistently in wiki contexts. Provides both human-readable and machine-interchange formats.

#### Usage

**Human-readable format (for display):**

```typescript
import { formatWikiDate } from './utils/wikiDate.js';

const date = new Date('2024-10-30T12:00:00Z');
const formatted = formatWikiDate(date);
// Returns: "30 Oct 2024"
```

**ISO format (for machine interchange and storage):**

```typescript
import { formatWikiDateISO } from './utils/wikiDate.js';

const date = new Date('2024-10-30T12:00:00Z');
const iso = formatWikiDateISO(date);
// Returns: "2024-10-30"
```

#### Architecture Decision

This utility is intentionally **dependency-free**. It uses `Intl.DateTimeFormat` for human display and `toISOString().slice(0,10)` for machine interchange instead of external date libraries to:
- Avoid external dependencies
- Ensure UTC-stable formatting
- Keep the codebase lightweight
- Provide both human and machine formats without duplication

**Format purposes:**
- `formatWikiDate()` – Human-readable "DD MMM YYYY" for display in wiki notes and UI
- `formatWikiDateISO()` – ISO 8601 "YYYY-MM-DD" for data interchange, storage, and sorting

#### Known Limitation

Locale data (month abbreviations, formatting rules) varies between JavaScript runtimes (Node.js versions, browsers, Deno, Bun). While the format structure is consistent, the exact byte representation of `formatWikiDate()` may differ slightly across environments.

**If you need byte-identical strings across different systems**, pin the JavaScript runtime version in your deployment and CI/CD pipeline. The `formatWikiDateISO()` function produces identical output across all runtimes.
