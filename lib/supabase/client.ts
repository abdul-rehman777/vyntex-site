"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for use inside Client Components.
 * Uses the public anon key only. Created lazily so the app still builds and
 * runs locally before Supabase env vars are configured; it throws a clear
 * error only if actually used without configuration.
 *
 * Used by the login/verify screens and the nav to reflect auth state.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createBrowserClient(url, anonKey);
}
