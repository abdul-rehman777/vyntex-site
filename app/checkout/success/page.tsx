import type { Metadata } from "next";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import PaymentStatus, {
  type OrderPaymentStatus,
} from "@/components/checkout/PaymentStatus";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const VALID: OrderPaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "canceled",
  "refunded",
];

/**
 * Post-payment landing page.
 *
 * CRITICAL: arriving here means Square redirected the buyer back. It does NOT
 * mean the payment succeeded. We read the order status from OUR database, which
 * is only ever set to 'paid' by the signature-verified webhook. Until then this
 * page truthfully says the payment is being confirmed.
 *
 * We look the order up by id with the service-role client, but we only ever
 * return its STATUS and TYPE to the page — no amounts, no customer details, no
 * partner data. Knowing an order id therefore reveals nothing worth having.
 */
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.order ?? "";

  let status: OrderPaymentStatus = "pending";
  let orderType = "direct";

  const uuidRe = /^[0-9a-fA-F-]{36}$/;

  if (orderId && uuidRe.test(orderId)) {
    const admin = getSupabaseAdmin();
    if (admin) {
      const { data } = await admin
        .from("orders")
        .select("status, order_type")
        .eq("id", orderId)
        .maybeSingle();

      if (data) {
        const raw = data.status as OrderPaymentStatus;
        if (VALID.includes(raw)) status = raw;
        orderType = (data.order_type as string) ?? "direct";
      }
    }
  }

  return (
    <>
      <Nav />
      <main id="main-content" className="pt-[72px]">
        <section className="py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-xl">
              <PaymentStatus initialStatus={status} orderType={orderType} />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
