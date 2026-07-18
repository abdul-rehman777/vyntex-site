# VYNTEX Mobile Performance Optimization

## Changes made

- Added adaptive motion detection for mobile, touch, data-saver, low-memory, and limited-CPU devices.
- Disabled the sitewide pointer atmosphere and magnetic cursor below desktop widths.
- Removed continuous ambient Framer Motion loops on constrained devices while preserving one-time entrance reveals.
- Paused the customer-journey autoplay on mobile and low-power devices; the workflow remains fully interactive by tap.
- Removed blur-based hero text entrance and replaced it with GPU-friendly opacity and transform motion.
- Disabled expensive backdrop filters, large glow layers, sheen loops, light streams, and perspective transforms on mobile and tablet.
- Added content-visibility and containment for below-the-fold homepage sections.
- Reduced mobile shadow complexity and removed heavy background animation layers.
- Preserved desktop cinematic motion, all content, portals, forms, pricing, Supabase, Square, Resend, and the 30% reseller margin.

## Files modified

- `app/globals.css`
- `components/SiteAtmosphere.tsx`
- `components/MagneticCursor.tsx`
- `components/home/ConnectedHero.tsx`
- `components/home/WorkflowDemo.tsx`
- `components/home/ServiceSystems.tsx`

## File created

- `hooks/useAdaptiveMotion.ts`

## Validation

- TypeScript: passed
- ESLint: passed with no warnings or errors
- Unit/integration suite: 93 passed; one Square webhook test exceeded the default 5-second test timeout
- Square webhook test rerun with a 10-second allowance: 11 of 11 passed
- Next.js production compilation started but exceeded the isolated execution timeout before completion

## Deployment

1. Replace the matching files in the production repository.
2. Run `npm ci`.
3. Run `npm run typecheck`.
4. Run `npm run lint`.
5. Run `npm run test`.
6. Run `npm run build`.
7. Commit and push to the production branch.
