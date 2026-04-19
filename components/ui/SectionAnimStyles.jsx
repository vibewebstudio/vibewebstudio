// Server Component — inlines CSS keyframes at build time.
// Previously these were injected via dangerouslySetInnerHTML inside a client component,
// causing a flash of unstyled content on first paint. Moving them here ensures
// they are part of the initial HTML response.

export default function SectionAnimStyles() {
  return (
    <style>{`
      /* ── Hero entrance ── */
      @keyframes hero-badge-in { from{opacity:0;transform:translateY(-16px) scale(0.9)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes hero-h1-in   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      @keyframes hero-sub-in  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      @keyframes hero-cta-in  { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes scroll-bounce{ 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }

      .hero-badge { animation: hero-badge-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s  both }
      .hero-h1    { animation: hero-h1-in   0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both }
      .hero-sub   { animation: hero-sub-in  0.8s cubic-bezier(0.22,1,0.36,1) 0.75s both }
      .hero-note  { animation: hero-sub-in  0.7s cubic-bezier(0.22,1,0.36,1) 0.9s  both }
      .hero-cta   { animation: hero-cta-in  0.8s cubic-bezier(0.22,1,0.36,1) 1.05s both }
      .hero-avail { animation: hero-sub-in  0.7s cubic-bezier(0.22,1,0.36,1) 1.25s both }

      /* ── Floating service dots ── */
      @keyframes svc-float { 0%,100%{transform:translateY(0) scale(1);opacity:0.45} 50%{transform:translateY(-22px) scale(1.08);opacity:0.75} }
      .svc-dot { animation: svc-float var(--dur,10s) ease-in-out infinite }

      /* ── Portfolio shimmer sweep ── */
      @keyframes port-shimmer { 0%{transform:translateX(-150%) skewX(-18deg);opacity:0} 15%{opacity:1} 85%{opacity:1} 100%{transform:translateX(260%) skewX(-18deg);opacity:0} }
      .port-sweep { animation: port-shimmer 7s ease-in-out infinite; animation-delay:var(--sd,0s) }

      /* ── Portfolio expand icon on hover (CSS-only, no inline style) ── */
      .project-card:hover .port-expand { opacity:1 !important }

      /* ── Edge floating particles ── */
      @keyframes edge-float { 0%{transform:translateY(0) scale(1);opacity:0} 15%{opacity:0.65} 85%{opacity:0.3} 100%{transform:translateY(-80px) scale(0.4);opacity:0} }
      .edge-dot { width:5px;height:5px;border-radius:50%;position:absolute;pointer-events:none;animation:edge-float var(--dur,6s) ease-in-out infinite;animation-delay:var(--del,0s) }

      /* ── Process traveler ── */
      @keyframes proc-travel { 0%{left:2%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{left:98%;opacity:0} }
      .proc-travel { position:absolute;top:50%;transform:translateY(-50%);width:8px;height:8px;border-radius:50%;background:#bb9eff;box-shadow:0 0 10px #bb9eff,0 0 22px rgba(187,158,255,0.5);animation:proc-travel 4s linear infinite;pointer-events:none }

      /* ── Contact card glow pulse ── */
      @keyframes contact-border { 0%,100%{box-shadow:0 0 0 1px rgba(72,71,77,0.15)} 50%{box-shadow:0 0 36px rgba(187,158,255,0.18),0 0 0 1px rgba(187,158,255,0.35)} }
      .contact-card { animation: contact-border 4.5s ease-in-out infinite }

      /* ── Modal entrance ── */
      @keyframes modal-in { from{opacity:0;transform:scale(0.95) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
      .modal-content { animation: modal-in 0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards }

      /* ── CTA glow ring pulse ── */
      @keyframes cta-ring-pulse { 0%,100%{transform:scale(1);opacity:0} 50%{transform:scale(1.18);opacity:0.4} }
      .cta-ring::after { content:'';position:absolute;inset:-8px;border-radius:inherit;border:1px solid rgba(0,207,252,0.35);pointer-events:none;animation:cta-ring-pulse 2.8s ease-in-out infinite }

      /* ── Stat shimmer ── */
      @keyframes stat-shimmer { 0%,100%{opacity:1} 50%{opacity:0.75} }
      .stat-num { animation: stat-shimmer 3s ease-in-out infinite }

      /* ── Trust badge float ── */
      @keyframes trust-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      .trust-float { animation: trust-float 4s ease-in-out infinite }

      /* ── Scroll indicator ── */
      .scroll-indicator { animation: scroll-bounce 2s ease-in-out infinite }

      /* ── Premium card glow ── */
      .premium-card { position:relative;transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275),box-shadow 0.4s cubic-bezier(0.22,1,0.36,1),border-color 0.4s ease }
      .premium-card::before { content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(187,158,255,0.08),rgba(0,207,252,0.06));opacity:0;transition:opacity 0.4s ease;pointer-events:none;z-index:0 }
      .premium-card:hover::before { opacity:1 }
      .premium-card:hover { transform:translateY(-8px);box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(0,207,252,0.15),0 0 40px rgba(0,207,252,0.06) }

      /* ── Member avatar pulse ── */
      @keyframes member-glow { 0%,100%{box-shadow:0 0 0 0 rgba(187,158,255,0.15)} 50%{box-shadow:0 0 28px 4px rgba(187,158,255,0.3)} }
      .member-avatar { animation: member-glow 4s ease-in-out infinite }

      /* ── Line accent draw ── */
      @keyframes line-grow { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
      .line-accent { transform-origin:left;animation:line-grow 1s cubic-bezier(0.22,1,0.36,1) 0.5s both }

      /* ── Footer link hover ── */
      .footer-link:hover { color: var(--c-tertiary) !important }

      /* ── Hide cursor elements on touch devices ── */
      @media (pointer: coarse) {
        #vws-cursor, #vws-cursor-trail { display: none !important }
      }
    `}</style>
  );
}
