## 2025-05-14 - [Critical Middleware Gap & Insecure Duplicate Endpoint]
**Vulnerability:**
1. **Inactive Middleware:** Critical security middleware (`proxy.js`) was present but inactive because it was incorrectly named (using the `middleware` function name in a `proxy.js` file for Next.js 16+), leaving the app without CSP, CSRF protection, and origin guards.
2. **Insecure Duplicate Endpoint:** `/api/chat` contained a duplicate of the contact form's email logic but lacked rate limiting, HTML escaping, and input validation, making it a prime target for spam and injection.

**Learning:**
- Security features "delivered" in a project may not be active if they don't follow framework-specific naming conventions (e.g., Next.js `middleware.js`).
- Duplicate logic often misses security patches applied to the "main" version, creating weak links.

**Prevention:**
- Always verify that security middleware is actually running by checking file naming and placement.
- Use centralized validation and shared logic instead of duplicating critical paths like email dispatch.
- Audit all API endpoints for consistent security controls (rate limiting, validation, sanitization).
