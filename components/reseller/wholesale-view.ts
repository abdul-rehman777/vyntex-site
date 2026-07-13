/**
 * Serializable view types for the confidential wholesale library.
 *
 * This file has NO imports and contains NO data — only shapes. The actual
 * figures are read on the server from lib/pricing-reseller.ts (which is
 * `server-only`) and passed down as props to a Client Component that renders
 * them.
 *
 * Why the indirection: if the client component imported the price book
 * directly, the entire wholesale table would be compiled into a public
 * JavaScript chunk and downloadable by anyone who knew the URL. Passing rows as
 * props means the figures exist only inside the rendered response to a request
 * that already passed the active-partner check.
 */

export type WholesaleCategory =
  | "websites"
  | "ai"
  | "crm"
  | "branding"
  | "social";

export interface WholesaleRowView {
  id: string;
  /** i18n key into translations.pricing.items — the NAME is public, the price is not. */
  nameKey: string;
  cost: string;
  resale: string;
  profit: string;
  maintenanceCost: string | null;
  maintenanceResale: string | null;
  /** True when the tier carries a setup + monthly structure (CRM). */
  hasSetup: boolean;
  /** True for "+" starting prices, which are quoted per project. */
  quoteOnly: boolean;
}

export interface WholesaleGroupView {
  category: WholesaleCategory;
  rows: WholesaleRowView[];
}

/** Service picker options for the partner order form. Contains NO prices. */
export interface PartnerServiceOption {
  id: string;
  category: WholesaleCategory;
  nameKey: string;
}
