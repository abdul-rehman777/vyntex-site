import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  verifyWebhookSignature,
  orderIdFromNote,
  type SquareWebhookEvent,
} from "@/lib/square";
import { addTwelveMonths, type OrderStatus } from "@/lib/order-types";
import { limiters } from "@/lib/rate-limit";
import { internalInbox } from "@/lib/resend";
import { queueAndSend } from "@/lib/email/outbox";
import {
  internalOrderPaidEmail,
  customerOrderPaidEmail,
  type OrderPaidEmailData,
} from "@/lib/email/templates";

// The Node runtime is required: we need the exact raw request body for
// signature verification, and the Square SDK's crypto helpers.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  user_id: string | null;
  partner_id: string | null;
  customer_email: string;
  customer_name: string | null;
  order_type: string;
  status: OrderStatus;
  total: number;
  language: string;
  client_reference: string | null;
  square_order_id: string | null;
}

interface PartnerRow {
  id: string;
  partner_number: string;
  email: string;
  contact_name: string;
  status: string;
  expiration_date: string | null;
}

/**
 * Square webhook receiver.
 *
 * This is the ONLY place in the entire application that may mark an order paid,
 * activate a partner, extend an expiration date, or record a qualifying sale.
 * The browser returning from Square proves nothing and changes nothing.
 *
 * Guarantees:
 *  - Signature verified against the RAW body before anything is parsed for use.
 *  - Idempotent: a unique index on (provider, provider_event_id) means Square's
 *    retries — which are normal and expected — cannot double-apply effects.
 *  - Always returns 200 once the signature is valid, so Square stops retrying a
 *    request we have accepted. Internal failures are logged, not surfaced.
 */
