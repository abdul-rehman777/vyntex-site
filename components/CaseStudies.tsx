"use client";

import type { ReactNode } from "react";
import { Globe, Workflow, BarChart3, Lock } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Case Studies — structure only. No client names, statistics, quotes, or
 * outcomes are shown, because none are verified yet. Cards are clearly labeled
 * "coming soon" and rendered in a muted, non-clickable state.
 */
export default function CaseStudies() {
  const { t } = useLang();

  const cards: { id: string; label: string; icon: ReactNode }[] = [
    { id: "website", label: t.caseStudies.cards.website, icon: <Globe size={20} aria-hidden /> },
    { id: "lead", label: t.caseStudies.cards.lead, icon: <Workflow size={20} aria-hidden /> },
    { id: "crm", label: t.caseStudies.cards.crm, icon: <BarChart3 size={20} aria-hidden /> },
  ];

  return (
    <section id={SECTION_IDS.caseStudies} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.caseStudies.eyebrow}
          title={t.sections.caseStudies.title}
          description={t.sections.caseStudies.description}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="flex flex-col gap-4 rounded-2xl border border-dashed border-[rgba(14,165,233,0.18)] bg-vx-bg2/40 p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-[rgba(14,165,233,0.15)] bg-vx-bg3 text-vx-silver-dim">
                {card.icon}
              </span>
              <h3 className="text-base font-semibold text-vx-silver">{card.label}</h3>
              <p className="inline-flex items-center gap-1.5 font-mono text-xs text-vx-muted">
                <Lock size={12} aria-hidden />
                {t.caseStudies.comingSoon}
              </p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-vx-muted">
          {t.caseStudies.note}
        </p>
      </Container>
    </section>
  );
}
