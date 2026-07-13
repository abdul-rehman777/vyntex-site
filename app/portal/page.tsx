import type { Metadata } from "next";
import { requireUser, getOrCreateProfile, type UserProfile } from "@/lib/auth";
import { getPartnerAccess } from "@/lib/reseller";
import { isAdmin } from "@/lib/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalDashboard from "@/components/portal/PortalDashboard";
import type { SupportRequestRow } from "@/components/portal/SupportRequestList";

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

// Auth state must never be cached across users.
export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const user = await requireUser();
  const profile = await getOrCreateProfile(user);

  // Resolved server-side. Only the STATE string reaches the browser — never a
  // partner record, and never any wholesale pricing.
  const access = await getPartnerAccess(user);
  const admin = await isAdmin(user);

  const fallback: UserProfile = {
    id: user.id,
    auth_user_id: user.id,
    full_name: null,
    business_name: null,
    phone: null,
    preferred_language: "en",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let requests: SupportRequestRow[] = [];
  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("support_requests")
      .select("id, subject, message, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) requests = data as SupportRequestRow[];
  } catch {
    /* leave requests empty on failure */
  }

  return (
    <PortalDashboard
      profile={profile ?? fallback}
      requests={requests}
      email={user.email ?? ""}
      partnerState={access.state}
      isAdmin={admin}
    />
  );
}
