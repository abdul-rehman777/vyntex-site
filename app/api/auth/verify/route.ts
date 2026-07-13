import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { limiters } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

export const runtime = "nodejs";

type Result = { ok: true } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

const bodySchema = z.object({
  email: z.string().trim().email().max(180),
  token: z.string().trim().regex(/^\d{6}$/),
});

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "invalidCode" }, 400);
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, code: "invalidCode" }, 400);
  const { email, token } = parsed.data;

  // Rate limit verification attempts: 10 / 15 min, keyed by email + IP.
  const rl = await limiters.otpVerify().limit(`${email}:${ip}`);
  if (!rl.success) return json({ ok: false, code: "tooManyRequests" }, 429);

  let supabase;
  try {
    supabase = await getSupabaseServerClient();
  } catch {
    return json({ ok: false, code: "generic" }, 500);
  }

  // On success, the cookie-bound server client writes the session cookies.
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });

  if (error) {
    const expired = /expired/i.test(error.message);
    return json({ ok: false, code: expired ? "expiredCode" : "invalidCode" }, 400);
  }

  return json({ ok: true });
}
