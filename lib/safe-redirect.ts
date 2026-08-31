/**
 * Only allow same-site relative paths as a post-login redirect target. Blocks
 * absolute URLs and protocol-relative (`//evil.com`) open-redirect attempts.
 */
export function safeCallbackUrl(
  raw: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (typeof raw !== "string" || raw === "") return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}
