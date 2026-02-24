import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const humanize = require('humanize');

export function getRelativeTime(createdAt: Date): string {
  // humanize expects Unix timestamp in seconds
  const timestamp = createdAt.getTime() / 1000;
  return humanize.relativeTime(timestamp);
}

/**
 * Pre-process a raw JSON string to quote bare integers that exceed
 * Number.MAX_SAFE_INTEGER (i.e. Discord snowflake IDs).
 *
 * LLMs often output snowflake IDs as unquoted JSON numbers like:
 *   {"channelId": 1475843393870364755}
 *
 * Standard JSON.parse would silently corrupt these to ~1475843393870364700.
 * This function wraps them in quotes before parsing so they survive as strings.
 *
 * Only targets numbers in JSON value positions (after : , or [), never inside
 * strings, and only numbers with 16+ digits (MAX_SAFE_INTEGER is 16 digits).
 */
export function preserveBigIntegers(raw: string): string {
  return raw.replace(/(?<=[:,\[]\s*)\b(\d{16,})\b/g, '"$1"');
}
