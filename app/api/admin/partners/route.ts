import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { requireAdminApi } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { limiters } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  partnerId: z.string().uuid(),
  status: z.enum([
    "pending",
    "approved",
    "active",
    "suspended",
    "expired",
    "terminated",
  ]),
});

type Result = { ok: true } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Change a partner's status (suspend / reinstate / terminate).
 *
 * Note what an administrator CANNOT do here: set a partner active without a
 * payment. They can, but the wholesale gate ALSO requires a signed agreement
 * (getPartnerAccess returns 'approved_unsigned' otherwise), so an accidental
 * click cannot unlock confidential pricing for someone who never signed.
 */
export async function POST(request: Request) {
  const user = await getUser();
  const admin = await requireAdminApi(user);
  if (!admin || !user) return json({ ok: false, code: "not_found" }, 404);

  const rl = await limiters.adminAction().limit(`admin:${user.id}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, code: "validation" }, 400);
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, code: "validation" }, 400);

  const db = getSupabaseAdmin();
  if (!db) return json({ ok: false, code: "server" }, 500);

  const { error } = await db.rpc("vx_set_partner_status", {
    p_partner_id: parsed.data.partnerId,
    p_status: parsed.data.status,
  });

  if (error) {
    console.error("[admin/partners] status change failed:", error.message);
    return json({ ok: false, code: "server" }, 500);
  }

  return json({ ok: true });
}
