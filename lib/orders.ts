import "server-only";
import {
  DIRECT_PRICING,
  RESELLER_PROGRAM,
  activationFeeCents,
  findDirectTier,
  parseMoney,
  type DirectTier,
} from "@/lib/pricing";
import {
  RESELLER_PRICING,
  findResellerTier,
  type ResellerTier,
} from "@/lib/pricing-reseller";
import {
  serviceName,
  type BillingType,
  type OrderType,
} from "@/lib/order-types";

/**
 * Order RESOLUTION. SERVER ONLY.
 *
 * CRITICAL: the browser never tells us what anything costs. It sends an order
 * type and a service key; this module looks the amount up in lib/pricing.ts and
 * that is the amount charged. Any price sent by a client is discarded.
 *
 * Shared enums, labels, and formatters live in lib/order-types.ts (importable
 * from client components). Only the code that DECIDES an amount lives here,
 * behind the `server-only` boundary above.
 */

// Re-exported for server callers so they have a single import site.
export {
  ORDER_TYPES,
  ORDER_STATUSES,
  SERVICE_NAMES,
  serviceName,
  formatCents,
  addTwelveMonths,
} from "@/lib/order-types";
export type {
  OrderType,
  OrderStatus,
  BillingType,
} from "@/lib/order-types";

export interface ResolvedLineItem {
  serviceKey: string;
  /** Snapshot of the name at purchase time, so later renames don't rewrite history. */
  serviceNameSnapshot: string;
  unitPriceCents: number;
  quantity: number;
  billingType: BillingType;
  metadata: Record<string, string>;
}

export interface ResolvedOrder {
  orderType: OrderType;
  items: ResolvedLineItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  currency: "USD";
  /** Human-readable label shown on the Square checkout page. */
  checkoutLabel: string;
}

export type ResolveError =
  | "unknown_service"
  | "quote_required"
  | "invalid_order_type";

export type ResolveResult =
  | { ok: true; order: ResolvedOrder }
  | { ok: false; code: ResolveError };

/** True when the tier is a starting price ("$2,000+") and cannot be auto-charged. */
export function isQuoteOnlyDirect(tier: DirectTier): boolean {
  return parseMoney(tier.price).quoteOnly;
}

export function isQuoteOnlyReseller(tier: ResellerTier): boolean {
  return parseMoney(tier.cost).quoteOnly;
}

/** Direct (public) services that can be checked out immediately. */
export function purchasableDirectTiers(): DirectTier[] {
  return DIRECT_PRICING.filter((t) => !isQuoteOnlyDirect(t));
}

/** Wholesale services an active partner can order immediately. */
export function purchasableResellerTiers(): ResellerTier[] {
  return RESELLER_PRICING.filter((t) => !isQuoteOnlyReseller(t));
}

function directBillingType(tier: DirectTier): BillingType {
  if (tier.unitKey === "setup") return "setup";
  if (tier.unitKey === "perMonth") return "recurring_monthly";
  return "one_time";
}

/**
 * Resolves the authoritative amount for an order. The ONLY place a chargeable
 * amount is produced.
 *
 * Note on CRM tiers: only the setup fee is charged through checkout. The
 * recurring monthly fee is billed separately and is recorded on the line item's
 * metadata so the order record still states it. We never silently bundle a
 * recurring charge into a one-time payment link.
 */
export function resolveOrder(input: {
  orderType: OrderType;
  serviceKey?: string;
}): ResolveResult {
  const { orderType, serviceKey } = input;

  if (orderType === "reseller_activation" || orderType === "reseller_renewal") {
    const cents = activationFeeCents();
    const label =
      orderType === "reseller_activation"
        ? "VYNTEX Authorized Reseller — Annual Activation"
        : "VYNTEX Authorized Reseller — Annual Renewal";
    const item: ResolvedLineItem = {
      serviceKey: orderType,
      serviceNameSnapshot: label,
      unitPriceCents: cents,
      quantity: 1,
      billingType: "annual",
      metadata: {
        activation_fee: RESELLER_PROGRAM.activationFee,
        term_months: "12",
      },
    };
    return {
      ok: true,
      order: {
        orderType,
        items: [item],
        subtotalCents: cents,
        taxCents: 0,
        totalCents: cents,
        currency: "USD",
        checkoutLabel: label,
      },
    };
  }

  if (orderType === "direct") {
    if (!serviceKey) return { ok: false, code: "unknown_service" };
    const tier = findDirectTier(serviceKey);
    if (!tier) return { ok: false, code: "unknown_service" };

    const price = parseMoney(tier.price);
    if (price.quoteOnly) return { ok: false, code: "quote_required" };

    const metadata: Record<string, string> = { list_price: tier.price };
    if (tier.recurring) metadata.recurring_monthly = tier.recurring;

    const item: ResolvedLineItem = {
      serviceKey: tier.id,
      serviceNameSnapshot: serviceName(tier.id),
      unitPriceCents: price.cents,
      quantity: 1,
      billingType: directBillingType(tier),
      metadata,
    };
    return {
      ok: true,
      order: {
        orderType,
        items: [item],
        subtotalCents: price.cents,
        taxCents: 0,
        totalCents: price.cents,
        currency: "USD",
        checkoutLabel: `VYNTEX — ${item.serviceNameSnapshot}`,
      },
    };
  }

  if (orderType === "partner_wholesale") {
    if (!serviceKey) return { ok: false, code: "unknown_service" };
    const tier = findResellerTier(serviceKey);
    if (!tier) return { ok: false, code: "unknown_service" };

    const cost = parseMoney(tier.cost);
    if (cost.quoteOnly) return { ok: false, code: "quote_required" };

    const metadata: Record<string, string> = { partner_cost: tier.cost };
    if (tier.recurring) metadata.recurring_monthly_cost = tier.recurring.cost;
    if (tier.maintenance) metadata.maintenance_monthly_cost = tier.maintenance.cost;

    const item: ResolvedLineItem = {
      serviceKey: tier.id,
      serviceNameSnapshot: serviceName(tier.id),
      unitPriceCents: cost.cents,
      quantity: 1,
      billingType: tier.recurring ? "setup" : "one_time",
      metadata,
    };
    return {
      ok: true,
      order: {
        orderType,
        items: [item],
        subtotalCents: cost.cents,
        taxCents: 0,
        totalCents: cost.cents,
        currency: "USD",
        // Never leak "wholesale" or the margin onto a page a client might see.
        checkoutLabel: `VYNTEX — ${item.serviceNameSnapshot} (Partner Order)`,
      },
    };
  }

  return { ok: false, code: "invalid_order_type" };
}
