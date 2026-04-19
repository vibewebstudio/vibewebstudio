"use client";

import PlexusCanvas from "@/components/ui/PlexusCanvas";
import { scrollTo, createRipple, magnetic } from "@/lib/interactions";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-shift"
      style={{ background: "var(--c-surface)" }}
    >
      <PlexusCanvas />

      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(187,158,255,0.06) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 80% at 80% 80%, rgba(0,207,252,0.05) 0%, transparent 60%)," +
            "radial-gradient(ellipse 40% 50% at 20% 20%, rgba(170,255,220,0.04) 0%, transparent 60%)," +
            "linear-gradient(to bottom, transparent 60%, rgba(14,14,19,0.9) 100%)",
        }}
      />

      <div className="orb parallax-el" data-speed="-0.08" aria-hidden="true"
        style={{ width:600, height:600, top:"-10%", left:"-12%", background:"rgba(187,158,255,0.09)", animationDelay:"0s", zIndex:1 }} />
      <div className="orb parallax-el" data-speed="0.10" aria-hidden="true"
        style={{ width:500, height:500, bottom:"-5%", right:"-8%", background:"rgba(0,207,252,0.07)", animationDelay:"3s", zIndex:1 }} />
      <div className="orb parallax-el" data-speed="-0.05" aria-hidden="true"
        style={{ width:300, height:300, top:"30%", right:"15%", background:"rgba(170,255,220,0.05)", animationDelay:"6s", zIndex:1 }} />

      <div className="relative max-w-5xl mx-auto text-center" style={{ zIndex:10 }}>

        <div
          className="hero-badge inline-flex items-center gap-2.5 px-5 py-2 mb-10 rounded-full"
          style={{ background:"rgba(25,25,31,0.8)", border:"1px solid rgba(0,207,252,0.3)", backdropFilter:"blur(20px)", boxShadow:"0 0 20px rgba(0,207,252,0.08)" }}
        >
          <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--c-secondary)", display:"inline-block", boxShadow:"0 0 10px var(--c-secondary), 0 0 20px rgba(0,207,252,0.5)", animation:"neon-flow 2s ease infinite" }} />
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color:"var(--c-secondary)" }}>
            Web Design &amp; Development — India
          </span>
        </div>

        <h1
          className="hero-h1 font-headline font-black tracking-tighter mb-6"
          style={{ fontSize:"clamp(2.8rem,8.5vw,6.5rem)", lineHeight:1.02, color:"var(--c-on-surface)" }}
        >
          We Design &amp; Build Websites
          <br />
          <em className="neon-text not-italic"> That Get You More Customers</em>
        </h1>

        <p className="hero-sub text-lg md:text-xl max-w-2xl mx-auto mb-3 font-light leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
          Clean, fast, mobile-ready websites for small businesses and startups — built by a designer and a developer working together.
        </p>

        <p className="hero-note text-sm mb-10 font-semibold" style={{ color:"var(--c-secondary)" }}>
          No commitment. Just ideas for your business.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={(e) => { createRipple(e); scrollTo("contact"); }}
            {...magnetic}
            aria-label="Get your website — go to contact section"
            className="btn-primary cta-ring relative w-full sm:w-auto px-12 py-4 rounded-full font-headline font-bold text-lg"
          >
            Get Your Website
          </button>
          <button
            onClick={(e) => { createRipple(e); scrollTo("portfolio"); }}
            aria-label="See our sample work"
            className="btn-ghost w-full sm:w-auto px-12 py-4 rounded-full font-headline font-bold text-lg"
          >
            See Sample Work
          </button>
        </div>

        <p className="hero-avail text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"rgba(170,255,220,0.75)" }}>
          ✦ Currently accepting 2 new projects this month
        </p>

        <div
          className="hero-avail flex items-center justify-center gap-8 mt-10 pt-10"
          style={{ borderTop:"1px solid rgba(72,71,77,0.15)" }}
        >
          {[
            { num:"48h",  label:"Avg. Response" },
            { num:"100%", label:"Mobile-Ready"  },
            { num:"1–3wk",label:"Delivery"      },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="stat-num font-headline font-black text-2xl" style={{ color:"var(--c-on-surface)" }}>{s.num}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color:"var(--c-on-sv)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-indicator absolute bottom-8 left-1/2 flex flex-col items-center gap-2" style={{ zIndex:10 }} aria-hidden="true">
        <div style={{ width:1, height:48, background:"linear-gradient(to bottom, transparent, rgba(172,170,177,0.5))" }} />
        <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--c-on-sv)", boxShadow:"0 0 8px rgba(172,170,177,0.5)" }} />
      </div>
    </section>
  );
}
