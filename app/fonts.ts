/**
 * System font stacks keep production builds deterministic and avoid runtime or
 * build-time requests to third-party font CDNs. Tailwind consumes these CSS
 * variable names exactly as before.
 */
export const inter = { variable: "font-system-sans" } as const;
export const jetbrainsMono = { variable: "font-system-mono" } as const;
