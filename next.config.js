/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  // Static security headers — applied at the CDN level on Vercel.
  // Dynamic CSP (env-aware) is handled in middleware.js.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "DENY" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
          { key: "Referrer-Policy",         value: "no-referrer" },
          { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
