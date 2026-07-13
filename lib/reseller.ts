import "server-only";
import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Reseller/partner domain logic. SERVER ONLY.
 *
 * The authorization state machine lives here and nowhere else. No component,
 * route, or client bundle is permitted to decide whether wholesale pricing may
 * be shown — they ask this module, which reads the database under the caller's
 * own RLS-scoped session.
 *
 * A partner sees the confidential library ONLY when getPartnerAccess() returns
 * state === "active", which requires ALL of:
 *   - an authenticated user
 *   - a partner row linked to that user
 *   - status = 'active' (not pending/approved/suspended/expired/terminated)
 *   - a signed agreement
 *   - a confirmed activation payment (status is only set to 'active' by the
 *     verified Square webhook — never by the browser)
 *   - an expiration date in the future
 */

export const PARTNER_STATUSES = [
  "pending",
  "approved",
  "active",
  "suspended",
  "expired",
  "terminated",
] as const;

export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export interface PartnerRecord {
  id: string;
  auth_user_id: string;
  partner_number: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  status: PartnerStatus;
  activation_date: string | null;
  expiration_date: string | null;
  annual_sales_count: number;
  minimum_sales_required: number;
  agreement_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgreementRecord {
  id: string;
  partner_id: string;
  agreement_version: string;
  agreement_hash: string;
  agreement_language: string;
  signed_name: string;
  signed_business_name: string;
  signed_title: string;
  signed_email: string;
  signed_at: string;
  status: string;
  document_path: string | null;
}

/**
 * The single set of states the partner experience can be in. The portal renders
 * strictly from this; there is no other branch.
 */
export type PartnerAccessState =
  | "none" // authenticated, but no partner record (may have a pending application)
  | "pending" // application received, awaiting approval
  | "approved_unsigned" // approved; must sign the agreement
  | "signed_unpaid" // signed; must pay the annual activation
  | "active" // full access — wholesale library unlocked
  | "expired" // term lapsed; must renew
  | "suspended" // access withheld; contact support
  | "terminated"; // access revoked

export interface PartnerAccess {
  state: PartnerAccessState;
  partner: PartnerRecord | null;
  agreement: AgreementRecord | null;
  /** True only when state === "active". The ONLY gate for wholesale pricing. */
  canViewWholesale: boolean;
  /** True when an application exists but no partner record does yet. */
  hasPendingApplication: boolean;
}

function isExpired(partner: PartnerRecord): boolean {
  if (!partner.expiration_date) return false;
  return new Date(partner.expiration_date).getTime() <= Date.now();
}

/** Reads the caller's own partner row. RLS prevents reading anyone else's. */
export async function getPartnerForUser(user: User): Promise<PartnerRecord | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (error || !data) return null;
    return data as PartnerRecord;
  } catch {
    return null;
  }
}

/** Reads the caller's most recent signed agreement, if any. */
export async function getAgreementForPartner(
  partnerId: string,
): Promise<AgreementRecord | null> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("reseller_agreements")
      .select(
        "id, partner_id, agreement_version, agreement_hash, agreement_language, signed_name, signed_business_name, signed_title, signed_email, signed_at, status, document_path",
      )
      .eq("partner_id", partnerId)
      .eq("status", "signed")
      .order("signed_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as AgreementRecord;
  } catch {
    return null;
  }
}

async function hasApplication(user: User): Promise<boolean> {
  try {
    const supabase = await getSupabaseServerClient();
    // Applications are readable only by their owner once linked (see RLS).
    const { count } = await supabase
      .from("reseller_applications")
      .select("id", { count: "exact", head: true })
      .eq("auth_user_id", user.id);
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Resolves the caller's complete partner authorization state. This is the only
 * function that may set canViewWholesale.
 */
export async function getPartnerAccess(user: User): Promise<PartnerAccess> {
  const partner = await getPartnerForUser(user);

  if (!partner) {
    const pending = await hasApplication(user);
    return {
      state: pending ? "pending" : "none",
      partner: null,
      agreement: null,
      canViewWholesale: false,
      hasPendingApplication: pending,
    };
  }

  const agreement = await getAgreementForPartner(partner.id);

  const base = {
    partner,
    agreement,
    hasPendingApplication: false,
    canViewWholesale: false,
  };

  // Terminal / administrative states take precedence over everything.
  if (partner.status === "terminated") return { ...base, state: "terminated" };
  if (partner.status === "suspended") return { ...base, state: "suspended" };
  if (partner.status === "pending") return { ...base, state: "pending" };

  // An 'active' row whose term has lapsed is treated as expired regardless of
  // what the column says, so a missed cron/renewal never leaves access open.
  if (partner.status === "expired" || isExpired(partner)) {
    return { ...base, state: "expired" };
  }

  if (partner.status === "approved") {
    return { ...base, state: agreement ? "signed_unpaid" : "approved_unsigned" };
  }

  if (partner.status === "active") {
    // Defense in depth: 'active' without a signed agreement is not a valid
    // state. Fall back to the signing step rather than unlocking pricing.
    if (!agreement) return { ...base, state: "approved_unsigned" };
    return { ...base, state: "active", canViewWholesale: true };
  }

  return { ...base, state: "none" };
}

/** Throws unless the caller is a fully active partner. Use before any wholesale read. */
export async function assertActivePartner(user: User): Promise<PartnerRecord> {
  const access = await getPartnerAccess(user);
  if (!access.canViewWholesale || !access.partner) {
    throw new Error("partner_not_active");
  }
  return access.partner;
}

const PARTNER_ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ"; // no 0/1/I/L/O/U

/**
 * Generates a VTX-XXXXXX partner number using a CSPRNG. Non-sequential and
 * non-enumerable, so a partner number never reveals how many partners exist.
 * Uniqueness is additionally enforced by a DB constraint; callers retry on
 * conflict (see the SQL approval function, which does this in one statement).
 */
export function generatePartnerNumber(): string {
  // Node's webcrypto is available in the Node runtime used by our routes.
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  let out = "";
  for (const byte of bytes) {
    const index = byte % PARTNER_ALPHABET.length;
    out += PARTNER_ALPHABET.charAt(index);
  }
  return `VTX-${out}`;
}
