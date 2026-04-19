"use client";

import { scrollTo } from "@/lib/interactions";

const NAV_COLS = [
  {
    heading: "Navigate",
    links: [
      { label:"Services",  section:"services"  },
      { label:"Portfolio", section:"portfolio" },
      { label:"Process",   section:"process"   },
      { label:"Team",      section:"team"      },
      { label:"Contact",   section:"contact"   },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label:"Instagram", href:"https://www.instagram.com/vibewebstudio.in", external:true },
      { label:"WhatsApp",  href:"https://wa.me/919XXXXXXXXX",                 external:true },
      { label:"Email",     href:"mailto:vibewebstudio91@gmail.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background:"var(--c-surface)", borderTop:"1px solid rgba(72,71,77,0.12)", padding:"4rem 1.5rem" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Brand */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="VibeWebStudio" style={{ height:56, width:"auto", objectFit:"contain", marginBottom:"0.75rem" }} />
          <p className="text-sm max-w-xs leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
            © {new Date().getFullYear()} VibeWebStudio.<br />
            Clean websites for real businesses.
          </p>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation">
          <div className="grid grid-cols-2 gap-10">
            {NAV_COLS.map((col) => (
              <div key={col.heading}>
                <h5 className="font-headline font-bold text-sm mb-4 uppercase tracking-widest" style={{ color:"var(--c-on-surface)" }}>
                  {col.heading}
                </h5>
                <ul className="space-y-3 text-sm" style={{ color:"var(--c-on-sv)" }}>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.section ? (
                        <a
                          href={`#${l.section}`}
                          onClick={(e) => { e.preventDefault(); scrollTo(l.section); }}
                          className="footer-link transition-colors duration-200"
                          style={{ color:"inherit" }}
                        >
                          {l.label}
                        </a>
                      ) : (
                        <a
                          href={l.href}
                          target={l.external ? "_blank" : undefined}
                          rel={l.external ? "noopener noreferrer" : undefined}
                          className="footer-link transition-colors duration-200"
                          style={{ color:"inherit" }}
                        >
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
