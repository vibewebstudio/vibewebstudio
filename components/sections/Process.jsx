"use client";

import { scrollTo, createRipple, magnetic, tilt } from "@/lib/interactions";
import ShootingStars from "@/components/ui/ShootingStars";

const STEPS = [
  { num:"1", title:"Discovery",   desc:"We start with a quick chat about your business and what you need. No jargon — just a simple conversation to get on the same page.", color:"var(--c-primary)",   text:"#1a003d" },
  { num:"2", title:"Design",      desc:"Krish creates your website design before any code is written. You give feedback, and we get it right together.",                    color:"var(--c-secondary)", text:"#003a48" },
  { num:"3", title:"Development", desc:"Once the design is approved, Ankit builds your site. Clean code, fast loading, and fully mobile-responsive.",                       color:"var(--c-tertiary)",  text:"#00654b" },
  { num:"4", title:"Launch",      desc:"We test everything, then go live. We're here to support you after launch so you can get started with confidence.",                  gradient:true },
];

export default function Process() {
  return (
    <section id="process" style={{ background:"#000", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <ShootingStars />
      <div className="max-w-7xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="text-center mb-20 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-tertiary))", borderRadius:2 }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-tertiary)" }}>How It Works</span>
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-tertiary),transparent)", borderRadius:2 }} />
          </div>
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--c-on-surface)" }}>A Simple, Clear Process</h2>
          <p className="max-w-lg mx-auto text-sm" style={{ color:"var(--c-on-sv)" }}>Four straightforward steps. No surprises, no confusion.</p>
        </div>
        <div className="relative">
          <div className="absolute top-[3.5rem] left-0 right-0 h-px hidden md:block" aria-hidden="true"
            style={{ background:"linear-gradient(90deg,transparent,rgba(72,71,77,0.4),rgba(72,71,77,0.4),transparent)" }}>
            <div className="proc-travel" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 stagger-children">
            {STEPS.map((s, i) => (
              <div key={s.title} {...tilt} className={`step-card premium-card rounded-2xl p-8 text-center reveal reveal-delay-${i + 1}`} style={{ background:"var(--c-surface)", border:"1px solid rgba(72,71,77,0.15)" }}>
                <div className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center font-headline font-black text-xl"
                  style={s.gradient ? { background:"linear-gradient(135deg,var(--c-primary),var(--c-secondary))", color:"#1a003d", boxShadow:"0 0 24px rgba(187,158,255,0.3)" } : { background:s.color, color:s.text, boxShadow:`0 0 20px ${s.color}30` }}
                  aria-hidden="true">{s.num}</div>
                <h4 className="font-headline font-bold text-xl mb-3" style={{ color:"var(--c-on-surface)" }}>{s.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-16 reveal">
          <p className="text-sm mb-5 font-semibold" style={{ color:"var(--c-on-sv)" }}>Ready to get started? It only takes a minute.</p>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic} className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg">Start Your Project</button>
        </div>
      </div>
    </section>
  );
}
