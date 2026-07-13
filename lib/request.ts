import { createHash } from "crypto";

/**
 * Server-only request utilities: safe client IP extraction, salted IP hashing
 * (we never store raw IPs), and lightweight spam heuristics (honeypot, minimum
 * completion time, and link flooding). No third-party captcha in this phase.
 */

/** Best-effort client IP from proxy headers. Falls back to a stable token. */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** One-way hash of an IP, salted with a server secret. For abuse metadata only. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "vx-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export interface SpamCheckInput {
  /** Hidden honeypot value; must be empty for a human. */
  honeypot?: unknown;
  /** Client timestamp (ms) when the form was first rendered. */
  startedAt?: unknown;
  /** The free-text message, checked for link flooding. */
  message?: string;
  /** Minimum seconds a real user needs to complete the form. */
  minSeconds?: number;
  /** Maximum links allowed in the message. */
  maxLinks?: number;
}

export type SpamResult = { spam: false } | { spam: true; reason: string };

const URL_RE = /https?:\/\/|www\./gi;

/**
 * Returns spam:true with a reason if the submission looks automated. Callers
 * should treat any spam:true as a rejection (without revealing the reason to
 * the client beyond a generic message).
 */
export function checkSpam(input: SpamCheckInput): SpamResult {
  const { honeypot, startedAt, message, minSeconds = 3, maxLinks = 3 } = input;

  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { spam: true, reason: "honeypot" };
  }

  if (typeof startedAt === "number" && Number.isFinite(startedAt)) {
    const elapsed = (Date.now() - startedAt) / 1000;
    if (elapsed >= 0 && elapsed < minSeconds) {
      return { spam: true, reason: "too_fast" };
    }
  }

  if (typeof message === "string") {
    const links = message.match(URL_RE);
    if (links && links.length > maxLinks) {
      return { spam: true, reason: "too_many_links" };
    }
  }

  return { spam: false };
}
