"use client";

import type { ReactNode } from "react";
import { Search, PenTool, Hammer, Rocket, LifeBuoy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const ICONS: Record<string, ReactNode> = {
  discover: <Search size={20} aria-hidden />,
  design: <PenTool size={20} aria-hidden />,
  build: <Hammer size={20} aria-hidden />,
  launch: <Rocket size={20} aria-hidden />,
  support: <LifeBuoy size={20} aria-hidden />,
};

export default function HowItWorks() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const steps = t.howItWorks.steps;

  return (
    <section id={SECTION_IDS.howItWorks} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.howItWorks.eyebrow}
          title={t.sections.howItWorks.title}
          description={t.sections.howItWorks.description}
        />

        <div className="relative mt-14">
          {/* Desktop connector line, drawn once on view */}
          <div className="pointer-events-none absolute inset-x-0 top-6 hidden lg:block" aria-hidden>
            <div className="relative mx-[10%] h-px bg-[rgba(14,165,233,0.15)]">
              <motion.div
                className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-vx-blue to-vx-cyan"
                style={{ width: "100%" }}
                initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            </div>
          </div>

          <ol className="grid gap-8 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => (
              <li key={step.id} className="relative flex gap-4 lg:flex-col lg:gap-4">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="relative z-10 grid h-12 w-12 place-items-center rounded-xl border border-vx-blue/40 bg-vx-bg2 text-vx-blue shadow-vx-glow-sm">
                    {ICONS[step.id]}
                  </span>
                  {/* Mobile vertical connector */}
                  {i < steps.length - 1 ? (
                    <span
                      aria-hidden
                      className="mt-1 h-full w-px flex-1 bg-[rgba(14,165,233,0.18)] lg:hidden"
                    />
                  ) : null}
                </div>

                <div className="pb-2 lg:pb-0">
                  <span className="font-mono text-xs text-vx-silver-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-vx-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-vx-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
