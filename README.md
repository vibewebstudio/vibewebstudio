# VibeWebStudio — Next.js Project

Full-stack Next.js website with AI chat widget + email notifications.

---

## 🚀 Quick Start (3 Steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Open .env.local and fill in your values (see below)
```

### 3. Run the dev server
```bash
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Environment Variables

Open `.env.local` and fill in:

| Variable | What it is | How to get it |
|---|---|---|
| `GMAIL_USER` | Your Gmail address | Your Gmail |
| `GMAIL_APP_PASSWORD` | 16-char App Password | Google Account → Security → App Passwords |
| `STUDIO_EMAIL` | Where inquiry emails go | Can be same as GMAIL_USER |
| `ANTHROPIC_API_KEY` | Claude API key | [console.anthropic.com](https://console.anthropic.com) |

### Getting a Gmail App Password
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → Enable **2-Step Verification**
3. Security → **App Passwords** → Generate
4. Paste the 16-char code into `GMAIL_APP_PASSWORD`

---

## 📁 Project Structure

```
vibewebstudio/
├── app/
│   ├── api/
│   │   ├── contact/route.js   ← Contact form + email handler
│   │   └── chat/route.js      ← AI Chat (Claude) API
│   ├── globals.css            ← Design system styles
│   ├── layout.jsx             ← Root layout (fonts, ChatWidget, WhatsApp FAB)
│   └── page.jsx               ← Full landing page
├── components/
│   └── ChatWidget.jsx         ← Floating AI chat widget
├── .env.example               ← Copy → .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🛠 Customize

### Change Pricing
Edit the `plans` array in `app/page.jsx` → `Pricing` component.

### Change AI Personality
Edit the `SYSTEM_PROMPT` in `app/api/chat/route.js`.

### Update WhatsApp Link
In `app/layout.jsx`, change `https://wa.me/yourlink` to your number: `https://wa.me/919876543210`

---

## 🚀 Deploy to Antigravity / Vercel

1. Push to GitHub
2. Connect repo in your hosting dashboard
3. Add all `.env.local` variables in the **Environment Variables** section
4. Deploy ✅

---

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI Chat**: Anthropic Claude (`claude-sonnet-4`)
- **Email**: Nodemailer + Gmail
- **Fonts**: Space Grotesk + Inter (Google Fonts)
