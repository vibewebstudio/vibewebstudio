## 2025-05-14 - [Insecure Email API Endpoint]
**Vulnerability:** The `/api/chat` endpoint was actually a duplicate of the contact form handler and lacked the security measures (rate limiting, input sanitization, length guards) found in `/api/contact`.
**Learning:** Redundant or legacy endpoints can often be left behind during refactoring, creating "shadow" APIs that don't have the same security protections as the primary ones.
**Prevention:** Regularly audit `app/api` for unused or duplicate routes. Ensure all public-facing endpoints share a common validation and security middleware or utility pattern.
