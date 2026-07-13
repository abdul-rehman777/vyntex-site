import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getPartnerAccess } from "@/lib/reseller";
import { PRICING_CATEGORIES, parseMoney } from "@/lib/pricing";
import { getResellerByCategory } from "@/lib/pricing-reseller";
import PortalShell from "@/components/portal/PortalShell";
import PartnerStatus, {
  type PartnerStatusView,
} from "@/components/reseller/PartnerStatus";
import WholesaleLibrary from "@/components/reseller/WholesaleLibrary";
import PartnerOrderForm from "@/components/reseller/PartnerOrderForm";
import type {
  WholesaleGroupView,
  PartnerServiceOption,
} from "@/components/reseller/wholesale-view";

export const metadata: Metadata = {
  title: "Partner Portal",
  // Never index a page that can contain confidential pricing.
  robots: { index: false, follow: false, nocache: true },
};

// Authorization state must never be cached or shared across users.
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * THE GATE.
 *
 * `getPartnerAccess` runs on the server and reads the database under the
 * caller's own RLS-scoped session. The wholesale price book
 * (lib/pricing-reseller.ts) is `server-only` and is READ HERE — inside this
 * `if` — and only ever reached when canViewWholesale is true, which requires an
 * active partner with a signed agreement and a webhook-confirmed activation
 * payment that has not expired.
 *
 * For every other visitor the figures are not hidden, not blurred, and not
 * behind a client-side flag: they are simply never computed, never serialized,
 * and never sent. There is no CSS to override and no variable to flip in
 * devtools, because the data does not exist in the response.
 */
export default async function PartnerPortalPage() {
  const user = await requireUser();
  const access = await getPartnerAccess(user);
  const { partner, agreement } = access;

  const view: PartnerStatusView = {
    state: access.state,
    partnerNumber: partner?.partner_number ?? null,
    status: partner?.status ?? null,
    activationDate: partner?.activation_date ?? null,
    expirationDate: partner?.expiration_date ?? null,
    salesCount: partner?.annual_sales_count ?? 0,
    minimumRequired: partner?.minimum_sales_required ?? 4,
    agreementSigned: Boolean(agreement),
  };

  // ---- CONFIDENTIAL SECTION -------------------------------------------------
  // Everything below is computed ONLY for an authorized active partner.
  let groups: WholesaleGroupView[] = [];
  let services: PartnerServiceOption[] = [];

  if (access.canViewWholesale) {
    groups = PRICING_CATEGORIES.map((category) => ({
      category,
      rows: getResellerByCategory(category).map((tier) => {
        const recurring = tier.recurring ?? tier.maintenance ?? null;
        return {
          id: tier.id,
          nameKey: tier.nameKey,
          cost: tier.cost,
          resale: tier.resale,
          profit: tier.profit,
          maintenanceCost: recurring?.cost ?? null,
          maintenanceResale: recurring?.resale ?? null,
          hasSetup: Boolean(tier.recurring),
          quoteOnly: parseMoney(tier.cost).quoteOnly,
        };
      }),
    })).filter((group) => group.rows.length > 0);

    services = PRICING_CATEGORIES.flatMap((category) =>
      getResellerByCategory(category)
        // Quote-only tiers ("$1,200+") are excluded: we will not auto-charge a
        // starting price. They route through a partner quote instead.
        .filter((tier) => !parseMoney(tier.cost).quoteOnly)
        .map((tier) => ({
          id: tier.id,
          category,
          nameKey: tier.nameKey,
        })),
    );
  }
  // ---- END CONFIDENTIAL SECTION ---------------------------------------------

  return (
    <PortalShell page="partner">
      <div className="flex flex-col gap-10">
        <PartnerStatus view={view} />

        {access.canViewWholesale ? (
          <>
            <WholesaleLibrary groups={groups} />
            <PartnerOrderForm services={services} />
          </>
        ) : null}
      </div>
    </PortalShell>
  );
}
