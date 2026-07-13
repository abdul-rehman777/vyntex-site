import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import AIShowcase from "@/components/AIShowcase";
import Industries from "@/components/Industries";
import Partners from "@/components/Partners";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import BookConsultation from "@/components/BookConsultation";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

/**
 * One-page marketing site. Server Component: it composes the section components
 * (each a self-contained Client Component that reads its own translations), so
 * the page itself ships no client JS of its own and every section still renders
 * on the server for SEO.
 *
 * Section order and ids are the canonical hash targets used by the nav, footer,
 * and sitemap.
 */
export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main-content">
        <Hero />
        <Services />
        <HowItWorks />
        <AIShowcase />
        <Industries />
        <Partners />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <BookConsultation />
      <Chatbot />
    </>
  );
}
