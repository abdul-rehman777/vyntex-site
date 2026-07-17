# VYNTEX — Xtract-Inspired Motion Audit and Implementation

**Scope of this pass:** audit the attached production repository against the Xtract-quality
motion brief, verify the existing motion system, close genuine gaps, and document — without
rebuilding, restyling, or altering business logic, content, pricing, routes, or integrations.

**Headline finding:** the repository **already implements a disciplined, Xtract-inspired motion
system** (a prior pass — see `VYNTEX_6D_ANIMATION_AUDIT_AND_IMPLEMENTATION.md` and
`VYNTEX_PREMIUM_MOTION_AND_SERVICES_UPDATE.md`). The live homepage, navigation, buttons, cards,
background atmosphere, page transitions, and reduced-motion behavior meet the brief. The correct
senior-engineer action here is verification plus a small set of surgical, low-risk coordination and
build-hygiene fixes — **not** manufactured churn. That is what was done.

---

## 1. Xtract reference analysis

The Xtract Framer template was used as a *quality reference*, not a design to copy. I could not
drive the live Framer preview inside this build sandbox (no browser/GPU), so the analysis below
is the motion **language** the brief itself enumerates and that the template is known for, mapped
to VYNTEX-appropriate decisions.

| Xtract trait | Adopt for VYNTEX? | Rationale |
|---|---|---|
| Staged hero appear sequence | **Yes** | Communicates the "disconnected → connected" story. Already implemented. |
| Once-on-enter section reveals (fade + short rise) | **Yes** | Premium, calm, non-repeating. Already implemented. |
| Card reveals with small stagger + subtle scale (~0.98→1) | **Yes** | Present via GlowCard hover + section stagger. |
| Animated active indicator on tabs, crossfade content | **Yes** | Present in the services pricing showcase. |
| Restrained ticker/marquee | **Rejected (no content basis)** | Brief forbids adding content just to fill a marquee; VYNTEX has no logo wall / partner list to scroll. |
| Custom cursor | **Rejected** | Accessibility/usability risk; brief says never hide the native cursor. Not implemented. |
| Aggressive card tilt / cursor-follow glow | **Rejected** | Brief calls for restrained depth; a prior pass explicitly removed cursor-tilt from the hero. |
| Heavy page-load overlay / full-screen video | **Rejected** | Performance + LCP. Not present. |

---

## 2. Current VYNTEX animation audit (live vs. orphaned)

I traced every animated surface to whether it renders on a live route.

**Live motion system (renders in production):**
- `app/template.tsx` — global route-in transition (opacity/translate), reduced-motion static.
- `components/home/*` (homepage) — `ConnectedHero`, `WorkflowDemo`, `ServiceSystems`,
  `BeforeAfterSystem`, `ImplementationProcess`, `IndustrySelector`, `FinalSystemCTA`. All share
  tokens from `components/home/motion.ts` (ease `[0.22,1,0.36,1]`, reveal 0.55s, stagger 0.09).
- `components/SiteAtmosphere.tsx` — CSS/SVG background; pointer parallax gated behind
  `pointer: fine` **and** `prefers-reduced-motion: no-preference`; all atmosphere animation is
  killed under reduced motion.
- `components/Nav.tsx` — sticky, scroll shadow, animated underline, `aria-current`, mobile drawer
  with `aria-expanded`/`aria-controls` and Escape-to-close.
- `components/ui/Button.tsx` — `motion-safe:hover:-translate-y-0.5`, `focus-visible` ring, brand
  colors only, no bounce.
- `components/ui/GlowCard.tsx` — pure-CSS hover lift + blue glow, `motion-safe` gated, featured
  emphasis in brand blue only.
- `components/marketing/*` — `PageShell`, `MarketingHero`, `ServicesPricingShowcase` (animated tab
  indicator + crossfade, with reduced-motion CSS overrides).

**Reduced-motion coverage (verified in `app/globals.css`):** a global
`@media (prefers-reduced-motion: reduce)` reset neutralizes all `animation`/`transition` durations,
backed by targeted overrides for the hero stage, services tabs/cards, hero sheen, and the entire
site atmosphere. This is comprehensive.

