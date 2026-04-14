"use client";

import { useState, useEffect, useRef } from "react";

// ── Scroll helper ──────────────────────────────────────────────────────────
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ── SCROLL REVEAL FADE UP (#2) ─────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ── CURSOR GLOW TRAIL (#11) ────────────────────────────────────────────────
function useCursor() {
  useEffect(() => {
    const cursor = document.getElementById("vws-cursor");
    const trail  = document.getElementById("vws-cursor-trail");
    if (!cursor || !trail) return;
    let mx = 0, my = 0, tx = 0, ty = 0, raf;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    };
    function animTrail() {
      tx += (mx - tx) * 0.1;
      ty += (my - ty) * 0.1;
      trail.style.transform = `translate(${tx - 16}px, ${ty - 16}px)`;
      raf = requestAnimationFrame(animTrail);
    }
    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animTrail);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
}

// ── PARALLAX SCROLL (#9) ───────────────────────────────────────────────────
function useParallax() {
  useEffect(() => {
    const els = document.querySelectorAll(".parallax-el");
    const onScroll = () => {
      const y = window.scrollY;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.12");
        el.style.transform = `translateY(${y * speed}px) scale(${el.dataset.scale || 1}) translateY(${el.dataset.baseY || 0}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

// ── BACK TO TOP (#20) ──────────────────────────────────────────────────────
function useBackToTop() {
  useEffect(() => {
    const btn = document.getElementById("vws-back-top");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("visible", window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

// ── BUTTON RIPPLE EFFECT (#12) ─────────────────────────────────────────────
function createRipple(e) {
  const btn  = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const r    = document.createElement("span");
  r.className = "vws-ripple";
  const size  = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

// ── MAGNETIC BUTTON EFFECT (#4) ────────────────────────────────────────────
const magnetic = {
  onMouseMove: (e) => {
    const btn  = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x    = (e.clientX - rect.left - rect.width  / 2) * 0.28;
    const y    = (e.clientY - rect.top  - rect.height / 2) * 0.28;
    btn.style.transform = `translate(${x}px, ${y}px) scale(1.05) translateY(-2px)`;
    btn.style.boxShadow = "0 0 56px rgba(0,207,252,0.5)";
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "";
  },
};

// ── CARD TILT HOVER (#8) ───────────────────────────────────────────────────
const tilt = {
  onMouseMove: (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width;
    const y    = (e.clientY - rect.top)  / rect.height;
    const tX   = (y - 0.5) * -10;
    const tY   = (x - 0.5) *  10;
    card.style.transform = `perspective(800px) rotateX(${tX}deg) rotateY(${tY}deg) translateY(-6px)`;
  },
  onMouseLeave: (e) => { e.currentTarget.style.transform = ""; },
};

// ── Contact Form Hook ──────────────────────────────────────────────────────
function useContactForm() {
  const [status, setStatus]           = useState("idle");
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [company, setCompany]         = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget]           = useState("");
  const [message, setMessage]         = useState("");
  const [errors, setErrors]           = useState({});
  const [touched, setTouched]         = useState({});

  function validate(fields) {
    const errs = {};
    if (!fields.name?.trim())    errs.name    = "Name is required";
    if (!fields.email?.trim())   errs.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "Enter a valid email";
    if (!fields.message?.trim()) errs.message = "Tell us about your project";
    return errs;
  }

  function touch(field) {
    setTouched(t => ({ ...t, [field]: true }));
    const current = { name, email, message };
    const errs = validate(current);
    setErrors(e => ({ ...e, [field]: errs[field] || "" }));
  }

  async function submit(e) {
    e.preventDefault();
    const fields = { name, email, company, projectType, budget, message };
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ name: true, email: true, message: true });
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setName(""); setEmail(""); setCompany(""); setProjectType(""); setBudget(""); setMessage("");
      setErrors({}); setTouched({});
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  }

  return { name, setName, email, setEmail, company, setCompany, projectType, setProjectType, budget, setBudget, message, setMessage, status, submit, errors, touched, touch };
}

// ── SECTION ANIMATION KEYFRAMES ───────────────────────────────────────────
function SectionAnimStyles() {
  const css = `
    @keyframes svc-float{0%,100%{transform:translateY(0) scale(1);opacity:0.45}50%{transform:translateY(-22px) scale(1.08);opacity:0.75}}
    .svc-dot{animation:svc-float var(--dur,10s) ease-in-out infinite;}
    @keyframes port-shimmer{0%{transform:translateX(-150%) skewX(-18deg);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(260%) skewX(-18deg);opacity:0}}
    .port-sweep{animation:port-shimmer 7s ease-in-out infinite;animation-delay:var(--sd,0s);}
    @keyframes edge-float{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:0.65}85%{opacity:0.3}100%{transform:translateY(-80px) scale(0.4);opacity:0}}
    .edge-dot{width:5px;height:5px;border-radius:50%;position:absolute;pointer-events:none;animation:edge-float var(--dur,6s) ease-in-out infinite;animation-delay:var(--del,0s);}
    @keyframes proc-travel{0%{left:2%;opacity:0}5%{opacity:1}95%{opacity:1}100%{left:98%;opacity:0}}
    .proc-travel{position:absolute;top:50%;transform:translateY(-50%);width:8px;height:8px;border-radius:50%;background:#bb9eff;box-shadow:0 0 10px #bb9eff,0 0 22px rgba(187,158,255,0.5);animation:proc-travel 4s linear infinite;pointer-events:none;}
    @keyframes contact-border{0%,100%{box-shadow:0 0 0 1px rgba(72,71,77,0.15)}50%{box-shadow:0 0 36px rgba(187,158,255,0.18),0 0 0 1px rgba(187,158,255,0.35)}}
    .contact-card{animation:contact-border 4.5s ease-in-out infinite;}
    @keyframes logo-shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    .footer-logo{background:linear-gradient(90deg,var(--c-on-surface) 20%,var(--c-secondary) 45%,var(--c-primary) 60%,var(--c-on-surface) 80%);background-size:220% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:logo-shimmer 6s ease-in-out infinite;}
    @keyframes modal-in{from{opacity:0;transform:scale(0.95) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .modal-content{animation:modal-in 0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards;}
    @keyframes field-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
    .field-shake{animation:field-shake 0.3s ease;}
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

// ── PLEXUS NETWORK CANVAS ─────────────────────────────────────────────────
function PlexusCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W, H;
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const visObserver = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0 }
    );
    visObserver.observe(canvas);

    const PALETTES = [
      [0, 207, 252],
      [187, 158, 255],
      [170, 255, 220],
      [120, 180, 255],
    ];

    const NODE_COUNT = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 160);
    const CONNECT_DIST = 145;
    const CURSOR_RADIUS = 130;
    const CURSOR_FORCE  = 0.018;

    const nodes = Array.from({ length: NODE_COUNT }, () => {
      const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      return {
        x:  Math.random() * (window.innerWidth || 1440),
        y:  Math.random() * (window.innerHeight || 800),
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r:  Math.random() * 2.2 + 0.8,
        pal,
        pulse:     Math.random() * Math.PI * 2,
        waveAmp:   Math.random() * 18 + 6,
        waveFreq:  Math.random() * 0.0008 + 0.0004,
        wavePhase: Math.random() * Math.PI * 2,
      };
    });

    const SPARK_COUNT = 55;
    const sparks = Array.from({ length: SPARK_COUNT }, () => ({
      x:    Math.random() * (window.innerWidth || 1440),
      y:    Math.random() * (window.innerHeight || 800),
      vx:   (Math.random() - 0.5) * 0.6,
      vy:   (Math.random() - 0.5) * 0.6,
      life: Math.random(),
      pal:  PALETTES[Math.floor(Math.random() * PALETTES.length)],
    }));

    const ripples = [];
    let t = 0;
    let raf;

    function draw() {
      raf = requestAnimationFrame(draw);
      if (pausedRef.current) return;
      t++;
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.fillStyle = "rgba(14,14,19,0.32)";
      ctx.fillRect(0, 0, cw, ch);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.y += Math.sin(t * n.waveFreq * 60 + n.wavePhase) * 0.12;
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_RADIUS && dist > 0) {
          const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE;
          n.vx += (dx / dist) * force * 60;
          n.vy += (dy / dist) * force * 60;
        }
        n.vx *= 0.985; n.vy *= 0.985;
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = cw + 20; else if (n.x > cw + 20) n.x = -20;
        if (n.y < -20) n.y = ch + 20; else if (n.y > ch + 20) n.y = -20;
        n.pulse += 0.025;
        const glow = 0.55 + 0.45 * Math.sin(n.pulse);
        const [r, g, b] = n.pal;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.22 * glow})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.85 * glow})`;
        ctx.shadowBlur = 8 * glow; ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i], nj = nodes[j];
          const dx = ni.x - nj.x, dy = ni.y - nj.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > CONNECT_DIST) continue;
          const alpha = (1 - d / CONNECT_DIST) * 0.28;
          const [r1, g1, b1] = ni.pal, [r2, g2, b2] = nj.pal;
          const lg = ctx.createLinearGradient(ni.x, ni.y, nj.x, nj.y);
          lg.addColorStop(0, `rgba(${r1},${g1},${b1},${alpha})`);
          lg.addColorStop(1, `rgba(${r2},${g2},${b2},${alpha})`);
          ctx.beginPath(); ctx.moveTo(ni.x, ni.y); ctx.lineTo(nj.x, nj.y);
          ctx.strokeStyle = lg; ctx.lineWidth = 0.65; ctx.stroke();
          const phase = (t * 0.012 + i * 0.31 + j * 0.17) % 1;
          const px = ni.x + (nj.x - ni.x) * phase;
          const py = ni.y + (nj.y - ni.y) * phase;
          ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 2})`; ctx.fill();
        }
      }

      for (const s of sparks) {
        s.x += s.vx; s.y += s.vy; s.life -= 0.003;
        if (s.life <= 0) {
          s.x = Math.random() * cw; s.y = Math.random() * ch;
          s.vx = (Math.random() - 0.5) * 0.6; s.vy = (Math.random() - 0.5) * 0.6;
          s.life = 0.6 + Math.random() * 0.4;
          s.pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        }
        const [r, g, b] = s.pal;
        ctx.beginPath(); ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${s.life * 0.6})`; ctx.fill();
      }

      if (mx > 0 && mx < cw) {
        if (t % 28 === 0) ripples.push({ x: mx, y: my, r: 0, life: 1 });
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, CURSOR_RADIUS);
        halo.addColorStop(0, "rgba(187,158,255,0.12)");
        halo.addColorStop(0.5, "rgba(0,207,252,0.06)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(mx, my, CURSOR_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = halo; ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.8; rp.life -= 0.028;
        if (rp.life <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(187,158,255,${rp.life * 0.28})`; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      visObserver.disconnect();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block", pointerEvents:"all" }} />
  );
}

