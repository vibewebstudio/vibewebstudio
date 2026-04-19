/**
 * Shared interaction utilities — import only in "use client" components.
 * These functions use browser APIs and must never be called during SSR.
 */

/** Smooth-scroll to a section by its DOM id */
export function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/** Ripple effect — attach via onClick={createRipple} */
export function createRipple(e) {
  const btn  = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const r    = document.createElement("span");
  r.className = "vws-ripple";
  const size  = Math.max(rect.width, rect.height);
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(r);
  setTimeout(() => r.remove(), 700);
}

/** Magnetic hover — spread onto a button element */
export const magnetic = {
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

/** 3-D card tilt on mouse — spread onto a card element */
export const tilt = {
  onMouseMove: (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x    = (e.clientX - rect.left) / rect.width;
    const y    = (e.clientY - rect.top)  / rect.height;
    card.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-6px)`;
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = "";
  },
};
