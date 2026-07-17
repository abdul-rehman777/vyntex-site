import { describe, it, expect } from "vitest";
import { resolveOrder } from "@/lib/orders";
import { formatCents, addTwelveMonths } from "@/lib/order-types";

/**
 * Server-side price resolution.
 *
 * This is the code that decides what a customer is actually charged. The client
 * cannot influence it — it sends a service KEY, never an amount. These tests
 * verify that the amount always comes from the price book, and that a
 * "starting price" can never be auto-charged.
 */

describe("resolveOrder — direct", () => {
  it("charges the published price, from the price book", () => {
    const result = resolveOrder({ orderType: "direct", serviceKey: "web-standard" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.totalCents).toBe(110000); // $1,100
    expect(result.order.items[0]?.serviceNameSnapshot).toBe("Standard Website");
  });

  it("REFUSES to auto-charge a starting price", () => {
    // "$2,000+" is a starting point. Charging it as if it were final would
    // overcharge some clients and undercharge others.
    const result = resolveOrder({ orderType: "direct", serviceKey: "web-custom" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("quote_required");
  });

  it("rejects an unknown service key instead of guessing", () => {
    const result = resolveOrder({ orderType: "direct", serviceKey: "not-a-service" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("unknown_service");
  });

  it("charges only the CRM setup fee, and records the monthly separately", () => {
    const result = resolveOrder({ orderType: "direct", serviceKey: "crm-basic" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // $1,000 setup — NOT setup + monthly bundled into one silent charge.
    expect(result.order.totalCents).toBe(100000);
    expect(result.order.items[0]?.billingType).toBe("setup");
    expect(result.order.items[0]?.metadata.recurring_monthly).toBe("$149");
  });
});

describe("resolveOrder — reseller activation and renewal", () => {
  it("charges exactly $199 for activation", () => {
    const result = resolveOrder({ orderType: "reseller_activation" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.totalCents).toBe(19900);
    expect(result.order.items[0]?.billingType).toBe("annual");
  });

  it("charges exactly $199 for renewal", () => {
    const result = resolveOrder({ orderType: "reseller_renewal" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.totalCents).toBe(19900);
  });

  it("does not require a service key", () => {
    const result = resolveOrder({ orderType: "reseller_activation" });
    expect(result.ok).toBe(true);
  });
});

describe("resolveOrder — partner wholesale", () => {
  it("charges the PARTNER COST, not the retail price", () => {
    const result = resolveOrder({
      orderType: "partner_wholesale",
      serviceKey: "web-standard",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // 30% partner margin: $770 partner cost — NOT the $1,100 retail price.
    expect(result.order.totalCents).toBe(77000);
  });

  it("refuses quote-only wholesale tiers", () => {
    const result = resolveOrder({
      orderType: "partner_wholesale",
      serviceKey: "crm-custom",
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("quote_required");
  });

  it("never leaks the word 'wholesale' onto the Square checkout label", () => {
    // The label appears on Square's hosted page, which a partner may screenshot
    // or forward. It must not advertise the margin.
    const result = resolveOrder({
      orderType: "partner_wholesale",
      serviceKey: "brand-logo",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.order.checkoutLabel.toLowerCase()).not.toContain("wholesale");
    expect(result.order.checkoutLabel).not.toContain("$75");
  });
});

describe("helpers", () => {
  it("formats cents for display", () => {
    expect(formatCents(19900)).toBe("$199.00");
    expect(formatCents(110000)).toBe("$1,100.00");
  });

  it("adds exactly twelve months", () => {
    const from = new Date("2026-03-15T00:00:00.000Z");
    expect(addTwelveMonths(from).toISOString()).toBe("2027-03-15T00:00:00.000Z");
  });

  it("handles a leap-day activation without losing the term", () => {
    const from = new Date("2028-02-29T00:00:00.000Z");
    const next = addTwelveMonths(from);
    // JS rolls 29 Feb -> 1 Mar in a non-leap year. The partner never loses time.
    expect(next.getTime()).toBeGreaterThan(from.getTime());
    expect(next.getUTCFullYear()).toBe(2029);
  });
});
