import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "VYNTEX builds toward WCAG 2.1 Level AA. What we have implemented, and the gaps we have not yet closed.",
  alternates: { canonical: "/accessibility" },
  openGraph: {
    title: "VYNTEX — Accessibility Statement",
    description: "VYNTEX builds toward WCAG 2.1 Level AA. What we have implemented, and the gaps we have not yet closed.",
    url: `${SITE.url}/accessibility`,
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
        <LegalPage doc="accessibility" />
      </main>
      <Footer />
    </>
  );
}
