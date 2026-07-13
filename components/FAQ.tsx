"use client";

import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import { faqSchema } from "@/lib/schema";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";

/**
 * FAQ section. The exact question/answer pairs rendered in the accordion are
 * also emitted as FAQPage structured data, keeping the schema in sync with the
 * visible content (a requirement for valid FAQ rich results).
 */
export default function FAQ() {
  const { t } = useLang();
  const items = t.faq.items;

  return (
    <section id={SECTION_IDS.faq} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.faq.eyebrow}
          title={t.sections.faq.title}
          description={t.sections.faq.description}
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion items={items} />
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(items)) }}
      />
    </section>
  );
}
