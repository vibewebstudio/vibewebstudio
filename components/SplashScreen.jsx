"use client";

import { useEffect, useRef, useState } from "react";

// Reduced from 5400ms → 3000ms total, exit at 2200ms
const TOTAL_MS = 3000;
const EXIT_AT  = 2200;

export default function SplashScreen({ onComplete }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const [phase, setPhase] = useState("run");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const rand    = (a, b) => Math.random() * (b - a) + a;
    const lerp    = (a, b, t) => a + (b - a) * t;
    const clamp   = (v, a, b) => Math.max(a, Math.min(b, v));
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    let startTime = null;
    let exiting   = false;

    const stars = Array.from({ length: 300 }, () => ({
      angle:        rand(0, Math.PI * 2),
      dist:         rand(0.1, 1.0),
      size:         rand(0.4, 2.2),
      speed:        rand(0.2, 0.6),
      opacity:      rand(0.5, 1),
      twinkle:      rand(0, Math.PI * 2),
      twinkleSpeed: rand(1, 4),
      hue:          Math.random() > 0.7 ? rand(185, 220) : -1,
    }));

    const streaks = Array.from({ length: 60 }, () => ({
      angle:   rand(0, Math.PI * 2),
      dist:    rand(0.25, 1.1),
      len:     rand(0.04, 0.14),
      speed:   rand(0.35, 0.85),
      opacity: rand(0.3, 0.75),
      width:   rand(0.4, 1.6),
      hue:     Math.random() > 0.5 ? rand(185, 215) : rand(260, 290),
    }));

    const sparks = Array.from({ length: 100 }, () => ({
      angle:   rand(0, Math.PI * 2),
      orbitR:  rand(0.01, 0.09),
      rotSpd:  rand(-3.5, 3.5),
      size:    rand(1, 3.2),
      opacity: rand(0.5, 1),
      drift:   rand(-0.025, 0.025),
      hue:     rand(180, 240),
      birth:   rand(0, 0.35),
    }));

    function buildCircuit() {
      return Array.from({ length: 10 }, (_, a) => {
        const base = (a / 10) * Math.PI * 2;
        const nodes = [];
        let r = 0.04, ang = base;
        for (let s = 0; s < 9; s++) {
          ang += rand(-0.2, 0.2);
          r   += rand(0.03, 0.055);
          nodes.push({ r, ang, branch: Math.random() > 0.6 && s < 7
            ? (() => {
                let ba = ang + rand(0.35, 0.9) * (Math.random() > 0.5 ? 1 : -1);
                let br = r;
                return Array.from({ length: Math.floor(rand(2, 4)) }, () => {
                  ba += rand(-0.12, 0.12); br += rand(0.02, 0.04);
                  return { r: br, ang: ba };
                });
              })()
            : null });
        }
        return nodes;
      });
    }
    const circuit = buildCircuit();

    const RINGS = [
      { birth: 0.12, hue: "0,200,255",  maxR: 0.30 },
      { birth: 0.25, hue: "100,80,255", maxR: 0.42 },
      { birth: 0.40, hue: "0,220,180",  maxR: 0.56 },
    ];

    function render(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t       = clamp(elapsed / TOTAL_MS, 0, 1);

      if (elapsed > EXIT_AT && !exiting) {
        exiting = true;
        setPhase("exit");
        setTimeout(() => onComplete?.(), 750);
      }

      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H / 2;
      const MR = Math.min(W, H) * 0.48;
      const fadeOut = exiting ? clamp((elapsed - EXIT_AT) / 600, 0, 1) : 0;
      const alpha   = 1 - fadeOut;
      const zoom    = lerp(1, 1.12, easeOut(t));

      ctx.fillStyle = `rgba(3,3,10,${lerp(0.22, 0.16, t)})`;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);
      ctx.globalAlpha = alpha;

      // Stars
      stars.forEach((s) => {
        const pull = clamp(t * s.speed * 1.9, 0, 1);
        const d    = lerp(s.dist, 0.012, Math.pow(pull, 1.6));
        const twk  = 0.7 + 0.3 * Math.sin(ts * 0.001 * s.twinkleSpeed + s.twinkle);
        const sx   = cx + Math.cos(s.angle) * d * MR * 2.4;
        const sy   = cy + Math.sin(s.angle) * d * MR * 2.4;
        const sz   = s.size * (1 + pull * 1.8);
        const col  = s.hue >= 0 ? `hsla(${s.hue},100%,85%,${s.opacity * twk})` : `rgba(255,255,255,${s.opacity * twk})`;
        ctx.save();
        ctx.shadowColor = s.hue >= 0 ? `hsl(${s.hue},100%,80%)` : "#fff";
        ctx.shadowBlur  = sz * 4;
        ctx.beginPath(); ctx.arc(sx, sy, sz * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = col; ctx.fill();
        ctx.restore();
      });

      // Streaks
      streaks.forEach((sk) => {
        const pull = clamp(t * sk.speed * 1.7, 0, 1);
        const d1   = lerp(sk.dist, 0.02, Math.pow(pull, 1.4));
        const d2   = d1 + sk.len * (0.25 + pull * 0.75);
        const x1   = cx + Math.cos(sk.angle) * d1 * MR * 2;
        const y1   = cy + Math.sin(sk.angle) * d1 * MR * 2;
        const x2   = cx + Math.cos(sk.angle) * d2 * MR * 2;
        const y2   = cy + Math.sin(sk.angle) * d2 * MR * 2;
        const g    = ctx.createLinearGradient(x2, y2, x1, y1);
        g.addColorStop(0, "rgba(0,0,0,0)");
        g.addColorStop(1, `hsla(${sk.hue},100%,80%,${sk.opacity * pull})`);
        ctx.save();
        ctx.shadowColor = `hsl(${sk.hue},100%,75%)`; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = g; ctx.lineWidth = sk.width * (0.4 + pull * 0.9);
        ctx.stroke(); ctx.restore();
      });

      // Circuit
      const drawT   = clamp((t - 0.14) / 0.56, 0, 1);
      const circleA = clamp((t - 0.2)  / 0.4,  0, 1);
      if (drawT > 0.01 && circleA > 0.01) {
        circuit.forEach((arm) => {
          [-1, 1].forEach((mir) => {
            let prev = null;
            arm.forEach((node, i) => {
              if ((i + 1) / arm.length > drawT) return;
              const ang = node.ang * mir;
              const nx  = cx + Math.cos(ang) * node.r * MR * 1.7;
              const ny  = cy + Math.sin(ang) * node.r * MR * 1.7;
              if (prev) {
                const g = ctx.createLinearGradient(prev.x, prev.y, nx, ny);
                g.addColorStop(0, `rgba(0,200,255,${circleA * 0.18})`);
                g.addColorStop(1, `rgba(0,200,255,${circleA * 0.6})`);
                ctx.save();
                ctx.shadowColor = "rgba(0,210,255,0.9)"; ctx.shadowBlur = 14;
                ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(nx, ny);
                ctx.strokeStyle = g; ctx.lineWidth = 1.3; ctx.stroke();
                ctx.restore();
                if (i % 2 === 0) {
                  ctx.save();
                  ctx.shadowColor = "#00d4ff"; ctx.shadowBlur = 18;
                  ctx.beginPath(); ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
                  ctx.fillStyle = `rgba(0,220,255,${circleA * 0.95})`; ctx.fill();
                  ctx.restore();
                }
                if (node.branch) {
                  let bp = { x: nx, y: ny };
                  node.branch.forEach((bn) => {
                    const ba  = bn.ang * mir;
                    const bnx = cx + Math.cos(ba) * bn.r * MR * 1.7;
                    const bny = cy + Math.sin(ba) * bn.r * MR * 1.7;
                    ctx.save();
                    ctx.shadowColor = "rgba(0,210,255,0.6)"; ctx.shadowBlur = 8;
                    ctx.beginPath(); ctx.moveTo(bp.x, bp.y); ctx.lineTo(bnx, bny);
                    ctx.strokeStyle = `rgba(0,200,255,${circleA * 0.3})`; ctx.lineWidth = 0.7;
                    ctx.stroke(); ctx.restore();
                    bp = { x: bnx, y: bny };
                  });
                }
              }
              prev = { x: nx, y: ny };
            });
          });
        });
      }

      // Rings
      RINGS.forEach((ring) => {
        const age = clamp((t - ring.birth) / 0.48, 0, 1);
        if (age < 0.01) return;
        ctx.save();
        ctx.shadowColor = `rgba(${ring.hue},0.9)`; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(cx, cy, ring.maxR * age * MR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ring.hue},${(1 - age) * 0.75})`; ctx.lineWidth = 1.6;
        ctx.stroke(); ctx.restore();
      });

      // Burst
      const burst = clamp((t - 0.08) / 0.52, 0, 1);
      if (burst > 0.01) {
        const r1 = MR * 0.24 * burst;
        const r2 = MR * 0.09 * burst;
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1 * 2);
        halo.addColorStop(0, `rgba(0,200,255,${0.32 * burst})`);
        halo.addColorStop(0.45, `rgba(100,80,255,${0.15 * burst})`);
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(cx, cy, r1 * 2, 0, Math.PI * 2);
        ctx.fillStyle = halo; ctx.fill();

        const mid = ctx.createRadialGradient(cx, cy, 0, cx, cy, r1);
        mid.addColorStop(0,   `rgba(200,240,255,${0.88 * burst})`);
        mid.addColorStop(0.3, `rgba(0,200,255,${0.7 * burst})`);
        mid.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(cx, cy, r1, 0, Math.PI * 2);
        ctx.fillStyle = mid; ctx.fill();

        const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r2);
        core.addColorStop(0,   `rgba(255,255,255,${burst})`);
        core.addColorStop(0.6, `rgba(180,230,255,${0.8 * burst})`);
        core.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(cx, cy, r2, 0, Math.PI * 2);
        ctx.fillStyle = core; ctx.fill();
      }

      // Sparks
      sparks.forEach((sp) => {
        if (t < sp.birth) return;
        const age   = clamp((t - sp.birth) / 0.65, 0, 1);
        const oR    = sp.orbitR * MR * (0.4 + age * 0.6);
        const angle = sp.angle + ts * 0.001 * sp.rotSpd;
        const sx    = cx + Math.cos(angle) * oR + sp.drift * MR * age;
        const sy    = cy + Math.sin(angle) * oR;
        ctx.save();
        ctx.shadowColor = `hsl(${sp.hue},100%,80%)`; ctx.shadowBlur = sp.size * 6;
        ctx.beginPath(); ctx.arc(sx, sy, sp.size * age, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${sp.hue},100%,80%,${sp.opacity * age})`; ctx.fill();
        ctx.restore();
      });

      ctx.restore();
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  return (
    <div
      aria-hidden="true"
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     9999,
        background: "#03030a",
        pointerEvents: phase === "exit" ? "none" : "all",
        transition: phase === "exit"
          ? "opacity 0.7s ease, transform 0.8s cubic-bezier(0.76,0,0.24,1)"
          : "none",
        opacity:   phase === "exit" ? 0 : 1,
        transform: phase === "exit" ? "scale(1.05)" : "scale(1)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />

      {/* Circular logo — fades in at 1.4s */}
      <div style={{
        position:      "absolute",
        top:           "50%",
        left:          "50%",
        transform:     "translate(-50%, -50%)",
        animation:     "splash-logo-in 0.8s cubic-bezier(0.22,1,0.36,1) 1.4s both",
        pointerEvents: "none",
        zIndex:        10,
      }}>
        <div style={{
          width:        "clamp(140px, 18vw, 220px)",
          height:       "clamp(140px, 18vw, 220px)",
          borderRadius: "50%",
          padding:      "4px",
          background:   "conic-gradient(from 0deg, #00cffc, #bb9eff, #aaffdc, #00cffc)",
          boxShadow:    "0 0 50px rgba(0,207,252,0.5), 0 0 100px rgba(187,158,255,0.3)",
          animation:    "ring-spin 4s linear infinite",
        }}>
          <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:"#03030a", padding:"6px" }}>
            <div style={{ width:"100%", height:"100%", borderRadius:"50%", overflow:"hidden", background:"#0e0e13" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splash-logo-in {
          from { opacity:0; transform:translate(-50%,-46%) scale(0.75); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes ring-spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
      `}</style>
    </div>
  );
}