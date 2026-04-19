"use client";

import { useEffect } from "react";

/** Wires up all passive DOM effects: scroll reveal, cursor glow, parallax, back-to-top */
export default function PageEffects() {
  // ── Scroll Reveal ───────────────────────────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Custom Cursor Glow (desktop/mouse only) ─────────────────────────────
  useEffect(() => {
    // Skip entirely on touch devices — no cursor exists there
    if (window.matchMedia("(pointer: coarse)").matches) return;

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

  // ── Parallax Scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    // Disable on mobile — too expensive and not noticeable
    if (window.matchMedia("(pointer: coarse)").matches) return;

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

  // ── Back to Top ─────────────────────────────────────────────────────────
  useEffect(() => {
    const btn = document.getElementById("vws-back-top");
    if (!btn) return;
    const onScroll = () => btn.classList.toggle("visible", window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null; // pure side-effects, renders nothing
}
