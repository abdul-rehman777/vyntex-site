import { Check } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import Button from "@/components/ui/Button";

/**
 * A single pricing plan. Fully presentational: the Pricing section resolves all
 * values from lib/pricing.ts + LABOR_TERMS + translations and passes them in,
 * so no price or label is hardcoded here. Featured plans use a blue/cyan
 * treatment (never gold).
 */
interface PricingCardProps {
  name: string;
  tagline: string;
  price: string;
  unitLabel: string;
  recurring?: { amount: string; unit: string };
  maintenanceNote?: string;
  features: string[];
  featured: boolean;
  popularLabel: string;
  supportBadge?: string;
  ctaLabel: string;
  ctaHref: string;
}

export default function PricingCard({
  name,
  tagline,
  price,
  unitLabel,
  recurring,
  maintenanceNote,
  features,
  featured,
  popularLabel,
  supportBadge,
  ctaLabel,
  ctaHref,
}: PricingCardProps) {
  return (
    <GlowCard
      as="article"
      featured={featured}
      className="flex h-full flex-col gap-4 p-7"
    >
      {featured ? (
        <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-vx-blue to-vx-cyan px-3 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-vx-bg">
          {popularLabel}
        </span>
      ) : null}

      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-vx-ink">{name}</h3>
        <p className="min-h-[2.5rem] text-sm text-vx-muted">{tagline}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-vx-ink">{price}</span>
          <span className="text-sm text-vx-muted">{unitLabel}</span>
        </p>
        {recurring ? (
          <p className="font-mono text-sm text-vx-cyan">
            + {recurring.amount}
            {recurring.unit}
          </p>
        ) : null}
        {maintenanceNote ? (
          <p className="font-mono text-xs text-vx-muted">{maintenanceNote}</p>
        ) : null}
      </div>

      {supportBadge ? (
        <p className="rounded-lg border border-vx-cyan/25 bg-vx-cyan/10 px-3 py-2 text-center font-mono text-xs text-vx-cyan">
          {supportBadge}
        </p>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-vx-muted">
            <Check size={16} className="mt-0.5 shrink-0 text-vx-blue" aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Button
          href={ctaHref}
          variant={featured ? "primary" : "ghost"}
          fullWidth
        >
          {ctaLabel}
        </Button>
      </div>
    </GlowCard>
  );
}
