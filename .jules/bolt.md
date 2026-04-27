## 2026-04-27 - [Next.js 16 Proxy Naming & Canvas Optimization]
**Learning:** In Next.js 16 (Turbopack), the file `proxy.js` at the root must export a function named `proxy` (or default export). Using the name `middleware` causes build failures. For Canvas performance, `shadowBlur` and `createRadialGradient` are extremely expensive in high-frequency animation loops (O(N) or O(N^2)). Replacing them with semi-transparent `arc` fills and hoisting squared distance calculations provides a significant performance boost without visual degradation.

**Action:** Always name the export in `proxy.js` as `proxy`. When optimizing Canvas, prioritize removing shadow/gradient effects in loops and use squared distance comparisons (`dx*dx + dy*dy < r*r`) to avoid `Math.sqrt`.
