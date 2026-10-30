/**
 * Convert arbitrary text into a URL-safe ASCII slug for wiki pages.
 * 
 * Architecture decision: This utility is intentionally dependency-free.
 * We use built-in Unicode normalization (NFKD) and regexes instead of
 * slug libraries to keep dependencies unchanged and ensure ASCII-only output.
 * 
 * Stored slugs are bounded to 64 ASCII bytes by default, while callers can
 * choose a shorter limit by passing maxLength.
 * 
 * @param text - The text to convert into a slug
 * @param maxLength - Maximum length of the slug in ASCII characters (default: 64)
 * @returns URL-safe ASCII slug with hyphens separating words, truncated to maxLength
 * 
 * @example
 * ```typescript
 * wikiRetestSlug('Hello World!');
 * // Returns: "hello-world"
 * 
 * wikiRetestSlug('Café au lait');
 * // Returns: "cafe-au-lait"
 * 
 * wikiRetestSlug('Multiple   spaces');
 * // Returns: "multiple-spaces"
 * 
 * wikiRetestSlug('---Edge hyphens---');
 * // Returns: "edge-hyphens"
 * 
 * wikiRetestSlug('Very long title that exceeds the default limit', 20);
 * // Returns: "very-long-title"
 * ```
 * 
 * **Known Limitation**: Non-Latin scripts (Cyrillic, Arabic, CJK, etc.) will
 * produce empty slugs after stripping non-ASCII characters. For example:
 * 
 * ```typescript
 * wikiRetestSlug('Привет мир');  // Returns: ""
 * wikiRetestSlug('你好世界');      // Returns: ""
 * wikiRetestSlug('مرحبا');        // Returns: ""
 * ```
 * 
 * If you need to support non-Latin input, consider using a transliteration
 * library or prepending a Latin prefix to ensure non-empty slugs.
 */
export function wikiRetestSlug(text: string, maxLength: number = 64): string {
  // Step 1: Normalize with NFKD to decompose characters (e.g., é → e + ́)
  const normalized = text.normalize('NFKD');
  
  // Step 2: Strip combining marks (diacritics)
  // \p{M} matches any Unicode mark (combining diacritics)
  const withoutMarks = normalized.replace(/\p{M}/gu, '');
  
  // Step 3: Convert to lowercase
  const lowercased = withoutMarks.toLowerCase();
  
  // Step 4: Replace runs of non-ASCII letters/digits with a single hyphen
  // Keep only ASCII letters (a-z) and digits (0-9), replace everything else with hyphen
  const withHyphens = lowercased.replace(/[^a-z0-9]+/g, '-');
  
  // Step 5: Trim edge hyphens
  const trimmed = withHyphens.replace(/^-+|-+$/g, '');
  
  // Step 6: Truncate to maxLength and remove any trailing hyphen
  const truncated = trimmed.slice(0, maxLength);
  const final = truncated.replace(/-+$/, '');
  
  return final;
}
