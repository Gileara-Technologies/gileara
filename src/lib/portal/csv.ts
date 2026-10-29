/**
 * Minimal RFC 4180 CSV encoding — just enough for the admin applications
 * export (no CSV parsing, no streaming, a few hundred rows at most).
 */

/**
 * Escape one field: wrapped in double quotes (with internal quotes doubled)
 * only when the value actually contains a comma, quote, or newline — plain
 * values pass through untouched so the common case stays readable.
 */
export function csvField(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** One CSV row: fields joined with commas, terminated with CRLF per RFC 4180. */
export function csvRow(fields: ReadonlyArray<string | number | null | undefined>): string {
  return `${fields.map(csvField).join(",")}\r\n`;
}