// ── NAVBAR ─────────────────────────────────────────────────────────────────
function Navbar() {
  const [active, setActive]     = useState("services");
  const [mobileOpen, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections  = document.querySelectorAll("section[id]");
    const observer  = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const links = [
    { href: "services",  label: "Services"  },
    { href: "portfolio", label: "Portfolio" },
    { href: "process",   label: "Process"   },
    { href: "contact",   label: "Contact"   },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 glass${scrolled ? " nav-scrolled" : ""}`}
      style={{ borderBottom: "1px solid rgba(72,71,77,0.1)", transition: "background 0.4s, backdrop-filter 0.4s, box-shadow 0.4s" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-3">
        <a href="#" aria-label="VibeWebStudio home" style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="VibeWebStudio"
            style={{ height: 36, width: "auto", objectFit: "contain", borderRadius: "6px" }}
          />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button key={l.href} onClick={() => scrollTo(l.href)}
              aria-label={`Navigate to ${l.label} section`}
              className={`nav-link ${active === l.href ? "active" : ""}`}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { createRipple(e); scrollTo("contact"); }}
            {...magnetic}
            aria-label="Start your project"
            className="btn-primary px-6 py-2.5 rounded-full font-headline font-bold text-sm tracking-wide hidden sm:block">
            Start Your Project
          </button>
          <button onClick={() => setMobile(p => !p)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}>
            <span style={{ width:22, height:2, background:"var(--c-on-surface)", display:"block", transition:"all 0.3s",
              transform: mobileOpen ? "rotate(45deg) translate(3px,5px)" : "none" }} />
            <span style={{ width:22, height:2, background:"var(--c-on-surface)", display:"block", transition:"all 0.3s",
              opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ width:22, height:2, background:"var(--c-on-surface)", display:"block", transition:"all 0.3s",
              transform: mobileOpen ? "rotate(-45deg) translate(3px,-5px)" : "none" }} />
          </button>
        </div>
      </div>

      <div
        className="md:hidden glass overflow-hidden"
        style={{
          borderTop: mobileOpen ? "1px solid rgba(72,71,77,0.15)" : "none",
          maxHeight: mobileOpen ? "360px" : "0px",
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
          transition: "max-height 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          padding: mobileOpen ? "1rem 1.5rem 1.5rem" : "0 1.5rem",
        }}
      >
        {links.map((l, i) => (
          <button key={l.href} onClick={() => { scrollTo(l.href); setMobile(false); }}
            aria-label={`Navigate to ${l.label} section`}
            style={{
              borderBottom:"1px solid rgba(72,71,77,0.1)",
              transitionDelay: mobileOpen ? `${i * 55}ms` : "0ms",
              transform: mobileOpen ? "translateX(0)" : "translateX(-14px)",
              opacity: mobileOpen ? 1 : 0,
              transition: "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease",
            }}
            className="block w-full text-left py-3 nav-link text-base">
            {l.label}
          </button>
        ))}
        <button
          onClick={(e) => { createRipple(e); scrollTo("contact"); setMobile(false); }}
          style={{
            transitionDelay: mobileOpen ? "220ms" : "0ms",
            transform: mobileOpen ? "translateY(0)" : "translateY(10px)",
            opacity: mobileOpen ? 1 : 0,
            transition: "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease",
          }}
          className="btn-primary w-full mt-4 py-3 rounded-full font-headline font-bold text-sm">
          Start Your Project
        </button>
      </div>
    </nav>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 px-6 overflow-hidden"
      style={{ background: "var(--c-surface)" }}>
      <PlexusCanvas />
      <div aria-hidden="true" style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(14,14,19,0.75) 100%)" }} />
      <div className="orb parallax-el" data-speed="-0.08"
        style={{ width:480,height:480,top:"8%",left:"-8%",background:"rgba(187,158,255,0.10)",animationDelay:"0s",zIndex:1 }} />
      <div className="orb parallax-el" data-speed="0.10"
        style={{ width:400,height:400,bottom:"4%",right:"-6%",background:"rgba(0,207,252,0.08)",animationDelay:"3s",zIndex:1 }} />
      <div className="relative max-w-5xl mx-auto text-center" style={{ zIndex: 10 }}>
        <span className="reveal inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-[0.2em] uppercase rounded-full"
          style={{ background:"var(--c-sc-high)", color:"var(--c-secondary)", border:"1px solid rgba(0,207,252,0.25)" }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:"var(--c-secondary)",display:"inline-block",
            boxShadow:"0 0 8px var(--c-secondary)",animation:"neon-flow 2s ease infinite" }} />
          Web Design &amp; Development Studio
        </span>
        <h1 className="reveal reveal-delay-1 font-headline font-black tracking-tighter mb-8 leading-[1.05]"
          style={{ fontSize:"clamp(2.8rem,8vw,6rem)", color:"var(--c-on-surface)" }}>
          Websites That Grow
          <em className="neon-text not-italic"> Your Business</em>
        </h1>
        <p className="reveal reveal-delay-2 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          style={{ color:"var(--c-on-sv)" }}>
          We design and build clean, fast, mobile-ready websites that attract the right customers and help your business grow. No fluff — just results.
        </p>
        <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-5">
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            aria-label="Start your project with VibeWebStudio"
            className="btn-primary w-full sm:w-auto px-10 py-4 rounded-full font-headline font-bold text-lg">
            Start Your Project
          </button>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }}
            aria-label="Contact us"
            className="btn-ghost w-full sm:w-auto px-10 py-4 rounded-full font-headline font-bold text-lg">
            Contact Us
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{ opacity:0.35, zIndex:10 }} aria-hidden="true">
        <div style={{ width:1,height:48,background:"linear-gradient(to bottom,transparent,var(--c-on-sv))" }} />
        <div style={{ width:5,height:5,borderRadius:"50%",marginTop:4,background:"var(--c-on-sv)" }} />
      </div>
    </section>
  );
}

// ── SERVICES ───────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      icon:"web",
      title:"Website Design",
      desc:"We create clean, modern designs that make a strong first impression and guide visitors toward taking action — whether that's calling you, buying, or filling out a form.",
      color:"var(--c-primary)",
      bg:"rgba(187,158,255,0.1)",
    },
    {
      icon:"code",
      title:"Web Development",
      desc:"Your site is built with modern code — fast to load, easy to update, and ready to work on any device. We focus on quality so you don't have to worry about the technical side.",
      color:"var(--c-secondary)",
      bg:"rgba(0,207,252,0.1)",
    },
    {
      icon:"insights",
      title:"UI/UX Optimisation",
      desc:"We look at how visitors use your site and make it easier for them to find what they need. Better user experience means more enquiries, more sales, and happier customers.",
      color:"var(--c-tertiary)",
      bg:"rgba(170,255,220,0.1)",
    },
  ];

  return (
    <section id="services" style={{ background:"var(--c-sc-low)", padding:"8rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <div className="svc-dot" style={{ position:"absolute", width:300, height:300, borderRadius:"50%", top:"5%", right:"-5%", background:"rgba(187,158,255,0.12)", filter:"blur(90px)", pointerEvents:"none", "--dur":"10s" }} />
      <div className="svc-dot" style={{ position:"absolute", width:200, height:200, borderRadius:"50%", bottom:"10%", left:"-3%", background:"rgba(0,207,252,0.10)", filter:"blur(70px)", pointerEvents:"none", "--dur":"13s", animationDelay:"2s" }} />
      <div className="svc-dot" style={{ position:"absolute", width:140, height:140, borderRadius:"50%", top:"50%", left:"45%", background:"rgba(170,255,220,0.08)", filter:"blur(50px)", pointerEvents:"none", "--dur":"8s", animationDelay:"4s" }} />
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 reveal-left">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color:"var(--c-primary)" }}>What We Do</span>
          <h2 className="font-headline font-black tracking-tighter" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--c-on-surface)" }}>Built to Perform</h2>
          <p className="mt-4 max-w-xl leading-relaxed text-sm" style={{ color:"var(--c-on-sv)" }}>
            Every website we build has one goal — to help your business succeed. We focus on what actually matters: clear design, fast performance, and real results.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {services.map((s, i) => (
            <div key={s.title} {...tilt} className={`service-card rounded-xl p-8 reveal reveal-delay-${i + 1}`}>
              <div className="service-icon inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6"
                style={{ background: s.bg, color: s.color }}>
                <span className="material-symbols-outlined" aria-hidden="true">{s.icon}</span>
              </div>
              <h3 className="font-headline font-bold text-2xl mb-3" style={{ color:"var(--c-on-surface)" }}>{s.title}</h3>
              <p className="leading-relaxed text-sm" style={{ color:"var(--c-on-sv)" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA between sections */}
        <div className="text-center mt-14 reveal">
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            className="btn-primary px-10 py-4 rounded-full font-headline font-bold text-lg">
            Get Your Website
          </button>
        </div>
      </div>
    </section>
  );
}

// ── WHY CHOOSE US (EDGE) ──────────────────────────────────────────────────
function Edge() {
  const points = [
    {
      icon:"speed",
      title:"Fast Delivery",
      desc:"Most websites are ready in 1–3 weeks. We work in focused sprints and keep you updated throughout — so you always know where things stand.",
      color:"var(--c-secondary)",
    },
    {
      icon:"devices",
      title:"Works on Every Device",
      desc:"Your customers browse on phones, tablets, and desktops. Every site we build looks great and works perfectly on all screen sizes, without compromise.",
      color:"var(--c-primary)",
    },
    {
      icon:"brush",
      title:"Clean, Modern Design",
      desc:"We design websites that look professional and feel easy to use. No clutter, no confusion — just a clear, attractive site that represents your brand well.",
      color:"var(--c-tertiary)",
    },
    {
      icon:"track_changes",
      title:"Business-Focused Approach",
      desc:"We don't just make things look good. We think about your goals — more enquiries, more sales, more trust — and build your website with those outcomes in mind.",
      color:"var(--c-secondary)",
    },
  ];

  return (
    <section id="why-us" style={{ background:"var(--c-surface)", padding:"8rem 1.5rem", position:"relative", overflow:"hidden" }}>
      {[
        { l:"12%", t:"80%", c:"rgba(0,207,252,0.5)",    dur:"6s",  del:"0s"   },
        { l:"28%", t:"90%", c:"rgba(187,158,255,0.4)",  dur:"8s",  del:"1.2s" },
        { l:"48%", t:"75%", c:"rgba(170,255,220,0.45)", dur:"5.5s",del:"2.4s" },
        { l:"65%", t:"85%", c:"rgba(0,207,252,0.35)",   dur:"7s",  del:"0.6s" },
        { l:"80%", t:"70%", c:"rgba(187,158,255,0.5)",  dur:"9s",  del:"3s"   },
        { l:"92%", t:"88%", c:"rgba(170,255,220,0.4)",  dur:"6.5s",del:"1.8s" },
      ].map((d, i) => (
        <div key={i} aria-hidden="true" className="edge-dot" style={{ left:d.l, top:d.t, background:d.c,
          filter:`blur(1px)`, boxShadow:`0 0 6px ${d.c}`, "--dur":d.dur, "--del":d.del }} />
      ))}
      <div className="max-w-7xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="text-center mb-16 reveal">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color:"var(--c-tertiary)" }}>Why Choose Us</span>
          <h2 className="font-headline font-black tracking-tighter" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--c-on-surface)" }}>
            What Sets Us Apart
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
            We're a small, dedicated studio that cares about doing good work. Here's what you can expect when you work with us.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
          {points.map((p, i) => (
            <div key={p.title} className={`flex gap-5 group reveal reveal-delay-${i + 1}`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background:"var(--c-sc-highest)", color: p.color }}>
                <span className="material-symbols-outlined" aria-hidden="true">{p.icon}</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-lg mb-1" style={{ color:"var(--c-on-surface)" }}>{p.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PORTFOLIO ──────────────────────────────────────────────────────────────
function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = [
    {
      img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
      tags: [{ label:"Landing Page", color:"var(--c-primary)", bg:"rgba(187,158,255,0.2)" }, { label:"Demo", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }],
      title: "Demo Project — Landing Page",
      description: "A concept landing page for a local services business. Designed to be clear, fast-loading, and easy to navigate on mobile. The layout focuses on building trust quickly and encouraging visitors to get in touch.",
    },
    {
      img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      tags: [{ label:"Business Website", color:"var(--c-tertiary)", bg:"rgba(170,255,220,0.2)" }, { label:"Demo", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }],
      title: "Demo Project — Business Website",
      description: "A multi-page concept website for a small professional services company. Includes a homepage, services overview, about section, and contact form. Built to look credible and work well on all devices.",
    },
    {
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      tags: [{ label:"Portfolio", color:"var(--c-primary)", bg:"rgba(187,158,255,0.2)" }, { label:"Demo", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }],
      title: "Demo Project — Creative Portfolio",
      description: "A portfolio concept for a freelance creative professional. Simple, visually focused layout that showcases work clearly. Designed to be easy to update and fast to load.",
    },
  ];

  return (
    <section id="portfolio" style={{ background:"var(--c-surface)", padding:"8rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <div className="port-sweep" style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 40%,rgba(187,158,255,0.04) 50%,transparent 60%)", pointerEvents:"none", zIndex:0, "--sd":"0s" }} />
      <div className="port-sweep" style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 40%,rgba(0,207,252,0.03) 50%,transparent 60%)", pointerEvents:"none", zIndex:0, "--sd":"3.5s" }} />
      <div className="max-w-7xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="text-center mb-12 reveal">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color:"var(--c-secondary)" }}>Our Work</span>
          <h2 className="font-headline font-black tracking-tighter" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--c-on-surface)" }}>Demo Projects</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
            These are concept projects that show the kind of work we do — the design style, layout quality, and attention to detail you can expect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allProjects.map((p, i) => (
            <button key={p.title} onClick={() => setSelectedProject(p)}
              aria-label={`View ${p.title} details`}
              className={`project-card relative rounded-xl aspect-video text-left reveal reveal-delay-${i + 1}`}
              style={{ background:"var(--c-sc-high)", display:"block", cursor:"pointer", width:"100%" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
              <div className="project-overlay rounded-xl" />
              <div className="project-info">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {p.tags.map((t) => (
                    <span key={t.label} className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest"
                      style={{ background: t.bg, color: t.color }}>{t.label}</span>
                  ))}
                </div>
                <h4 className="font-headline font-bold text-xl mb-1" style={{ color:"var(--c-on-surface)" }}>{p.title}</h4>
                <span className="text-xs" style={{ color:"var(--c-secondary)" }}>View Details →</span>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-14 reveal">
          <p className="text-sm mb-5" style={{ color:"var(--c-on-sv)" }}>
            Ready to start your own project? We'd love to hear about it.
          </p>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            className="btn-primary px-10 py-4 rounded-full font-headline font-bold text-lg">
            Start Your Project
          </button>
        </div>
      </div>

      {selectedProject && (
        <PortfolioModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}

// ── PORTFOLIO MODAL ────────────────────────────────────────────────────────
function PortfolioModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)" }}
      onClick={onClose} role="dialog" aria-modal="true" aria-label={`${project.title} details`}>
      <div className="modal-content relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background:"var(--c-sc-high)", border:"1px solid rgba(72,71,77,0.3)", maxHeight:"90vh", overflowY:"auto" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
        </div>
        <div className="p-8">
          <div className="flex gap-2 mb-4 flex-wrap">
            {project.tags.map((t) => (
              <span key={t.label} className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest"
                style={{ background: t.bg, color: t.color }}>{t.label}</span>
            ))}
          </div>
          <h3 className="font-headline font-black text-2xl mb-3" style={{ color:"var(--c-on-surface)" }}>{project.title}</h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--c-on-sv)" }}>{project.description}</p>
          <div className="flex gap-3">
            <button onClick={(e) => { createRipple(e); scrollTo("contact"); onClose(); }} {...magnetic}
              className="btn-primary flex-1 py-4 rounded-xl font-headline font-bold">Build Something Similar</button>
            <button onClick={onClose} className="btn-ghost px-6 py-4 rounded-xl font-headline font-bold">Close</button>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close modal"
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background:"rgba(0,0,0,0.5)", color:"var(--c-on-surface)", border:"1px solid rgba(72,71,77,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── PROCESS ────────────────────────────────────────────────────────────────
function Process() {
  const steps = [
    { num:"1", title:"Discovery",   desc:"We start by understanding your business, your goals, and who your customers are. This helps us make smart decisions throughout the project.", color:"var(--c-primary)",   text:"#1a003d" },
    { num:"2", title:"Design",      desc:"We create mockups of your website so you can see exactly how it will look before any code is written. Your feedback shapes the final design.", color:"var(--c-secondary)", text:"#003a48" },
    { num:"3", title:"Development", desc:"Once the design is approved, we build your site with clean, modern code. We focus on speed, mobile responsiveness, and ease of use.", color:"var(--c-tertiary)",  text:"#00654b" },
    { num:"4", title:"Launch",      desc:"We test everything thoroughly, then launch your site. We're here to support you after go-live — so you can start with confidence.", gradient: true },
  ];

  return (
    <section id="process" style={{ background:"#000", padding:"8rem 1.5rem" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 reveal">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color:"var(--c-tertiary)" }}>How We Work</span>
          <h2 className="font-headline font-black tracking-tighter" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--c-on-surface)" }}>A Simple, Clear Process</h2>
          <p className="mt-4 max-w-lg mx-auto text-sm" style={{ color:"var(--c-on-sv)" }}>
            We keep things straightforward so you always know what's happening and what comes next.
          </p>
        </div>
        <div className="relative">
          <div className="absolute top-[3.5rem] left-0 right-0 h-px hidden md:block" aria-hidden="true"
            style={{ background:"linear-gradient(90deg,transparent,rgba(72,71,77,0.4),rgba(72,71,77,0.4),transparent)" }}>
            <div className="proc-travel" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 stagger-children">
            {steps.map((s, i) => (
              <div key={s.title} {...tilt} className={`step-card rounded-xl p-8 text-center reveal reveal-delay-${i + 1}`}>
                <div className="w-12 h-12 rounded-full mx-auto mb-6 flex items-center justify-center font-headline font-black text-lg"
                  style={s.gradient
                    ? { background:"linear-gradient(135deg,var(--c-primary),var(--c-secondary))", color:"#1a003d" }
                    : { background: s.color, color: s.text }
                  } aria-hidden="true">
                  {s.num}
                </div>
                <h4 className="font-headline font-bold text-lg mb-3" style={{ color:"var(--c-on-surface)" }}>{s.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-14 reveal">
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            className="btn-primary px-10 py-4 rounded-full font-headline font-bold text-lg">
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
}

// ── CONTACT FORM ───────────────────────────────────────────────────────────
function ContactSection() {
  const {
    name, setName, email, setEmail,
    company, setCompany, projectType, setProjectType,
    budget, setBudget, message, setMessage,
    status, submit, errors, touched, touch,
  } = useContactForm();

  const btnLabel = {
    idle:    "Send My Project Brief",
    loading: "Sending…",
    success: "✅ Received! We'll be in touch within 24 hours.",
    error:   "❌ Something went wrong — please try again",
  }[status];

  const projectTypes = ["Landing Page", "Business Website", "E-Commerce", "Portfolio", "Other"];
  const budgetRanges = ["₹5,000 – Starter", "₹7,000 – Growth", "₹12,000 – Authority", "Custom Budget"];

  const FieldErr = ({ field }) => touched[field] && errors[field]
    ? <span className="block text-xs mt-1.5" style={{ color:"#ff6b6b" }} role="alert">{errors[field]}</span>
    : null;

  const errStyle = (field) => touched[field] && errors[field] ? { borderColor:"rgba(255,107,107,0.5)" } : {};

  return (
    <section id="contact" style={{ background:"var(--c-sc-low)", padding:"8rem 1.5rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="contact-card relative rounded-3xl overflow-hidden p-8 md:p-16 reveal"
          style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.15)" }}>
          <div className="orb" style={{ width:400,height:400,top:-100,right:-100,background:"rgba(187,158,255,0.1)" }} />
          <div className="orb" style={{ width:240,height:240,bottom:-80,left:-60,background:"rgba(0,207,252,0.08)",animationDelay:"2s" }} />

          <div className="relative z-10 text-center mb-10">
            <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color:"var(--c-secondary)" }}>Get in Touch</span>
            <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-on-surface)" }}>
              Let's Build Your Website
            </h2>
            <p className="text-sm" style={{ color:"var(--c-on-sv)" }}>
              Tell us a little about your project and we'll get back to you within 24 hours. No pressure, no commitment — just a friendly chat about what you need.
            </p>
          </div>

          <form className="relative z-10 space-y-5" onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Your Name *</label>
                <input id="contact-name" type="text" placeholder="Jane Smith" required value={name}
                  onChange={(e) => setName(e.target.value)} onBlur={() => touch("name")}
                  aria-invalid={!!(errors.name && touched.name)}
                  className="input-field w-full px-4 py-3 rounded-xl" style={errStyle("name")} />
                <FieldErr field="name" />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Email Address *</label>
                <input id="contact-email" type="email" placeholder="jane@yourcompany.com" required value={email}
                  onChange={(e) => setEmail(e.target.value)} onBlur={() => touch("email")}
                  aria-invalid={!!(errors.email && touched.email)}
                  className="input-field w-full px-4 py-3 rounded-xl" style={errStyle("email")} />
                <FieldErr field="email" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-company" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Company</label>
                <input id="contact-company" type="text" placeholder="Your company (optional)" value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-xl" />
              </div>
              <div>
                <label htmlFor="contact-project-type" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Project Type</label>
                <select id="contact-project-type" value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-xl"
                  style={{ appearance:"none", cursor:"pointer" }}>
                  <option value="">Select type…</option>
                  {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Budget Range</label>
              <div className="flex flex-wrap gap-3" role="group" aria-label="Select a budget range">
                {budgetRanges.map(b => (
                  <button key={b} type="button"
                    onClick={(e) => { createRipple(e); setBudget(b === budget ? "" : b); }}
                    aria-pressed={budget === b}
                    className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
                    style={{
                      border: budget === b ? "1px solid var(--c-primary)" : "1px solid rgba(72,71,77,0.35)",
                      background: budget === b ? "rgba(187,158,255,0.15)" : "transparent",
                      color: budget === b ? "var(--c-primary)" : "var(--c-on-sv)",
                      position:"relative", overflow:"hidden",
                    }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Project Details *</label>
              <textarea id="contact-message" rows={4} placeholder="What kind of website do you need? Who is it for? What do you want visitors to do?" required value={message}
                onChange={(e) => setMessage(e.target.value)} onBlur={() => touch("message")}
                aria-invalid={!!(errors.message && touched.message)}
                className="input-field w-full px-4 py-3 rounded-xl resize-none" style={errStyle("message")} />
              <FieldErr field="message" />
            </div>

            <button id="contact-submit" type="submit" onClick={createRipple}
              disabled={status === "loading"}
              {...(status !== "loading" ? magnetic : {})}
              aria-live="polite"
              className="btn-primary w-full py-5 rounded-full font-headline font-bold text-lg disabled:opacity-60">
              {btnLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      heading:"Navigate",
      links:[
        { label:"Services",  onClick:() => scrollTo("services")  },
        { label:"Portfolio", onClick:() => scrollTo("portfolio") },
        { label:"Process",   onClick:() => scrollTo("process")   },
        { label:"Contact",   onClick:() => scrollTo("contact")   },
      ],
    },
    {
      heading:"Connect",
      links:[
        { label:"Instagram", href:"https://www.instagram.com/vibewebstudio.in", target:"_blank" },
        { label:"WhatsApp",  href:"https://wa.me/919000000000",                 target:"_blank" },
      ],
    },
  ];

  return (
    <footer style={{ background:"var(--c-surface)", borderTop:"1px solid rgba(72,71,77,0.12)", padding:"4rem 1.5rem" }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="VibeWebStudio"
            style={{ height: 56, width: "auto", objectFit: "contain", marginBottom: "0.75rem" }}
          />
          <p className="text-sm max-w-xs leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
            © 2026 VibeWebStudio.<br />Clean websites for real businesses.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10">
          {cols.map((col) => (
            <div key={col.heading}>
              <h5 className="font-headline font-bold text-sm mb-4 uppercase tracking-widest" style={{ color:"var(--c-on-surface)" }}>{col.heading}</h5>
              <ul className="space-y-3 text-sm" style={{ color:"var(--c-on-sv)" }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.onClick ? (
                      <button onClick={l.onClick}
                        className="transition-colors duration-200" style={{ color:"inherit", background:"none", border:"none", cursor:"pointer", padding:0 }}
                        onMouseOver={(e) => (e.target.style.color = "var(--c-tertiary)")}
                        onMouseOut={(e)  => (e.target.style.color = "")}>
                        {l.label}
                      </button>
                    ) : (
                      <a href={l.href} target={l.target || "_self"} rel={l.target === "_blank" ? "noopener noreferrer" : undefined}
                        className="transition-colors duration-200" style={{ color:"inherit" }}
                        onMouseOver={(e) => (e.target.style.color = "var(--c-tertiary)")}
                        onMouseOut={(e)  => (e.target.style.color = "")}>
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────
export default function Home() {
  useReveal();
  useCursor();
  useParallax();
  useBackToTop();

  return (
    <>
      <SectionAnimStyles />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Edge />
        <Portfolio />
        <Process />
        <ContactSection />
      </main>
      <Footer />

      <div id="vws-cursor" aria-hidden="true" />
      <div id="vws-cursor-trail" aria-hidden="true" />

      <button id="vws-back-top" aria-label="Scroll back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </>
  );
}