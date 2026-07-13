import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isAuthorizedCron } from "@/lib/cron";

/**
 * Cron endpoint authorization.
 *
 * The cron routes mutate partner status and drain the email queue. An
 * unauthenticated caller must not be able to trigger them, and — critically — a
 * MISSING secret must not be treated as "no auth required".
 */

const SECRET = "test_cron_secret";

function req(auth?: string): Request {
  return new Request("https://vyntexusa.com/api/cron/expire-partners", {
    headers: auth ? { authorization: auth } : {},
  });
}

beforeEach(() => {
  vi.stubEnv("CRON_SECRET", SECRET);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("cron authorization", () => {
  it("accepts the correct bearer token", () => {
    expect(isAuthorizedCron(req(`Bearer ${SECRET}`))).toBe(true);
  });

  it("rejects a missing Authorization header", () => {
    expect(isAuthorizedCron(req())).toBe(false);
  });

  it("rejects a wrong secret", () => {
    expect(isAuthorizedCron(req("Bearer wrong_secret_xx"))).toBe(false);
  });

  it("rejects a correct secret with the wrong scheme", () => {
    expect(isAuthorizedCron(req(`Basic ${SECRET}`))).toBe(false);
  });

  it("FAILS CLOSED when CRON_SECRET is unset", () => {
    // An unprotected cron endpoint is a public button that changes partner
    // status. A missing variable must lock the door, not remove it.
    vi.stubEnv("CRON_SECRET", "");
    expect(isAuthorizedCron(req("Bearer anything"))).toBe(false);
    expect(isAuthorizedCron(req())).toBe(false);
  });

  it("rejects a prefix of the correct token", () => {
    expect(isAuthorizedCron(req(`Bearer ${SECRET.slice(0, -1)}`))).toBe(false);
  });
});
