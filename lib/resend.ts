import { Resend } from "resend";
import { SITE } from "@/lib/site";

/**
 * Resend transactional email. Primary email provider.
 * Server-only: never import this into a Client Component.
 *
 * Callers should prefer lib/email/outbox.ts#queueAndSend, which records the
 * message before attempting delivery so a provider outage retries rather than
 * losing the email. This module is the raw transport underneath it.
 */

let client: Resend | null = null;

export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export function fromAddress(): string {
  const from = process.env.FROM_EMAIL || SITE.email;
  return `VYNTEX <${from}>`;
}

/** Internal notification inbox. Prefers CONTACT_TO_EMAIL, then INTERNAL_INBOX. */
export function internalInbox(): string {
  return process.env.CONTACT_TO_EMAIL || process.env.INTERNAL_INBOX || SITE.email;
}

/** Base64-encoded file attachment (used for the signed agreement PDF). */
export interface EmailAttachment {
  filename: string;
  /** Base64 string. Resend accepts base64 content for attachments. */
  content: string;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export type SendEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

/**
 * Sends an email via Resend. Returns a typed result instead of throwing so
 * callers can handle failures gracefully. If Resend is not configured, returns
 * a clear error rather than crashing (useful in local development).
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "Email is not configured (missing RESEND_API_KEY)." };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo,
      attachments: input.attachments,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error.";
    return { ok: false, error: message };
  }
}
