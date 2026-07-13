import { NextResponse } from "next/server";
import { consultationSchema } from "@/lib/validation/consultation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limiters } from "@/lib/rate-limit";
import { getClientIp, hashIp, checkSpam } from "@/lib/request";
import { internalInbox } from "@/lib/resend";
import { queueAndSend } from "@/lib/email/outbox";
import { notifyFormSubmit } from "@/lib/formsubmit";
import {
  internalConsultationEmail,
  clientConsultationConfirmation,
  type ConsultationEmailData,
} from "@/lib/email/templates";

export const runtime = "nodejs";

type Result = { ok: true; partial?: boolean } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  const rl = await limiters.consultation().limit(`ip:${ip}`);
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

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
  const data = parsed.data;

  const formSubmitRes = await notifyFormSubmit({
    formName: "Consultation Request",
    subject: `New VYNTEX consultation request from ${data.fullName}`,
    replyTo: data.email,
    fields: {
      Name: data.fullName,
      Business: data.businessName,
      Email: data.email,
      Phone: data.phone,
      Services: data.services,
      Budget: data.budget,
      Timeline: data.timeline,
      "Preferred Contact": data.preferredContact,
      "Referral Source": data.referralSource,
      Language: data.language,
      Message: data.message,
    },
  });

  if (!formSubmitRes.ok) {
    console.error("[consultation] FormSubmit notification failed:", formSubmitRes.error);
  }

  let databaseSaved = false;
  const admin = getSupabaseAdmin();
  if (admin) {
    const { error: dbError } = await admin.from("consultation_requests").insert({
      full_name: data.fullName,
      business_name: data.businessName || null,
      email: data.email,
      phone: data.phone || null,
      services: data.services,
      budget: data.budget,
      timeline: data.timeline,
      preferred_contact: data.preferredContact,
      referral_source: data.referralSource || null,
      message: data.message,
      language: data.language,
      ip_hash: hashIp(ip),
      status: "new",
    });

    if (dbError) {
      console.error("[consultation] insert failed:", dbError.message);
    } else {
      databaseSaved = true;
    }
  } else {
    console.error("[consultation] Supabase admin not configured; FormSubmit fallback used.");
  }

  const emailData: ConsultationEmailData = {
    fullName: data.fullName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    services: data.services,
    budget: data.budget,
    timeline: data.timeline,
    preferredContact: data.preferredContact,
    referralSource: data.referralSource,
    message: data.message,
    language: data.language,
  };

  const internal = internalConsultationEmail(emailData);
  const confirm = clientConsultationConfirmation(emailData);

  const [internalRes, confirmRes] = await Promise.all([
    queueAndSend({
      kind: "consultation_internal",
      to: internalInbox(),
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
    }),
    queueAndSend({
      kind: "consultation_client",
      to: data.email,
      subject: confirm.subject,
      html: confirm.html,
      text: confirm.text,
    }),
  ]);

  if (!databaseSaved && !formSubmitRes.ok) {
    return json({ ok: false, code: "server" }, 500);
  }

  const partial = !databaseSaved || !internalRes.sent || !confirmRes.sent || !formSubmitRes.ok;
  return json({ ok: true, partial });
}