**Problems identified:**
1. **Token fragmentation.** Three near-identical reveal easing curves coexisted:
   `lib/motion.ts` `ease.smooth = [0.25,0.1,0.25,1]`, `components/home/motion.ts` `[0.22,1,0.36,1]`,
   and `components/ui/AnimatedSection.tsx` `[0.25,0.46,0.45,0.94]`. The brief asks for one
   coordinated rhythm and flags token duplication explicitly.
2. **Orphaned legacy components (dead code).** The following have **zero** import references and
   are superseded by the `home/*` + `marketing/*` rewrite:
   `components/{About,Industries,Pricing,Services,AIShowcase,HowItWorks,CaseStudies,FinalCTA}.tsx`,
   `components/home/HeroAnimation.tsx`, and all of `components/visuals/*`
   (`DashboardSequence`, `ServiceCards`, `ProcessTimeline`, `IndustrySelector`, `TransformationCompare`).
   They do **not** ship in any route bundle (Next tree-shakes unimported modules — confirmed by the
   build output), so they cause no runtime or performance harm; they are repository dead weight only.
3. **Typecheck gate papercut.** `npm run typecheck` (standalone `tsc --noEmit`) reported one error
   — `TS2882` on the global `import "@/app/globals.css"` side-effect — because bare `tsc` lacks
   Next's CSS loader knowledge. Next's own build type-check passes it.

**Not problems (verified):** no scroll hijacking, no autoplay audio, no hover-only essential
information, no aggressive continuous JS while idle (atmosphere is CSS-driven), no fake dashboards,
testimonials, logos, counts, or awards, no off-brand colors.

---

## 3. Motion strategy

Preserve the existing four-level hierarchy, which already matches the brief:
- **L1 Signature:** hero connection sequence (module entrance → path draw → data pulse → settle).
- **L2 Storytelling:** homepage workflow/process/industry sections, once-on-enter.
- **L3 Controls:** nav underline, tabs indicator, pricing cards, buttons.
- **L4 Micro:** hover lifts, focus states, status pulses.

The only strategic change was to **collapse the three reveal curves into one canonical ease-out**
(`[0.22,1,0.36,1]`) so page transitions and section reveals move on a single rhythm.

---

## 4. Effects adopted (this pass)
- One canonical reveal/transition easing across the live site (see §7).

## 5. Effects intentionally rejected
- Ticker/marquee (no existing content to justify it; brief forbids adding content for it).
- Custom cursor (accessibility/usability risk).
- Deleting the orphaned components in this pass (destructive, not required, no bundle impact — see
  Remaining Limitations for the recommended follow-up).

---

## 6. Motion system (tokens) — after this pass

`lib/motion.ts` is now the documented single source of truth for the shared ease-out; the homepage
token file mirrors the identical value and cross-references it. Reveal duration is 0.55s across the
homepage sections and `AnimatedSection`. Micro (0.15–0.24s), controls (0.2s), and section reveals
(0.55s) sit within the brief's recommended timing bands. No new motion dependency was added —
Framer Motion (already installed) remains the only motion library.

---

## 7. Files modified
- `lib/motion.ts` — `ease.smooth` changed `[0.25,0.1,0.25,1.0]` → `[0.22,1,0.36,1]`; documented as
  canonical. **Live effect:** page transitions in `app/template.tsx` now match homepage reveals.
- `components/ui/AnimatedSection.tsx` — reveal `duration 0.5 → 0.55`, `ease → [0.22,1,0.36,1]`.
  Removes the third divergent curve. (Its only consumers are orphaned components, so **no live-route
  visual change**; this is future-proofing/consistency.)
- `components/home/motion.ts` — added a comment marking the ease as canonical (mirrors `lib/motion`).

## 8. Files created
- `types/global-css.d.ts` — ambient `declare module "*.css";` so standalone `tsc`/CI resolves global
  stylesheet side-effect imports. Type-resolution hygiene only; no build or runtime change. CSS
  Modules keep their more-specific Next-provided typings.
