import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Server Supabase client for Server Components, Route Handlers, and Server
 * Actions. Reads/writes the auth session cookies. In Next 15 `cookies()` is
 * async, so this helper is async too.
 *
 * Never expose the service-role key to the browser. Use `getSupabaseAdmin()`
 * (see note below) only in trusted server code that must bypass RLS.
 *
 * Used by the portal, the partner gate, and every RLS-scoped read.
 */
export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // `setAll` was called from a Server Component. Safe to ignore when
          // middleware is refreshing the session (see middleware.ts).
        }
      },
    },
  });
}
