# testing

A simple testing example with TypeScript utilities for wiki operations.

## Utils

### wikiRetestSlug

A standalone TypeScript utility for converting arbitrary text into URL-safe ASCII slugs for wiki pages.

#### Usage

```typescript
import { wikiRetestSlug } from './utils/wikiRetestSlug.js';

wikiRetestSlug('Hello World!');
// Returns: "hello-world"

wikiRetestSlug('Café au lait');
// Returns: "cafe-au-lait"

wikiRetestSlug('Multiple   spaces');
// Returns: "multiple-spaces"

wikiRetestSlug('---Edge hyphens---');
// Returns: "edge-hyphens"
```

The function:
1. Normalizes text with Unicode NFKD decomposition
2. Strips combining marks (diacritics)
3. Converts to lowercase
4. Replaces runs of non-ASCII letters/digits with single hyphens
5. Trims edge hyphens

#### Architecture Decision

This utility is intentionally **dependency-free**. It uses built-in Unicode normalization (`String.normalize('NFKD')`) and regular expressions instead of external slug libraries to:
- Keep dependencies unchanged
- Ensure ASCII-only output
- Keep the codebase lightweight

#### Known Limitation

**Non-Latin scripts produce empty slugs.** The utility strips all non-ASCII characters after normalization, so text in Cyrillic, Arabic, CJK, or other non-Latin scripts will result in an empty string:

```typescript
wikiRetestSlug('Привет мир');  // Returns: "" (Cyrillic)
wikiRetestSlug('你好世界');      // Returns: "" (Chinese)
wikiRetestSlug('مرحبا');        // Returns: "" (Arabic)
```

**If you need to support non-Latin input**, consider:
- Using a transliteration library (e.g., `transliteration`, `speakingurl`)
- Prepending a Latin prefix to ensure non-empty slugs
- Implementing custom transliteration rules for your target scripts
