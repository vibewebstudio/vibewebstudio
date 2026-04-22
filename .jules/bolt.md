## 2025-05-15 - [Canvas Performance Patterns]
**Learning:** High-frequency animation loops in Canvas should avoid expensive operations like `Math.sqrt`, `createLinearGradient`, `createRadialGradient`, and `shadowBlur`. Using squared distance comparisons and simple flat color fills can significantly improve framerate with minimal visual impact.
**Action:** Always prefer squared distance comparisons (`dx*dx + dy*dy < radius*radius`) for collision/proximity checks. Avoid re-creating gradients or using expensive shadow effects inside `requestAnimationFrame` loops.

## 2025-05-15 - [Next.js Proxy/Middleware Export]
**Learning:** In Next.js 16 (Turbopack) with a `proxy.js` file at the root, the middleware function must be a default export or named `proxy`. Using the name `middleware` for the export causes a build failure.
**Action:** Use `export default function proxy(request) { ... }` in `proxy.js` to ensure the middleware is correctly recognized and the build passes.
