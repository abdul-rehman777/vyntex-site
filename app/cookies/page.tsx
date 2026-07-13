import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "VYNTEX uses no advertising cookies and no third-party analytics. The complete list of what we store in your browser.",
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "VYNTEX — Cookie Policy",
    description: "VYNTEX uses no advertising cookies and no third-party analytics. The complete list of what we store in your browser.",
    url: `${SITE.url}/cookies`,
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
        <LegalPage doc="cookies" />
      </main>
      <Footer />
    </>
  );
}
