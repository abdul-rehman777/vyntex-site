import "server-only";
import { SITE } from "@/lib/site";

/**
 * Secondary internal submission notification through FormSubmit.
 *
 * FormSubmit requires a one-time activation click sent to the destination
 * inbox after the first submission. Until that activation is completed,
 * Supabase persistence and the primary Resend outbox remain the source of
 * truth, so no customer submission is lost.
 *
 * Authentication secrets, OTP values, payment-provider payloads, and admin
 * actions must never be sent through this helper.
 */

export interface FormSubmitNotification {
  formName: string;
  subject: string;
  replyTo?: string;
  fields: Record<string, unknown>;
}

export interface FormSubmitResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

function destination(): string {
  return process.env.FORMSUBMIT_EMAIL || SITE.email;
}

function enabled(): boolean {
  return process.env.FORMSUBMIT_ENABLED !== "false";
}

function normalize(value: unknown): string {
  if (value === null || value === undefined || value === "") return "Not provided";
  if (Array.isArray(value)) return value.map(normalize).join(", ");
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).slice(0, 5000);
}

export async function notifyFormSubmit(
  input: FormSubmitNotification,
): Promise<FormSubmitResult> {
  if (!enabled()) return { ok: true, skipped: true };

  const email = destination();
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;
  const payload: Record<string, string> = {
    _subject: input.subject,
    _template: "table",
    _captcha: "false",
    _replyto: input.replyTo || email,
    "Submission Type": input.formName,
    "Submitted At": new Date().toISOString(),
    "Website": process.env.NEXT_PUBLIC_SITE_URL || SITE.url,
  };

  for (const [key, value] of Object.entries(input.fields)) {
    payload[key] = normalize(value);
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return { ok: false, error: `FormSubmit returned HTTP ${response.status}.` };
    }

    const result = (await response.json().catch(() => null)) as
      | { success?: string | boolean; message?: string }
      | null;

    if (result?.success === false || result?.success === "false") {
      return { ok: false, error: result.message || "FormSubmit rejected the submission." };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown FormSubmit error.",
    };
  }
}
