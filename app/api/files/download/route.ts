import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { signedFileUrl } from "@/lib/files";
import { limiters } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Result = { ok: true; url: string; fileName: string } | { ok: false; code: string };

function json(body: Result, status = 200) {
  return NextResponse.json(body, { status });
}

/**
 * Issues a short-lived signed URL for a file the caller owns.
 *
 * A missing file and someone else's file return the SAME 404. An attacker
 * enumerating ids therefore learns nothing about which ids exist.
 */
export async function GET(request: Request) {
  const user = await getUser();
  if (!user) return json({ ok: false, code: "session" }, 401);

  const rl = await limiters.fileDownload().limit(`user:${user.id}`);
  if (!rl.success) return json({ ok: false, code: "rate_limited" }, 429);

  const id = new URL(request.url).searchParams.get("id") ?? "";
  const uuidRe = /^[0-9a-fA-F-]{36}$/;
  if (!uuidRe.test(id)) return json({ ok: false, code: "not_found" }, 404);

  const signed = await signedFileUrl({ userId: user.id, fileId: id });
  if (!signed) return json({ ok: false, code: "not_found" }, 404);

  return json({ ok: true, url: signed.url, fileName: signed.fileName });
}
