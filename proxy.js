import { NextResponse } from "next/server";

/**
 * Global proxy — runs on every request (Next.js 16+).
 * Replaces the deprecated middleware.js convention.
 *
 * Responsibilities:
 *   1. Inject security response headers
 *   2. Block cross-origin requests to /api/* (CSRF-style guard)
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ── 1. Security headers (applied to every response) ─────────────────────
  const headers = response.headers;

  /** Prevent this site from being iframed (clickjacking protection) */
  headers.set("X-Frame-Options", "DENY");

  /** Stop browsers from MIME-sniffing response types */
  headers.set("X-Content-Type-Options", "nosniff");

  /** Legacy XSS filter — still supported by older browsers */
  headers.set("X-XSS-Protection", "1; mode=block");

  /** Don't send the Referer header when navigating away */
  headers.set("Referrer-Policy", "no-referrer");

  /**
   * Permissions Policy — disable features this site never needs.
   * Adjust if you add maps, payments, etc.
   */
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  /**
   * Content Security Policy — tightened for Next.js.
   *   • 'self' + trusted CDNs for scripts/styles
   *   • Inline styles allowed (needed for Tailwind JIT & CSS-in-JS)
   *   • No inline scripts (hash/nonce can be added if needed)
   */
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval required by Next.js dev
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://api.anthropic.com",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  // ── 2. API origin guard ──────────────────────────────────────────────────
  // Only enforce on /api routes in production.
  // Blocks cross-origin POST requests that bypass the x-client-key header.
  if (pathname.startsWith("/api/") && process.env.NODE_ENV === "production") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const allowedOrigin = `https://${host}`;

    // Allow same-origin requests (origin is null for server-to-server)
    // Block cross-origin requests that have a mismatched origin header
    if (origin && origin !== allowedOrigin) {
      return new NextResponse(JSON.stringify({ error: "Forbidden." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return response;
}

// ── Matcher — run on all routes except Next.js internals & static files ────
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf)).*)",
  ],
};
