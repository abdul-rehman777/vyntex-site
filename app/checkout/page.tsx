import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutHeading from "@/components/checkout/CheckoutHeading";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Order a VYNTEX website, AI automation, CRM system, branding package, or social media service. Clear one-time and monthly pricing. Payment is processed securely by Square.",
  alternates: { canonical: "/checkout" },
  openGraph: {
    title: "VYNTEX — Checkout",
    description: "Order a VYNTEX service. Secure payment processed by Square.",
    url: `${SITE.url}/checkout`,
    type: "website",
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "VYNTEX" }],
  },
  // Don't index a transactional page with query-driven state.
  robots: { index: false, follow: true },
};

/**
 * Public direct checkout.
 *
 * CheckoutForm reads the `?service=` query param, so it must sit inside a
 * Suspense boundary (useSearchParams opts the subtree into client rendering).
 */
export default function CheckoutPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="pt-[72px]">
        <section className="py-14 sm:py-16">
          <Container>
            <CheckoutHeading />
            <div className="mt-10">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-2xl border border-[rgba(14,165,233,0.12)] bg-vx-bg2" />
                }
              >
                <CheckoutForm />
              </Suspense>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
