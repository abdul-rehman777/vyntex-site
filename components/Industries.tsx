"use client";

import type { ReactNode } from "react";
import {
  Briefcase,
  Calculator,
  Scale,
  Stethoscope,
  Wrench,
  HardHat,
  Home,
  UtensilsCrossed,
  ShoppingBag,
  Scissors,
  Car,
  GraduationCap,
  Building2,
  Network,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowCard from "@/components/ui/GlowCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

const ICONS: Record<string, ReactNode> = {
  professional: <Briefcase size={20} aria-hidden />,
  accounting: <Calculator size={20} aria-hidden />,
  legal: <Scale size={20} aria-hidden />,
  healthcare: <Stethoscope size={20} aria-hidden />,
  homeservices: <Wrench size={20} aria-hidden />,
  construction: <HardHat size={20} aria-hidden />,
  realestate: <Home size={20} aria-hidden />,
  restaurants: <UtensilsCrossed size={20} aria-hidden />,
  retail: <ShoppingBag size={20} aria-hidden />,
  beauty: <Scissors size={20} aria-hidden />,
  automotive: <Car size={20} aria-hidden />,
  education: <GraduationCap size={20} aria-hidden />,
  agencies: <Building2 size={20} aria-hidden />,
  multilocation: <Network size={20} aria-hidden />,
};

export default function Industries() {
  const { t } = useLang();

  return (
    <section id={SECTION_IDS.industries} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.industries.eyebrow}
          title={t.sections.industries.title}
          description={t.sections.industries.description}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.industries.items.map((industry, i) => (
            <AnimatedSection key={industry.id} delay={(i % 3) * 0.05}>
              <GlowCard as="article" className="flex h-full flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-vx-blue/30 bg-vx-bg3 text-vx-blue">
                    {ICONS[industry.id]}
                  </span>
                  <h3 className="text-base font-semibold text-vx-ink">
                    {industry.name}
                  </h3>
                </div>
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-wide text-vx-silver-dim">
                    {t.industries.challengeLabel}
                  </p>
                  <p className="mt-0.5 text-sm text-vx-muted">{industry.challenge}</p>
                </div>
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-wide text-vx-cyan">
                    {t.industries.solutionLabel}
                  </p>
                  <p className="mt-0.5 text-sm text-vx-silver">{industry.solution}</p>
                </div>
              </GlowCard>
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
