/**
 * Calculate a retention deadline from an issued date and a number of days.
 * 
 * Uses fixed 24-hour elapsed periods rather than local calendar-date arithmetic,
 * so daylight-saving changes do not change the elapsed duration.
 * 
 * @param issuedAt - The starting date
 * @param days - Number of days to add
 * @returns The deadline date
 */
export function retentionDeadline(issuedAt: Date, days: number): Date {
  return new Date(issuedAt.getTime() + days * 86_400_000);
}
