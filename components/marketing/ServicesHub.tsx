"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { servicesByLang, pageCopy } from "@/lib/marketing-content";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

const serviceOrder = [
  "crm-systems",
  "ai-automation",
  "web-development",
  "ai-chatbots",
  "digital-marketing",
  "branding",
];

export default function ServicesHub() {
  const { lang } = useLang();
  const copy = pageCopy[lang].services;
  const services = [...servicesByLang[lang]].sort(
    (a, b) => serviceOrder.indexOf(a.slug) - serviceOrder.indexOf(b.slug),
  );

  return (
    <PageShell>
      <MarketingHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        primaryHref="/contact"
        primaryLabel={lang === "en" ? "Book a Consultation" : "Reservar una Consulta"}
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, index) => (
              <article key={service.slug} className="group rounded-2xl border border-[rgba(14,165,233,0.14)] bg-vx-bg2 p-7 transition hover:-translate-y-1 hover:border-[rgba(34,211,238,0.45)]">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-vx-cyan">{service.eyebrow}</p>
                  <span className="font-mono text-xs text-vx-muted">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-4 text-2xl font-bold">{service.shortTitle}</h2>
                <p className="mt-4 leading-7 text-vx-muted">{service.summary}</p>
                <ul className="mt-6 grid gap-2 text-sm text-vx-silver">
                  {service.solutions.slice(0, 4).map((item) => <li key={item}>• {item}</li>)}
                </ul>
                <Link href={`/services/${service.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold text-vx-cyan">
                  {lang === "en" ? "View Service" : "Ver Servicio"}<ArrowRight size={17}/>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
