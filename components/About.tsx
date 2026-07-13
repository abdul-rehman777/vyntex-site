"use client";

import type { ReactNode } from "react";
import { Lightbulb, Handshake, TrendingUp, MapPin, Check } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import { SITE } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import GlowCard from "@/components/ui/GlowCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

const VALUE_ICONS: Record<string, ReactNode> = {
  innovation: <Lightbulb size={22} aria-hidden />,
  partnership: <Handshake size={22} aria-hidden />,
  growth: <TrendingUp size={22} aria-hidden />,
};

export default function About() {
  const { t } = useLang();

  return (
    <section id={SECTION_IDS.about} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.about.eyebrow}
          title={t.sections.about.title}
          description={t.sections.about.description}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Story + specialties */}
          <GlowCard className="flex flex-col gap-5 p-7 sm:p-8">
            <p className="text-vx-muted">{t.about.intro}</p>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-vx-blue">
                {t.about.specialtiesLabel}
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {t.about.specialties.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-vx-silver">
                    <Check size={15} className="shrink-0 text-vx-cyan" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-vx-muted">{t.about.approach}</p>

            <div className="mt-auto flex items-center gap-2 rounded-xl border border-[rgba(14,165,233,0.15)] bg-vx-bg3 px-4 py-3">
              <MapPin size={18} className="text-vx-blue" aria-hidden />
              <span className="text-sm">
                <span className="font-semibold text-vx-ink">{t.about.locationTitle}</span>{" "}
                <span className="text-vx-muted">— {t.about.locationSubtitle}</span>
              </span>
            </div>
          </GlowCard>

          {/* Values */}
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-vx-blue">
              {t.about.valuesLabel}
            </p>
            {t.about.values.map((value, i) => (
              <AnimatedSection key={value.id} delay={i * 0.08}>
                <GlowCard className="flex items-start gap-4 p-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-vx-blue to-vx-cyan text-vx-bg">
                    {VALUE_ICONS[value.id]}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-vx-ink">{value.title}</h3>
                    <p className="mt-1 text-sm text-vx-muted">{value.description}</p>
                  </div>
                </GlowCard>
              </AnimatedSection>
            ))}
            <p className="mt-1 text-center font-mono text-xs text-vx-muted sm:text-left">
              {SITE.name} · {SITE.address.locality}, {SITE.address.region}{" "}
              {SITE.address.postalCode}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
