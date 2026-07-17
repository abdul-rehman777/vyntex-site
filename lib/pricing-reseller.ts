import "server-only";
import type { Money, ServiceCategory } from "@/lib/pricing";

/**
 * CONFIDENTIAL wholesale pricing — SERVER ONLY.
 *
 * The `server-only` import above is the enforcement mechanism. Any attempt to
 * import this module from a Client Component is a hard build error, so these
 * figures can never end up in a JavaScript chunk that an unauthenticated
 * visitor can download.
 *
 * Authorized partners see these values because a Server Component
 * (app/portal/partner/page.tsx) reads them AFTER lib/reseller.ts#getPartnerAccess
 * confirms the caller is an active partner, and passes only the resulting rows
 * down as props. They are therefore present in exactly one place: the rendered
 * response to an authorized request.
 *
 * These are the same figures as the public price book's counterparts — do not
 * restate a retail price here; RESELLER_PRICING.resale is the SUGGESTED resale,
 * which the agreement forbids partners from undercutting.
 */

export interface ResellerTier {
  id: string;
  category: ServiceCategory;
  nameKey: string;
  cost: Money;
  resale: Money;
  profit: Money;
  /** Optional recurring line, e.g. CRM monthly cost/resale/profit. */
  recurring?: { cost: Money; resale: Money; profit: Money };
  /** Optional maintenance line for one-time products with monthly upkeep. */
  maintenance?: { cost: Money; resale: Money; profit: Money };
}

export const RESELLER_MARGIN_PERCENT = 30 as const;

export const RESELLER_PRICING: ResellerTier[] = [
  // Partner cost is 70% of the suggested resale price, leaving a 30% margin.
  { id: "web-basic", category: "websites", nameKey: "webBasic", cost: "$350", resale: "$500", profit: "$150", maintenance: { cost: "$104.30", resale: "$149", profit: "$44.70" } },
  { id: "web-standard", category: "websites", nameKey: "webStandard", cost: "$770", resale: "$1,100", profit: "$330", maintenance: { cost: "$132.30", resale: "$189", profit: "$56.70" } },
  { id: "web-custom", category: "websites", nameKey: "webCustom", cost: "$1,400+", resale: "$2,000+", profit: "$600+" },

  { id: "ai-simple", category: "ai", nameKey: "aiSimple", cost: "$350", resale: "$500", profit: "$150", maintenance: { cost: "$104.30", resale: "$149", profit: "$44.70" } },
  { id: "ai-standard", category: "ai", nameKey: "aiStandard", cost: "$840", resale: "$1,200", profit: "$360", maintenance: { cost: "$132.30", resale: "$189", profit: "$56.70" } },
  { id: "ai-advanced", category: "ai", nameKey: "aiAdvanced", cost: "$1,400+", resale: "$2,000+", profit: "$600+" },

  { id: "crm-basic", category: "crm", nameKey: "crmBasic", cost: "$700", resale: "$1,000", profit: "$300", recurring: { cost: "$104.30", resale: "$149", profit: "$44.70" } },
  { id: "crm-standard", category: "crm", nameKey: "crmStandard", cost: "$1,050", resale: "$1,500", profit: "$450", recurring: { cost: "$157.50", resale: "$225", profit: "$67.50" } },
  { id: "crm-custom", category: "crm", nameKey: "crmCustom", cost: "$4,200+", resale: "$6,000+", profit: "$1,800+" },

  { id: "brand-logo", category: "branding", nameKey: "brandLogo", cost: "$87.50", resale: "$125", profit: "$37.50" },
  { id: "brand-bundle", category: "branding", nameKey: "brandBundle", cost: "$245", resale: "$350", profit: "$105" },
  { id: "brand-kit", category: "branding", nameKey: "brandKit", cost: "$420", resale: "$600", profit: "$180" },

  { id: "social-setup", category: "social", nameKey: "socialSetup", cost: "$175", resale: "$250", profit: "$75" },
  { id: "social-mgmt", category: "social", nameKey: "socialMgmt", cost: "$104.30", resale: "$149", profit: "$44.70" },
];

export function findResellerTier(id: string): ResellerTier | undefined {
  return RESELLER_PRICING.find((t) => t.id === id);
}

export function getResellerByCategory(category: ServiceCategory): ResellerTier[] {
  return RESELLER_PRICING.filter((t) => t.category === category);
}
