# Sentinel 🛡️ - Security Journal

## 2025-05-15 - [Middleware Naming & Ghost Endpoint Hardening]
**Vulnerability:** The application had an inactive security middleware and an unprotected "ghost" API endpoint (`/api/chat`) acting as an open email relay.
**Learning:** In Next.js 16/Turbopack as configured in this project, the middleware file must be named `proxy.js` and export a function named `proxy`. The previous name `middleware` caused the security layers (CSRF guards and security headers) to be silently ignored during the build. Additionally, duplicate API routes often miss security parity with the main routes.
**Prevention:** Always verify middleware activation via build logs (`ƒ Proxy (Middleware)`). Audit all API routes for consistent security patterns (rate limiting, sanitization) even if they are not currently linked to the frontend.

## 2025-05-15 - [CSRF Origin Guard Activation]
**Vulnerability:** API endpoints were vulnerable to CSRF and cross-origin requests because the `x-site-request` header was not enforced.
**Learning:** Activating the `proxy.js` middleware immediately blocked existing frontend requests.
**Prevention:** Ensure frontend fetch calls are updated with custom security headers (e.g., `x-site-request`) before or simultaneously with activating origin guards.