- `VYNTEX_XTRACT_INSPIRED_MOTION_AUDIT_AND_IMPLEMENTATION.md` — this document.

## 9. Dependencies added
- **None** in the application. (A single dev-only platform binary,
  `@rollup/rollup-linux-x64-gnu`, was installed **locally, unsaved** so Vitest could run — the
  packaged `node_modules` shipped Windows-only rollup natives. This is not part of the deliverable
  and does not affect `package.json`/`package-lock.json`.)

---

## 10. Performance comparison
Build output is identical before and after:
- Homepage `/`: **10 kB** route / **289 kB** First Load JS (unchanged).
- Shared JS: **102 kB** (unchanged). Middleware: **90.4 kB** (unchanged).

## 11. Bundle-size comparison
No change — the edits are easing constants plus a type-only `.d.ts`. Expected and confirmed.

---

## 12. Accessibility behavior
- Global `prefers-reduced-motion` reset plus targeted overrides; every animated surface has a static
  equivalent. Verified in `app/globals.css`.
- Keyboard: nav is focusable with visible `focus-visible` rings; mobile drawer traps/close via
  Escape; buttons and links carry accessible labels; decorative SVG/atmosphere is `aria-hidden`.
- No flashing/strobing, no autoplay audio, no scroll hijacking, no hover-only essential content.

## 13. Mobile behavior
- Hero simplifies on small viewports (no shrunk desktop scene); primary CTA is above the fold.
- Pointer parallax is disabled on touch (`pointer: fine` gate). No horizontal overflow observed in
  the source layout (grid/flex with `max-w`/`whitespace-nowrap` guards on nav).

## 14. Reduced-motion behavior
- Hero renders the completed connected state; infinite pulses/rotation and the hero sheen are
  disabled; atmosphere animation is fully stopped; tabs/cards drop transforms and transitions.

---

## 15. Test results (actually run in this environment)
- `tsc --noEmit` (typecheck gate): **PASS — 0 errors** (was 1 environmental `TS2882` before the
  ambient CSS declaration).
- Vitest suite: **PASS — 94/94 tests, 9 files** (validation, wholesale-isolation, square-webhook,
  orders, agreement, translations, pricing, cron-auth).
- `next build`: **PASS**, clean. Only pre-existing benign warnings — webpack cache big-string
  serialization, and Supabase's `process.version` Edge-runtime notice (upstream, unrelated to motion).

## 16. Visual QA results
**Not performed in this pass, and not fabricated.** This sandbox has no browser/GPU, so I did not
render pages, capture screenshots, or run Lighthouse. Per the brief's own instruction ("Do not claim
visual QA / Lighthouse unless you actually did it"), those are listed as limitations rather than
reported as results. Verification here is: static inspection of every animated surface, a clean
`next build`, a green typecheck, and 94 passing tests. Manual visual QA + Lighthouse should be run
on a preview deploy (checklist in §Deployment).

---

## 17. Remaining limitations
1. **Browser-based QA + Lighthouse** were not run here — do them on a Vercel preview.
2. **Orphaned components not deleted.** Recommended follow-up (safe, one commit): remove
   `components/{About,Industries,Pricing,Services,AIShowcase,HowItWorks,CaseStudies,FinalCTA}.tsx`,
   `components/home/HeroAnimation.tsx`, and `components/visuals/*` after a final `grep` confirms no
   dynamic references. Left in place this pass to avoid a destructive change outside the motion brief.
3. **Packaged `node_modules` was Windows-built.** Reinstall on the deploy platform
   (`npm ci`) so native binaries (rollup, swc) match.

