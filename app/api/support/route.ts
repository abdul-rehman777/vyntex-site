import { NextResponse } from "next/server";
import { supportSchema } from "@/lib/validation/support";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { limiters } from "@/lib/rate-limit";
import { checkSpam } from "@/lib/request";
import { notifyFormSubmit } from "@/lib/formsubmit";

export const runtime = "nodejs";

type Result = { ok: true } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let supabase;
  try {
    supabase = await getSupabaseServerClient();
  } catch {
    return json({ ok: false, code: "server" }, 500);
  }

  // Must be authenticated. RLS also enforces ownership on insert.
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return json({ ok: false, code: "session" }, 401);

  // Rate limit by user: 10 / hour.
  const rl = await limiters.support().limit(`user:${user.id}`);
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

  const parsed = supportSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "validation" }, 400);
  const data = parsed.data;

  const { error } = await supabase.from("support_requests").insert({
    user_id: user.id,
    subject: data.subject,
    message: data.message,
    status: "open",
  });

  if (error) {
    console.error("[support] insert failed:", error.message);
    return json({ ok: false, code: "server" }, 500);
  }

  const formSubmit = await notifyFormSubmit({
    formName: "Authenticated Support Request",
    subject: `New VYNTEX support request: ${data.subject}`,
    replyTo: user.email,
    fields: {
      "User ID": user.id,
      Email: user.email,
      Subject: data.subject,
      Message: data.message,
    },
  });
  if (!formSubmit.ok) {
    console.error("[support] FormSubmit notification failed:", formSubmit.error);
  }

  return json({ ok: true });
}
