import { Space_Grotesk, Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const spaceGrotesk = Space_Grotesk({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display:  "swap",
});

const inter = Inter({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  variable: "--font-inter",
  display:  "swap",
});

const dmSans = DM_Sans({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  variable: "--font-dm",
  display:  "swap",
});

const BASE_URL = "https://vibewebstudio.in";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default:  "VibeWebStudio | Web Design & Development — India",
    template: "%s | VibeWebStudio",
  },

  description:
    "Clean, fast, mobile-ready websites for small businesses and startups in India. Built by Ankit & Krish — honest pricing, 1–3 week delivery.",

  keywords: [
    "web design India",
    "web development India",
    "Next.js agency India",
    "small business website India",
    "landing page design",
    "affordable web design",
    "VibeWebStudio",
  ],

  openGraph: {
    title:       "VibeWebStudio — Websites That Get You More Customers",
    description: "Premium web design & development for Indian SMBs. Fast delivery, honest pricing, real results.",
    url:         BASE_URL,
    siteName:    "VibeWebStudio",
    images: [
      {
        url:    "/og-image.jpg", // Create a 1200×630 image and place it in /public
        width:  1200,
        height: 630,
        alt:    "VibeWebStudio — Web Design & Development",
      },
    ],
    locale: "en_IN",
    type:   "website",
  },

  twitter: {
    card:        "summary_large_image",
    title:       "VibeWebStudio | Web Design India",
    description: "Websites for small businesses. Fast. Honest. Effective.",
    images:      ["/og-image.jpg"],
  },

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index:                    true,
    follow:                   true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type":    "ProfessionalService",
  name:       "VibeWebStudio",
  url:        BASE_URL,
  email:      "vibewebstudio91@gmail.com",
  description:
    "Web design and development studio for small businesses and startups in India.",
  areaServed:    "IN",
  priceRange:    "₹₹",
  serviceType:   ["Web Design", "Web Development", "SEO", "E-Commerce"],
  founder: [
    { "@type": "Person", name: "Ankit",  jobTitle: "Developer" },
    { "@type": "Person", name: "Krish",  jobTitle: "Designer"  },
  ],
  sameAs: ["https://www.instagram.com/vibewebstudio.in"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${dmSans.variable}`}
    >
      <body>
        {/* Fonts preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* App content */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
