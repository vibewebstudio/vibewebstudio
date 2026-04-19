"use client";

import { scrollTo, createRipple, magnetic, tilt } from "@/lib/interactions";

const SERVICES = [
  {
    icon:  "web",
    title: "Website Design",
    desc:  "A design that looks professional and guides visitors toward contacting you or taking the next step. First impressions matter — we make sure yours is strong.",
    color: "var(--c-primary)",
    bg:    "rgba(187,158,255,0.12)",
    glow:  "rgba(187,158,255,0.15)",
  },
  {
    icon:  "code",
    title: "Web Development",
    desc:  "Your site is built with modern code — fast to load, easy to update, and works perfectly on any device. No technical headaches on your end.",
    color: "var(--c-secondary)",
    bg:    "rgba(0,207,252,0.12)",
    glow:  "rgba(0,207,252,0.15)",
  },
  {
    icon:  "insights",
    title: "UI/UX Improvements",
    desc:  "If your current site isn't bringing in enquiries, we can identify why and fix it. Small changes often lead to noticeably more leads.",
    color: "var(--c-tertiary)",
    bg:    "rgba(170,255,220,0.12)",
    glow:  "rgba(170,255,220,0.15)",
  },
];

export default function Services() {
  return (
    <section id="services" style={{ background:"var(--c-sc-low)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <div className="svc-dot" aria-hidden="true" style={{ position:"absolute", width:400, height:400, borderRadius:"50%", top:"0%", right:"-8%", background:"rgba(187,158,255,0.10)", filter:"blur(100px)", pointerEvents:"none", "--dur":"11s" }} />
      <div className="svc-dot" aria-hidden="true" style={{ position:"absolute", width:280, height:280, borderRadius:"50%", bottom:"5%", left:"-5%", background:"rgba(0,207,252,0.08)", filter:"blur(80px)", pointerEvents:"none", "--dur":"13s", animationDelay:"2s" }} />

      <div className="max-w-7xl mx-auto">
        <div className="mb-20 reveal-left">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-primary),transparent)", borderRadius:2 }} className="line-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-primary)" }}>What We Do</span>
          </div>
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--c-on-surface)" }}>
            Websites That Help You<br />Get More Leads
          </h2>
          <p className="max-w-lg leading-relaxed text-sm" style={{ color:"var(--c-on-sv)" }}>
            Everything focused on one thing — helping your business get more customers online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              {...tilt}
              className={`premium-card service-card rounded-2xl p-8 reveal reveal-delay-${i + 1}`}
              style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.15)", cursor:"default" }}
            >
              <div
                className="service-icon inline-flex items-center justify-center w-14 h-14 rounded-xl mb-7"
                style={{ background:s.bg, color:s.color, boxShadow:`0 0 20px ${s.glow}`, border:`1px solid ${s.glow}` }}
              >
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:"1.5rem" }}>{s.icon}</span>
              </div>
              <div className="mb-3" style={{ color:"rgba(72,71,77,0.5)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.15em" }}>
                0{i + 1}
              </div>
              <h3 className="font-headline font-bold text-xl mb-3" style={{ color:"var(--c-on-surface)" }}>{s.title}</h3>
              <p className="leading-relaxed text-sm" style={{ color:"var(--c-on-sv)" }}>{s.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold" style={{ color:s.color }}>
                <span>Learn more</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 reveal">
          <p className="text-sm mb-5 font-semibold" style={{ color:"var(--c-on-sv)" }}>
            Ready to grow your business online?
          </p>
          <button
            onClick={(e) => { createRipple(e); scrollTo("contact"); }}
            {...magnetic}
            className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg"
          >
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
}
