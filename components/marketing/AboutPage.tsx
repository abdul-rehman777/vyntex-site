"use client";

import { CheckCircle2 } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { pageCopy } from "@/lib/marketing-content";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

export default function AboutPage() {
  const { lang } = useLang();
  const c = pageCopy[lang].about;

  const founder = lang === "en"
    ? {
        eyebrow: "ABOUT THE FOUNDER",
        name: "Daysi A. Bettran, MBA",
        role: "Founder and Chief Executive Officer",
        body: "Daysi Bettran brings experience in entrepreneurship, business operations, accounting, advisory, and technology implementation. Her work focuses on helping small businesses replace scattered processes with clear systems that support customers, teams, and long-term growth.",
        note: "Vyntex combines practical business understanding with thoughtful technology implementation, bilingual communication, and hands-on support.",
      }
    : {
        eyebrow: "ACERCA DE LA FUNDADORA",
        name: "Daysi A. Bettran, MBA",
        role: "Fundadora y Directora Ejecutiva",
        body: "Daysi Bettran aporta experiencia en emprendimiento, operaciones empresariales, contabilidad, asesoría e implementación tecnológica. Su trabajo se enfoca en ayudar a pequeñas empresas a reemplazar procesos dispersos con sistemas claros que apoyan a clientes, equipos y crecimiento a largo plazo.",
        note: "Vyntex combina conocimiento empresarial práctico con implementación tecnológica, comunicación bilingüe y apoyo personalizado.",
      };

  return (
    <PageShell>
      <MarketingHero
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.intro}
        primaryHref="/contact"
        primaryLabel={lang === "en" ? "Book a Consultation" : "Reservar una Consulta"}
      />

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-6 text-lg leading-8 text-vx-muted">
            {c.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <aside className="rounded-2xl border border-[rgba(14,165,233,.16)] bg-vx-bg2 p-7">
            <h2 className="text-2xl font-semibold">{lang === "en" ? "What guides our work" : "Lo que guía nuestro trabajo"}</h2>
            <ul className="mt-6 space-y-4">
              {c.values.map((value) => <li key={value} className="flex gap-3 text-vx-silver"><CheckCircle2 size={18} className="mt-1 shrink-0 text-vx-cyan"/>{value}</li>)}
            </ul>
          </aside>
        </Container>
      </section>

      <section className="border-y border-vx-line bg-vx-bg2/40 py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[.45fr_1fr]">
            <div className="mx-auto grid aspect-square w-full max-w-[300px] place-items-center rounded-[2rem] border border-vx-line bg-[radial-gradient(circle_at_40%_20%,rgba(34,211,238,.25),transparent_55%),linear-gradient(145deg,#10172d,#080b1b)] shadow-vx-glow-sm" aria-label={founder.name}>
              <span className="text-6xl font-extrabold tracking-[-0.05em] vx-grad-text">DB</span>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{founder.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold sm:text-5xl">{founder.name}</h2>
              <p className="mt-3 font-semibold text-vx-silver">{founder.role}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-vx-muted">{founder.body}</p>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-vx-muted">{founder.note}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { en: "Strategy before software", es: "Estrategia antes del software" },
              { en: "Built for real operations", es: "Creado para operaciones reales" },
              { en: "Clear, bilingual support", es: "Apoyo claro y bilingüe" },
            ].map((item) => <article key={item.en} className="rounded-2xl border border-[rgba(14,165,233,.12)] bg-vx-bg p-7"><h3 className="text-xl font-semibold">{lang === "en" ? item.en : item.es}</h3></article>)}
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
