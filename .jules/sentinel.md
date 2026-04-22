## 2025-05-15 - Broken Security Middleware in Next.js Turbopack
**Vulnerability:** The root-level `proxy.js` was exporting a function named `middleware`. In this project's Next.js version (16.2.4 with Turbopack), the middleware export MUST be named `proxy`. Because of the incorrect name, the middleware was not executing, effectively disabling all security headers (CSP, X-Frame-Options) and the CSRF origin guard for all `/api/*` routes.
**Learning:** Build failures during the 'Collecting page data' or 'Generating static pages' phase in Next.js can sometimes mask critical configuration errors in middleware/proxy files.
**Prevention:** Always verify that security middleware is actually running by checking response headers in production builds or using `pnpm build` to catch "Proxy is missing expected function export name" errors.

## 2025-05-15 - HTML Injection in Chat API Emails
**Vulnerability:** The `/api/chat` endpoint was embedding raw user input directly into an HTML email template. An attacker could inject malicious HTML/CSS into the email received by the studio.
**Learning:** Parity between similar API endpoints (like `contact` and `chat`) is crucial; one may be hardened while the other remains vulnerable.
**Prevention:** Use a centralized `escapeHtml` utility for all user-provided data that is eventually rendered in an HTML context, including emails.
