import { describe, it, expect } from "vitest";
import { createCheckoutSchema } from "@/lib/validation/checkout";
import { resellerApplicationSchema } from "@/lib/validation/reseller";
import { isAllowedMime, safeFileName, MAX_FILE_BYTES } from "@/lib/files";
import { checkSpam, hashIp } from "@/lib/request";

describe("checkout validation", () => {
  it("has NO price field — the client cannot propose an amount", () => {
    // The single most important property of this schema. A price field here
    // would let a tampered request buy a $1,100 site for $1.
    const result = createCheckoutSchema.safeParse({
      orderType: "direct",
      serviceKey: "web-standard",
      fullName: "Test Buyer",
      email: "buyer@example.com",
      termsAccepted: true,
      privacyAccepted: true,
      // Attacker-supplied. Must be ignored, not honoured.
      total: 1,
      amount: 1,
      price: "$1",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    const parsed = result.data as Record<string, unknown>;
    expect(parsed.total).toBeUndefined();
    expect(parsed.amount).toBeUndefined();
    expect(parsed.price).toBeUndefined();
  });

  it("requires both terms and privacy acceptance", () => {
    const base = {
      orderType: "direct" as const,
      serviceKey: "web-basic",
      fullName: "Test Buyer",
      email: "buyer@example.com",
      privacyAccepted: true as const,
    };
    expect(createCheckoutSchema.safeParse({ ...base, termsAccepted: false }).success).toBe(
      false,
    );
  });

  it("accepts a partner wholesale order with a client reference", () => {
    const result = createCheckoutSchema.safeParse({
      orderType: "partner_wholesale",
      serviceKey: "web-basic",
      clientReference: "Acme Bakery - homepage",
      termsAccepted: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown order type", () => {
    const result = createCheckoutSchema.safeParse({ orderType: "free_stuff" });
    expect(result.success).toBe(false);
  });
});

describe("reseller application validation", () => {
  const valid = {
    fullName: "Jane Partner",
    businessName: "Partner Co",
    email: "jane@partner.co",
    phone: "609-555-0100",
    city: "Northfield",
    state: "NJ",
    clientCount: "11_50" as const,
    servicesInterest: ["websites" as const],
    resellModel: "agency" as const,
    message: "We serve about forty local restaurants and want to add websites.",
    agreementAck: true as const,
    privacyConsent: true as const,
  };

  it("accepts a complete application", () => {
    expect(resellerApplicationSchema.safeParse(valid).success).toBe(true);
  });

  it("requires at least one service of interest", () => {
    expect(
      resellerApplicationSchema.safeParse({ ...valid, servicesInterest: [] }).success,
    ).toBe(false);
  });

  it("requires both the agreement acknowledgement and privacy consent", () => {
    expect(
      resellerApplicationSchema.safeParse({ ...valid, agreementAck: false }).success,
    ).toBe(false);
    expect(
      resellerApplicationSchema.safeParse({ ...valid, privacyConsent: false }).success,
    ).toBe(false);
  });

  it("rejects a state that is not a two-letter code", () => {
    expect(
      resellerApplicationSchema.safeParse({ ...valid, state: "New Jersey" }).success,
    ).toBe(false);
  });
});

describe("file upload guards", () => {
  it("uses an ALLOWLIST — an executable is not allowed", () => {
    expect(isAllowedMime("application/pdf")).toBe(true);
    expect(isAllowedMime("image/png")).toBe(true);
    // A blocklist would have to enumerate every dangerous type and would always
    // be one short. The allowlist is closed by construction.
    expect(isAllowedMime("application/x-msdownload")).toBe(false);
    expect(isAllowedMime("text/html")).toBe(false);
    expect(isAllowedMime("application/x-sh")).toBe(false);
  });

  it("caps the upload inside Vercel's body limit", () => {
    expect(MAX_FILE_BYTES).toBeLessThanOrEqual(4.5 * 1024 * 1024);
  });

  it("strips path traversal from a filename", () => {
    expect(safeFileName("../../etc/passwd")).not.toContain("/");
    expect(safeFileName("..\\..\\windows\\system32")).not.toContain("\\");
    expect(safeFileName("....pdf")).not.toMatch(/^\./);
  });

  it("never returns an empty filename", () => {
    expect(safeFileName("").length).toBeGreaterThan(0);
    expect(safeFileName("...").length).toBeGreaterThan(0);
  });
});

describe("spam heuristics", () => {
  it("catches a filled honeypot", () => {
    const result = checkSpam({ honeypot: "bot-filled-this" });
    expect(result.spam).toBe(true);
  });

  it("catches an impossibly fast submission", () => {
    const result = checkSpam({ startedAt: Date.now(), minSeconds: 3 });
    expect(result.spam).toBe(true);
  });

  it("allows a genuine submission", () => {
    const result = checkSpam({
      honeypot: "",
      startedAt: Date.now() - 30_000,
      message: "I would like a website for my restaurant.",
    });
    expect(result.spam).toBe(false);
  });

  it("catches link flooding", () => {
    const result = checkSpam({
      startedAt: Date.now() - 30_000,
      message: "http://a.com http://b.com http://c.com http://d.com http://e.com",
    });
    expect(result.spam).toBe(true);
  });
});

describe("IP hashing", () => {
  it("never returns the raw IP", () => {
    const ip = "203.0.113.42";
    const hashed = hashIp(ip);
    expect(hashed).not.toContain(ip);
    expect(hashed).toHaveLength(32);
  });

  it("is deterministic for the same IP", () => {
    expect(hashIp("203.0.113.42")).toBe(hashIp("203.0.113.42"));
  });

  it("produces different hashes for different IPs", () => {
    expect(hashIp("203.0.113.42")).not.toBe(hashIp("203.0.113.43"));
  });
});
