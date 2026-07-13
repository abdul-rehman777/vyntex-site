import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getPartnerAccess } from "@/lib/reseller";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getClientIp, hashIp } from "@/lib/request";
import PortalShell from "@/components/portal/PortalShell";
import AgreementViewer from "@/components/reseller/AgreementViewer";
import AgreementSignatureForm, {
  type SignedSummary,
} from "@/components/reseller/AgreementSignatureForm";

export const metadata: Metadata = {
  title: "Reseller Agreement",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Agreement review and signature.
 *
 * Only a partner record holder may reach this page. Someone with no partner
 * record is sent back to the partner portal, which explains their actual state
 * (apply / pending) rather than showing them a document they cannot sign.
 *
 * Viewing is itself an audit event: we record it before rendering, so the trail
 * shows the partner saw the agreement before they signed it.
 */
export default async function AgreementPage() {
  const user = await requireUser();
  const access = await getPartnerAccess(user);
  const { partner, agreement } = access;

  // No partner record -> nothing to sign.
  if (!partner) redirect("/portal/partner");

  // Suspended/terminated partners may still READ their agreement, but the form
  // will refuse to accept a new signature (the API enforces this too).
  const alreadySigned: SignedSummary | null = agreement
    ? {
        signedName: agreement.signed_name,
        signedAt: agreement.signed_at,
        version: agreement.agreement_version,
        hash: agreement.agreement_hash,
      }
    : null;

  // Audit: 'viewed'. Best-effort — a logging failure must not block the page.
  if (agreement) {
    try {
      const admin = getSupabaseAdmin();
      const h = await headers();
      if (admin) {
        await admin.from("agreement_audit_events").insert({
          agreement_id: agreement.id,
          event_type: "viewed",
          event_data: { partner_number: partner.partner_number },
          ip_hash: hashIp(getClientIp(h)),
          user_agent: h.get("user-agent")?.slice(0, 400) ?? "",
        });
      }
    } catch {
      /* auditing is best-effort; never block the read */
    }
  }

  return (
    <PortalShell page="agreement">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <AgreementViewer />
        <div className="lg:sticky lg:top-8">
          <AgreementSignatureForm
            defaultEmail={partner.email}
            defaultBusinessName={partner.business_name}
            alreadySigned={alreadySigned}
          />
        </div>
      </div>
    </PortalShell>
  );
}
