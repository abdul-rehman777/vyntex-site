"use client";

import { useLang } from "@/context/LanguageContext";
import {
  findDirectTier,
  parseMoney,
  LABOR_TERMS,
  type DirectTier,
} from "@/lib/pricing";
import GlowCard from "@/components/ui/GlowCard";

/**
 * Public order summary for the direct checkout.
 *
 * Every figure is read from lib/pricing.ts. Nothing is hardcoded, and no
 * wholesale/partner figure is imported here — this component is used on a
 * PUBLIC page and must never be able to reach RESELLER_PRICING.
 */
export default function OrderSummary({ serviceKey }: { serviceKey: string }) {
  const { t } = useLang();
  const c = t.checkout;

  const tier: DirectTier | undefined = findDirectTier(serviceKey);

  if (!tier) {
    return (
      <GlowCard className="p-6">
        <h2 className="text-lg font-semibold text-vx-ink">{c.summaryHeading}</h2>
        <p className="mt-3 text-sm text-vx-muted">{c.noService}</p>
      </GlowCard>
    );
  }

  const nameKey = tier.nameKey as keyof typeof t.pricing.items;
  const item = t.pricing.items[nameKey];
  const price = parseMoney(tier.price);

  // A "+" price is a starting point, not a fixed amount. We refuse to charge it.
  if (price.quoteOnly) {
    return (
      <GlowCard className="p-6">
        <h2 className="text-lg font-semibold text-vx-ink">{item.name}</h2>
        <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-sm text-amber-300">
          {c.quoteOnly}
        </p>
      </GlowCard>
    );
  }

  const unitLabel =
    tier.unitKey === "setup"
      ? c.lines.setup
      : tier.unitKey === "perMonth"
        ? c.lines.recurring
        : c.lines.oneTime;

  return (
    <GlowCard className="p-6 sm:p-7">
      <h2 className="text-lg font-semibold text-vx-ink">{c.summaryHeading}</h2>

      <div className="mt-5 flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-4">
          <div className="min-w-0">
            <p className="font-semibold text-vx-ink">{item.name}</p>
            <p className="mt-0.5 text-xs text-vx-muted">{item.tagline}</p>
          </div>
          <p className="shrink-0 font-mono text-lg font-semibold text-vx-ink">
            {tier.price}
          </p>
        </div>
        <p className="text-xs uppercase tracking-wide text-vx-silver-dim">
          {unitLabel}
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-1.5 border-t border-[rgba(14,165,233,0.12)] pt-4">
        {item.features.map((feature) => (
          <li key={feature} className="text-sm text-vx-muted">
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-[rgba(14,165,233,0.20)] pt-4">
        <span className="font-semibold text-vx-silver">{c.lines.total}</span>
        <span className="font-mono text-xl font-bold text-vx-ink">{tier.price}</span>
      </div>

      {/* If the tier also carries a monthly fee, say so — do not bundle it silently. */}
      {tier.recurring ? (
        <p className="mt-3 rounded-lg border border-[rgba(14,165,233,0.16)] bg-vx-bg px-3 py-2.5 text-xs text-vx-silver">
          {c.recurringNote.replace(
            "{amount}",
            `${tier.recurring}${t.pricing.units.perMonth}`,
          )}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-vx-silver-dim">
        {c.supportNote.replace("{days}", String(LABOR_TERMS.supportIncludedDays))}
      </p>
      <p className="mt-2 text-xs text-vx-silver-dim">{c.laborNote}</p>
    </GlowCard>
  );
}
