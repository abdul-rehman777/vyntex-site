import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. SERVER ONLY.
 *
 * The `server-only` import makes any accidental client-side import a build
 * error. This client bypasses Row Level Security, so it is used exclusively for
 * trusted server operations — e.g. inserting public contact/consultation
 * submissions (which have no public INSERT policy by design).
 *
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
let admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!admin) {
    admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return admin;
}
