import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { limiters } from "@/lib/rate-limit";
import { getClientIp, checkSpam } from "@/lib/request";

export const runtime = "nodejs";

type Result = { ok: true } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

const bodySchema = z.object({
  email: z.string().trim().email().max(180),
  honeypot: z.string().optional(),
  startedAt: z.number().optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "invalidEmail" }, 400);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "invalidEmail" }, 400);
  const { email, honeypot, startedAt } = parsed.data;

  const spam = checkSpam({ honeypot, startedAt, minSeconds: 1 });
  if (spam.spam) return json({ ok: false, code: "generic" }, 400);

  // Rate limit OTP requests: 5 / hour, keyed by email + IP.
  const rl = await limiters.otpRequest().limit(`${email}:${ip}`);
  if (!rl.success) return json({ ok: false, code: "tooManyRequests" }, 429);

  let supabase;

try {
  supabase = await getSupabaseServerClient();
} catch {
  return json({ ok: false, code: "generic" }, 500);
}

const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: true,
  },
});

if (error) {
  console.error("[auth/otp] signInWithOtp failed:", error.message);

  const code = /rate|too many|seconds/i.test(error.message)
    ? "tooManyRequests"
    : "otpFailed";

  return json({ ok: false, code }, 400);
}

return json({ ok: true });
}
