import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { requireAdminApi } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limiters } from "@/lib/rate-limit";
import { queueAndSend } from "@/lib/email/outbox";
import { resellerApprovedEmail } from "@/lib/email/templates";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  applicationId: z.string().uuid(),
  action: z.enum(["approve", "reject"]),
});

type Result =
  | { ok: true; partnerNumber?: string; emailSent?: boolean }
  | { ok: false; code: string; message?: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Approve or reject a reseller application.
 *
 * Authorization is checked against the `admin_users` table on every call — the
 * page guard is convenience, this is enforcement. A non-admin gets 404, not 403:
 * we do not confirm that the endpoint is interesting.
 *
 * Approval runs as a single atomic Postgres function so the partner insert, the
 * partner-number mint, and the application status flip cannot half-apply.
 * Approval creates a partner with status 'approved', NOT 'active' — wholesale
 * pricing stays locked until they sign the agreement and the Square webhook
 * confirms the activation payment.
 */
export async function POST(request: Request) {
  const user = await getUser();
  const admin = await requireAdminApi(user);
  if (!admin || !user) return json({ ok: false, code: "not_found" }, 404);

  const rl = await limiters.adminAction().limit(`admin:${user.id}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, code: "validation" }, 400);
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
  const { applicationId, action } = parsed.data;

  const db = getSupabaseAdmin();
  if (!db) return json({ ok: false, code: "server" }, 500);

  if (action === "reject") {
    const { error } = await db.rpc("vx_reject_application_admin", {
      p_application_id: applicationId,
    });
    if (error) {
      console.error("[admin/applications] reject failed:", error.message);
      return json({ ok: false, code: "server" }, 500);
    }
    return json({ ok: true });
  }

  // Approve.
  const { data, error } = await db.rpc("vx_approve_application_admin", {
    p_application_id: applicationId,
  });

  if (error) {
    // The function raises a readable exception when the applicant has never
    // signed in (no auth.users row to attach the partner to). Surface it —
    // this is the one failure an administrator genuinely needs to see.
    console.error("[admin/applications] approve failed:", error.message);
    return json(
      { ok: false, code: "approve_failed", message: error.message },
      400,
    );
  }

  const row = Array.isArray(data) ? data[0] : data;
  const partnerNumber = (row?.partner_number as string | undefined) ?? "";
  const partnerId = (row?.partner_id as string | undefined) ?? undefined;

  // Fetch the application so the approval email is addressed correctly.
  const { data: app } = await db
    .from("reseller_applications")
    .select("full_name, business_name, email, language")
    .eq("id", applicationId)
    .maybeSingle();

  let emailSent = false;
  if (app) {
    const language = app.language === "es" ? "es" : "en";
    const mail = resellerApprovedEmail({
      fullName: app.full_name as string,
      businessName: app.business_name as string,
      partnerNumber,
      language,
      portalUrl: `${SITE.url}/portal/partner`,
    });
    const queued = await queueAndSend({
      to: app.email as string,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      kind: "reseller_approved",
      refId: partnerId,
    });
    emailSent = queued.sent;
  }

  return json({ ok: true, partnerNumber, emailSent });
}
