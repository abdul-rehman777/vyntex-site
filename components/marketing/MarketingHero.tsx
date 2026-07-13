import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function MarketingHero({ eyebrow, title, description, primaryHref = "/contact", primaryLabel = "Start a Project", secondaryHref, secondaryLabel }: { eyebrow: string; title: string; description: string; primaryHref?: string; primaryLabel?: string; secondaryHref?: string; secondaryLabel?: string }) {
  return <section className="relative overflow-hidden border-b border-[rgba(14,165,233,0.12)] py-20 sm:py-28"><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.12),transparent_35%)]" /><Container className="relative"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{eyebrow}</p><h1 className="mt-5 max-w-5xl text-4xl font-bold text-vx-ink sm:text-5xl lg:text-6xl">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-vx-muted">{description}</p><div className="mt-8 flex flex-wrap gap-3"><Button href={primaryHref} size="lg">{primaryLabel}</Button>{secondaryHref && secondaryLabel ? <Button href={secondaryHref} variant="ghost" size="lg">{secondaryLabel}</Button> : null}</div></Container></section>;
}
