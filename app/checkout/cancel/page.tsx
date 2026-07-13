import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";
import CheckoutCancelled from "@/components/checkout/CheckoutCancelled";

export const metadata: Metadata = {
  title: "Payment canceled",
  robots: { index: false, follow: false },
};

/**
 * The buyer backed out of Square's checkout. Nothing was charged. Their order
 * row stays 'pending' — they can return and pay whenever they like.
 */
export default function CheckoutCancelPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="pt-[72px]">
        <section className="py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-xl">
              <CheckoutCancelled />
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
