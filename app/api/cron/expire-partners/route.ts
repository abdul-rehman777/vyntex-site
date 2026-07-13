import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isAuthorizedCron, recordCronRun } from "@/lib/cron";
import { queueAndSend } from "@/lib/email/outbox";
import { partnerExpiringEmail, partnerExpiredEmail } from "@/lib/email/templates";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Nightly partner term enforcement (Vercel Cron — see vercel.json).
 *
 * 1. Flips 'active' partners past their expiration_date to 'expired'.
 * 2. Emails partners whose term ends within 14 days.
 *
 * IMPORTANT: this is bookkeeping, NOT the security boundary. getPartnerAccess()
 * already treats an active row with a past expiry as expired at READ time, so
 * even if this job never ran, an expired partner could not open the wholesale
 * library. The cron keeps the stored state honest for admin reporting and
 * renewal reminders.
 */
export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const started = Date.now();
  const admin = getSupabaseAdmin();

  if (!admin) {
    await recordCronRun({
      job: "expire-partners",
      status: "error",
      detail: { error: "supabase_unconfigured" },
      durationMs: Date.now() - started,
    });
    return NextResponse.json({ ok: false, error: "unconfigured" }, { status: 500 });
  }

  try {
    // 1) Expire lapsed terms (atomic, in-database).
    const { data: expiredData, error: expireError } = await admin.rpc(
      "vx_expire_partners",
    );
    if (expireError) throw new Error(expireError.message);

    const row = Array.isArray(expiredData) ? expiredData[0] : expiredData;
    const expiredCount = (row?.expired_count as number | undefined) ?? 0;
    const expiredIds = (row?.partner_ids as string[] | undefined) ?? [];

    // Notify the partners we just expired.
    if (expiredIds.length > 0) {
      const { data: expiredPartners } = await admin
        .from("partners")
        .select("id, partner_number, contact_name, email")
        .in("id", expiredIds);

      for (const p of expiredPartners ?? []) {
        const mail = partnerExpiredEmail({
          contactName: p.contact_name as string,
          partnerNumber: p.partner_number as string,
          portalUrl: `${SITE.url}/portal/partner`,
          language: "en",
        });
        await queueAndSend({
          to: p.email as string,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
          kind: "partner_expired",
          refId: p.id as string,
        });
      }
    }

    // 2) Warn partners expiring within 14 days (once — we only warn on the
    //    exact day the 14-day window opens, so a partner is not emailed nightly).
    const soon = new Date();
    soon.setUTCDate(soon.getUTCDate() + 14);
    const soonStart = new Date(soon);
    soonStart.setUTCHours(0, 0, 0, 0);
    const soonEnd = new Date(soon);
    soonEnd.setUTCHours(23, 59, 59, 999);

    const { data: expiring } = await admin
      .from("partners")
      .select("id, partner_number, contact_name, email, expiration_date")
      .eq("status", "active")
      .gte("expiration_date", soonStart.toISOString())
      .lte("expiration_date", soonEnd.toISOString());

    let warned = 0;
    for (const p of expiring ?? []) {
      const mail = partnerExpiringEmail({
        contactName: p.contact_name as string,
        partnerNumber: p.partner_number as string,
        expiresAt: p.expiration_date as string,
        portalUrl: `${SITE.url}/portal/partner`,
        language: "en",
      });
      await queueAndSend({
        to: p.email as string,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        kind: "partner_expiring",
        refId: p.id as string,
      });
      warned += 1;
    }

    const detail = { expired: expiredCount, warned };
    await recordCronRun({
      job: "expire-partners",
      status: "ok",
      detail,
      durationMs: Date.now() - started,
    });

    return NextResponse.json({ ok: true, ...detail });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[cron/expire-partners]", message);
    await recordCronRun({
      job: "expire-partners",
      status: "error",
      detail: { error: message },
      durationMs: Date.now() - started,
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
