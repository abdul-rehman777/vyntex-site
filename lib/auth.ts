import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side auth helpers. These use the cookie-bound server client, so they
 * respect the user's session and RLS. Route/page protection lives here (plus
 * middleware) — never rely on client-side checks alone.
 */

export interface UserProfile {
  id: string;
  auth_user_id: string;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  preferred_language: string | null;
  created_at: string;
  updated_at: string;
}

/** Returns the signed-in user, or null. Safe when Supabase is unconfigured. */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** Requires a signed-in user; otherwise redirects to /login. */
export async function requireUser(): Promise<User> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Returns the user's profile, creating it on first access if missing.
 * RLS ensures a user can only ever read/insert their own row.
 */
export async function getOrCreateProfile(user: User): Promise<UserProfile | null> {
  const supabase = await getSupabaseServerClient();

  const { data: existing, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[auth] profile read failed:", error.message);
    return null;
  }
  if (existing) return existing as UserProfile;

  const { data: created, error: insertError } = await supabase
    .from("user_profiles")
    .insert({
      auth_user_id: user.id,
      full_name: null,
      business_name: null,
      phone: null,
      preferred_language: "en",
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("[auth] profile create failed:", insertError.message);
    return null;
  }
  return created as UserProfile;
}
