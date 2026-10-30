/**
 * Normalize input text into a display label for wiki snapshots.
 * 
 * Uses NFKC normalization to produce canonical Unicode text, trims whitespace,
 * and collapses runs of whitespace to single spaces while preserving all Unicode characters.
 * Truncates to maxLength Unicode code points (not UTF-16 code units) and trims the result.
 * 
 * Note: The output is display text, not a safe filename. Use wikiRetestSlug for URL-safe slugs.
 * 
 * @param input - The text to normalize
 * @param maxLength - Maximum length in Unicode code points (default: 96)
 * @returns Normalized display label with collapsed whitespace, bounded to maxLength code points
 * 
 * @example
 * wikiSnapshotLabel('  Hello   World  ') // 'Hello World'
 * wikiSnapshotLabel('Café\u00A0Menu') // 'Café Menu'
 * wikiSnapshotLabel('日本語　テキスト') // '日本語 テキスト'
 * wikiSnapshotLabel('A very long label...', 10) // 'A very lon'
 */
export function wikiSnapshotLabel(input: string, maxLength: number = 96): string {
  const normalized = input
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ');
  
  // Truncate by Unicode code points, not UTF-16 code units
  const truncated = Array.from(normalized).slice(0, maxLength).join('');
  
  return truncated.trim();
}
