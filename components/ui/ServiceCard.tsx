import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";

/**
 * Service card: icon, title, the problem it solves, a concise description, an
 * optional "starting at" price, and a link. Presentational and localization-
 * agnostic — all strings are passed in. Full package details live in Pricing.
 */
interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  problem: string;
  description: string;
  priceLabel?: string;
  price?: string;
  href: string;
  cta: string;
}

export default function ServiceCard({
  icon,
  title,
  problem,
  description,
  priceLabel,
  price,
  href,
  cta,
}: ServiceCardProps) {
  return (
    <GlowCard as="article" className="flex h-full flex-col gap-4 p-7">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-vx-blue to-vx-cyan text-vx-bg">
        {icon}
      </span>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-vx-ink">{title}</h3>
        <p className="text-sm font-medium text-vx-silver">{problem}</p>
        <p className="text-sm text-vx-muted">{description}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        {price ? (
          <span className="font-mono text-sm text-vx-cyan">
            {priceLabel} <span className="text-vx-ink">{price}</span>
          </span>
        ) : (
          <span />
        )}
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-vx-blue transition-colors hover:text-vx-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vx-blue focus-visible:ring-offset-2 focus-visible:ring-offset-vx-bg"
          aria-label={`${cta}: ${title}`}
        >
          {cta}
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </GlowCard>
  );
}
