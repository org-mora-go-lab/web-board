const PROBE_ORIGIN = "http://next-path.invalid";

// Only same-origin paths are allowed as post-login destinations to prevent open redirects.
// Parsing (rather than prefix checks) also catches tricks like "/\t/evil.com", which URL parsers turn into "//evil.com".
export function toSafeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || /[\x00-\x1f\\]/.test(value))
    return "/";
  try {
    const url = new URL(value, PROBE_ORIGIN);
    return url.origin === PROBE_ORIGIN
      ? `${url.pathname}${url.search}${url.hash}`
      : "/";
  } catch {
    return "/";
  }
}
