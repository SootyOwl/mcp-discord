import humanize from 'humanize';

export function getRelativeTime(createdAt: Date): string {
  // humanize expects Unix timestamp in seconds
  const timestamp = createdAt.getTime() / 1000;
  return humanize.relativeTime(timestamp);
}
