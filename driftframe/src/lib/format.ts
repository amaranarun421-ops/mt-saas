/**
 * Stable, locale-independent formatters.
 *
 * Why: `toLocaleDateString(undefined, …)` and `toLocaleString()` use the
 * runtime's DEFAULT locale. On the Next.js server (Node.js) the default locale
 * is typically `en-US` (or `C`), while the browser's default locale is the
 * user's locale (e.g. `en-GB`, `de-DE`, `fr-FR`). When a CLIENT component
 * renders a date/number with `undefined` locale during SSR and again during
 * hydration, the two strings can differ → React hydration mismatch.
 *
 * Fix: always pin the locale to `"en-US"` so server and client produce
 * byte-identical strings. These helpers exist so the rule lives in one place.
 */

/** Format an ISO date string as e.g. "Aug 2, 2025". Stable across server/client. */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...opts,
  });
}

/** Format an ISO date string as e.g. "Aug 2". Stable across server/client. */
export function formatMonthDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Format an ISO date-time string as e.g. "8/2/2025, 4:30:15 PM". Stable. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US");
}

/** Format a number with grouping separators, e.g. 1284 → "1,284". Stable. */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/**
 * Format a relative time string like "just now", "5m ago", "3h ago",
 * "2d ago", or fall back to a stable absolute date for older items.
 *
 * Note: the returned string depends on `Date.now()` at call time. Calling
 * this during render is safe ONLY if the caller is inside a `mounted` gate
 * (so the server render and first client render both skip it and produce
 * the same stable placeholder). Otherwise the server's `Date.now()` and
 * the client's `Date.now()` differ by the network/IPC latency, which can
 * produce different strings at minute boundaries → hydration mismatch.
 */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const date = new Date(iso);
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatMonthDay(iso);
}
