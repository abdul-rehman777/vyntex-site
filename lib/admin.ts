import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Administrator authorization. SERVER ONLY.
 *
 * An administrator is a DATABASE FACT: a row in `admin_users` with
 * is_active = true. There is no admin code, no magic query string, no
 * environment-variable password, and no client-side flag. Those patterns all
 * put the decision somewhere an attacker can reach; this one does not.
 *
 * The check runs against the caller's own RLS-scoped session, so a user can
 * only ever confirm their OWN admin row — the admin list itself is not readable
 * through the API by anybody.
 */

export type AdminRole = "admin" | "super_admin";

export interface AdminRecord {
  id: string;
  auth_user_id: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
}

/** Returns the caller's admin record, or null. Never throws. */
export async function getAdmin(user: User): Promise<AdminRecord | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, auth_user_id, email, role, is_active")
      .eq("auth_user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return null;
    return data as AdminRecord;
  } catch {
    return null;
  }
}

/** True only for an active administrator. The single gate for every admin view. */
export async function isAdmin(user: User): Promise<boolean> {
  return (await getAdmin(user)) !== null;
}

/**
 * Page guard. A non-admin is sent to the ordinary portal — NOT to a "403" page,
 * which would confirm that /portal/admin exists and is worth attacking.
 */
export async function requireAdmin(user: User): Promise<AdminRecord> {
  const admin = await getAdmin(user);
  if (!admin) redirect("/portal");
  return admin;
}

/** API guard. Returns null when the caller is not an active administrator. */
export async function requireAdminApi(user: User | null): Promise<AdminRecord | null> {
  if (!user) return null;
  return getAdmin(user);
}
