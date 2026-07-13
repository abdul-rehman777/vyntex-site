/**
 * Test stub for the `server-only` package.
 *
 * The real package throws on import outside a React Server Component, which is
 * exactly what makes it a build-time guarantee in Next.js — and exactly what
 * stops Vitest from unit-testing the server modules it protects.
 *
 * Aliasing it to a no-op in the TEST runner does NOT weaken the production
 * guarantee: Next.js still enforces it at build time, and
 * tests/unit/wholesale-isolation.test.ts independently asserts that every
 * secret-bearing module still carries the real `import "server-only"` line.
 * If someone deletes that import, the isolation test fails even though this
 * stub exists.
 */
export {};
