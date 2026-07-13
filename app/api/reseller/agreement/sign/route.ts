import { NextResponse } from "next/server";
import { signatureSchema } from "@/lib/validation/reseller";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/auth";
import { getPartnerAccess } from "@/lib/reseller";
import { limiters } from "@/lib/rate-limit";
import { getClientIp, hashIp, checkSpam } from "@/lib/request";
import { internalInbox } from "@/lib/resend";
import { queueAndSend } from "@/lib/email/outbox";
import { notifyFormSubmit } from "@/lib/formsubmit";
import { AGREEMENT, AGREEMENT_VERSION } from "@/lib/agreement-content";
import {
  agreementHash,
  generateAgreementPdf,
  storeAgreementPdf,
  type SignedAgreementData,
} from "@/lib/agreements";
import {
  internalAgreementSignedEmail,
  partnerAgreementSignedEmail,
  type AgreementSignedEmailData,
} from "@/lib/email/templates";

export const runtime = "nodejs";

type Result =
  | { ok: true; agreementId: string; partial?: boolean }
  | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Records a typed-name electronic signature on the reseller agreement.
 *
 * Order of operations is deliberate: the signature record and its audit events
 * are committed FIRST. PDF generation and email are best-effort afterwards. If
 * they fail, the signature still exists and is legally recorded — the partner
 * sees a partial-success message and can re-download later. We never lose a
 * signature because an email bounced.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const userAgent = request.headers.get("user-agent")?.slice(0, 400) ?? "";

  const user = await getUser();
  if (!user) return json({ ok: false, code: "session" }, 401);

  const rl = await limiters.agreementSign().limit(`user:${user.id}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

  // Server-side authorization: only an approved (or later) partner may sign.
  const access = await getPartnerAccess(user);
  const partner = access.partner;
  if (!partner) return json({ ok: false, code: "not_a_partner" }, 403);

  if (partner.status === "suspended" || partner.status === "terminated") {
    return json({ ok: false, code: "partner_inactive" }, 403);
  }
  if (access.agreement && access.agreement.agreement_version === AGREEMENT_VERSION) {
    // Already signed the current version — nothing to do. Idempotent.
    return json({ ok: true, agreementId: access.agreement.id });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "validation" }, 400);
  }

  const raw = body as Record<string, unknown>;
  const spam = checkSpam({
    honeypot: raw.honeypot,
    startedAt: raw.startedAt,
    minSeconds: 5,
  });
  if (spam.spam) return json({ ok: false, code: "spam" }, 400);

  const parsed = signatureSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
  const data = parsed.data;

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error("[agreement/sign] Supabase admin not configured.");
    return json({ ok: false, code: "server" }, 500);
  }

  const hash = agreementHash();
  const doc = AGREEMENT[data.language];
  const consentText = doc.consentText;
  const signedAt = new Date().toISOString();
  const ipHash = hashIp(ip);

  // 1) The signature record. This is the legally meaningful artifact.
  const { data: inserted, error: insertError } = await admin
    .from("reseller_agreements")
    .insert({
      partner_id: partner.id,
      agreement_version: AGREEMENT_VERSION,
      agreement_hash: hash,
      agreement_language: data.language,
      signed_name: data.fullLegalName,
      signed_business_name: data.legalBusinessName,
      signed_title: data.signerTitle,
      signed_email: data.email,
      signed_at: signedAt,
      ip_hash: ipHash,
      user_agent: userAgent,
      consent_text: consentText,
      status: "signed",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[agreement/sign] insert failed:", insertError?.message);
    return json({ ok: false, code: "server" }, 500);
  }

  const agreementId = inserted.id as string;

  // 2) Audit trail. Consent and signature are separate events.
  await admin.from("agreement_audit_events").insert([
    {
      agreement_id: agreementId,
      event_type: "consented",
      event_data: { consent_text: consentText, language: data.language },
      ip_hash: ipHash,
      user_agent: userAgent,
    },
    {
      agreement_id: agreementId,
      event_type: "signed",
      event_data: {
        agreement_version: AGREEMENT_VERSION,
        agreement_hash: hash,
        typed_signature: data.typedSignature,
        signer_title: data.signerTitle,
      },
      ip_hash: ipHash,
      user_agent: userAgent,
    },
  ]);

  // 3) Point the partner at the current agreement.
  await admin
    .from("partners")
    .update({ agreement_id: agreementId })
    .eq("id", partner.id);

  // 4) Signed PDF -> private bucket. Best-effort.
  const signedData: SignedAgreementData = {
    agreementId,
    partnerNumber: partner.partner_number,
    version: AGREEMENT_VERSION,
    hash,
    language: data.language,
    signedName: data.fullLegalName,
    signedBusinessName: data.legalBusinessName,
    signedTitle: data.signerTitle,
    signedEmail: data.email,
    signedAt,
    consentText,
  };

  let pdfBytes: Uint8Array | null = null;
  let documentStored = false;

  try {
    pdfBytes = await generateAgreementPdf(signedData);
    const stored = await storeAgreementPdf({
      partnerId: partner.id,
      agreementId,
      bytes: pdfBytes,
    });
    if (stored.ok) {
      documentStored = true;
      await admin
        .from("reseller_agreements")
        .update({ document_path: stored.path })
        .eq("id", agreementId);
    } else {
      console.error("[agreement/sign] pdf storage failed:", stored.error);
    }
  } catch (err) {
    console.error(
      "[agreement/sign] pdf generation failed:",
      err instanceof Error ? err.message : "unknown",
    );
  }

  // 5) Email both parties. Attach the PDF when we have it.
  const emailData: AgreementSignedEmailData = {
    partnerNumber: partner.partner_number,
    signedName: data.fullLegalName,
    businessName: data.legalBusinessName,
    signerTitle: data.signerTitle,
    signedEmail: data.email,
    signedAt,
    agreementVersion: AGREEMENT_VERSION,
    agreementHash: hash,
    language: data.language,
  };

  const internal = internalAgreementSignedEmail(emailData);
  const partnerCopy = partnerAgreementSignedEmail(emailData);

  const attachments = pdfBytes
    ? [
        {
          filename: `VYNTEX-Reseller-Agreement-${partner.partner_number}.pdf`,
          content: Buffer.from(pdfBytes).toString("base64"),
        },
      ]
    : undefined;

  // The signed-agreement copy is the one email we cannot afford to lose, so it
  // goes through the durable outbox. If Resend fails, the row is retried by the
  // nightly cron; meanwhile the partner can always download the PDF from the
  // portal, so they are never dependent on email to obtain their agreement.
  const [internalRes, partnerRes, formSubmitRes] = await Promise.all([
    queueAndSend({
      to: internalInbox(),
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
      attachments,
      kind: "agreement_signed_internal",
      refId: agreementId,
    }),
    queueAndSend({
      to: data.email,
      subject: partnerCopy.subject,
      html: partnerCopy.html,
      text: partnerCopy.text,
      attachments,
      kind: "agreement_signed_partner",
      refId: agreementId,
    }),
    notifyFormSubmit({
      formName: "Reseller Agreement Signature",
      subject: `VYNTEX reseller agreement signed by ${data.legalBusinessName}`,
      replyTo: data.email,
      fields: {
        "Agreement ID": agreementId,
        "Partner Number": partner.partner_number,
        "Legal Name": data.fullLegalName,
        Business: data.legalBusinessName,
        Title: data.signerTitle,
        Email: data.email,
        "Signed At": signedAt,
        "Agreement Version": AGREEMENT_VERSION,
        "Agreement Hash": hash,
        Language: data.language,
        "Document Stored": documentStored,
      },
    }),
  ]);

  if (partnerRes.sent) {
    await admin.from("agreement_audit_events").insert({
      agreement_id: agreementId,
      event_type: "emailed",
      event_data: { to: data.email, attached: Boolean(attachments) },
      ip_hash: ipHash,
      user_agent: userAgent,
    });
  }

  if (!formSubmitRes.ok) {
    console.error("[agreement/sign] FormSubmit notification failed:", formSubmitRes.error);
  }

  const partial = !internalRes.sent || !partnerRes.sent || !documentStored || !formSubmitRes.ok;
  if (partial) {
    console.error(
      "[agreement/sign] partial completion:",
      internalRes.sent ? "" : (internalRes.error ?? "queued for retry"),
      partnerRes.sent ? "" : (partnerRes.error ?? "queued for retry"),
      documentStored ? "" : "document not stored",
    );
  }

  return json({ ok: true, agreementId, partial });
}
