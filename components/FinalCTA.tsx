"use client";

import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

/**
 * Closing CTA before the footer. Links to Pricing and Contact.
 */
export default function FinalCTA() {
  const { t } = useLang();

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-[rgba(14,165,233,0.25)] bg-vx-bg2/70 px-6 py-14 text-center sm:px-12 sm:py-20">
          {/* Ambient glow, decorative */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(500px 300px at 50% 0%, rgba(14,165,233,0.15), transparent 60%)",
            }}
          />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <h2 className="text-balance text-3xl font-extrabold text-vx-ink sm:text-4xl">
              {t.finalCta.title}
            </h2>
            <p className="mt-4 text-vx-muted sm:text-lg">{t.finalCta.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={`#${SECTION_IDS.pricing}`} variant="primary" size="lg">
                {t.actions.explorePricing}
              </Button>
              <Button href={`#${SECTION_IDS.contact}`} variant="ghost" size="lg">
                {t.actions.contactUs}
                <ArrowRight size={18} aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
