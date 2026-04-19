"use client";

import { useState } from "react";
import { scrollTo, createRipple, magnetic } from "@/lib/interactions";
import ShootingStars from "@/components/ui/ShootingStars";

const PROJECTS = [
  { img:"https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80", tags:[{ label:"Landing Page", color:"var(--c-primary)", bg:"rgba(187,158,255,0.2)" }, { label:"Concept", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }], title:"Demo Landing Page for Local Business", description:"A concept landing page built for a local services business. Designed to load fast, look trustworthy, and make it easy for visitors to get in touch. Everything you'd expect a professional site to do." },
  { img:"https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", tags:[{ label:"Business Website", color:"var(--c-tertiary)", bg:"rgba(170,255,220,0.2)" }, { label:"Concept", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }], title:"Sample Business Website (Concept)", description:"A multi-page concept for a small business — homepage, services, and contact. Built to look credible, load quickly, and work well for people browsing on their phones." },
  { img:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", tags:[{ label:"Startup Website", color:"var(--c-primary)", bg:"rgba(187,158,255,0.2)" }, { label:"Concept", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }], title:"Startup Website Design", description:"A website concept for an early-stage startup. Clean layout focused on showcasing the product and encouraging visitors to sign up or get in touch." },
];

export default function Portfolio() {
  const [selected, setSelected] = useState(null);
  return (
    <section id="portfolio" style={{ background:"var(--c-sc-low)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <ShootingStars />
      <div className="port-sweep" aria-hidden="true" style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 40%,rgba(187,158,255,0.04) 50%,transparent 60%)", pointerEvents:"none", zIndex:0, "--sd":"0s" }} />
      <div className="port-sweep" aria-hidden="true" style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 40%,rgba(0,207,252,0.03) 50%,transparent 60%)", pointerEvents:"none", zIndex:0, "--sd":"3.5s" }} />
      <div className="max-w-7xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="text-center mb-4 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-secondary))", borderRadius:2 }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-secondary)" }}>Sample Work</span>
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-secondary),transparent)", borderRadius:2 }} />
          </div>
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--c-on-surface)" }}>Demo Projects</h2>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mb-2" style={{ background:"rgba(187,158,255,0.08)", border:"1px solid rgba(187,158,255,0.2)" }}>
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:"1rem", color:"var(--c-primary)" }}>info</span>
            <p className="text-xs font-semibold" style={{ color:"var(--c-on-sv)" }}>These are sample projects created to showcase our design and development work — not live client sites.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {PROJECTS.map((p, i) => (
            <button key={p.title} onClick={() => setSelected(p)} aria-label={`View details for ${p.title}`}
              className={`project-card relative rounded-2xl overflow-hidden aspect-video text-left reveal reveal-delay-${i + 1}`}
              style={{ background:"var(--c-sc-high)", display:"block", cursor:"pointer", width:"100%", boxShadow:"0 8px 40px rgba(0,0,0,0.3)", border:"1px solid rgba(72,71,77,0.15)", transition:"transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              <div className="project-overlay" aria-hidden="true" />
              <div className="project-info">
                <div className="flex flex-wrap gap-2 mb-2">
                  {p.tags.map((tag) => (<span key={tag.label} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:tag.bg, color:tag.color, backdropFilter:"blur(8px)" }}>{tag.label}</span>))}
                </div>
                <h3 className="font-headline font-bold text-sm leading-snug" style={{ color:"#fff" }}>{p.title}</h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color:"rgba(255,255,255,0.7)" }}>Click to read more</p>
              </div>
              <div className="port-expand" aria-hidden="true" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:48, height:48, borderRadius:"50%", background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity 0.3s ease" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-16 reveal">
          <p className="text-sm mb-5 font-semibold" style={{ color:"var(--c-on-sv)" }}>Interested in seeing what we can build for you?</p>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic} className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg">Discuss Your Project</button>
        </div>
      </div>
      {selected && (
        <div role="dialog" aria-modal="true" aria-label={selected.title} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)" }} onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="modal-content relative max-w-2xl w-full rounded-3xl overflow-hidden" style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.25)" }}>
            <div style={{ aspectRatio:"16/9", overflow:"hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.img} alt={selected.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {selected.tags.map((tag) => (<span key={tag.label} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background:tag.bg, color:tag.color }}>{tag.label}</span>))}
              </div>
              <h3 className="font-headline font-bold text-2xl mb-3" style={{ color:"var(--c-on-surface)" }}>{selected.title}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--c-on-sv)" }}>{selected.description}</p>
              <button onClick={(e) => { createRipple(e); setSelected(null); scrollTo("contact"); }} className="btn-primary px-8 py-3 rounded-full font-headline font-bold text-sm">Build Something Like This</button>
            </div>
            <button onClick={() => setSelected(null)} aria-label="Close project details" className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background:"rgba(0,0,0,0.5)", color:"var(--c-on-surface)", border:"1px solid rgba(72,71,77,0.3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
