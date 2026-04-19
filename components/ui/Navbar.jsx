"use client";

import { useState, useEffect } from "react";
import { scrollTo, createRipple, magnetic } from "@/lib/interactions";

const NAV_LINKS = [
  { href: "services",  label: "Services"  },
  { href: "portfolio", label: "Portfolio" },
  { href: "process",   label: "Process"   },
  { href: "team",      label: "Team"      },
  { href: "contact",   label: "Contact"   },
];

export default function Navbar() {
  const [active, setActive]     = useState("services");
  const [mobileOpen, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    sections.forEach((s) => obs.observe(s));
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobile(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 glass${scrolled ? " nav-scrolled" : ""}`}
      style={{ borderBottom: "1px solid rgba(72,71,77,0.1)", transition: "background 0.4s, backdrop-filter 0.4s, box-shadow 0.4s" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-3">
        {/* Logo */}
        <a href="#" aria-label="VibeWebStudio — back to top" style={{ display:"flex", alignItems:"center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="VibeWebStudio" style={{ height:36, width:"auto", objectFit:"contain", borderRadius:"6px" }} />
        </a>

        {/* Desktop nav — <a> tags for SEO + keyboard nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={`#${l.href}`}
              onClick={(e) => { e.preventDefault(); scrollTo(l.href); }}
              aria-current={active === l.href ? "true" : undefined}
              className={`nav-link ${active === l.href ? "active" : ""}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { createRipple(e); scrollTo("contact"); }}
            {...magnetic}
            aria-label="Get your website — go to contact section"
            className="btn-primary px-6 py-2.5 rounded-full font-headline font-bold text-sm tracking-wide hidden sm:block"
          >
            Get Your Website
          </button>

          <button
            onClick={() => setMobile((p) => !p)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            <span style={{ width:22, height:2, background:"var(--c-on-surface)", display:"block", transition:"all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(3px,5px)" : "none" }} />
            <span style={{ width:22, height:2, background:"var(--c-on-surface)", display:"block", transition:"all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ width:22, height:2, background:"var(--c-on-surface)", display:"block", transition:"all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(3px,-5px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        id="mobile-nav"
        className="md:hidden glass overflow-hidden"
        style={{
          borderTop:  mobileOpen ? "1px solid rgba(72,71,77,0.15)" : "none",
          maxHeight:  mobileOpen ? "400px" : "0px",
          opacity:    mobileOpen ? 1 : 0,
          transform:  mobileOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          padding:    mobileOpen ? "1rem 1.5rem 1.5rem" : "0 1.5rem",
        }}
      >
        {NAV_LINKS.map((l, i) => (
          <a
            key={l.href}
            href={`#${l.href}`}
            onClick={(e) => { e.preventDefault(); scrollTo(l.href); setMobile(false); }}
            style={{
              display: "block",
              borderBottom: "1px solid rgba(72,71,77,0.1)",
              transitionDelay: mobileOpen ? `${i * 55}ms` : "0ms",
              transform:       mobileOpen ? "translateX(0)" : "translateX(-14px)",
              opacity:         mobileOpen ? 1 : 0,
              transition:      "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease",
            }}
            className="py-3 nav-link text-base"
          >
            {l.label}
          </a>
        ))}
        <button
          onClick={(e) => { createRipple(e); scrollTo("contact"); setMobile(false); }}
          style={{
            transitionDelay: mobileOpen ? "280ms" : "0ms",
            transform:       mobileOpen ? "translateY(0)" : "translateY(10px)",
            opacity:         mobileOpen ? 1 : 0,
            transition:      "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease",
          }}
          className="btn-primary w-full mt-4 py-3 rounded-full font-headline font-bold text-sm"
        >
          Get Your Website
        </button>
      </div>
    </nav>
  );
}
