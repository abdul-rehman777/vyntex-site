"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { servicesByLang, pageCopy } from "@/lib/marketing-content";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

export default function ServicesHub() { const { lang } = useLang(); const copy = pageCopy[lang].services; return <PageShell><MarketingHero eyebrow={copy.eyebrow} title={copy.title} description={copy.description} primaryHref="/contact" primaryLabel={lang === "en" ? "Plan Your Project" : "Planificar su proyecto"} /><section className="py-20"><Container><div className="grid gap-6 md:grid-cols-2">{servicesByLang[lang].map((service) => <article key={service.slug} className="group rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2 p-7 transition hover:border-[rgba(34,211,238,0.45)]"><p className="font-mono text-xs uppercase tracking-[0.18em] text-vx-cyan">{service.eyebrow}</p><h2 className="mt-4 text-2xl font-semibold">{service.shortTitle}</h2><p className="mt-4 text-vx-muted">{service.summary}</p><ul className="mt-6 grid gap-2 text-sm text-vx-silver">{service.solutions.slice(0,4).map((x) => <li key={x}>• {x}</li>)}</ul><Link href={`/services/${service.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold text-vx-cyan">{lang === "en" ? "Explore service" : "Explorar servicio"}<ArrowRight size={17}/></Link></article>)}</div></Container></section></PageShell>; }
