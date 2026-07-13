"use client";

import {
  ArrowRight,
  UserPlus,
  Sparkles,
  Database,
  Send,
  CalendarCheck,
  BellRing,
  Check,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import AutomationFlow, { type FlowStep } from "@/components/ui/AutomationFlow";
import TerminalDemo from "@/components/ui/TerminalDemo";
import { openConsultation } from "@/components/BookConsultation";

/**
 * Hero — the page's single H1. Left: message + CTAs + verified trust points.
 * Right: an interactive, code-free automation example (illustrative only).
 */
export default function Hero() {
  const { t } = useLang();
  const w = t.hero.workflow;

  const steps: FlowStep[] = [
    { id: "lead", label: w.lead, icon: <UserPlus size={16} aria-hidden /> },
    { id: "qualify", label: w.qualify, icon: <Sparkles size={16} aria-hidden /> },
    { id: "crm", label: w.crm, icon: <Database size={16} aria-hidden /> },
    { id: "followup", label: w.followup, icon: <Send size={16} aria-hidden /> },
    { id: "appointment", label: w.appointment, icon: <CalendarCheck size={16} aria-hidden /> },
    { id: "notify", label: w.notify, icon: <BellRing size={16} aria-hidden /> },
  ];

  const trust = [
    t.hero.trust.bilingual,
    t.hero.trust.pricing,
    t.hero.trust.support,
    t.hero.trust.nationwide,
  ];

  return (
    <section id={SECTION_IDS.home} className="relative overflow-hidden pt-[120px] pb-16 sm:pt-[140px] sm:pb-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Message */}
          <div className="flex flex-col items-start">
            <span className="mb-6 inline-block rounded-full border border-[rgba(14,165,233,0.3)] px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-vx-blue">
              {t.hero.eyebrow}
            </span>

            <h1 className="max-w-xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              {t.hero.headlineLead}{" "}
              <span className="vx-grad-text">{t.hero.headlineAccent}</span>
            </h1>

            <p className="mt-6 max-w-xl text-vx-muted sm:text-lg">
              {t.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={`#${SECTION_IDS.services}`} variant="primary" size="lg">
                {t.hero.ctaExplore}
                <ArrowRight size={18} aria-hidden />
              </Button>
              <Button href={`#${SECTION_IDS.pricing}`} variant="secondary" size="lg">
                {t.hero.ctaPricing}
              </Button>
              <Button onClick={openConsultation} variant="ghost" size="lg">
                {t.hero.ctaConsult}
              </Button>
            </div>

            <ul className="mt-9 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {trust.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-vx-silver">
                  <Check size={15} className="shrink-0 text-vx-blue" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive automation example */}
          <div className="relative">
            <div className="rounded-2xl border border-[rgba(14,165,233,0.2)] bg-vx-bg2/70 p-5 shadow-vx-glow-sm backdrop-blur sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-vx-cyan">
                  {t.hero.demoLabel}
                </span>
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-vx-silver-dim" />
                  <span className="h-2.5 w-2.5 rounded-full bg-vx-silver-dim" />
                  <span className="h-2.5 w-2.5 rounded-full bg-vx-blue" />
                </span>
              </div>

              <AutomationFlow steps={steps} orientation="vertical" />

              <div className="mt-4">
                <TerminalDemo phrases={t.hero.terminal} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
