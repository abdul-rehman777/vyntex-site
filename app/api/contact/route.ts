import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limiters } from "@/lib/rate-limit";
import { getClientIp, hashIp, checkSpam } from "@/lib/request";
import { internalInbox } from "@/lib/resend";
import { queueAndSend } from "@/lib/email/outbox";
import { notifyFormSubmit } from "@/lib/formsubmit";
import {
  internalContactEmail,
  clientContactConfirmation,
  type ContactEmailData,
} from "@/lib/email/templates";

export const runtime = "nodejs";

type Result = { ok: true; partial?: boolean } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  const rl = await limiters.contact().limit(`ip:${ip}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

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
    message: typeof raw.message === "string" ? raw.message : "",
  });
  if (spam.spam) return json({ ok: false, code: "spam" }, 400);

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
  const data = parsed.data;

  // FormSubmit is the immediate, deployment-independent delivery channel.
  // It runs before database/email work so a missing Supabase or Resend setting
  // never causes a valid public inquiry to disappear.
  const formSubmitRes = await notifyFormSubmit({
    formName: "Contact Form",
    subject: `New VYNTEX contact request from ${data.fullName}`,
    replyTo: data.email,
    fields: {
      Name: data.fullName,
      Business: data.businessName,
      Email: data.email,
      Phone: data.phone,
      Service: data.serviceInterest,
      "Preferred Contact": data.preferredContact,
      Language: data.language,
      Message: data.message,
    },
  });

  if (!formSubmitRes.ok) {
    console.error("[contact] FormSubmit notification failed:", formSubmitRes.error);
  }

  let databaseSaved = false;
  const admin = getSupabaseAdmin();
  if (admin) {
    const { error: dbError } = await admin.from("contact_submissions").insert({
      full_name: data.fullName,
      business_name: data.businessName || null,
      email: data.email,
      phone: data.phone || null,
      service_interest: data.serviceInterest,
      message: data.message,
      preferred_contact: data.preferredContact,
      language: data.language,
      ip_hash: hashIp(ip),
      status: "new",
    });

    if (dbError) {
      console.error("[contact] insert failed:", dbError.message);
    } else {
      databaseSaved = true;
    }
  } else {
    console.error("[contact] Supabase admin not configured; FormSubmit fallback used.");
  }

  const emailData: ContactEmailData = {
    fullName: data.fullName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    serviceInterest: data.serviceInterest,
    preferredContact: data.preferredContact,
    message: data.message,
    language: data.language,
  };

  const internal = internalContactEmail(emailData);
  const confirm = clientContactConfirmation(emailData);

  const [internalRes, confirmRes] = await Promise.all([
    queueAndSend({
      to: internalInbox(),
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
      kind: "contact_internal",
    }),
    queueAndSend({
      to: data.email,
      subject: confirm.subject,
      html: confirm.html,
      text: confirm.text,
      kind: "contact_client",
    }),
  ]);

  // A valid inquiry is accepted when either durable database persistence or
  // FormSubmit delivery succeeded. Resend is additional confirmation, not a
  // reason to show the visitor a false failure message.
  if (!databaseSaved && !formSubmitRes.ok) {
    return json({ ok: false, code: "server" }, 500);
  }

  const partial = !databaseSaved || !internalRes.sent || !confirmRes.sent || !formSubmitRes.ok;
  return json({ ok: true, partial });
}
