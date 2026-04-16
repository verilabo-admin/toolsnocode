/**
 * SSRF-hardened URL validation and fetch helpers.
 *
 * Blocks:
 *  - non-http(s) protocols (file:, ftp:, gopher:, ...)
 *  - IPv4 in private / loopback / link-local / CGNAT / multicast ranges,
 *    in dotted, decimal, and hex notations
 *  - IPv6 loopback / link-local / ULA / IPv4-mapped-to-private
 *  - redirects into any of the above (by following manually and re-validating)
 *
 * NOT blocked (known gap):
 *  - DNS rebinding (hostname resolves OK at check time, then re-resolves to
 *    a private IP at fetch time). Mitigation would require resolving the
 *    hostname once, passing the raw IP to fetch(), and setting Host header.
 *    Overkill for this codebase; trusted RSS feeds are the main input.
 */

function isPrivateIPv4(parts: number[]): boolean {
  if (parts.length !== 4) return true;
  const [a, b] = parts;
  if (parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) return true;
  if (a === 0) return true;
  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

function isPrivateHostname(hostname: string): boolean {
  let h = hostname.toLowerCase();
  if (h.startsWith("[") && h.endsWith("]")) h = h.slice(1, -1);
  if (!h) return true;

  if (h === "localhost" || h === "ip6-localhost" || h === "ip6-loopback") return true;

  const dotted = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (dotted) return isPrivateIPv4(dotted.slice(1).map(Number));

  if (/^\d+$/.test(h)) {
    const n = Number(h);
    if (!Number.isFinite(n) || n < 0 || n > 0xffffffff) return true;
    return isPrivateIPv4([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
  }

  if (/^0x[0-9a-f]+$/.test(h)) {
    const n = parseInt(h.slice(2), 16);
    if (!Number.isFinite(n) || n < 0 || n > 0xffffffff) return true;
    return isPrivateIPv4([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
  }

  if (h.includes(":")) {
    if (h === "::" || h === "::1") return true;
    if (h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")) return true;
    if (h.startsWith("ff")) return true;
    if (h.startsWith("::ffff:")) return isPrivateHostname(h.slice(7));
    return false;
  }

  return false;
}

export function isPrivateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) return true;
    return isPrivateHostname(parsed.hostname);
  } catch {
    return true;
  }
}

export async function safeFetch(
  url: string,
  init: RequestInit = {},
  maxRedirects = 3,
): Promise<Response | null> {
  let current = url;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    if (isPrivateUrl(current)) return null;
    const res = await fetch(current, { ...init, redirect: "manual" });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return res;
      try {
        current = new URL(loc, current).toString();
      } catch {
        return null;
      }
      continue;
    }
    return res;
  }
  return null;
}
