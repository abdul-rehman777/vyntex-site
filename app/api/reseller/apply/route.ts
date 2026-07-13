import { NextResponse } from "next/server";
import { resellerApplicationSchema } from "@/lib/validation/reseller";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getUser } from "@/lib/auth";
import { limiters } from "@/lib/rate-limit";
import { getClientIp, hashIp, checkSpam } from "@/lib/request";
import { internalInbox } from "@/lib/resend";
import { queueAndSend } from "@/lib/email/outbox";
import { notifyFormSubmit } from "@/lib/formsubmit";
import {
  internalResellerApplicationEmail,
  resellerApplicationConfirmation,
  type ResellerApplicationEmailData,
} from "@/lib/email/templates";

export const runtime = "nodejs";

type Result = { ok: true; partial?: boolean } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  const rl = await limiters.resellerApply().limit(`ip:${ip}`);
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
    minSeconds: 5,
  });
  if (spam.spam) return json({ ok: false, code: "spam" }, 400);

  const parsed = resellerApplicationSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
  const data = parsed.data;

  const formSubmitRes = await notifyFormSubmit({
    formName: "Authorized Reseller Application",
    subject: `New VYNTEX reseller application from ${data.businessName}`,
    replyTo: data.email,
    fields: {
      Name: data.fullName,
      Business: data.businessName,
      Email: data.email,
      Phone: data.phone,
      Website: data.website,
      City: data.city,
      State: data.state.toUpperCase(),
      "Current Client Count": data.clientCount,
      "Services of Interest": data.servicesInterest,
      "Resell Model": data.resellModel,
      Language: data.language,
      Message: data.message,
    },
  });

  if (!formSubmitRes.ok) {
    console.error("[reseller/apply] FormSubmit notification failed:", formSubmitRes.error);
  }

  let databaseSaved = false;
  const admin = getSupabaseAdmin();
  if (admin) {
    const user = await getUser();
    const { error: dbError } = await admin.from("reseller_applications").insert({
      auth_user_id: user?.id ?? null,
      full_name: data.fullName,
      business_name: data.businessName,
      email: data.email,
      phone: data.phone,
      website: data.website || null,
      city: data.city,
      state: data.state.toUpperCase(),
      client_count: data.clientCount,
      services_interest: data.servicesInterest,
      resell_model: data.resellModel,
      message: data.message,
      language: data.language,
      ip_hash: hashIp(ip),
      status: "pending",
    });

    if (dbError) {
      console.error("[reseller/apply] insert failed:", dbError.message);
    } else {
      databaseSaved = true;
    }
  } else {
    console.error("[reseller/apply] Supabase admin not configured; FormSubmit fallback used.");
  }

  const emailData: ResellerApplicationEmailData = {
    fullName: data.fullName,
    businessName: data.businessName,
    email: data.email,
    phone: data.phone,
    website: data.website,
    city: data.city,
    state: data.state.toUpperCase(),
    clientCount: data.clientCount,
    servicesInterest: data.servicesInterest,
    resellModel: data.resellModel,
    message: data.message,
    language: data.language,
  };

  const internal = internalResellerApplicationEmail(emailData);
  const confirm = resellerApplicationConfirmation(emailData);

  const [internalRes, confirmRes] = await Promise.all([
    queueAndSend({
      to: internalInbox(),
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
      kind: "reseller_application_internal",
    }),
    queueAndSend({
      to: data.email,
      subject: confirm.subject,
      html: confirm.html,
      text: confirm.text,
      kind: "reseller_application_client",
    }),
  ]);

  if (!databaseSaved && !formSubmitRes.ok) {
    return json({ ok: false, code: "server" }, 500);
  }

  const partial = !databaseSaved || !internalRes.sent || !confirmRes.sent || !formSubmitRes.ok;
  return json({ ok: true, partial });
}
