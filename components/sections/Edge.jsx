// Server Component — no "use client" needed; uses only CSS hover effects

const POINTS = [
  {
    icon:  "speed",
    title: "Fast Delivery",
    desc:  "Most websites are ready in 1–3 weeks. You'll always know what's happening — no waiting in the dark.",
    color: "var(--c-secondary)",
  },
  {
    icon:  "devices",
    title: "Works on Every Device",
    desc:  "Your site will look great and work perfectly on phones, tablets, and desktops — no exceptions.",
    color: "var(--c-primary)",
  },
  {
    icon:  "brush",
    title: "Clean, Modern Design",
    desc:  "Professional websites that are easy to navigate. No clutter, no confusion.",
    color: "var(--c-tertiary)",
  },
  {
    icon:  "track_changes",
    title: "Focused on Results",
    desc:  "We think about your goals — more enquiries, more trust, more sales — and build with those in mind.",
    color: "var(--c-secondary)",
  },
];

const EDGE_DOTS = [
  { l:"12%", t:"80%", c:"rgba(0,207,252,0.5)",    dur:"6s",   del:"0s"   },
  { l:"28%", t:"90%", c:"rgba(187,158,255,0.4)",  dur:"8s",   del:"1.2s" },
  { l:"48%", t:"75%", c:"rgba(170,255,220,0.45)", dur:"5.5s", del:"2.4s" },
  { l:"65%", t:"85%", c:"rgba(0,207,252,0.35)",   dur:"7s",   del:"0.6s" },
  { l:"80%", t:"70%", c:"rgba(187,158,255,0.5)",  dur:"9s",   del:"3s"   },
  { l:"92%", t:"88%", c:"rgba(170,255,220,0.4)",  dur:"6.5s", del:"1.8s" },
];

export default function Edge() {
  return (
    <section id="why-us" style={{ background:"var(--c-surface)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      {EDGE_DOTS.map((d, i) => (
        <div key={i} aria-hidden="true" className="edge-dot" style={{ left:d.l, top:d.t, background:d.c, filter:"blur(1px)", boxShadow:`0 0 6px ${d.c}`, "--dur":d.dur, "--del":d.del }} />
      ))}
      <div aria-hidden="true" style={{ position:"absolute", width:600, height:600, borderRadius:"50%", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle, rgba(187,158,255,0.04) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div className="max-w-7xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="text-center mb-20 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-tertiary))", borderRadius:2 }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-tertiary)" }}>Why Work With Us</span>
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-tertiary),transparent)", borderRadius:2 }} />
          </div>
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--c-on-surface)" }}>
            Simple. Honest. Effective.
          </h2>
          <p className="mt-2 max-w-xl mx-auto text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
            We're a two-person team that cares about doing good work. Here's what you get when we work together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
          {POINTS.map((p, i) => (
            <div
              key={p.title}
              className={`premium-card group flex gap-5 p-7 rounded-2xl reveal reveal-delay-${i + 1}`}
              style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.15)" }}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width:52, height:52,
                  borderRadius:"0.75rem",
                  background:"var(--c-sc-highest)",
                  color: p.color,
                  boxShadow:"0 0 0 1px rgba(72,71,77,0.2)",
                  transition:"transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.4s ease",
                }}
              >
                <span className="material-symbols-outlined" aria-hidden="true">{p.icon}</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg mb-2" style={{ color:"var(--c-on-surface)" }}>{p.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 reveal">
          {[
            { icon:"verified",      text:"No Hidden Fees"      },
            { icon:"support_agent", text:"Post-Launch Support" },
            { icon:"lock",          text:"Secure & Fast"       },
          ].map((b) => (
            <div key={b.text} className="trust-float flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ background:"var(--c-sc-high)", border:"1px solid rgba(72,71,77,0.2)" }}>
              <span className="material-symbols-outlined icon-filled text-base" aria-hidden="true" style={{ color:"var(--c-tertiary)", fontSize:"1.1rem" }}>{b.icon}</span>
              <span className="text-xs font-bold" style={{ color:"var(--c-on-surface)" }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
