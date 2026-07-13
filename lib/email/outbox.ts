import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail, type EmailAttachment } from "@/lib/resend";

/**
 * Durable transactional email. SERVER ONLY.
 *
 * THE PROBLEM THIS SOLVES: `sendEmail` is a best-effort network call. If Resend
 * is having a bad minute, the call fails and the message is gone. For a contact
 * form that is survivable. For a signed reseller agreement copy, or a payment
 * receipt, it is not.
 *
 * THE APPROACH: every important email is written to `email_deliveries` BEFORE we
 * try to send it. We then attempt delivery immediately. If that attempt fails,
 * the row simply stays 'pending' and the nightly cron
 * (/api/cron/process-emails) retries it with exponential backoff until it
 * succeeds or hits max_attempts.
 *
 * The caller is told the truth either way: `queued: true, sent: false` means
 * "we have it, it will go out" — which is what the UI shows as a partial
 * success. We never claim an email was sent when it was not.
 *
 * ATTACHMENTS: deliberately NOT persisted in the outbox. Storing a base64 PDF in
 * a Postgres row is wasteful and would put document bytes in a table. For a
 * retried agreement email, the message body carries a portal download link
 * instead — the partner can always retrieve the document from
 * /portal/partner regardless of email.
 */

export type EmailKind =
  | "contact_internal"
  | "contact_client"
  | "consultation_internal"
  | "consultation_client"
  | "reseller_application_internal"
  | "reseller_application_client"
  | "reseller_approved"
  | "agreement_signed_internal"
  | "agreement_signed_partner"
  | "order_paid_internal"
  | "order_paid_customer"
  | "partner_expiring"
  | "partner_expired";

export interface QueueEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  kind: EmailKind;
  /** Correlates back to the order / agreement / application that produced it. */
  refId?: string;
  /** Sent on the FIRST attempt only; not persisted for retries. */
  attachments?: EmailAttachment[];
}

export interface QueueEmailResult {
  /** True when the row was written. False means we could not even record it. */
  queued: boolean;
  /** True only when the provider actually accepted the message. */
  sent: boolean;
  error?: string;
}

const BACKOFF_MINUTES = [1, 5, 30, 120, 720]; // 1m, 5m, 30m, 2h, 12h

function nextRetryAt(attempts: number): string {
  const index = Math.min(attempts, BACKOFF_MINUTES.length - 1);
  const minutes = BACKOFF_MINUTES[index] ?? 720;
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

/**
 * Records the email, then attempts immediate delivery. Safe to call even when
 * Supabase or Resend is unconfigured — it degrades rather than throwing.
 */
export async function queueAndSend(input: QueueEmailInput): Promise<QueueEmailResult> {
  const admin = getSupabaseAdmin();

  // No database? Still try to send — a missing outbox must not block email.
  if (!admin) {
    const direct = await sendEmail({
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
      attachments: input.attachments,
    });
    return {
      queued: false,
      sent: direct.ok,
      error: direct.ok ? undefined : direct.error,
    };
  }

  const { data: row, error: insertError } = await admin
    .from("email_deliveries")
    .insert({
      to_email: input.to,
      subject: input.subject,
      html: input.html,
      text_body: input.text ?? null,
      reply_to: input.replyTo ?? null,
      kind: input.kind,
      ref_id: input.refId ?? null,
      status: "pending",
      attempts: 0,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    console.error("[email] outbox insert failed:", insertError?.message);
    const direct = await sendEmail({
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
      attachments: input.attachments,
    });
    return {
      queued: false,
      sent: direct.ok,
      error: direct.ok ? undefined : direct.error,
    };
  }

  const id = row.id as string;

  const result = await sendEmail({
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
    attachments: input.attachments,
  });

  if (result.ok) {
    await admin
      .from("email_deliveries")
      .update({
        status: "sent",
        attempts: 1,
        provider_id: result.id,
        sent_at: new Date().toISOString(),
      })
      .eq("id", id);
    return { queued: true, sent: true };
  }

  await admin
    .from("email_deliveries")
    .update({
      status: "pending",
      attempts: 1,
      last_error: result.error.slice(0, 500),
      next_retry_at: nextRetryAt(1),
    })
    .eq("id", id);

  console.error(`[email] queued for retry (${input.kind}):`, result.error);
  return { queued: true, sent: false, error: result.error };
}

export interface DrainResult {
  processed: number;
  sent: number;
  failed: number;
  abandoned: number;
}

/**
 * Drains the outbox. Called by /api/cron/process-emails.
 * Bounded batch: a serverless function must finish, so we take at most `limit`
 * per run and let the next run pick up the rest.
 */
export async function drainOutbox(limit = 25): Promise<DrainResult> {
  const admin = getSupabaseAdmin();
  const result: DrainResult = { processed: 0, sent: 0, failed: 0, abandoned: 0 };
  if (!admin) return result;

  const { data, error } = await admin
    .from("email_deliveries")
    .select("id, to_email, subject, html, text_body, reply_to, attempts, max_attempts")
    .eq("status", "pending")
    .lte("next_retry_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !data) return result;

  for (const row of data) {
    result.processed += 1;
    const attempts = (row.attempts as number) + 1;
    const maxAttempts = row.max_attempts as number;

    const send = await sendEmail({
      to: row.to_email as string,
      subject: row.subject as string,
      html: row.html as string,
      text: (row.text_body as string | null) ?? undefined,
      replyTo: (row.reply_to as string | null) ?? undefined,
    });

    if (send.ok) {
      await admin
        .from("email_deliveries")
        .update({
          status: "sent",
          attempts,
          provider_id: send.id,
          sent_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", row.id as string);
      result.sent += 1;
      continue;
    }

    // Out of attempts: stop retrying, but keep the row. An abandoned email is a
    // visible fact in the admin portal, not a silent disappearance.
    if (attempts >= maxAttempts) {
      await admin
        .from("email_deliveries")
        .update({
          status: "abandoned",
          attempts,
          last_error: send.error.slice(0, 500),
        })
        .eq("id", row.id as string);
      result.abandoned += 1;
      continue;
    }

    await admin
      .from("email_deliveries")
      .update({
        status: "pending",
        attempts,
        last_error: send.error.slice(0, 500),
        next_retry_at: nextRetryAt(attempts),
      })
      .eq("id", row.id as string);
    result.failed += 1;
  }

  return result;
}
