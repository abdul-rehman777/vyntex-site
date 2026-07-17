# VYNTEX Site-Wide Spatial Motion Update

## Completed
- Removed the visible Skip to content link from the global navigation.
- Added Home / Inicio to desktop and mobile primary navigation.
- Added a global spatial background environment to the root layout so it appears consistently across public pages.
- Built the environment with CSS 3D perspective, SVG data paths, restrained cursor depth, layered grids, brand halos, and data nodes.
- Used only the existing VYNTEX navy, blue, cyan, silver, and white design tokens.
- Removed purple, yellow, orange, and unrelated teal accents from the Services pricing presentation.
- Preserved all routes, portals, authentication, pricing, reseller pricing, API routes, forms, Square, Supabase, Resend, and environment behavior.
- Added reduced-motion and mobile fallbacks.

## Files changed
- app/layout.tsx
- app/globals.css
- components/Nav.tsx
- lib/site.ts

## File created
- components/SiteAtmosphere.tsx

## Validation
- npm run typecheck: passed
- npm run lint: passed with no warnings or errors
- npm run test: 93 passed; one existing Square webhook integration test exceeded its 5-second timeout in this container
- npm run build: production compilation passed; process later exceeded the container timeout during Next.js post-compilation checks

## Deployment
1. Replace the repository files with this package.
2. Run npm ci.
3. Run npm run typecheck and npm run build.
4. Commit and push to the production branch.
