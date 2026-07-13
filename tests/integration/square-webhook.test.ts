import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "node:crypto";

/**
 * Square webhook — signature verification and idempotency.
 *
 * These are INTEGRATION tests against the real verification helper from the
 * Square SDK, using a real HMAC computed the way Square computes it. They do
 * not need live Square credentials: the signature key is a secret we choose,
 * and the algorithm is deterministic.
 *
 * WHAT THIS PROTECTS: the webhook is the only thing in the entire system that
 * can mark an order paid, activate a partner, or record a qualifying sale. If
 * an attacker could forge one, they could activate themselves as a partner for
 * free and read the confidential wholesale price book. Signature verification
 * is the whole defence.
 */

const SIGNATURE_KEY = "test_signature_key_do_not_use_in_production";
const NOTIFICATION_URL = "https://vyntexusa.com/api/square/webhook";

/** Reproduces exactly what Square does: HMAC-SHA256 over (url + raw body). */
function squareSignature(body: string, url = NOTIFICATION_URL, key = SIGNATURE_KEY) {
  return createHmac("sha256", key).update(url + body).digest("base64");
}

beforeEach(() => {
  vi.stubEnv("SQUARE_WEBHOOK_SIGNATURE_KEY", SIGNATURE_KEY);
  vi.stubEnv("SQUARE_WEBHOOK_NOTIFICATION_URL", NOTIFICATION_URL);
});

async function verify(body: string, header: string | null) {
  const { verifyWebhookSignature } = await import("@/lib/square");
  return verifyWebhookSignature({ rawBody: body, signatureHeader: header });
}

const paymentBody = JSON.stringify({
  merchant_id: "MERCHANT",
  type: "payment.updated",
  event_id: "evt_11111111-1111-1111-1111-111111111111",
  created_at: "2026-07-13T12:00:00Z",
  data: {
    type: "payment",
    id: "pay_1",
    object: {
      payment: {
        id: "pay_1",
        order_id: "sq_order_1",
        status: "COMPLETED",
        note: "vx_order:3fa85f64-5717-4562-b3fc-2c963f66afa6",
      },
    },
  },
});

describe("Square webhook signature verification", () => {
  it("ACCEPTS a correctly signed payload", async () => {
    const sig = squareSignature(paymentBody);
    await expect(verify(paymentBody, sig)).resolves.toBe(true);
  });

  it("REJECTS a payload with no signature header", async () => {
    await expect(verify(paymentBody, null)).resolves.toBe(false);
  });

  it("REJECTS a forged signature", async () => {
    await expect(verify(paymentBody, "not-a-real-signature")).resolves.toBe(false);
  });

  it("REJECTS a body tampered with after signing", async () => {
    // The classic attack: sign a $1 order, then swap the body for a $10,000 one.
    const sig = squareSignature(paymentBody);
    const tampered = paymentBody.replace("COMPLETED", "PENDING");
    await expect(verify(tampered, sig)).resolves.toBe(false);
  });

  it("REJECTS a signature computed with the wrong key", async () => {
    const sig = squareSignature(paymentBody, NOTIFICATION_URL, "attacker_key");
    await expect(verify(paymentBody, sig)).resolves.toBe(false);
  });

  it("REJECTS a signature computed for a different notification URL", async () => {
    // Square signs (url + body). If the deployed URL and the registered URL
    // disagree — even by a trailing slash — verification fails. This test exists
    // to make that failure mode explicit rather than mysterious.
    const sig = squareSignature(paymentBody, "https://vyntexusa.com/api/square/webhook/");
    await expect(verify(paymentBody, sig)).resolves.toBe(false);
  });

  it("FAILS CLOSED when the signature key is not configured", async () => {
    vi.stubEnv("SQUARE_WEBHOOK_SIGNATURE_KEY", "");
    const sig = squareSignature(paymentBody);
    // A missing key must never mean "trust everything".
    await expect(verify(paymentBody, sig)).resolves.toBe(false);
  });

  it("FAILS CLOSED when the notification URL is not configured", async () => {
    vi.stubEnv("SQUARE_WEBHOOK_NOTIFICATION_URL", "");
    const sig = squareSignature(paymentBody);
    await expect(verify(paymentBody, sig)).resolves.toBe(false);
  });

  it("is sensitive to whitespace — proving the RAW body must be used", async () => {
    // If a handler parsed the JSON and re-serialized it, the bytes would change
    // and the HMAC would break. This asserts that fragility, so nobody "helpfully"
    // refactors the route to use request.json().
    const sig = squareSignature(paymentBody);
    const reserialized = JSON.stringify(JSON.parse(paymentBody), null, 2);
    expect(reserialized).not.toBe(paymentBody);
    await expect(verify(reserialized, sig)).resolves.toBe(false);
  });
});

describe("order id extraction", () => {
  it("recovers our order id from the payment note", async () => {
    const { orderIdFromNote } = await import("@/lib/square");
    expect(orderIdFromNote("vx_order:3fa85f64-5717-4562-b3fc-2c963f66afa6")).toBe(
      "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    );
  });

  it("returns null for an absent or malformed note", async () => {
    const { orderIdFromNote } = await import("@/lib/square");
    expect(orderIdFromNote(undefined)).toBeNull();
    expect(orderIdFromNote("some other note")).toBeNull();
    expect(orderIdFromNote("vx_order:not-a-uuid")).toBeNull();
  });
});
