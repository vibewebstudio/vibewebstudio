"use client";

import { scrollTo, createRipple, magnetic, tilt } from "@/lib/interactions";
import ShootingStars from "@/components/ui/ShootingStars";

const MEMBERS = [
  { name:"Ankit", role:"Developer", emoji:"💻", tagline:"I handle development — building fast, reliable websites.", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.08)",   border:"rgba(0,207,252,0.2)",   glow:"rgba(0,207,252,0.25)",   skills:["Next.js","React","Performance","Mobile-Ready"] },
  { name:"Krish", role:"Designer",  emoji:"🎨", tagline:"I handle design — creating clean, user-friendly interfaces.",  color:"var(--c-primary)",   bg:"rgba(187,158,255,0.08)", border:"rgba(187,158,255,0.2)", glow:"rgba(187,158,255,0.25)", skills:["UI/UX","Figma","Branding","Visual Design"] },
];

export default function TeamSection() {
  return (
    <section id="team" style={{ background:"var(--c-sc-low)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <ShootingStars />
      <div aria-hidden="true" style={{ position:"absolute", width:600, height:600, borderRadius:"50%", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle, rgba(187,158,255,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div className="max-w-5xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="text-center mb-16 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-primary))", borderRadius:2 }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-primary)" }}>Meet the Team</span>
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-primary),transparent)", borderRadius:2 }} />
          </div>
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--c-on-surface)" }}>
            Hi, we&apos;re <em className="neon-text not-italic">Ankit &amp; Krish</em>
          </h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
            We design and build modern websites for businesses — working together so you get great design <em>and</em> great code in one package.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {MEMBERS.map((m, i) => (
            <div key={m.name} {...tilt} className={`premium-card rounded-3xl p-8 reveal reveal-delay-${i + 1}`} style={{ background:m.bg, border:`1px solid ${m.border}`, cursor:"default" }}>
              <div className="member-avatar inline-flex items-center justify-center mb-6 rounded-2xl" style={{ width:72, height:72, background:`linear-gradient(135deg, ${m.bg}, rgba(255,255,255,0.04))`, border:`1.5px solid ${m.border}`, fontSize:"2rem", boxShadow:`0 0 24px ${m.glow}` }}>{m.emoji}</div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${m.border}` }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color:m.color }}>{m.role}</span>
              </div>
              <h3 className="font-headline font-black text-3xl mb-3" style={{ color:"var(--c-on-surface)" }}>{m.name}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--c-on-sv)" }}>{m.tagline}</p>
              <div className="flex flex-wrap gap-2">
                {m.skills.map((skill) => (<span key={skill} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(72,71,77,0.25)", color:"var(--c-on-sv)" }}>{skill}</span>))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center reveal" style={{ padding:"2rem 2rem", background:"rgba(255,255,255,0.03)", borderRadius:"1.5rem", border:"1px solid rgba(72,71,77,0.15)" }}>
          <p className="font-headline font-bold text-lg mb-6" style={{ color:"var(--c-on-surface)" }}>&ldquo;We focus on simple, effective websites that actually help businesses grow.&rdquo;</p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[{ emoji:"🎯", text:"Results-Driven" }, { emoji:"⚡", text:"Fast Turnaround" }, { emoji:"💬", text:"Direct Communication" }].map((item) => (
              <div key={item.text} className="trust-float flex items-center gap-2 px-4 py-2.5 rounded-full" style={{ background:"var(--c-sc-high)", border:"1px solid rgba(72,71,77,0.2)" }}>
                <span style={{ fontSize:"1rem" }}>{item.emoji}</span>
                <span className="text-xs font-bold" style={{ color:"var(--c-on-surface)" }}>{item.text}</span>
              </div>
            ))}
          </div>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic} className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg">Let&apos;s Work Together</button>
        </div>
      </div>
    </section>
  );
}
