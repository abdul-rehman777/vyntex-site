import "server-only";
import { SquareClient, SquareEnvironment, WebhooksHelper } from "square";
import { SITE } from "@/lib/site";

/**
 * Square integration. SERVER ONLY.
 *
 * We use Square-hosted Payment Links. Card data never touches our origin — the
 * buyer enters it on Square's page. SQUARE_ACCESS_TOKEN is read from the server
 * environment and is never sent to the browser (no NEXT_PUBLIC_ prefix, and the
 * `server-only` import above makes a client import a build error).
 */

let client: SquareClient | null = null;

function environment(): string {
  const env = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "sandbox")
    .trim()
    .toLowerCase();
  return env === "production"
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox;
}

export function isSquareConfigured(): boolean {
  return Boolean(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);
}

export function getSquareClient(): SquareClient | null {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token || !process.env.SQUARE_LOCATION_ID) return null;
  if (!client) {
    client = new SquareClient({ token, environment: environment() });
  }
  return client;
}

export interface PaymentLinkInput {
  /** Our order id. Used as the idempotency key and echoed in the payment note. */
  orderId: string;
  /** Line-item name shown on the Square checkout page. */
  name: string;
  amountCents: number;
  buyerEmail?: string;
  /** Where Square sends the buyer after payment. */
  redirectUrl: string;
}

export type PaymentLinkResult =
  | {
      ok: true;
      url: string;
      paymentLinkId: string;
      /** Square's own order id — the key the webhook payload gives us. */
      squareOrderId: string | null;
    }
  | { ok: false; error: string };

export async function createPaymentLink(
  input: PaymentLinkInput,
): Promise<PaymentLinkResult> {
  const square = getSquareClient();
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!square || !locationId) {
    return { ok: false, error: "Square is not configured." };
  }

  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    return { ok: false, error: "Invalid amount." };
  }

  try {
    const response = await square.checkout.paymentLinks.create({
      // Our order id is a UUID: replaying the same request cannot double-charge.
      idempotencyKey: input.orderId,
      description: `VYNTEX order ${input.orderId}`,
      quickPay: {
        name: input.name,
        priceMoney: {
          amount: BigInt(input.amountCents),
          currency: "USD",
        },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: input.redirectUrl,
        merchantSupportEmail: SITE.email,
        askForShippingAddress: false,
        allowTipping: false,
      },
      prePopulatedData: input.buyerEmail ? { buyerEmail: input.buyerEmail } : undefined,
      paymentNote: `vx_order:${input.orderId}`,
    });

    const link = response.paymentLink;
    const url = link?.url ?? link?.longUrl;
    if (!link?.id || !url) {
      return { ok: false, error: "Square did not return a payment link." };
    }

    return {
      ok: true,
      url,
      paymentLinkId: link.id,
      squareOrderId: link.orderId ?? null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Square error.";
    // Never surface Square internals to the browser; the caller returns a code.
    console.error("[square] payment link creation failed:", message);
    return { ok: false, error: message };
  }
}

/**
 * Verifies a webhook came from Square.
 *
 * Square signs the concatenation of the notification URL and the RAW request
 * body. The body must be the exact bytes received — re-serializing parsed JSON
 * changes whitespace and breaks the signature. Callers must pass request.text().
 */
export async function verifyWebhookSignature(input: {
  rawBody: string;
  signatureHeader: string | null;
}): Promise<boolean> {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;

  if (!signatureKey || !notificationUrl) {
    console.error(
      "[square] webhook rejected: SQUARE_WEBHOOK_SIGNATURE_KEY or SQUARE_WEBHOOK_NOTIFICATION_URL is not set.",
    );
    return false;
  }
  if (!input.signatureHeader) return false;

  try {
    return await WebhooksHelper.verifySignature({
      requestBody: input.rawBody,
      signatureHeader: input.signatureHeader,
      signatureKey,
      notificationUrl,
    });
  } catch (err) {
    console.error(
      "[square] signature verification threw:",
      err instanceof Error ? err.message : "unknown",
    );
    return false;
  }
}

/** Minimal shape of the Square webhook envelope we rely on. */
export interface SquareWebhookEvent {
  event_id?: string;
  type?: string;
  data?: {
    type?: string;
    id?: string;
    object?: {
      payment?: {
        id?: string;
        order_id?: string;
        status?: string;
        note?: string;
      };
      refund?: {
        id?: string;
        order_id?: string;
        payment_id?: string;
        status?: string;
      };
    };
  };
}

/** Extracts our order id from the payment note we set at link creation. */
export function orderIdFromNote(note: string | undefined): string | null {
  if (!note) return null;
  const match = /vx_order:([0-9a-fA-F-]{36})/.exec(note);
  return match?.[1] ?? null;
}
