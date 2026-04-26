## 2025-04-26 - Vulnerable Email Relay in Duplicate API Route
**Vulnerability:** The `/api/chat` endpoint was a duplicate of `/api/contact` but lacked all security protections (rate limiting, input sanitization, length guards). It could be used as an open email relay for spam or DoS.
**Learning:** Even when security features like rate limiting and sanitization are implemented in one part of the app, duplicate or legacy routes can leave "backdoors" if not consistently updated.
**Prevention:** Audit all API routes for consistent application of security middlewares/utilities. Use a centralized validation schema or middleware for common API patterns like email sending.
