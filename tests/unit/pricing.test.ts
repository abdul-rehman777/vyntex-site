import { describe, it, expect } from "vitest";
import {
  DIRECT_PRICING,
  LABOR_TERMS,
  RESELLER_PROGRAM,
  parseMoney,
  findDirectTier,
  activationFeeCents,
} from "@/lib/pricing";

/**
 * Pricing integrity.
 *
 * These tests exist because a silent price change is the single most damaging
 * bug this codebase could ship. If someone edits lib/pricing.ts carelessly,
 * these fail loudly.
 */

describe("parseMoney", () => {
  it("parses plain amounts to cents", () => {
    expect(parseMoney("$500")).toEqual({ cents: 50000, quoteOnly: false });
    expect(parseMoney("$99")).toEqual({ cents: 9900, quoteOnly: false });
  });

  it("parses thousands separators", () => {
    expect(parseMoney("$1,100")).toEqual({ cents: 110000, quoteOnly: false });
    expect(parseMoney("$4,000+")).toEqual({ cents: 400000, quoteOnly: true });
  });

  it("flags a trailing + as quote-only", () => {
    // This is the guard that stops us auto-charging a STARTING price.
    expect(parseMoney("$2,000+").quoteOnly).toBe(true);
    expect(parseMoney("$2,000").quoteOnly).toBe(false);
  });

  it("throws rather than silently charging zero on a malformed value", () => {
    expect(() => parseMoney("free")).toThrow();
  });
});

describe("published direct prices", () => {
  // Locked against the official price book. Changing a price REQUIRES changing
  // this test, which forces the change to be deliberate.
  const expected: Record<string, string> = {
    "web-basic": "$500",
    "web-standard": "$1,100",
    "web-custom": "$2,000+",
    "ai-simple": "$500",
    "ai-standard": "$1,200",
    "ai-advanced": "$2,000+",
    "crm-basic": "$1,000",
    "crm-standard": "$1,500",
    "crm-custom": "$4,000+",
    "brand-logo": "$125",
    "brand-bundle": "$350",
    "brand-kit": "$600",
    "social-setup": "$250",
    "social-mgmt": "$149",
  };

  it("matches the official price book exactly", () => {
    for (const [id, price] of Object.entries(expected)) {
      expect(findDirectTier(id)?.price, `tier ${id}`).toBe(price);
    }
  });

  it("covers every tier — no tier is missing from the price book", () => {
    expect(DIRECT_PRICING).toHaveLength(Object.keys(expected).length);
  });

  it("has the correct CRM recurring fees", () => {
    expect(findDirectTier("crm-basic")?.recurring).toBe("$149");
    expect(findDirectTier("crm-standard")?.recurring).toBe("$225");
  });
});

describe("labor terms", () => {
  it("matches the published rates", () => {
    expect(LABOR_TERMS.hourly).toBe("$95");
    expect(LABOR_TERMS.rush).toBe("$145");
    expect(LABOR_TERMS.supportIncludedDays).toBe(30);
  });
});

describe("reseller program terms", () => {
  it("matches the signed agreement", () => {
    expect(RESELLER_PROGRAM.activationFee).toBe("$199");
    expect(RESELLER_PROGRAM.minimumResalesPerYear).toBe(4);
  });

  it("derives the activation fee in cents from the same string", () => {
    expect(activationFeeCents()).toBe(19900);
  });
});
