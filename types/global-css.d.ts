/**
 * Ambient declaration for global stylesheet *side-effect* imports
 * (e.g. `import "@/app/globals.css"` in app/layout.tsx).
 *
 * Next.js resolves these through its own compiler pipeline, but a standalone
 * `tsc --noEmit` (the `npm run typecheck` gate, and CI) has no loader knowledge
 * of them and reports TS2882. This declaration only covers whole-file CSS
 * imports used for their side effects; CSS Modules (`*.module.css`) keep their
 * more-specific Next-provided object typings and are unaffected.
 *
 * Build/runtime behavior is unchanged — this is type-resolution hygiene only.
 */
declare module "*.css";
