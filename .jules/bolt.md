## 2025-05-15 - Canvas and Redundant Logic Optimization
**Learning:** High-frequency canvas operations (Plexus background) using `createLinearGradient` inside $O(n^2)$ loops create significant GPU/CPU overhead. Additionally, the same custom cursor hook (`useCursor`) was active in both `ClientLayout.jsx` and `page.jsx`, resulting in two separate `requestAnimationFrame` loops managing the same DOM elements.
**Action:** Replace `Math.sqrt` with squared distance comparisons and use flat colors instead of gradients for canvas connections. Audit component tree for redundant global hooks like cursor listeners or animation loops.

## 2025-05-15 - Middleware/Proxy Export Naming
**Learning:** In this environment's Next.js 16 setup, the middleware file `proxy.js` requires the export to be named `proxy`. Using the generic name `middleware` causes a silent build failure or runtime error during deployment/build phases.
**Action:** Always name the exported middleware function `proxy` when working with `proxy.js`.
