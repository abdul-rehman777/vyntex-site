import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing VYNTEX services: what is included, what is billed separately, support periods, payment, and the reseller program.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "VYNTEX — Terms of Service",
    description: "Terms governing VYNTEX services: what is included, what is billed separately, support periods, payment, and the reseller program.",
    url: `${SITE.url}/terms`,
    type: "article",
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: "VYNTEX" }],
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main-content" className="pt-[72px]">
        <LegalPage doc="terms" />
      </main>
      <Footer />
    </>
  );
}