## 18. Deployment steps
1. `npm ci` (clean install for the target platform).
2. `npm run verify` (typecheck → lint → test → build).
3. Ensure env vars are set (see `.env.example`): Supabase, Resend, Upstash, Square, `CRON_SECRET`.
4. Deploy to Vercel; open a **preview** URL.
5. Manual QA on preview: desktop/tablet/mobile hero, EN/ES, reduced-motion (OS toggle), keyboard nav,
   services tabs + pricing cards, consultation modal, contact form, client-login smoke test,
   admin/partner route protection, checkout route. No console errors, no hydration warnings, no
   horizontal overflow, no idle CPU spikes.
6. Run Lighthouse (target LCP < 2.5s, CLS < 0.1, INP < 200ms) on the preview.
7. Promote to production.

## 19. Rollback steps
The change set is tiny and self-contained. To revert:
- Restore `lib/motion.ts` `ease.smooth` to `[0.25, 0.1, 0.25, 1.0]`.
- Restore `components/ui/AnimatedSection.tsx` transition to `{ duration: 0.5, ease: [0.25,0.46,0.45,0.94] }`.
- Remove the comment in `components/home/motion.ts`.
- Delete `types/global-css.d.ts` (note: the `npm run typecheck` gate will then report the pre-existing
  `TS2882` again under standalone `tsc`).

Or simply `git revert` the commit containing these four files.

---

## Final quality check (verified against the brief)
Brand unchanged · existing copy unchanged · no new content added · routes/portals/pricing unchanged ·
reseller margin still 30% (server-only pricing untouched) · hero explains connected business systems ·
motion coordinated on one rhythm · not excessive · reduced motion complete · keyboard nav intact ·
consultation modal intact · no fake proof · no off-brand colors · no generic AI imagery · no motion
that delays understanding · no performance regression (bundle identical).

---

## Addendum — Nexaro-inspired additions (scroll effects + text reveals)

Requested scope: apply Nexaro's motion vocabulary, molded to VYNTEX, **safe enhancements only —
scroll effects + text reveals, no new elements**. (Custom cursors, light/dark toggle, and any
fake-metric/logo sections were rejected as before.)

**Added:**
- `components/ui/RevealText.tsx` (new) — accessible per-word reveal on the canonical curve
  `[0.22,1,0.36,1]`. Container carries `aria-label`; word spans are `aria-hidden` (screen readers
  read the clean string once). Renders plain static text under `prefers-reduced-motion`. It only
  re-presents the exact string passed to it — no copy added/changed.
- **Text reveals applied** to the live homepage hero H1 (`ConnectedHero`, plays on mount, replacing
  the prior single-block masked reveal) and the six homepage section H2s (`WorkflowDemo`,
  `BeforeAfterSystem`, `IndustrySelector`, `ServiceSystems`, `ImplementationProcess`,
  `FinalSystemCTA` — previously static, now reveal on scroll-in).
- **Scroll effect** — a subtle scroll-linked parallax on the homepage hero visual stage via
  `useScroll`/`useTransform` (±34px, GPU transform only). Flat under reduced motion.

**Performance guard (important):** an initial attempt also applied `RevealText` to `MarketingHero`,
which pulled framer-motion into the lighter marketing routes and raised `/about` from **254 → 292 kB**
First Load JS. That was reverted. Text reveals now live **only where framer-motion is already
loaded** (the homepage), so there is **no bundle regression on marketing pages**.

**Bundle after this addendum:**
- `/` (homepage): 10 kB → **13.5 kB** route, 289 → **293 kB** First Load (RevealText + scroll hooks;
  cost localized to the flagship page).
- `/about`, `/industries`: **254 kB** (unchanged). `/services`: 293 → **295 kB** (already loaded
  framer-motion). Shared JS: **102 kB** (unchanged).

**Gates:** typecheck PASS (0 errors) · lint PASS (no warnings) · tests **94/94** · `next build` clean.

**Not done here (same honest limitations):** no browser render / Lighthouse in this sandbox — verify
the word-reveal timing and hero parallax on a preview deploy.

**Marketing-hero reveals (optional follow-up):** if you later want the same headline reveal on
`/about`, `/services`, etc. without the framer-motion cost, I can ship a CSS + IntersectionObserver
variant of `RevealText` (no motion library) so those routes stay light. Say the word.
