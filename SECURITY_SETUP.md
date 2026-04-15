# VibeWebStudio — Security Implementation Guide

## Files Delivered

```
middleware.js                          ← Security headers + API origin guard
lib/ratelimit.js                       ← Upstash rate limiter (shared)
app/api/chat/route.js                  ← Secured AI chat endpoint
app/api/contact/route.js               ← Secured contact/email endpoint
ChatWidget.jsx                         ← Updated: sends x-client-key header
page.jsx                               ← Updated: contact form sends x-client-key
.env.local.example                     ← All required env vars
```

---

## Setup Steps

### 1. Install dependencies

```bash
npm install @upstash/ratelimit @upstash/redis zod nodemailer @anthropic-ai/sdk
```

### 2. Create Upstash Redis database

1. Go to https://console.upstash.com → Create Database
2. Choose **Regional** (lowest latency) → pick a region near your Vercel deployment
3. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into `.env.local`

### 3. Create Gmail App Password

1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password → paste into `GMAIL_APP_PASSWORD` (with spaces is fine)

### 4. Generate your CLIENT_KEY

```bash
openssl rand -hex 32
```

Paste the same value into **both** `CLIENT_KEY` and `NEXT_PUBLIC_CLIENT_KEY`.

### 5. Copy env file

```bash
cp .env.local.example .env.local
# Fill in all values
```

### 6. Add to `.gitignore` (verify it exists)

```
.env.local
.env*.local
```

### 7. Add env vars to Vercel

Settings → Environment Variables → add each key from `.env.local`.

---

## Security Layers at a Glance

| Layer | Where | What it does |
|---|---|---|
| **Rate limiting** | `lib/ratelimit.js` → API routes | 10 req/min (chat), 5 req/min (contact) per IP |
| **Auth header** | Every API route | Blocks requests missing `x-client-key` |
| **Zod validation** | Every API route | Rejects malformed/oversized input |
| **Size limit** | Every API route | Rejects bodies > 1 KB |
| **Spam filter** | `/api/contact` | Blocks URLs + 15 spam keyword patterns |
| **Origin guard** | `middleware.js` | Blocks cross-origin API calls in production |
| **Security headers** | `middleware.js` | CSP, X-Frame-Options, nosniff, etc. |
| **Server-only AI key** | `app/api/chat/route.js` | `ANTHROPIC_API_KEY` never reaches the browser |
| **Token cap** | `app/api/chat/route.js` | `max_tokens: 300` limits AI cost per request |

---

## Rate Limit Behavior

When a limit is hit the API returns:

```json
HTTP 429
{ "error": "Too many requests. Please wait a moment." }
```

Headers included:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After`

The `ChatWidget.jsx` surfaces a friendly message to the user automatically.

---

## Optional Enhancements (future)

- **Cloudflare Turnstile** — add invisible CAPTCHA to the contact form
- **Vercel Edge Config** — dynamic IP blocklist without redeployment
- **Sentry / Axiom** — structured error + abuse logging
