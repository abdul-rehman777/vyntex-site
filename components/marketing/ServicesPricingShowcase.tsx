"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import {
  DIRECT_PRICING,
  LABOR_TERMS,
  PRICING_CATEGORIES,
  type DirectTier,
  type ServiceCategory,
} from "@/lib/pricing";
import Container from "@/components/ui/Container";

const categoryLabels: Record<ServiceCategory, { en: string; es: string }> = {
  websites: { en: "Websites", es: "Sitios Web" },
  ai: { en: "AI Tools", es: "Herramientas de IA" },
  crm: { en: "CRM", es: "CRM" },
  branding: { en: "Branding", es: "Marca" },
  social: { en: "Social", es: "Redes" },
};

const itemKeyMap: Record<string, string> = {
  webBasic: "BasicWebsite",
  webStandard: "StandardWebsite",
  webCustom: "CustomizedWebsite",
  aiSimple: "SimpleAiTool",
  aiStandard: "StandardAiAutomation",
  aiAdvanced: "AdvancedAi",
  crmBasic: "CRMBasic",
  crmStandard: "CRMStandard",
  crmCustom: "CRMCustomized",
  brandLogo: "BrandLogo",
  brandBundle: "BrandBundle",
  brandKit: "BrandKit",
  socialSetup: "SocialMediaSetup",
  socialMgmt: "SocialMediaManagement",
};

const maintenanceKeys = new Set(["from149", "from189", "quoted", "buyout"]);

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

function tierHref(tier: DirectTier): string {
  return tier.price.includes("+") ? "/contact" : `/checkout?service=${tier.id}`;
}

export default function ServicesPricingShowcase() {
  const { lang, t } = useLang();
  const reduceMotion = useReducedMotion() === true;
  const [category, setCategory] = useState<ServiceCategory>("websites");

  const tiers = useMemo(
    () => DIRECT_PRICING.filter((tier) => tier.category === category),
    [category],
  );

  return (
    <section className="services-pricing-section py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">
            {lang === "en" ? "SERVICES AND PRICING" : "SERVICIOS Y PRECIOS"}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
            {lang === "en" ? "Choose the Right Starting Point" : "Elija el Punto de Partida Correcto"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">
            {lang === "en"
              ? "Start with one focused service, then connect more systems as your business grows."
              : "Comience con un servicio específico y conecte más sistemas a medida que su negocio crece."}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={lang === "en" ? "Service categories" : "Categorías de servicios"}
          className="services-category-tabs mx-auto mt-10"
        >
          {PRICING_CATEGORIES.map((cat) => {
            const selected = category === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCategory(cat)}
                className="services-category-tab"
              >
                {categoryLabels[cat][lang]}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={category}
            className="services-price-grid mt-12"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            {tiers.map((tier, index) => {
              const itemKey = itemKeyMap[tier.nameKey] as keyof typeof t.pricing.items;
              const item = t.pricing.items[itemKey];
              const isFeatured = Boolean(tier.featured);
              const showSupport = tier.category === "websites" || tier.category === "ai";
              const maintenance = tier.maintenanceKey && maintenanceKeys.has(tier.maintenanceKey)
                ? interpolate(
                    t.pricing.maintenance[tier.maintenanceKey as keyof typeof t.pricing.maintenance],
                    { range: LABOR_TERMS.crmBuyoutRange },
                  )
                : undefined;

              return (
                <motion.article
                  key={tier.id}
                  className={`services-price-card ${isFeatured ? "is-featured" : ""}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: 0.42 }}
                >
                  {isFeatured ? (
                    <span className="services-popular-badge">
                      <Sparkles size={13} aria-hidden />
                      {t.pricing.badges.popular}
                    </span>
                  ) : null}

                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.03em] text-vx-ink">{item.name}</h3>
                    <p className="mt-2 min-h-[3rem] text-sm leading-6 text-vx-muted">{item.tagline}</p>
                  </div>

                  <div className="mt-7">
                    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                      <span className="text-4xl font-extrabold tracking-[-0.04em] text-vx-ink">{tier.price}</span>
                      <span className="pb-1 text-sm text-vx-muted">{t.pricing.units[tier.unitKey]}</span>
                    </div>
                    {tier.recurring ? (
                      <p className="mt-2 font-mono text-sm text-vx-cyan">
                        + {tier.recurring}{t.pricing.units.perMonth}
                      </p>
                    ) : null}
                    {maintenance ? (
                      <p className="mt-2 font-mono text-xs leading-5 text-vx-cyan">{maintenance}</p>
                    ) : null}
                  </div>

                  {showSupport ? (
                    <p className="services-support-badge mt-6">
                      <Sparkles size={14} aria-hidden />
                      {t.pricing.badges.supportIncluded}
                    </p>
                  ) : null}

                  <ul className="mt-7 space-y-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-vx-silver">
                        <Check size={17} className="mt-1 shrink-0 text-vx-cyan" aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <Link
                      href={tierHref(tier)}
                      className={`services-price-cta ${isFeatured ? "is-featured" : ""}`}
                    >
                      {tier.price.includes("+")
                        ? t.pricing.cta.requestQuote
                        : t.pricing.cta.getStarted}
                      <ArrowRight size={17} aria-hidden />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 text-center">
          <p className="text-sm text-vx-muted">
            {lang === "en"
              ? "Need a connected system across multiple services? We will scope it around your workflow."
              : "¿Necesita un sistema conectado con varios servicios? Lo definimos alrededor de su flujo de trabajo."}
          </p>
          <Link href="/contact" className="mt-4 inline-flex items-center gap-2 font-semibold text-vx-cyan hover:text-vx-glow">
            {lang === "en" ? "Book a Consultation" : "Reservar una Consulta"}
            <ArrowRight size={17} aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
