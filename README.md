# testing

A simple testing example repository with Node.js testing patterns and standalone TypeScript utilities for wiki operations.

## Usage

### wikiSnapshotLabel

Normalize input text into a display label for wiki snapshots:

```typescript
import { wikiSnapshotLabel } from './utils/wikiSnapshotLabel.js';

wikiSnapshotLabel('  Hello   World  '); // 'Hello World'
wikiSnapshotLabel('Café\u00A0Menu');    // 'Café Menu'
wikiSnapshotLabel('日本語　テキスト');   // '日本語 テキスト'
```

Uses NFKC normalization to produce canonical Unicode text, trims whitespace, and collapses runs of whitespace to single spaces while preserving all Unicode characters.

**Note:** The output is display text, not a safe filename. Use `wikiRetestSlug` for URL-safe slugs.

### wikiRetestSlug

Convert text into URL-safe ASCII slugs for wiki pages:

```typescript
import { wikiRetestSlug } from './utils/wikiRetestSlug.js';

wikiRetestSlug('Hello World');        // 'hello-world'
wikiRetestSlug('Café Menu', 32);      // 'cafe-menu'
wikiRetestSlug('日本語');              // '' (empty for non-Latin)
```

Uses NFKD normalization, strips non-ASCII characters, and produces lowercase hyphenated slugs bounded to 64 ASCII characters by default (configurable via `maxLength` parameter).

## Run tests

```bash
npm test
```
