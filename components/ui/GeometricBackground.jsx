"use client";

import { useEffect, useRef } from "react";

export default function ShootingStars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    function randBetween(a, b) { return a + Math.random() * (b - a); }

    const COLORS = [
      "187,158,255",
      "0,207,252",
      "170,255,220",
      "255,255,255",
    ];

    class Star {
      constructor() { this.reset(true); }

      reset(initial = false) {
        // Pick a random edge: 0=top, 1=bottom, 2=left, 3=right
        this.edge = Math.floor(Math.random() * 4);

        if (this.edge === 0) {
          // spawn top, shoot downward
          this.x     = randBetween(-50, W + 50);
          this.y     = randBetween(-60, -10);
          this.angle = randBetween(20, 160) * (Math.PI / 180);
        } else if (this.edge === 1) {
          // spawn bottom, shoot upward
          this.x     = randBetween(-50, W + 50);
          this.y     = H + randBetween(10, 60);
          this.angle = randBetween(200, 340) * (Math.PI / 180);
        } else if (this.edge === 2) {
          // spawn left, shoot rightward
          this.x     = randBetween(-60, -10);
          this.y     = randBetween(-50, H + 50);
          this.angle = randBetween(-70, 70) * (Math.PI / 180);
        } else {
          // spawn right, shoot leftward
          this.x     = W + randBetween(10, 60);
          this.y     = randBetween(-50, H + 50);
          this.angle = randBetween(110, 250) * (Math.PI / 180);
        }

        if (initial) {
          this.x = randBetween(0, W);
          this.y = randBetween(0, H);
        }

        this.speed = randBetween(9, 20);
        this.vx    = Math.cos(this.angle) * this.speed;
        this.vy    = Math.sin(this.angle) * this.speed;
        this.len   = randBetween(120, 340);
        this.width = randBetween(1.2, 2.8);
        this.col   = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = randBetween(0.6, 1.0);
        this.life  = 1.0;
        this.decay = randBetween(0.010, 0.022);
        this.trail = [];
      }

      update() {
        this.x    += this.vx;
        this.y    += this.vy;
        this.life -= this.decay;
        this.trail.push({ x: this.x, y: this.y, life: this.life });
        if (this.trail.length > 20) this.trail.shift();

        const offscreen =
          this.x < -200 || this.x > W + 200 ||
          this.y < -200 || this.y > H + 200;
        if (this.life <= 0 || offscreen) this.reset();
      }

      draw() {
        if (this.life <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;

        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0,   `rgba(${this.col},0)`);
        grad.addColorStop(0.5, `rgba(${this.col},${(this.alpha * this.life * 0.35).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(${this.col},${(this.alpha * this.life).toFixed(3)})`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = this.width;
        ctx.lineCap     = "round";
        ctx.shadowColor = `rgba(${this.col},${(this.life * 0.8).toFixed(2)})`;
        ctx.shadowBlur  = 14;
        ctx.stroke();
        ctx.restore();

        // glowing head
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width * 2, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(${this.col},${(this.alpha * this.life).toFixed(3)})`;
        ctx.shadowColor = `rgba(${this.col},0.9)`;
        ctx.shadowBlur  = 22;
        ctx.fill();
        ctx.restore();

        // sparkle trail
        this.trail.forEach((p, i) => {
          const t = i / this.trail.length;
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            p.x + randBetween(-4, 4),
            p.y + randBetween(-4, 4),
            randBetween(0.4, 1.8), 0, Math.PI * 2
          );
          ctx.fillStyle   = `rgba(${this.col},${(t * p.life * 0.45).toFixed(3)})`;
          ctx.shadowColor = `rgba(${this.col},0.5)`;
          ctx.shadowBlur  = 6;
          ctx.fill();
          ctx.restore();
        });
      }
    }

    const POOL  = 14;
    const stars = Array.from({ length: POOL }, () => new Star());
    stars.forEach((s) => { s.life = randBetween(0.1, 1.0); });

    let burstTimer = 0;
    const BURST_INTERVAL = 150;

    let raf;
    function tick() {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, W, H);

      burstTimer++;
      if (burstTimer >= BURST_INTERVAL) {
        burstTimer = 0;
        const n = Math.floor(randBetween(3, 6));
        for (let i = 0; i < n; i++) {
          stars[Math.floor(Math.random() * POOL)].reset();
        }
      }

      stars.forEach((s) => { s.update(); s.draw(); });
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        0,
        borderRadius:  "inherit",
      }}
    />
  );
}