/**
 * Normalize input text into a display label for wiki snapshots.
 * 
 * Uses NFKC normalization to produce canonical Unicode text, trims whitespace,
 * and collapses runs of whitespace to single spaces while preserving all Unicode characters.
 * 
 * Note: The output is display text, not a safe filename. Use wikiRetestSlug for URL-safe slugs.
 * 
 * @param input - The text to normalize
 * @returns Normalized display label with collapsed whitespace
 * 
 * @example
 * wikiSnapshotLabel('  Hello   World  ') // 'Hello World'
 * wikiSnapshotLabel('Café\u00A0Menu') // 'Café Menu'
 * wikiSnapshotLabel('日本語　テキスト') // '日本語 テキスト'
 */
export function wikiSnapshotLabel(input: string): string {
  return input
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ');
}
