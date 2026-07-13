import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import PortalShell from "@/components/portal/PortalShell";
import AdminDashboard, {
  type AdminApplicationView,
  type AdminPartnerView,
  type AdminOrderView,
  type AdminSystemView,
} from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Administrator",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Administrator portal.
 *
 * `requireAdmin` checks the `admin_users` table and redirects a non-admin to
 * /portal — NOT to a 403, which would confirm this route is worth attacking.
 *
 * Data is fetched with the service-role client, which is correct ONLY because
 * the admin check above has already passed. That ordering is the whole security
 * of this page: authorize first, then elevate.
 */
export default async function AdminPage() {
  const user = await requireUser();
  await requireAdmin(user);

  const db = getSupabaseAdmin();

  let applications: AdminApplicationView[] = [];
  let partners: AdminPartnerView[] = [];
  let orders: AdminOrderView[] = [];

  const squareEnvironment =
    (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "sandbox")
      .trim()
      .toLowerCase() === "production"
      ? "production"
      : "sandbox";

  const system: AdminSystemView = {
    squareEnvironment,
    emailPending: 0,
    emailAbandoned: 0,
    emailSent: 0,
    cronRuns: [],
    missingConfig: [],
  };

  // Configuration gaps, surfaced where an administrator will actually see them.
  const required: [string, boolean][] = [
    ["SUPABASE_SERVICE_ROLE_KEY", Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)],
    ["RESEND_API_KEY", Boolean(process.env.RESEND_API_KEY)],
    ["IP_HASH_SALT", Boolean(process.env.IP_HASH_SALT)],
    ["UPSTASH_REDIS_REST_URL", Boolean(process.env.UPSTASH_REDIS_REST_URL)],
    ["SQUARE_ACCESS_TOKEN", Boolean(process.env.SQUARE_ACCESS_TOKEN)],
    ["SQUARE_WEBHOOK_SIGNATURE_KEY", Boolean(process.env.SQUARE_WEBHOOK_SIGNATURE_KEY)],
    ["CRON_SECRET", Boolean(process.env.CRON_SECRET)],
  ];
  system.missingConfig = required.filter(([, ok]) => !ok).map(([name]) => name);

  if (db) {
    const [appsRes, partnersRes, ordersRes, cronRes, sentRes, pendingRes, abandonedRes] =
      await Promise.all([
        db
          .from("reseller_applications")
          .select(
            "id, created_at, full_name, business_name, email, phone, city, state, client_count, resell_model, message",
          )
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(50),
        db
          .from("partners")
          .select(
            "id, partner_number, business_name, contact_name, email, status, expiration_date, annual_sales_count, minimum_sales_required",
          )
          .order("created_at", { ascending: false })
          .limit(100),
        db
          .from("orders")
          .select(
            "id, created_at, customer_email, order_type, status, total, order_items(service_name_snapshot)",
          )
          .order("created_at", { ascending: false })
          .limit(50),
        db
          .from("cron_runs")
          .select("job, status, created_at")
          .order("created_at", { ascending: false })
          .limit(6),
        db
          .from("email_deliveries")
          .select("id", { count: "exact", head: true })
          .eq("status", "sent"),
        db
          .from("email_deliveries")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        db
          .from("email_deliveries")
          .select("id", { count: "exact", head: true })
          .eq("status", "abandoned"),
      ]);

    applications = (appsRes.data ?? []).map((r) => ({
      id: r.id as string,
      createdAt: r.created_at as string,
      fullName: r.full_name as string,
      businessName: r.business_name as string,
      email: r.email as string,
      phone: r.phone as string,
      city: r.city as string,
      state: r.state as string,
      clientCount: r.client_count as string,
      resellModel: r.resell_model as string,
      message: (r.message as string | null) ?? "",
    }));

    partners = (partnersRes.data ?? []).map((r) => ({
      id: r.id as string,
      partnerNumber: r.partner_number as string,
      businessName: r.business_name as string,
      contactName: r.contact_name as string,
      email: r.email as string,
      status: r.status as string,
      expirationDate: (r.expiration_date as string | null) ?? null,
      salesCount: (r.annual_sales_count as number) ?? 0,
      minimumRequired: (r.minimum_sales_required as number) ?? 4,
    }));

    orders = (ordersRes.data ?? []).map((r) => {
      const items = r.order_items as { service_name_snapshot: string }[] | null;
      return {
        id: r.id as string,
        createdAt: r.created_at as string,
        customerEmail: r.customer_email as string,
        itemName: items?.[0]?.service_name_snapshot ?? "—",
        orderType: r.order_type as string,
        status: r.status as string,
        total: r.total as number,
      };
    });

    system.cronRuns = (cronRes.data ?? []).map((r) => ({
      job: r.job as string,
      status: r.status as string,
      createdAt: r.created_at as string,
    }));
    system.emailSent = sentRes.count ?? 0;
    system.emailPending = pendingRes.count ?? 0;
    system.emailAbandoned = abandonedRes.count ?? 0;
  }

  return (
    <PortalShell page="admin">
      <AdminDashboard
        applications={applications}
        partners={partners}
        orders={orders}
        system={system}
      />
    </PortalShell>
  );
}
