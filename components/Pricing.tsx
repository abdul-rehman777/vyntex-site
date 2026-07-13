"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { SECTION_IDS } from "@/lib/site";
import {
  DIRECT_PRICING,
  LABOR_TERMS,
  PRICING_CATEGORIES,
  type ServiceCategory,
  type DirectTier,
} from "@/lib/pricing";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PricingCard from "@/components/ui/PricingCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

const CATEGORY_KEY: Record<ServiceCategory, "websites" | "ai" | "crm" | "branding" | "social"> = {
  websites: "websites",
  ai: "ai",
  crm: "crm",
  branding: "branding",
  social: "social",
};

// Categories whose one-time products include the 30-day support badge.
const SUPPORT_BADGE_CATEGORIES: ServiceCategory[] = ["websites", "ai"];

// Maintenance keys that render a note (others are covered by the recurring line).
const NOTE_KEYS = new Set(["from149", "from189", "quoted", "buyout"]);

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export default function Pricing() {
  const { t } = useLang();
  const [category, setCategory] = useState<ServiceCategory>("websites");

  const tiers = DIRECT_PRICING.filter((tier) => tier.category === category);

  const maintenanceNote = (tier: DirectTier): string | undefined => {
    const key = tier.maintenanceKey;
    if (!key || !NOTE_KEYS.has(key)) return undefined;
    const raw = t.pricing.maintenance[key as keyof typeof t.pricing.maintenance];
    return interpolate(raw, { range: LABOR_TERMS.crmBuyoutRange });
  };

  const ctaLabel = (tier: DirectTier): string =>
    tier.price.includes("+") ? t.pricing.cta.requestQuote : t.pricing.cta.getStarted;

  // Fixed prices go straight to checkout with the tier preselected. Starting
  // prices ("$2,000+") are quoted per project, so they route to contact instead
  // — we never open a payment link for an amount that isn't final.
  const ctaHref = (tier: DirectTier): string =>
    tier.price.includes("+")
      ? `#${SECTION_IDS.contact}`
      : `/checkout?service=${tier.id}`;

  return (
    <section id={SECTION_IDS.pricing} className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow={t.sections.pricing.eyebrow}
          title={t.sections.pricing.title}
          description={t.sections.pricing.description}
        />

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label={t.sections.pricing.title}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2"
        >
          {PRICING_CATEGORIES.map((cat) => {
            const selected = category === cat;
            const label = t.pricing.tabs[CATEGORY_KEY[cat]];
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={selected}
                onClick={() => setCategory(cat)}
                className={[
                  "rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  selected
                    ? "bg-gradient-to-r from-vx-blue to-vx-cyan text-vx-bg"
                    : "border border-[rgba(14,165,233,0.2)] text-vx-muted hover:text-vx-ink",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, i) => {
            const item = t.pricing.items[tier.nameKey as keyof typeof t.pricing.items];
            const showSupport = SUPPORT_BADGE_CATEGORIES.includes(tier.category);
            return (
              <AnimatedSection key={tier.id} delay={i * 0.06}>
                <PricingCard
                  name={item.name}
                  tagline={item.tagline}
                  price={tier.price}
                  unitLabel={t.pricing.units[tier.unitKey]}
                  recurring={
                    tier.recurring
                      ? { amount: tier.recurring, unit: t.pricing.units.perMonth }
                      : undefined
                  }
                  maintenanceNote={maintenanceNote(tier)}
                  features={item.features}
                  featured={Boolean(tier.featured)}
                  popularLabel={t.pricing.badges.popular}
                  supportBadge={showSupport ? t.pricing.badges.supportIncluded : undefined}
                  ctaLabel={ctaLabel(tier)}
                  ctaHref={ctaHref(tier)}
                />
              </AnimatedSection>
            );
          })}
        </div>

        {/* Policies */}
        <div className="mt-14 rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2/50 p-7 sm:p-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-vx-blue">
            {t.pricing.policies.title}
          </h3>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            <li className="text-sm text-vx-muted">
              {interpolate(t.pricing.policies.support, {
                days: LABOR_TERMS.supportIncludedDays,
              })}
            </li>
            <li className="text-sm text-vx-muted">
              {interpolate(t.pricing.policies.hourly, {
                hourly: LABOR_TERMS.hourly,
                rush: LABOR_TERMS.rush,
              })}
            </li>
            <li className="text-sm text-vx-muted">{t.pricing.policies.thirdParty}</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
