import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Vercel Cron authorization. SERVER ONLY.
 *
 * Vercel sends `Authorization: Bearer $CRON_SECRET` on scheduled invocations.
 * We verify it with a timing-safe comparison so the endpoint cannot be probed
 * character by character.
 *
 * FAIL CLOSED: if CRON_SECRET is not set, we reject everything. An unprotected
 * cron endpoint is a public button that mutates partner status — never leave it
 * open just because a variable is missing.
 */
export function isAuthorizedCron(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[cron] CRON_SECRET is not set — refusing to run.");
    return false;
  }

  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  if (header.length !== expected.length) return false;

  // Constant-time compare.
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= header.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/** Records the outcome of a scheduled job so a silent failure becomes visible. */
export async function recordCronRun(input: {
  job: string;
  status: "ok" | "error";
  detail: Record<string, unknown>;
  durationMs: number;
}): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) return;
  try {
    await admin.from("cron_runs").insert({
      job: input.job,
      status: input.status,
      detail: input.detail,
      duration_ms: input.durationMs,
    });
  } catch {
    /* observability must never break the job it observes */
  }
}
