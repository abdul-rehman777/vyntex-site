import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Upstash Redis rate limiting.
 *
 * Modular by design: if Upstash env vars are not set (e.g. local development),
 * limiters degrade to a permissive fallback so the app still runs — but this is
 * logged, loudly in production, so protection is never *silently* disabled.
 */

export interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface Limiter {
  limit: (identifier: string) => Promise<LimitResult>;
}

function isConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

let redis: Redis | null = null;
let warned = false;

function getRedis(): Redis | null {
  if (!isConfigured()) {
    if (!warned) {
      warned = true;
      const msg =
        "[rate-limit] Upstash is not configured — rate limiting is using a permissive fallback.";
      if (process.env.NODE_ENV === "production") {
        console.error(`${msg} Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in production.`);
      } else {
        console.warn(`${msg} (development)`);
      }
    }
    return null;
  }
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

const noopLimiter: Limiter = {
  async limit() {
    return { success: true, limit: 0, remaining: 0, reset: Date.now() };
  },
};

export type Window = `${number} ${"s" | "m" | "h" | "d"}`;

export interface CreateLimiterOptions {
  prefix: string;
  tokens: number;
  window: Window;
}

/** Creates a sliding-window limiter, or a permissive fallback if unconfigured. */
export function createLimiter(options: CreateLimiterOptions): Limiter {
  const client = getRedis();
  if (!client) return noopLimiter;

  const rl = new Ratelimit({
    redis: client,
    prefix: `vx:${options.prefix}`,
    limiter: Ratelimit.slidingWindow(options.tokens, options.window),
    analytics: false,
  });

  return {
    async limit(identifier: string) {
      const res = await rl.limit(identifier);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    },
  };
}

/**
 * Named limiters with the Phase 3 limits. Lazily instantiated so the fallback
 * warning fires at first use rather than at import time.
 */
const cache = new Map<string, Limiter>();

function named(key: string, opts: CreateLimiterOptions): Limiter {
  let l = cache.get(key);
  if (!l) {
    l = createLimiter(opts);
    cache.set(key, l);
  }
  return l;
}

export const limiters = {
  contact: () => named("contact", { prefix: "contact", tokens: 5, window: "1 h" }),
  consultation: () =>
    named("consultation", { prefix: "consultation", tokens: 3, window: "1 h" }),
  otpRequest: () => named("otp-request", { prefix: "otp-request", tokens: 5, window: "1 h" }),
  otpVerify: () => named("otp-verify", { prefix: "otp-verify", tokens: 10, window: "15 m" }),
  support: () => named("support", { prefix: "support", tokens: 10, window: "1 h" }),

  // ---- Phase 4 -----------------------------------------------------------
  /** Reseller applications, by IP. Low: this is a considered business decision. */
  resellerApply: () =>
    named("reseller-apply", { prefix: "reseller-apply", tokens: 3, window: "1 h" }),
  /** Agreement signing, by user. A partner signs once; retries allow for errors. */
  agreementSign: () =>
    named("agreement-sign", { prefix: "agreement-sign", tokens: 5, window: "1 h" }),
  /** Signed-agreement downloads, by user. */
  agreementDownload: () =>
    named("agreement-download", { prefix: "agreement-download", tokens: 20, window: "1 h" }),
  /** Checkout link creation, by user or IP. Each call hits the Square API. */
  checkoutCreate: () =>
    named("checkout-create", { prefix: "checkout-create", tokens: 10, window: "1 h" }),
  /** Partner wholesale orders, by partner. */
  partnerOrder: () =>
    named("partner-order", { prefix: "partner-order", tokens: 20, window: "1 h" }),
  /**
   * Square webhook processing, keyed by event id. Square legitimately retries,
   * so this is generous — it only exists to blunt a flood of forged requests
   * that somehow passed signature verification. Idempotency (not this limiter)
   * is what makes retries safe.
   */
  squareWebhook: () =>
    named("square-webhook", { prefix: "square-webhook", tokens: 120, window: "1 m" }),

  // ---- Phase 5 -----------------------------------------------------------
  /** Administrator mutations (approve / reject / status change), by admin id. */
  adminAction: () =>
    named("admin-action", { prefix: "admin-action", tokens: 60, window: "1 h" }),
  /** Client file uploads, by user. */
  fileUpload: () =>
    named("file-upload", { prefix: "file-upload", tokens: 20, window: "1 h" }),
  /** Client file downloads, by user. */
  fileDownload: () =>
    named("file-download", { prefix: "file-download", tokens: 60, window: "1 h" }),
};
