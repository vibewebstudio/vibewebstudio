## 2025-05-15 - [Plexus Canvas Optimization]
**Learning:** O(n²) distance checks and CPU-bound canvas effects like `shadowBlur` and `createLinearGradient` are major performance killers in high-frequency animation loops. Removing `Math.sqrt` by using squared distances and simplifying rendering to solid colors significantly reduces frame time.
**Action:** Always prefer squared distance comparisons and avoid complex filters/gradients inside `requestAnimationFrame` loops for canvas animations.

## 2025-05-15 - [Next.js Middleware Export Naming]
**Learning:** In this specific environment (Next.js 16.2.4 with Turbopack), the root middleware file is expected to be `proxy.js` and the exported function must be named `proxy`. Using the standard `middleware` name causes a build error.
**Action:** Adhere to the `proxy.js` / `export function proxy` pattern in this codebase despite it being non-standard for Next.js.
