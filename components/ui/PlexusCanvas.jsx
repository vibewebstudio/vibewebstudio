"use client";

import { useEffect, useRef } from "react";

const PALETTES = [
  [0, 207, 252],
  [187, 158, 255],
  [170, 255, 220],
  [120, 180, 255],
];

export default function PlexusCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Skip on touch devices — saves battery, they have no mouse anyway
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    let W, H;
    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Fewer nodes on small screens (O(n²) complexity)
    const isMobile    = window.innerWidth < 768;
    const NODE_COUNT  = isMobile
      ? 25
      : Math.min(Math.floor((window.innerWidth * window.innerHeight) / 12000), 100);
    const CONNECT_DIST  = isMobile ? 90 : 140;
    const CURSOR_RADIUS = 130;
    const CURSOR_FORCE  = 0.018;

    const nodes = Array.from({ length: NODE_COUNT }, () => {
      const pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      return {
        x: Math.random() * (window.innerWidth || 1440),
        y: Math.random() * (window.innerHeight || 800),
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

    const SPARK_COUNT = isMobile ? 20 : 40;
    const sparks = Array.from({ length: SPARK_COUNT }, () => ({
      x:    Math.random() * (window.innerWidth || 1440),
      y:    Math.random() * (window.innerHeight || 800),
      vx:   (Math.random() - 0.5) * 0.5,
      vy:   (Math.random() - 0.5) * 0.5,
      life: Math.random(),
      pal:  PALETTES[Math.floor(Math.random() * PALETTES.length)],
    }));

    const ripples = [];
    let t = 0;
    let raf;

    // Mouse / touch handlers
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    if (!isTouch) {
      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
    }

    // Pause when off-screen
    const visObs = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0 }
    );
    visObs.observe(canvas);

    // Pause when tab hidden
    const onVisChange = () => { pausedRef.current = document.hidden; };
    document.addEventListener("visibilitychange", onVisChange);

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

      // Update + draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.y += Math.sin(t * n.waveFreq * 60 + n.wavePhase) * 0.12;
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (!isTouch && dist < CURSOR_RADIUS && dist > 0) {
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
        // Node glow (radial)
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grad.addColorStop(0, `rgba(${r},${g},${b},${0.22 * glow})`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
        // Node dot
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.85 * glow})`;
        ctx.shadowBlur = 8 * glow; ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      // Connections — use flat color (cheaper than createLinearGradient per pair)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const ni = nodes[i], nj = nodes[j];
          const dx = ni.x - nj.x, dy = ni.y - nj.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > CONNECT_DIST) continue;
          const alpha = (1 - d / CONNECT_DIST) * 0.22;
          const [r, g, b] = ni.pal;
          ctx.beginPath(); ctx.moveTo(ni.x, ni.y); ctx.lineTo(nj.x, nj.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.65; ctx.stroke();
          // Traveling dot
          const phase = (t * 0.012 + i * 0.31 + j * 0.17) % 1;
          const px = ni.x + (nj.x - ni.x) * phase;
          const py = ni.y + (nj.y - ni.y) * phase;
          ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${alpha * 2})`; ctx.fill();
        }
      }

      // Sparks
      for (const s of sparks) {
        s.x += s.vx; s.y += s.vy; s.life -= 0.003;
        if (s.life <= 0) {
          s.x = Math.random() * cw; s.y = Math.random() * ch;
          s.vx = (Math.random() - 0.5) * 0.5; s.vy = (Math.random() - 0.5) * 0.5;
          s.life = 0.6 + Math.random() * 0.4;
          s.pal = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        }
        const [r, g, b] = s.pal;
        ctx.beginPath(); ctx.arc(s.x, s.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${s.life * 0.5})`; ctx.fill();
      }

      // Cursor halo + ripples (desktop only)
      if (!isTouch && mx > 0 && mx < cw) {
        if (t % 28 === 0) ripples.push({ x: mx, y: my, r: 0, life: 1 });
        const halo = ctx.createRadialGradient(mx, my, 0, mx, my, CURSOR_RADIUS);
        halo.addColorStop(0, "rgba(187,158,255,0.10)");
        halo.addColorStop(0.5, "rgba(0,207,252,0.05)");
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(mx, my, CURSOR_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = halo; ctx.fill();
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += 2.8; rp.life -= 0.028;
        if (rp.life <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(187,158,255,${rp.life * 0.25})`; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      visObs.disconnect();
      document.removeEventListener("visibilitychange", onVisChange);
      if (!isTouch) {
        canvas.removeEventListener("mousemove", onMove);
        canvas.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block", pointerEvents:"all" }}
    />
  );
}
