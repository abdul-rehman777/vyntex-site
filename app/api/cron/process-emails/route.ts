import { NextResponse } from "next/server";
import { isAuthorizedCron, recordCronRun } from "@/lib/cron";
import { drainOutbox } from "@/lib/email/outbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Drains the transactional email outbox (Vercel Cron — see vercel.json).
 *
 * Any email that could not be delivered on its first attempt is retried here
 * with exponential backoff (1m, 5m, 30m, 2h, 12h) until it succeeds or hits
 * max_attempts, at which point it is marked 'abandoned' and surfaced in the
 * admin portal. A failed email is therefore always visible — never silently
 * dropped.
 */
export async function GET(request: Request) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const started = Date.now();

  try {
    const result = await drainOutbox(25);
    await recordCronRun({
      job: "process-emails",
      status: "ok",
      detail: { ...result },
      durationMs: Date.now() - started,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[cron/process-emails]", message);
    await recordCronRun({
      job: "process-emails",
      status: "error",
      detail: { error: message },
      durationMs: Date.now() - started,
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
