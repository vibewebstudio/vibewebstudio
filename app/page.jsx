"use client";

import { useState, useEffect, useRef } from "react";

// ── Scroll helper ──────────────────────────────────────────────────────────
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ── SCROLL REVEAL ──────────────────────────────────────────────────────────
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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}


// ── PARALLAX SCROLL ────────────────────────────────────────────────────────
function useParallax() {
  useEffect(() => {
    const els = document.querySelectorAll(".parallax-el");
    const onScroll = () => {
      const y = window.scrollY;
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.12");
        el.style.transform = `translateY(${y * speed}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

// ── BACK TO TOP ────────────────────────────────────────────────────────────
function useBackToTop() {
  useEffect(() => {
    const btn = document.getElementById("vws-back-top");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("visible", window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

// ── BUTTON RIPPLE ──────────────────────────────────────────────────────────
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

// ── MAGNETIC BUTTON ────────────────────────────────────────────────────────
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

// ── CARD TILT ──────────────────────────────────────────────────────────────
const tilt = {
  onMouseMove: (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width;
    const y    = (e.clientY - rect.top)  / rect.height;
    const tX   = (y - 0.5) * -8;
    const tY   = (x - 0.5) *  8;
    card.style.transform = `perspective(800px) rotateX(${tX}deg) rotateY(${tY}deg) translateY(-6px)`;
  },
  onMouseLeave: (e) => { e.currentTarget.style.transform = ""; },
};

// ── CONTACT FORM HOOK ──────────────────────────────────────────────────────
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

// ── GLOBAL STYLES ──────────────────────────────────────────────────────────
function SectionAnimStyles() {
  const css = `
    /* ── hero entrance animations ── */
    @keyframes hero-badge-in{from{opacity:0;transform:translateY(-16px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes hero-h1-in{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
    @keyframes hero-sub-in{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes hero-cta-in{from{opacity:0;transform:translateY(20px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes scroll-bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}
    .hero-badge{animation:hero-badge-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both}
    .hero-h1{animation:hero-h1-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.55s both}
    .hero-sub{animation:hero-sub-in 0.8s cubic-bezier(0.22,1,0.36,1) 0.75s both}
    .hero-note{animation:hero-sub-in 0.7s cubic-bezier(0.22,1,0.36,1) 0.9s both}
    .hero-cta{animation:hero-cta-in 0.8s cubic-bezier(0.22,1,0.36,1) 1.05s both}
    .hero-avail{animation:hero-sub-in 0.7s cubic-bezier(0.22,1,0.36,1) 1.25s both}

    /* ── floating service dots ── */
    @keyframes svc-float{0%,100%{transform:translateY(0) scale(1);opacity:0.45}50%{transform:translateY(-22px) scale(1.08);opacity:0.75}}
    .svc-dot{animation:svc-float var(--dur,10s) ease-in-out infinite;}

    /* ── shimmer sweep ── */
    @keyframes port-shimmer{0%{transform:translateX(-150%) skewX(-18deg);opacity:0}15%{opacity:1}85%{opacity:1}100%{transform:translateX(260%) skewX(-18deg);opacity:0}}
    .port-sweep{animation:port-shimmer 7s ease-in-out infinite;animation-delay:var(--sd,0s);}

    /* ── edge particles ── */
    @keyframes edge-float{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:0.65}85%{opacity:0.3}100%{transform:translateY(-80px) scale(0.4);opacity:0}}
    .edge-dot{width:5px;height:5px;border-radius:50%;position:absolute;pointer-events:none;animation:edge-float var(--dur,6s) ease-in-out infinite;animation-delay:var(--del,0s);}

    /* ── process traveler ── */
    @keyframes proc-travel{0%{left:2%;opacity:0}5%{opacity:1}95%{opacity:1}100%{left:98%;opacity:0}}
    .proc-travel{position:absolute;top:50%;transform:translateY(-50%);width:8px;height:8px;border-radius:50%;background:#bb9eff;box-shadow:0 0 10px #bb9eff,0 0 22px rgba(187,158,255,0.5);animation:proc-travel 4s linear infinite;pointer-events:none;}

    /* ── contact card glow pulse ── */
    @keyframes contact-border{0%,100%{box-shadow:0 0 0 1px rgba(72,71,77,0.15)}50%{box-shadow:0 0 36px rgba(187,158,255,0.18),0 0 0 1px rgba(187,158,255,0.35)}}
    .contact-card{animation:contact-border 4.5s ease-in-out infinite;}

    /* ── modal ── */
    @keyframes modal-in{from{opacity:0;transform:scale(0.95) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .modal-content{animation:modal-in 0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards;}

    /* ── form field shake ── */
    @keyframes field-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
    .field-shake{animation:field-shake 0.3s ease;}

    /* ── CTA glow ring pulse ── */
    @keyframes cta-ring-pulse{0%,100%{transform:scale(1);opacity:0}50%{transform:scale(1.18);opacity:0.4}}
    .cta-ring::after{content:'';position:absolute;inset:-8px;border-radius:inherit;border:1px solid rgba(0,207,252,0.35);pointer-events:none;animation:cta-ring-pulse 2.8s ease-in-out infinite;}

    /* ── stat counter shimmer ── */
    @keyframes stat-shimmer{0%,100%{opacity:1}50%{opacity:0.75}}
    .stat-num{animation:stat-shimmer 3s ease-in-out infinite;}

    /* ── avatar ring ── */
    @keyframes avatar-ring-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    .avatar-ring-spin{animation:avatar-ring-spin 8s linear infinite;}

    /* ── trust badge float ── */
    @keyframes trust-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    .trust-float{animation:trust-float 4s ease-in-out infinite;}

    /* ── scroll indicator ── */
    .scroll-indicator{animation:scroll-bounce 2s ease-in-out infinite;}

    /* ── card glow border on hover ── */
    .premium-card{position:relative;transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275),box-shadow 0.4s cubic-bezier(0.22,1,0.36,1),border-color 0.4s ease;}
    .premium-card::before{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(135deg,rgba(187,158,255,0.08),rgba(0,207,252,0.06));opacity:0;transition:opacity 0.4s ease;pointer-events:none;z-index:0;}
    .premium-card:hover::before{opacity:1;}
    .premium-card:hover{transform:translateY(-8px);box-shadow:0 20px 60px rgba(0,0,0,0.4),0 0 0 1px rgba(0,207,252,0.15),0 0 40px rgba(0,207,252,0.06);}

    /* ── line accent ── */
    @keyframes line-grow{from{transform:scaleX(0);opacity:0}to{transform:scaleX(1);opacity:1}}
    .line-accent{transform-origin:left;animation:line-grow 1s cubic-bezier(0.22,1,0.36,1) 0.5s both;}

    /* ── team card member avatar pulse ── */
    @keyframes member-glow{0%,100%{box-shadow:0 0 0 0 rgba(187,158,255,0.15)}50%{box-shadow:0 0 28px 4px rgba(187,158,255,0.3)}}
    .member-avatar{animation:member-glow 4s ease-in-out infinite;}
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

// ── PLEXUS NETWORK CANVAS ──────────────────────────────────────────────────
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
    const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
    const CURSOR_RADIUS = 130;
    const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS;
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
      ctx.fillStyle = "rgba(14,14,19,0.28)";
      ctx.fillRect(0, 0, cw, ch);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.y += Math.sin(t * n.waveFreq * 60 + n.wavePhase) * 0.12;
        const dx = n.x - mx, dy = n.y - my;
        const distSq = dx * dx + dy * dy;

        // Optimization: Use squared distance for check to avoid Math.sqrt
        if (distSq < CURSOR_RADIUS_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq);
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

        // Optimization: Replaced radial gradient and shadowBlur with simplified circles for performance
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.12 * glow})`;
        ctx.fill();

        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.85 * glow})`;
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i], nj = nodes[j];
          const dx = ni.x - nj.x, dy = ni.y - nj.y;
          const distSq = dx * dx + dy * dy;

          // Optimization: Use squared distance for check
          if (distSq > CONNECT_DIST_SQ) continue;

          const d = Math.sqrt(distSq);
          const alpha = (1 - d / CONNECT_DIST) * 0.28;
          const [r1, g1, b1] = ni.pal;

          // Optimization: Replaced linear gradient with solid color for connection performance
          ctx.beginPath(); ctx.moveTo(ni.x, ni.y); ctx.lineTo(nj.x, nj.y);
          ctx.strokeStyle = `rgba(${r1},${g1},${b1},${alpha})`;
          ctx.lineWidth = 0.65; ctx.stroke();
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
        // Optimization: Use a simpler circle for the cursor halo to avoid createRadialGradient
        ctx.beginPath();
        ctx.arc(mx, my, CURSOR_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(187,158,255,0.04)";
        ctx.fill();
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
    { href: "team",      label: "Team"      },
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
            aria-label="Get your website"
            className="btn-primary px-6 py-2.5 rounded-full font-headline font-bold text-sm tracking-wide hidden sm:block">
            Get Your Website
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
          maxHeight: mobileOpen ? "400px" : "0px",
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
            transitionDelay: mobileOpen ? "280ms" : "0ms",
            transform: mobileOpen ? "translateY(0)" : "translateY(10px)",
            opacity: mobileOpen ? 1 : 0,
            transition: "transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s ease",
          }}
          className="btn-primary w-full mt-4 py-3 rounded-full font-headline font-bold text-sm">
          Get Your Website
        </button>
      </div>
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-shift"
      style={{ background: "var(--c-surface)" }}
    >
      <PlexusCanvas />

      <div aria-hidden="true" style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
        background:"radial-gradient(ellipse 80% 60% at 50% 40%, rgba(187,158,255,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(0,207,252,0.05) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 20% 20%, rgba(170,255,220,0.04) 0%, transparent 60%), linear-gradient(to bottom, transparent 60%, rgba(14,14,19,0.9) 100%)"
      }} />

      <div className="orb parallax-el" data-speed="-0.08" aria-hidden="true"
        style={{ width:600, height:600, top:"-10%", left:"-12%", background:"rgba(187,158,255,0.09)", animationDelay:"0s", zIndex:1 }} />
      <div className="orb parallax-el" data-speed="0.10" aria-hidden="true"
        style={{ width:500, height:500, bottom:"-5%", right:"-8%", background:"rgba(0,207,252,0.07)", animationDelay:"3s", zIndex:1 }} />
      <div className="orb parallax-el" data-speed="-0.05" aria-hidden="true"
        style={{ width:300, height:300, top:"30%", right:"15%", background:"rgba(170,255,220,0.05)", animationDelay:"6s", zIndex:1 }} />

      <div className="relative max-w-5xl mx-auto text-center" style={{ zIndex:10 }}>

        <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2 mb-10 rounded-full"
          style={{
            background:"rgba(25,25,31,0.8)",
            border:"1px solid rgba(0,207,252,0.3)",
            backdropFilter:"blur(20px)",
            boxShadow:"0 0 20px rgba(0,207,252,0.08)",
          }}>
          <span style={{
            width:7, height:7, borderRadius:"50%", background:"var(--c-secondary)", display:"inline-block",
            boxShadow:"0 0 10px var(--c-secondary), 0 0 20px rgba(0,207,252,0.5)",
            animation:"neon-flow 2s ease infinite"
          }} />
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color:"var(--c-secondary)" }}>
            Web Design &amp; Development — India
          </span>
        </div>

        <h1 className="hero-h1 font-headline font-black tracking-tighter mb-6"
          style={{ fontSize:"clamp(2.8rem,8.5vw,6.5rem)", lineHeight:1.02, color:"var(--c-on-surface)" }}>
          We Design &amp; Build Websites
          <br />
          <em className="neon-text not-italic"> That Get You More Customers</em>
        </h1>

        <p className="hero-sub text-lg md:text-xl max-w-2xl mx-auto mb-3 font-light leading-relaxed"
          style={{ color:"var(--c-on-sv)" }}>
          Clean, fast, mobile-ready websites for small businesses and startups — built by a designer and a developer working together.
        </p>

        <p className="hero-note text-sm mb-10 font-semibold" style={{ color:"var(--c-secondary)" }}>
          No commitment. Just ideas for your business.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={(e) => { createRipple(e); scrollTo("contact"); }}
            {...magnetic}
            aria-label="Get your website"
            className="btn-primary cta-ring relative w-full sm:w-auto px-12 py-4 rounded-full font-headline font-bold text-lg">
            Get Your Website
          </button>
          <button
            onClick={(e) => { createRipple(e); scrollTo("portfolio"); }}
            aria-label="View sample work"
            className="btn-ghost w-full sm:w-auto px-12 py-4 rounded-full font-headline font-bold text-lg">
            See Sample Work
          </button>
        </div>

        <p className="hero-avail text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color:"rgba(170,255,220,0.75)" }}>
          ✦ Currently accepting 2 new projects this month
        </p>

        <div className="hero-avail flex items-center justify-center gap-8 mt-10 pt-10"
          style={{ borderTop:"1px solid rgba(72,71,77,0.15)" }}>
          {[
            { num:"48h", label:"Avg. Response" },
            { num:"100%", label:"Mobile-Ready" },
            { num:"1–3wk", label:"Delivery" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="stat-num font-headline font-black text-2xl" style={{ color:"var(--c-on-surface)" }}>{s.num}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color:"var(--c-on-sv)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-indicator absolute bottom-8 left-1/2 flex flex-col items-center gap-2"
        style={{ zIndex:10 }} aria-hidden="true">
        <div style={{ width:1, height:48, background:"linear-gradient(to bottom, transparent, rgba(172,170,177,0.5))" }} />
        <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--c-on-sv)", boxShadow:"0 0 8px rgba(172,170,177,0.5)" }} />
      </div>
    </section>
  );
}

// ── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      icon:"web",
      title:"Website Design",
      desc:"A design that looks professional and guides visitors toward contacting you or taking the next step. First impressions matter — we make sure yours is strong.",
      color:"var(--c-primary)",
      bg:"rgba(187,158,255,0.12)",
      glow:"rgba(187,158,255,0.15)",
    },
    {
      icon:"code",
      title:"Web Development",
      desc:"Your site is built with modern code — fast to load, easy to update, and works perfectly on any device. No technical headaches on your end.",
      color:"var(--c-secondary)",
      bg:"rgba(0,207,252,0.12)",
      glow:"rgba(0,207,252,0.15)",
    },
    {
      icon:"insights",
      title:"UI/UX Improvements",
      desc:"If your current site isn't bringing in enquiries, we can identify why and fix it. Small changes often lead to noticeably more leads.",
      color:"var(--c-tertiary)",
      bg:"rgba(170,255,220,0.12)",
      glow:"rgba(170,255,220,0.15)",
    },
  ];

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
          {services.map((s, i) => (
            <div
              key={s.title}
              {...tilt}
              className={`premium-card service-card rounded-2xl p-8 reveal reveal-delay-${i + 1}`}
              style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.15)", cursor:"default" }}
            >
              <div className="service-icon inline-flex items-center justify-center w-14 h-14 rounded-xl mb-7"
                style={{
                  background: s.bg,
                  color: s.color,
                  boxShadow:`0 0 20px ${s.glow}`,
                  border:`1px solid ${s.glow}`,
                }}>
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:"1.5rem" }}>{s.icon}</span>
              </div>

              <div className="mb-3" style={{ color:"rgba(72,71,77,0.5)", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.15em" }}>
                0{i + 1}
              </div>

              <h3 className="font-headline font-bold text-xl mb-3" style={{ color:"var(--c-on-surface)" }}>{s.title}</h3>
              <p className="leading-relaxed text-sm" style={{ color:"var(--c-on-sv)" }}>{s.desc}</p>

              <div className="mt-6 flex items-center gap-2 text-xs font-bold" style={{ color: s.color }}>
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
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg">
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
}

// ── WHY CHOOSE US ─────────────────────────────────────────────────────────
function Edge() {
  const points = [
    {
      icon:"speed",
      title:"Fast Delivery",
      desc:"Most websites are ready in 1–3 weeks. You'll always know what's happening — no waiting in the dark.",
      color:"var(--c-secondary)",
    },
    {
      icon:"devices",
      title:"Works on Every Device",
      desc:"Your site will look great and work perfectly on phones, tablets, and desktops — no exceptions.",
      color:"var(--c-primary)",
    },
    {
      icon:"brush",
      title:"Clean, Modern Design",
      desc:"Professional websites that are easy to navigate. No clutter, no confusion.",
      color:"var(--c-tertiary)",
    },
    {
      icon:"track_changes",
      title:"Focused on Results",
      desc:"We think about your goals — more enquiries, more trust, more sales — and build with those in mind.",
      color:"var(--c-secondary)",
    },
  ];

  return (
    <section id="why-us" style={{ background:"var(--c-surface)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      {[
        { l:"12%", t:"80%", c:"rgba(0,207,252,0.5)",    dur:"6s",  del:"0s"   },
        { l:"28%", t:"90%", c:"rgba(187,158,255,0.4)",  dur:"8s",  del:"1.2s" },
        { l:"48%", t:"75%", c:"rgba(170,255,220,0.45)", dur:"5.5s",del:"2.4s" },
        { l:"65%", t:"85%", c:"rgba(0,207,252,0.35)",   dur:"7s",  del:"0.6s" },
        { l:"80%", t:"70%", c:"rgba(187,158,255,0.5)",  dur:"9s",  del:"3s"   },
        { l:"92%", t:"88%", c:"rgba(170,255,220,0.4)",  dur:"6.5s",del:"1.8s" },
      ].map((d, i) => (
        <div key={i} aria-hidden="true" className="edge-dot" style={{ left:d.l, top:d.t, background:d.c,
          filter:"blur(1px)", boxShadow:`0 0 6px ${d.c}`, "--dur":d.dur, "--del":d.del }} />
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
          {points.map((p, i) => (
            <div
              key={p.title}
              className={`premium-card group flex gap-5 p-7 rounded-2xl reveal reveal-delay-${i + 1}`}
              style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.15)" }}
            >
              <div className="flex-shrink-0 w-13 h-13 rounded-xl flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  width:52, height:52,
                  background:"var(--c-sc-highest)",
                  color: p.color,
                  boxShadow:`0 0 0 1px rgba(72,71,77,0.2)`,
                  transition:"transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.4s ease",
                }}>
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
            { icon:"verified", text:"No Hidden Fees" },
            { icon:"support_agent", text:"Post-Launch Support" },
            { icon:"lock", text:"Secure & Fast" },
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

// ── PORTFOLIO ────────────────────────────────────────────────────────────────
function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = [
    {
      img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
      tags: [{ label:"Landing Page", color:"var(--c-primary)", bg:"rgba(187,158,255,0.2)" }, { label:"Concept", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }],
      title: "Demo Landing Page for Local Business",
      description: "A concept landing page built for a local services business. Designed to load fast, look trustworthy, and make it easy for visitors to get in touch. Everything you'd expect a professional site to do.",
    },
    {
      img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      tags: [{ label:"Business Website", color:"var(--c-tertiary)", bg:"rgba(170,255,220,0.2)" }, { label:"Concept", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }],
      title: "Sample Business Website (Concept)",
      description: "A multi-page concept for a small business — homepage, services, and contact. Built to look credible, load quickly, and work well for people browsing on their phones.",
    },
    {
      img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      tags: [{ label:"Startup Website", color:"var(--c-primary)", bg:"rgba(187,158,255,0.2)" }, { label:"Concept", color:"var(--c-secondary)", bg:"rgba(0,207,252,0.2)" }],
      title: "Startup Website Design",
      description: "A website concept for an early-stage startup. Clean layout focused on showcasing the product and encouraging visitors to sign up or get in touch.",
    },
  ];

  return (
    <section id="portfolio" style={{ background:"var(--c-sc-low)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <div className="port-sweep" aria-hidden="true" style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 40%,rgba(187,158,255,0.04) 50%,transparent 60%)", pointerEvents:"none", zIndex:0, "--sd":"0s" }} />
      <div className="port-sweep" aria-hidden="true" style={{ position:"absolute", inset:0, background:"linear-gradient(105deg,transparent 40%,rgba(0,207,252,0.03) 50%,transparent 60%)", pointerEvents:"none", zIndex:0, "--sd":"3.5s" }} />

      <div className="max-w-7xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="text-center mb-4 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-secondary))", borderRadius:2 }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-secondary)" }}>Sample Work</span>
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-secondary),transparent)", borderRadius:2 }} />
          </div>
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--c-on-surface)" }}>
            Demo Projects
          </h2>
          {/* Honest disclaimer */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mb-2"
            style={{ background:"rgba(187,158,255,0.08)", border:"1px solid rgba(187,158,255,0.2)" }}>
            <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize:"1rem", color:"var(--c-primary)" }}>info</span>
            <p className="text-xs font-semibold" style={{ color:"var(--c-on-sv)" }}>
              These are sample projects created to showcase our design and development work — not live client sites.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {allProjects.map((p, i) => (
            <button
              key={p.title}
              onClick={() => setSelectedProject(p)}
              aria-label={`View ${p.title} details`}
              className={`project-card relative rounded-2xl overflow-hidden aspect-video text-left reveal reveal-delay-${i + 1}`}
              style={{ background:"var(--c-sc-high)", display:"block", cursor:"pointer", width:"100%",
                boxShadow:"0 8px 40px rgba(0,0,0,0.3)", border:"1px solid rgba(72,71,77,0.15)",
                transition:"transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease" }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.01)";
                e.currentTarget.style.boxShadow = "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,207,252,0.12)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.3)";
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.title}
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />

              <div className="project-overlay" aria-hidden="true" />

              <div className="project-info">
                <div className="flex flex-wrap gap-2 mb-2">
                  {p.tags.map((tag) => (
                    <span key={tag.label} className="text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: tag.bg, color: tag.color, backdropFilter:"blur(8px)" }}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                <h3 className="font-headline font-bold text-sm leading-snug" style={{ color:"#fff" }}>{p.title}</h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color:"rgba(255,255,255,0.7)" }}>Click to read more</p>
              </div>

              <div style={{
                position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                width:48, height:48, borderRadius:"50%",
                background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)",
                border:"1px solid rgba(255,255,255,0.2)",
                display:"flex", alignItems:"center", justifyContent:"center",
                opacity:0, transition:"opacity 0.3s ease",
              }}
              className="portfolio-expand-icon"
              aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
              </div>

              <style>{`.project-card:hover .portfolio-expand-icon{opacity:1!important}`}</style>
            </button>
          ))}
        </div>

        <div className="text-center mt-16 reveal">
          <p className="text-sm mb-5 font-semibold" style={{ color:"var(--c-on-sv)" }}>
            Interested in seeing what we can build for you?
          </p>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg">
            Discuss Your Project
          </button>
        </div>
      </div>

      {selectedProject && (
        <div
          role="dialog" aria-modal="true" aria-label={selectedProject.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.85)", backdropFilter:"blur(12px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedProject(null); }}
        >
          <div className="modal-content relative max-w-2xl w-full rounded-3xl overflow-hidden"
            style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.25)" }}>
            <div style={{ aspectRatio:"16/9", overflow:"hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedProject.img} alt={selectedProject.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.tags.map((tag) => (
                  <span key={tag.label} className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>
                ))}
              </div>
              <h3 className="font-headline font-bold text-2xl mb-3" style={{ color:"var(--c-on-surface)" }}>{selectedProject.title}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--c-on-sv)" }}>{selectedProject.description}</p>
              <button onClick={(e) => { createRipple(e); setSelectedProject(null); scrollTo("contact"); }}
                className="btn-primary px-8 py-3 rounded-full font-headline font-bold text-sm">
                Build Something Like This
              </button>
            </div>
            <button onClick={() => setSelectedProject(null)}
              aria-label="Close project details"
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background:"rgba(0,0,0,0.5)", color:"var(--c-on-surface)", border:"1px solid rgba(72,71,77,0.3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ── PROCESS ──────────────────────────────────────────────────────────────────
function Process() {
  const steps = [
    { num:"1", title:"Discovery",   desc:"We start with a quick chat about your business and what you need. No jargon — just a simple conversation to get on the same page.", color:"var(--c-primary)",   text:"#1a003d" },
    { num:"2", title:"Design",      desc:"Krish creates your website design before any code is written. You give feedback, and we get it right together.", color:"var(--c-secondary)", text:"#003a48" },
    { num:"3", title:"Development", desc:"Once the design is approved, Ankit builds your site. Clean code, fast loading, and fully mobile-responsive.", color:"var(--c-tertiary)",  text:"#00654b" },
    { num:"4", title:"Launch",      desc:"We test everything, then go live. We're here to support you after launch so you can get started with confidence.", gradient: true },
  ];

  return (
    <section id="process" style={{ background:"#000", padding:"9rem 1.5rem" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-tertiary))", borderRadius:2 }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-tertiary)" }}>How It Works</span>
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-tertiary),transparent)", borderRadius:2 }} />
          </div>
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--c-on-surface)" }}>
            A Simple, Clear Process
          </h2>
          <p className="max-w-lg mx-auto text-sm" style={{ color:"var(--c-on-sv)" }}>
            Four straightforward steps. No surprises, no confusion.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-[3.5rem] left-0 right-0 h-px hidden md:block" aria-hidden="true"
            style={{ background:"linear-gradient(90deg,transparent,rgba(72,71,77,0.4),rgba(72,71,77,0.4),transparent)" }}>
            <div className="proc-travel" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 stagger-children">
            {steps.map((s, i) => (
              <div key={s.title} {...tilt} className={`step-card premium-card rounded-2xl p-8 text-center reveal reveal-delay-${i + 1}`}
                style={{ background:"var(--c-surface)", border:"1px solid rgba(72,71,77,0.15)" }}>
                <div className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center font-headline font-black text-xl"
                  style={s.gradient
                    ? { background:"linear-gradient(135deg,var(--c-primary),var(--c-secondary))", color:"#1a003d", boxShadow:"0 0 24px rgba(187,158,255,0.3)" }
                    : { background: s.color, color: s.text, boxShadow:`0 0 20px ${s.color}30` }
                  } aria-hidden="true">
                  {s.num}
                </div>
                <h4 className="font-headline font-bold text-xl mb-3" style={{ color:"var(--c-on-surface)" }}>{s.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color:"var(--c-on-sv)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 reveal">
          <p className="text-sm mb-5 font-semibold" style={{ color:"var(--c-on-sv)" }}>
            Ready to get started? It only takes a minute.
          </p>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg">
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
}

// ── TEAM SECTION ─────────────────────────────────────────────────────────────
function TeamSection() {
  const members = [
    {
      name: "Ankit",
      role: "Developer",
      emoji: "💻",
      tagline: "I handle development — building fast, reliable websites.",
      color: "var(--c-secondary)",
      bg: "rgba(0,207,252,0.08)",
      border: "rgba(0,207,252,0.2)",
      glow: "rgba(0,207,252,0.25)",
      skills: ["Next.js", "React", "Performance", "Mobile-Ready"],
    },
    {
      name: "Krish",
      role: "Designer",
      emoji: "🎨",
      tagline: "I handle design — creating clean, user-friendly interfaces.",
      color: "var(--c-primary)",
      bg: "rgba(187,158,255,0.08)",
      border: "rgba(187,158,255,0.2)",
      glow: "rgba(187,158,255,0.25)",
      skills: ["UI/UX", "Figma", "Branding", "Visual Design"],
    },
  ];

  return (
    <section id="team" style={{ background:"var(--c-sc-low)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      {/* Background glow */}
      <div aria-hidden="true" style={{ position:"absolute", width:600, height:600, borderRadius:"50%", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle, rgba(187,158,255,0.05) 0%, transparent 70%)", pointerEvents:"none" }} />

      <div className="max-w-5xl mx-auto" style={{ position:"relative", zIndex:1 }}>

        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-primary))", borderRadius:2 }} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-primary)" }}>Meet the Team</span>
            <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-primary),transparent)", borderRadius:2 }} />
          </div>

          {/* Human intro line */}
          <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3.5rem)", color:"var(--c-on-surface)" }}>
            Hi, we're <em className="neon-text not-italic">Ankit &amp; Krish</em>
          </h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color:"var(--c-on-sv)" }}>
            We design and build modern websites for businesses — working together so you get great design <em>and</em> great code in one package.
          </p>
        </div>

        {/* Member Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {members.map((m, i) => (
            <div key={m.name} {...tilt}
              className={`premium-card rounded-3xl p-8 reveal reveal-delay-${i + 1}`}
              style={{
                background: m.bg,
                border: `1px solid ${m.border}`,
                cursor: "default",
              }}
            >
              {/* Avatar */}
              <div className="member-avatar inline-flex items-center justify-center mb-6 rounded-2xl"
                style={{
                  width: 72, height: 72,
                  background: `linear-gradient(135deg, ${m.bg}, rgba(255,255,255,0.04))`,
                  border: `1.5px solid ${m.border}`,
                  fontSize: "2rem",
                  boxShadow: `0 0 24px ${m.glow}`,
                }}>
                {m.emoji}
              </div>

              {/* Role badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                style={{ background:`rgba(255,255,255,0.06)`, border:`1px solid ${m.border}` }}>
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: m.color }}>{m.role}</span>
              </div>

              <h3 className="font-headline font-black text-3xl mb-3" style={{ color:"var(--c-on-surface)" }}>{m.name}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color:"var(--c-on-sv)" }}>{m.tagline}</p>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {m.skills.map((skill) => (
                  <span key={skill} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(72,71,77,0.25)",
                      color: "var(--c-on-sv)",
                    }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Positioning line */}
        <div className="text-center reveal"
          style={{ padding:"2rem 2rem", background:"rgba(255,255,255,0.03)", borderRadius:"1.5rem", border:"1px solid rgba(72,71,77,0.15)" }}>
          <p className="font-headline font-bold text-lg mb-6" style={{ color:"var(--c-on-surface)" }}>
            "We focus on simple, effective websites that actually help businesses grow."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {[
              { emoji:"🎯", text:"Results-Driven" },
              { emoji:"⚡", text:"Fast Turnaround" },
              { emoji:"💬", text:"Direct Communication" },
            ].map((item) => (
              <div key={item.text} className="trust-float flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{ background:"var(--c-sc-high)", border:"1px solid rgba(72,71,77,0.2)" }}>
                <span style={{ fontSize:"1rem" }}>{item.emoji}</span>
                <span className="text-xs font-bold" style={{ color:"var(--c-on-surface)" }}>{item.text}</span>
              </div>
            ))}
          </div>
          <button onClick={(e) => { createRipple(e); scrollTo("contact"); }} {...magnetic}
            className="btn-primary cta-ring relative px-12 py-4 rounded-full font-headline font-bold text-lg">
            Let's Work Together
          </button>
        </div>
      </div>
    </section>
  );
}

