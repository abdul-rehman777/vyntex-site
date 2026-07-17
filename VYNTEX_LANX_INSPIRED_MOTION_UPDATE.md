# VYNTEX LanX-Inspired Motion Update

## Scope
This pass adds coordinated motion and interaction without adding new marketing sections or changing backend functionality.

## Implemented
- Global motion orchestration with IntersectionObserver-based one-time reveals.
- Central Framer Motion configuration with user reduced-motion support.
- Sitewide pointer-responsive ambient light using existing VYNTEX blue and cyan colors.
- Hero data pulses moving along the existing connected-system paths.
- Calm hero sheen and long-duration ambient dashboard breathing.
- Premium button light sweep and restrained icon movement.
- Smooth shared-layout active indicator for Services category tabs.
- Stable crossfade/slide transitions between pricing categories.
- Staggered service-detail card entrances.
- Restrained hover elevation and edge illumination on service, workflow, process, and industry cards.
- Directional movement on selected industry controls.
- Mobile reductions and complete reduced-motion fallbacks.

## Files created
- components/motion/SiteMotion.tsx

## Files modified
- app/layout.tsx
- app/globals.css
- components/ui/Button.tsx
- components/home/ConnectedHero.tsx
- components/marketing/ServicesPricingShowcase.tsx
- components/marketing/ServicesHub.tsx

## Preserved
- Existing content and section order
- Client OTP login
- Admin and partner access controls
- Supabase, Square, Resend, forms, APIs, middleware, pricing, and reseller margin
- Existing VYNTEX typography and color palette

## Verification
- `npm run typecheck`: passed
- `npm run lint`: passed with no warnings or errors
- `npm run test`: started but did not complete within the isolated runtime timeout
- `npm run build`: started but did not complete within the isolated runtime timeout

The timeout did not expose a TypeScript or lint error. Run the full test and build commands in the normal local or Vercel environment before deployment.
