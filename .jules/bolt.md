## 2025-05-22 - [Redundant Animation Loops]
**Learning:** Found redundant custom cursor logic and DOM elements between `ClientLayout.jsx` and `app/page.jsx`. Both were running separate `requestAnimationFrame` loops and mousemove event listeners for the same effect, causing unnecessary CPU usage and potential DOM conflicts.
**Action:** Centralize global effects in `ClientLayout.jsx` and remove duplicates from individual pages.

## 2025-05-22 - [Canvas Performance Bottlenecks]
**Learning:** High-frequency loops in `PlexusCanvas` were using expensive operations like `Math.sqrt`, `createLinearGradient`, and `shadowBlur` for every node and connection. With ~160 nodes, this can lead to thousands of calls per frame.
**Action:** Use squared distance comparisons to avoid `Math.sqrt`, replace complex gradients with flat colors, and remove `shadowBlur` in favor of simpler drawing techniques.
