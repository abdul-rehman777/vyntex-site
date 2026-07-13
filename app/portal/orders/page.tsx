import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import PortalShell from "@/components/portal/PortalShell";
import OrdersList, { type OrderRowView } from "@/components/portal/OrdersList";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface OrderQueryRow {
  id: string;
  created_at: string;
  order_type: string;
  status: string;
  total: number;
  client_reference: string | null;
  order_items: { service_name_snapshot: string }[] | null;
}

/**
 * The signed-in user's own orders. RLS scopes the query to `user_id = auth.uid()`,
 * so even a crafted request cannot return another customer's orders.
 */
export default async function OrdersPage() {
  const user = await requireUser();

  let orders: OrderRowView[] = [];

  try {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("orders")
      .select(
        "id, created_at, order_type, status, total, client_reference, order_items(service_name_snapshot)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      orders = (data as OrderQueryRow[]).map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        orderType: row.order_type,
        status: row.status,
        total: row.total,
        clientReference: row.client_reference,
        itemName: row.order_items?.[0]?.service_name_snapshot ?? "—",
      }));
    }
  } catch {
    /* leave empty on failure — the list renders its own empty state */
  }

  return (
    <PortalShell page="orders">
      <OrdersList orders={orders} />
    </PortalShell>
  );
}
