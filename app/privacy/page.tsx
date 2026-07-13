import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How VYNTEX collects, uses, and protects your information. We hash IPs, never store card details, and run no advertising trackers.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "VYNTEX — Privacy Policy",
    description: "How VYNTEX collects, uses, and protects your information. We hash IPs, never store card details, and run no advertising trackers.",
    url: `${SITE.url}/privacy`,
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
        <LegalPage doc="privacy" />
      </main>
      <Footer />
    </>
  );
}
