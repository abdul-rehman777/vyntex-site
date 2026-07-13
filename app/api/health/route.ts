import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Deployment health / configuration check.
 *
 * Reports WHETHER each external dependency is configured — never WHAT it is
 * configured with. No key, token, URL, or fragment of a secret is ever returned,
 * so this endpoint is safe to leave public and to hit from an uptime monitor.
 *
 * Its purpose is the first five minutes after a Vercel deploy: instead of
 * clicking around trying to work out why checkout is failing, hit /api/health
 * and see exactly which variable you forgot.
 */

interface Check {
  name: string;
  configured: boolean;
  required: boolean;
  /** Administrator-facing guidance shown when it is not configured. */
  hint: string;
}

function has(...names: string[]): boolean {
  return names.every((n) => Boolean(process.env[n]?.trim()));
}

export async function GET() {
  const checks: Check[] = [
    {
      name: "site_url",
      configured: has("NEXT_PUBLIC_SITE_URL"),
      required: true,
      hint: "Set NEXT_PUBLIC_SITE_URL to your canonical URL (e.g. https://vyntexusa.com). Used for canonical tags, the sitemap, email links, and the Square redirect.",
    },
    {
      name: "supabase_public",
      configured: has("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      required: true,
      hint: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Without these, login and the portal are unavailable.",
    },
    {
      name: "supabase_service_role",
      configured: has("SUPABASE_SERVICE_ROLE_KEY"),
      required: true,
      hint: "Set SUPABASE_SERVICE_ROLE_KEY (server-only). Without it, forms, orders, agreements, and the Square webhook cannot write to the database.",
    },
    {
      name: "resend",
      configured: has("RESEND_API_KEY", "FROM_EMAIL"),
      required: true,
      hint: "Set RESEND_API_KEY and FROM_EMAIL (on a Resend-verified domain). Without these, no transactional email is sent — submissions are still saved and queued for retry.",
    },
    {
      name: "ip_hash_salt",
      configured: has("IP_HASH_SALT"),
      required: true,
      hint: "Set IP_HASH_SALT to a random 32-byte hex string (openssl rand -hex 32). Used to hash IPs before storage; raw IPs are never persisted.",
    },
    {
      name: "upstash_rate_limit",
      configured: has("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"),
      required: true,
      hint: "Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Without them, rate limiting falls back to permissive and logs an error every boot — do not ship to production this way.",
    },
    {
      name: "square_payments",
      configured: has("SQUARE_ACCESS_TOKEN", "SQUARE_LOCATION_ID"),
      required: true,
      hint: "Set SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID. Without them, checkout returns 'payments unavailable' and the site directs buyers to contact you instead — nothing breaks, but nothing sells.",
    },
    {
      name: "square_webhook",
      configured: has("SQUARE_WEBHOOK_SIGNATURE_KEY", "SQUARE_WEBHOOK_NOTIFICATION_URL"),
      required: true,
      hint: "Set SQUARE_WEBHOOK_SIGNATURE_KEY and SQUARE_WEBHOOK_NOTIFICATION_URL. Without them, every webhook is rejected and NO payment is ever confirmed. SQUARE_WEBHOOK_NOTIFICATION_URL must match the URL registered with Square byte-for-byte.",
    },
    {
      name: "cron",
      configured: has("CRON_SECRET"),
      required: true,
      hint: "Set CRON_SECRET. Without it, the scheduled jobs refuse to run (fail-closed) — partner expiry and email retries will not happen.",
    },
  ];

  // Database reachability. A missing/failed connection is reported, not thrown.
  let database: "ok" | "unreachable" | "unconfigured" = "unconfigured";
  const admin = getSupabaseAdmin();
  if (admin) {
    try {
      const { error } = await admin
        .from("partners")
        .select("id", { count: "exact", head: true })
        .limit(1);
      database = error ? "unreachable" : "ok";
    } catch {
      database = "unreachable";
    }
  }

  const missingRequired = checks.filter((c) => c.required && !c.configured);
  const squareEnv =
    (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "sandbox")
      .trim()
      .toLowerCase() === "production"
      ? "production"
      : "sandbox";

  const ready = missingRequired.length === 0 && database === "ok";

  return NextResponse.json(
    {
      ok: true,
      ready,
      database,
      squareEnvironment: squareEnv,
      // Loudly flagged: real cards are being charged.
      squareLiveMode: squareEnv === "production",
      checks: checks.map(({ name, configured, required }) => ({
        name,
        configured,
        required,
      })),
      // Only the actionable ones carry a hint, so the response stays readable.
      setupRequired: missingRequired.map((c) => ({ name: c.name, hint: c.hint })),
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
