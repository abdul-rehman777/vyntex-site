import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { getPartnerAccess } from "@/lib/reseller";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  generateAgreementPdf,
  storeAgreementPdf,
  signedAgreementUrl,
  type SignedAgreementData,
} from "@/lib/agreements";
import { AGREEMENT } from "@/lib/agreement-content";
import { limiters } from "@/lib/rate-limit";
import { getClientIp, hashIp } from "@/lib/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Result = { ok: true; url: string } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Issues a short-lived signed URL for the caller's OWN signed agreement.
 *
 * The storage bucket is private, so this route is the only way to read the
 * document. Ownership is resolved from the session (never from a URL parameter)
 * — a partner cannot request someone else's agreement by guessing an id.
 *
 * If the PDF was not stored at signing time (e.g. storage was briefly
 * unavailable), we regenerate it from the signature record on demand. The
 * record — not the file — is the source of truth.
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return json({ ok: false, code: "session" }, 401);

  const rl = await limiters.agreementDownload().limit(`user:${user.id}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

  const access = await getPartnerAccess(user);
  const { partner, agreement } = access;

  if (!partner || !agreement) {
    return json({ ok: false, code: "no_agreement" }, 404);
  }

  const admin = getSupabaseAdmin();
  if (!admin) return json({ ok: false, code: "server" }, 500);

  let path = agreement.document_path;

  // Regenerate on demand if the stored copy is missing.
  if (!path) {
    const language = agreement.agreement_language === "es" ? "es" : "en";
    const signed: SignedAgreementData = {
      agreementId: agreement.id,
      partnerNumber: partner.partner_number,
      version: agreement.agreement_version,
      hash: agreement.agreement_hash,
      language,
      signedName: agreement.signed_name,
      signedBusinessName: agreement.signed_business_name,
      signedTitle: agreement.signed_title,
      signedEmail: agreement.signed_email,
      signedAt: agreement.signed_at,
      consentText: AGREEMENT[language].consentText,
    };

    try {
      const bytes = await generateAgreementPdf(signed);
      const stored = await storeAgreementPdf({
        partnerId: partner.id,
        agreementId: agreement.id,
        bytes,
      });
      if (!stored.ok) {
        console.error("[agreement/download] regeneration store failed:", stored.error);
        return json({ ok: false, code: "document_unavailable" }, 500);
      }
      path = stored.path;
      await admin
        .from("reseller_agreements")
        .update({ document_path: path })
        .eq("id", agreement.id);
    } catch (err) {
      console.error(
        "[agreement/download] regeneration failed:",
        err instanceof Error ? err.message : "unknown",
      );
      return json({ ok: false, code: "document_unavailable" }, 500);
    }
  }

  const url = await signedAgreementUrl(path, 300);
  if (!url) return json({ ok: false, code: "document_unavailable" }, 500);

  const ip = getClientIp(request.headers);
  await admin.from("agreement_audit_events").insert({
    agreement_id: agreement.id,
    event_type: "downloaded",
    event_data: { partner_number: partner.partner_number },
    ip_hash: hashIp(ip),
    user_agent: request.headers.get("user-agent")?.slice(0, 400) ?? "",
  });

  return json({ ok: true, url });
}
