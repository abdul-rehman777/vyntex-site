/**
 * Order types and pure helpers — SHARED (server + client).
 *
 * Deliberately split from lib/orders.ts, which is `server-only`. Client
 * components legitimately need to name an order type and format a stored
 * amount; they must never be able to reach the code that DECIDES an amount.
 * That decision logic (`resolveOrder`) stays behind the server-only boundary
 * in lib/orders.ts, so a client bundle importing it is a build error, not a
 * silent leak.
 *
 * Nothing here can produce a price. It can only label and format one that the
 * server already determined.
 */

export const ORDER_TYPES = [
  "direct",
  "reseller_activation",
  "reseller_renewal",
  "partner_wholesale",
] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

export const ORDER_STATUSES = [
  "pending", // created, awaiting payment
  "paid", // confirmed by a verified Square webhook — never by the browser
  "failed",
  "canceled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type BillingType = "one_time" | "setup" | "recurring_monthly" | "annual";

/**
 * Display names for line items and order snapshots. Deliberately English and
 * NOT read from lib/translations.ts: the Square dashboard, receipts, and the
 * immutable order record must not shift language with the buyer's UI toggle.
 */
export const SERVICE_NAMES: Record<string, string> = {
  "web-basic": "Basic Website",
  "web-standard": "Standard Website",
  "web-custom": "Custom Website",
  "ai-simple": "Simple AI Tool",
  "ai-standard": "Standard Automation",
  "ai-advanced": "Advanced AI",
  "crm-basic": "Basic CRM",
  "crm-standard": "Standard CRM",
  "crm-custom": "Custom CRM",
  "brand-logo": "Logo",
  "brand-bundle": "Brand Bundle",
  "brand-kit": "Full Brand Kit",
  "social-setup": "Social Setup",
  "social-mgmt": "Social Management",
};

export function serviceName(key: string): string {
  return SERVICE_NAMES[key] ?? key;
}

/** Formats integer cents for display, e.g. 110000 -> "$1,100.00". */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Adds twelve months to a date, preserving the day of month where possible. */
export function addTwelveMonths(from: Date): Date {
  const next = new Date(from.getTime());
  next.setUTCFullYear(next.getUTCFullYear() + 1);
  return next;
}
