import { NextResponse } from "next/server";

/**
 * Next.js Middleware — must live at the project root and be named middleware.js
 * Runs on every matched request.
 *
 * Responsibilities:
 *   1. Inject security response headers
 *   2. Block cross-origin requests to /api/* (CSRF guard)
 */
/**
 * In this project's Next.js version (with Turbopack), root-level middleware in 'proxy.js'
 * must export a function named 'proxy' (or a default export).
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const headers = response.headers;

  // ── 1. Security headers ────────────────────────────────────────────────
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  // Tighten unsafe-eval in production
  const scriptSrc =
    process.env.NODE_ENV === "production"
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'"; // Next.js dev requires eval

  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  // ── 2. API origin guard (production only) ─────────────────────────────
  if (pathname.startsWith("/api/") && process.env.NODE_ENV === "production") {
    const origin = request.headers.get("origin");
    const host   = request.headers.get("host");
    const allowed = `https://${host}`;

    if (origin && origin !== allowed) {
      return new NextResponse(JSON.stringify({ error: "Forbidden." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Basic CSRF check: all API calls from our site include this header
    if (!request.headers.get("x-site-request")) {
      return new NextResponse(JSON.stringify({ error: "Forbidden." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|otf)).*)",
  ],
};
