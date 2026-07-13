import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getPartnerAccess } from "@/lib/reseller";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalShell from "@/components/portal/PortalShell";
import OrdersList, { type OrderRowView } from "@/components/portal/OrdersList";

export const metadata: Metadata = {
  title: "Partner Orders",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PartnerOrderQueryRow {
  id: string;
  created_at: string;
  order_type: string;
  status: string;
  total: number;
  client_reference: string | null;
  order_items: { service_name_snapshot: string }[] | null;
}

/**
 * A partner's own orders, including which ones counted toward the four-per-year
 * minimum. Only rows where partner_sales.qualifying_sale is true count — and
 * that flag is set exclusively by the verified Square webhook.
 */
export default async function PartnerOrdersPage() {
  const user = await requireUser();
  const access = await getPartnerAccess(user);
  const partner = access.partner;

  if (!partner) redirect("/portal/partner");

  let orders: OrderRowView[] = [];

  try {
    const supabase = await getSupabaseServerClient();

    const [{ data: orderData }, { data: salesData }] = await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, created_at, order_type, status, total, client_reference, order_items(service_name_snapshot)",
        )
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("partner_sales")
        .select("order_id, qualifying_sale")
        .eq("partner_id", partner.id),
    ]);

    const qualifying = new Set(
      (salesData ?? [])
        .filter((s) => s.qualifying_sale === true)
        .map((s) => s.order_id as string),
    );

    if (orderData) {
      orders = (orderData as PartnerOrderQueryRow[]).map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        orderType: row.order_type,
        status: row.status,
        total: row.total,
        clientReference: row.client_reference,
        itemName: row.order_items?.[0]?.service_name_snapshot ?? "—",
        qualifying: qualifying.has(row.id),
      }));
    }
  } catch {
    /* leave empty on failure */
  }

  return (
    <PortalShell page="partnerOrders">
      <OrdersList orders={orders} />
    </PortalShell>
  );
}
