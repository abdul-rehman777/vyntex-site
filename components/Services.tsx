"use client";

import type { ReactNode } from "react";
import {
  Workflow,
  Globe,
  BarChart3,
  MessagesSquare,
  Palette,
  Megaphone,
  Zap,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import { DIRECT_PRICING } from "@/lib/pricing";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

type ServiceId =
  | "ai-automation"
  | "web"
  | "crm"
  | "chatbot"
  | "branding"
  | "marketing";

const ICONS: Record<ServiceId, ReactNode> = {
  "ai-automation": <Workflow size={24} aria-hidden />,
  web: <Globe size={24} aria-hidden />,
  crm: <BarChart3 size={24} aria-hidden />,
  chatbot: <MessagesSquare size={24} aria-hidden />,
  branding: <Palette size={24} aria-hidden />,
  marketing: <Megaphone size={24} aria-hidden />,
};

// Representative starting price per service, pulled from centralized pricing.
const PRICE_TIER: Record<ServiceId, string> = {
  "ai-automation": "ai-simple",
  web: "web-basic",
  crm: "crm-basic",
  chatbot: "ai-simple",
  branding: "brand-logo",
  marketing: "social-setup",
};

function priceFor(tierId: string): string | undefined {
  return DIRECT_PRICING.find((tier) => tier.id === tierId)?.price;
}

export default function Services() {
  const { t } = useLang();
  const order: ServiceId[] = [
    "ai-automation",
    "web",
    "crm",
    "chatbot",
    "branding",
    "marketing",
  ];

  return (
    <section id={SECTION_IDS.services} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.services.eyebrow}
          title={t.sections.services.title}
          description={t.sections.services.description}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {order.map((id, i) => {
            const item = t.services.items[id];
            return (
              <AnimatedSection key={id} delay={i * 0.06}>
                <ServiceCard
                  icon={ICONS[id]}
                  title={item.title}
                  problem={item.problem}
                  description={item.description}
                  priceLabel={t.services.startingAt}
                  price={priceFor(PRICE_TIER[id])}
                  href={`/services/${id === "web" ? "web-development" : id === "crm" ? "crm-systems" : id === "chatbot" ? "ai-chatbots" : id === "marketing" ? "digital-marketing" : id}`}
                  cta={t.actions.learnMore}
                />
              </AnimatedSection>
            );
          })}
        </div>

        {/* Automatable business processes */}
        <div className="mt-16 rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2/50 p-7 sm:p-9">
          <div className="max-w-2xl">
            <h3 className="text-xl font-semibold text-vx-ink">
              {t.services.process.title}
            </h3>
            <p className="mt-2 text-sm text-vx-muted">
              {t.services.process.subtitle}
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {t.services.process.items.map((label) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(14,165,233,0.18)] bg-vx-bg3 px-3.5 py-2 text-sm text-vx-silver"
              >
                <Zap size={14} className="text-vx-cyan" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
