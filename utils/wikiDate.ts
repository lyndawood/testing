/**
 * Format a date for wiki usage in a consistent, UTC-stable format.
 * 
 * Architecture decision: This utility is intentionally dependency-free.
 * We use Intl.DateTimeFormat instead of date libraries to avoid external
 * dependencies and ensure UTC-stable formatting.
 * 
 * @param date - The date to format
 * @returns Formatted date string in format "DD MMM YYYY" (e.g., "30 Oct 2024")
 * 
 * @example
 * ```typescript
 * const date = new Date('2024-10-30T12:00:00Z');
 * const formatted = formatWikiDate(date);
 * // Returns: "30 Oct 2024"
 * ```
 */
export function formatWikiDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
  
  return formatter.format(date);
}