// ── CONTACT FORM ─────────────────────────────────────────────────────────────
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
    success: "✅ Received! We'll get back to you within 24 hours.",
    error:   "❌ Something went wrong — please try again",
  }[status];

  const projectTypes = ["Landing Page", "Business Website", "E-Commerce", "Portfolio", "Other"];
  const budgetRanges = ["₹5,000 – Starter", "₹7,000 – Growth", "₹12,000 – Authority", "Custom Budget"];

  const FieldErr = ({ field }) => touched[field] && errors[field]
    ? <span className="block text-xs mt-1.5" style={{ color:"#ff6b6b" }} role="alert">{errors[field]}</span>
    : null;

  const errStyle = (field) => touched[field] && errors[field] ? { borderColor:"rgba(255,107,107,0.5)" } : {};

  return (
    <section id="contact" style={{ background:"var(--c-sc-low)", padding:"9rem 1.5rem", position:"relative", overflow:"hidden" }}>
      <div aria-hidden="true" style={{ position:"absolute", width:700, height:700, borderRadius:"50%", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"radial-gradient(circle, rgba(0,207,252,0.04) 0%, transparent 65%)", pointerEvents:"none" }} />

      <div className="max-w-4xl mx-auto" style={{ position:"relative", zIndex:1 }}>
        <div className="contact-card relative rounded-3xl overflow-hidden p-8 md:p-14 reveal"
          style={{ background:"var(--c-sc)", border:"1px solid rgba(72,71,77,0.2)" }}>

          <div className="orb" aria-hidden="true" style={{ width:400, height:400, top:-120, right:-120, background:"rgba(187,158,255,0.08)" }} />
          <div className="orb" aria-hidden="true" style={{ width:280, height:280, bottom:-100, left:-80, background:"rgba(0,207,252,0.07)", animationDelay:"2s" }} />

          <div className="relative z-10 text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height:2, width:32, background:"linear-gradient(90deg,transparent,var(--c-secondary))", borderRadius:2 }} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color:"var(--c-secondary)" }}>Get in Touch</span>
              <div style={{ height:2, width:32, background:"linear-gradient(90deg,var(--c-secondary),transparent)", borderRadius:2 }} />
            </div>
            <h2 className="font-headline font-black tracking-tighter mb-4" style={{ fontSize:"clamp(2rem,5vw,3rem)", color:"var(--c-on-surface)" }}>
              Let's Build Your Website
            </h2>
            <p className="text-sm mb-1" style={{ color:"var(--c-on-sv)" }}>
              Tell us a little about your project and we'll get back to you within 24 hours.
            </p>
            <p className="text-sm font-bold" style={{ color:"var(--c-secondary)" }}>
              ⚡ Currently accepting 2 new projects this month.
            </p>
          </div>

          {status === "success" && (
            <div className="relative z-10 text-center py-12 mb-8 rounded-2xl"
              style={{ background:"rgba(170,255,220,0.08)", border:"1px solid rgba(170,255,220,0.25)" }}>
              <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>✅</div>
              <h3 className="font-headline font-bold text-xl mb-2" style={{ color:"var(--c-tertiary)" }}>Message Received!</h3>
              <p className="text-sm" style={{ color:"var(--c-on-sv)" }}>We'll get back to you within 24 hours.</p>
            </div>
          )}

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
                <input id="contact-email" type="email" placeholder="you@yourbusiness.com" required value={email}
                  onChange={(e) => setEmail(e.target.value)} onBlur={() => touch("email")}
                  aria-invalid={!!(errors.email && touched.email)}
                  className="input-field w-full px-4 py-3 rounded-xl" style={errStyle("email")} />
                <FieldErr field="email" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contact-company" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Business Name</label>
                <input id="contact-company" type="text" placeholder="Your business (optional)" value={company}
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
                      boxShadow: budget === b ? "0 0 12px rgba(187,158,255,0.15)" : "none",
                    }}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color:"var(--c-on-sv)" }}>Tell Us About Your Project *</label>
              <textarea id="contact-message" rows={4} placeholder="What kind of website do you need? Who is it for? What do you want visitors to do?" required value={message}
                onChange={(e) => setMessage(e.target.value)} onBlur={() => touch("message")}
                aria-invalid={!!(errors.message && touched.message)}
                className="input-field w-full px-4 py-3 rounded-xl resize-none" style={errStyle("message")} />
              <FieldErr field="message" />
            </div>

            <p className="text-xs text-center" style={{ color:"var(--c-on-sv)" }}>
              🔒 We'll get back to you within 24 hours. No spam, no pressure.
            </p>

            <button id="contact-submit" type="submit" onClick={createRipple}
              disabled={status === "loading"}
              {...(status !== "loading" ? magnetic : {})}
              aria-live="polite"
              className="btn-primary cta-ring relative w-full py-5 rounded-full font-headline font-bold text-lg disabled:opacity-60">
              {btnLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    {
      heading:"Navigate",
      links:[
        { label:"Services",  onClick:() => scrollTo("services")  },
        { label:"Portfolio", onClick:() => scrollTo("portfolio") },
        { label:"Process",   onClick:() => scrollTo("process")   },
        { label:"Team",      onClick:() => scrollTo("team")      },
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

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  useReveal();
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
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />

      <button id="vws-back-top" aria-label="Scroll back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      </button>
    </>
  );
}