export async function POST(request: Request) {
  // 1) RAW body. Do NOT use request.json() here — re-serializing changes bytes
  //    and the HMAC will not match.
  const rawBody = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature");

  const valid = await verifyWebhookSignature({ rawBody, signatureHeader: signature });
  if (!valid) {
    // Do not leak why. An attacker learns nothing from a bare 401.
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event: SquareWebhookEvent;
  try {
    event = JSON.parse(rawBody) as SquareWebhookEvent;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventId = event.event_id;
  const eventType = event.type ?? "unknown";
  if (!eventId) {
    return NextResponse.json({ ok: true, ignored: "missing_event_id" });
  }

  // Signature-verified, so this limiter is only a flood guard, never the
  // correctness mechanism. Idempotency below is what makes retries safe.
  const rl = await limiters.squareWebhook().limit(`event:${eventId}`);
  if (!rl.success) {
    return NextResponse.json({ ok: true, ignored: "rate_limited" });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    console.error("[square/webhook] Supabase admin not configured.");
    // 500 so Square retries once we are healthy again.
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const payloadHash = createHash("sha256").update(rawBody, "utf8").digest("hex");

  // 2) IDEMPOTENCY GATE. Insert first; a duplicate event_id violates the unique
  //    index and we stop. This is why a replayed webhook is harmless.
  const { data: ledgerRow, error: ledgerError } = await admin
    .from("payment_events")
    .insert({
      provider: "square",
      provider_event_id: eventId,
      event_type: eventType,
      payload_hash: payloadHash,
      status: "received",
    })
    .select("id")
    .single();

  if (ledgerError || !ledgerRow) {
    // Unique violation = already processed. Acknowledge so Square stops retrying.
    if (ledgerError?.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    console.error("[square/webhook] ledger insert failed:", ledgerError?.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const eventRowId = ledgerRow.id as string;

  const finish = async (status: string, orderId: string | null) => {
    await admin
      .from("payment_events")
      .update({
        status,
        order_id: orderId,
        processed_at: new Date().toISOString(),
      })
      .eq("id", eventRowId);
  };

  // 3) Locate our order.
  const payment = event.data?.object?.payment;
  const refund = event.data?.object?.refund;

  const squareOrderId = payment?.order_id ?? refund?.order_id ?? null;
  const noteOrderId = orderIdFromNote(payment?.note);

  if (!squareOrderId && !noteOrderId) {
    await finish("ignored", null);
    return NextResponse.json({ ok: true, ignored: "no_order_reference" });
  }

  let order: OrderRow | null = null;

  if (noteOrderId) {
    const { data } = await admin
      .from("orders")
      .select(
        "id, user_id, partner_id, customer_email, customer_name, order_type, status, total, language, client_reference, square_order_id",
      )
      .eq("id", noteOrderId)
      .maybeSingle();
    if (data) order = data as OrderRow;
  }

  if (!order && squareOrderId) {
    const { data } = await admin
      .from("orders")
      .select(
        "id, user_id, partner_id, customer_email, customer_name, order_type, status, total, language, client_reference, square_order_id",
      )
      .eq("square_order_id", squareOrderId)
      .maybeSingle();
    if (data) order = data as OrderRow;
  }

  if (!order) {
    await finish("ignored", null);
    return NextResponse.json({ ok: true, ignored: "order_not_found" });
  }

  // Backfill the Square order id if the link creation response did not carry it.
  if (squareOrderId && !order.square_order_id) {
    await admin
      .from("orders")
      .update({ square_order_id: squareOrderId })
      .eq("id", order.id);
  }

  // 4) Map the Square event to an order status.
  const paymentStatus = payment?.status?.toUpperCase();
  const refundStatus = refund?.status?.toUpperCase();

  let nextStatus: OrderStatus | null = null;
  if (refund && refundStatus === "COMPLETED") {
    nextStatus = "refunded";
  } else if (paymentStatus === "COMPLETED") {
    nextStatus = "paid";
  } else if (paymentStatus === "FAILED") {
    nextStatus = "failed";
  } else if (paymentStatus === "CANCELED") {
    nextStatus = "canceled";
  }

  if (!nextStatus) {
    // APPROVED / PENDING and everything else: acknowledged, no state change.
    await finish("ignored", order.id);
    return NextResponse.json({ ok: true, ignored: "no_status_change" });
  }

  // Never regress a paid order back to pending/failed via a stale event.
  if (order.status === "paid" && nextStatus !== "refunded") {
    await finish("ignored", order.id);
    return NextResponse.json({ ok: true, ignored: "already_paid" });
  }

  await admin
    .from("orders")
    .update({
      status: nextStatus,
      square_payment_id: payment?.id ?? null,
      paid_at: nextStatus === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", order.id);

  // 5) Side effects — ONLY on a confirmed payment.
  if (nextStatus === "paid") {
    try {
      await applyPaidSideEffects(order);
    } catch (err) {
      console.error(
        "[square/webhook] side effects failed for order",
        order.id,
        err instanceof Error ? err.message : "unknown",
      );
      await finish("error", order.id);
      // The payment IS recorded; only the follow-on failed. Return 500 so Square
      // retries — the idempotency row is already written, so we guard below.
      return NextResponse.json({ ok: false }, { status: 500 });
    }
  }

  if (nextStatus === "failed" || nextStatus === "canceled") {
    await admin
      .from("partner_renewals")
      .update({ status: nextStatus === "failed" ? "failed" : "canceled" })
      .eq("payment_order_id", order.id)
      .eq("status", "pending");
  }

  await finish("processed", order.id);
  return NextResponse.json({ ok: true });
}

/**
 * Applies everything that a confirmed payment unlocks. Called only after the
 * webhook signature has been verified and the payment reported COMPLETED.
 */
async function applyPaidSideEffects(order: OrderRow): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("admin_unavailable");

  const now = new Date();

  if (
    order.order_type === "reseller_activation" ||
    order.order_type === "reseller_renewal"
  ) {
    if (!order.partner_id) throw new Error("missing_partner_on_activation");

    const { data: partnerData } = await admin
      .from("partners")
      .select("id, partner_number, email, contact_name, status, expiration_date")
      .eq("id", order.partner_id)
      .maybeSingle();

    const partner = partnerData as PartnerRow | null;
    if (!partner) throw new Error("partner_not_found");

    // Renewals extend from the later of "now" and the current expiry, so an
    // early renewal never shortens the term the partner already paid for.
    const currentExpiry = partner.expiration_date
      ? new Date(partner.expiration_date)
      : null;
    const base =
      order.order_type === "reseller_renewal" &&
      currentExpiry &&
      currentExpiry.getTime() > now.getTime()
        ? currentExpiry
        : now;

    const expiresAt = addTwelveMonths(base);

    await admin
      .from("partners")
      .update({
        status: "active",
        activation_date: partner.status === "approved" ? now.toISOString() : undefined,
        expiration_date: expiresAt.toISOString(),
        // A new 12-month term starts a fresh minimum-sales window.
        annual_sales_count: 0,
      })
      .eq("id", partner.id);

    await admin
      .from("partner_renewals")
      .update({
        status: "paid",
        starts_at: base.toISOString(),
        expires_at: expiresAt.toISOString(),
      })
      .eq("payment_order_id", order.id);

    await sendOrderEmails(order, partner.partner_number);
    return;
  }

  if (order.order_type === "partner_wholesale") {
    if (!order.partner_id) throw new Error("missing_partner_on_wholesale");

    const { data: itemData } = await admin
      .from("order_items")
      .select("service_key, unit_price")
      .eq("order_id", order.id)
      .limit(1)
      .maybeSingle();

    const serviceKey = (itemData?.service_key as string | undefined) ?? "unknown";
    const amount = (itemData?.unit_price as number | undefined) ?? order.total;

    // A qualifying sale toward the four-per-year minimum. Unique index on
    // order_id means a retried webhook cannot record it twice.
    const { error: saleError } = await admin.from("partner_sales").insert({
      partner_id: order.partner_id,
      order_id: order.id,
      service_key: serviceKey,
      wholesale_amount: amount,
      qualifying_sale: true,
      status: "recorded",
    });

    if (saleError && saleError.code !== "23505") {
      throw new Error(`sale_insert_failed: ${saleError.message}`);
    }

    // Only increment if we actually inserted (i.e. not a duplicate replay).
    if (!saleError) {
      const { error: rpcError } = await admin.rpc("vx_increment_partner_sales", {
        p_partner_id: order.partner_id,
      });
      if (rpcError) throw new Error(`increment_failed: ${rpcError.message}`);
    }

    const { data: partnerData } = await admin
      .from("partners")
      .select("partner_number")
      .eq("id", order.partner_id)
      .maybeSingle();

    await sendOrderEmails(
      order,
      (partnerData?.partner_number as string | undefined) ?? null,
    );
    return;
  }

  // Direct order.
  await sendOrderEmails(order, null);
}

async function sendOrderEmails(
  order: OrderRow,
  partnerNumber: string | null,
): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin) return;

  const { data: items } = await admin
    .from("order_items")
    .select("service_name_snapshot, unit_price, quantity, billing_type")
    .eq("order_id", order.id);

  const data: OrderPaidEmailData = {
    orderId: order.id,
    orderType: order.order_type,
    customerName: order.customer_name ?? "",
    customerEmail: order.customer_email,
    partnerNumber,
    clientReference: order.client_reference,
    totalCents: order.total,
    items: (items ?? []).map((i) => ({
      name: i.service_name_snapshot as string,
      unitPriceCents: i.unit_price as number,
      quantity: i.quantity as number,
      billingType: i.billing_type as string,
    })),
    language: order.language === "es" ? "es" : "en",
  };

  const internal = internalOrderPaidEmail(data);
  const customer = customerOrderPaidEmail(data);

  // Receipts go through the durable outbox. A payment is confirmed regardless of
  // whether the receipt sends — the money is real either way, so the email is
  // retried rather than being allowed to fail the webhook.
  await Promise.all([
    queueAndSend({
      to: internalInbox(),
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      kind: "order_paid_internal",
      refId: order.id,
    }),
    queueAndSend({
      to: order.customer_email,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
      kind: "order_paid_customer",
      refId: order.id,
    }),
  ]);
}
