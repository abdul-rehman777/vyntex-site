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

export const RESELLER_PRICING: ResellerTier[] = [
  // Websites
  { id: "web-basic", category: "websites", nameKey: "webBasic", cost: "$300", resale: "$500", profit: "$200", maintenance: { cost: "$99", resale: "$149", profit: "$50" } },
  { id: "web-standard", category: "websites", nameKey: "webStandard", cost: "$660", resale: "$1,100", profit: "$440", maintenance: { cost: "$125", resale: "$189", profit: "$64" } },
  { id: "web-custom", category: "websites", nameKey: "webCustom", cost: "$1,200+", resale: "$2,000+", profit: "$800+" },

  // AI Tools
  { id: "ai-simple", category: "ai", nameKey: "aiSimple", cost: "$300", resale: "$500", profit: "$200", maintenance: { cost: "$99", resale: "$149", profit: "$50" } },
  { id: "ai-standard", category: "ai", nameKey: "aiStandard", cost: "$720", resale: "$1,200", profit: "$480", maintenance: { cost: "$125", resale: "$189", profit: "$64" } },
  { id: "ai-advanced", category: "ai", nameKey: "aiAdvanced", cost: "$1,200+", resale: "$2,000+", profit: "$800+" },

  // CRM
  { id: "crm-basic", category: "crm", nameKey: "crmBasic", cost: "$650", resale: "$1,000", profit: "$350", recurring: { cost: "$99", resale: "$149", profit: "$50" } },
  { id: "crm-standard", category: "crm", nameKey: "crmStandard", cost: "$1,000", resale: "$1,500", profit: "$500", recurring: { cost: "$149", resale: "$225", profit: "$76" } },
  { id: "crm-custom", category: "crm", nameKey: "crmCustom", cost: "$4,000+", resale: "$6,000+", profit: "$2,000+" },

  // Branding
  { id: "brand-logo", category: "branding", nameKey: "brandLogo", cost: "$75", resale: "$125", profit: "$50" },
  { id: "brand-bundle", category: "branding", nameKey: "brandBundle", cost: "$210", resale: "$350", profit: "$140" },
  { id: "brand-kit", category: "branding", nameKey: "brandKit", cost: "$360", resale: "$600", profit: "$240" },

  // Social
  { id: "social-setup", category: "social", nameKey: "socialSetup", cost: "$150", resale: "$250", profit: "$100" },
  { id: "social-mgmt", category: "social", nameKey: "socialMgmt", cost: "$99", resale: "$149", profit: "$50" },
];

export function findResellerTier(id: string): ResellerTier | undefined {
  return RESELLER_PRICING.find((t) => t.id === id);
}

export function getResellerByCategory(category: ServiceCategory): ResellerTier[] {
  return RESELLER_PRICING.filter((t) => t.category === category);
}
