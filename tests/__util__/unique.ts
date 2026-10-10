let sequence = 0;

// Unique per worker and per call, so parallel tests never collide on emails, titles or search terms.
export function uniqueId(prefix = "e2e") {
  sequence += 1;
  return `${prefix}${process.pid.toString(36)}${Date.now().toString(36)}${sequence}`;
}
