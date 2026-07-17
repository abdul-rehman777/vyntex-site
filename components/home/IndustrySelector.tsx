"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Building2, CalendarCheck2, FileText, ReceiptText, UserRoundCheck, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealText from "@/components/ui/RevealText";
import Button from "@/components/ui/Button";
import { useLang } from "@/context/LanguageContext";

const copy = {
  en: {
    eyebrow: "INDUSTRIES",
    title: "Workflows Shaped Around the Way Your Business Operates",
    body: "Choose an industry to see a typical connected customer journey.",
    cta: "View Industries",
    industries: [
      ["Accounting and Tax", ["Lead", "Appointment", "Document request", "Client portal", "Invoice", "Follow-up"]],
      ["Medical Offices", ["Inquiry", "Appointment", "Reminder", "Internal task", "Follow-up"]],
      ["Home Services", ["Lead", "Estimate", "Scheduling", "Invoice", "Review request"]],
      ["Construction", ["Project inquiry", "Estimate tracking", "Task coordination", "Status update", "Reporting"]],
      ["Professional Services", ["Client intake", "Appointment", "Documents", "CRM pipeline", "Follow-up"]],
      ["Financial Services", ["Lead", "Qualification", "Appointment", "Reminder", "Pipeline", "Reporting"]],
    ],
  },
  es: {
    eyebrow: "INDUSTRIAS",
    title: "Flujos Adaptados a la Forma en que Opera su Negocio",
    body: "Seleccione una industria para ver un recorrido típico del cliente.",
    cta: "Ver Industrias",
    industries: [
      ["Contabilidad e Impuestos", ["Prospecto", "Cita", "Solicitud de documentos", "Portal del cliente", "Factura", "Seguimiento"]],
      ["Oficinas Médicas", ["Consulta", "Cita", "Recordatorio", "Tarea interna", "Seguimiento"]],
      ["Servicios del Hogar", ["Prospecto", "Estimado", "Programación", "Factura", "Solicitud de reseña"]],
      ["Construcción", ["Consulta de proyecto", "Seguimiento de estimado", "Coordinación", "Actualización", "Reporte"]],
      ["Servicios Profesionales", ["Admisión", "Cita", "Documentos", "Proceso CRM", "Seguimiento"]],
      ["Servicios Financieros", ["Prospecto", "Calificación", "Cita", "Recordatorio", "Proceso", "Reporte"]],
    ],
  },
} as const;

const icons = [Building2, CalendarCheck2, FileText, Workflow, ReceiptText, UserRoundCheck] as const;

export default function IndustrySelector() {
  const { lang } = useLang();
  const c = copy[lang];
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const current = c.industries[active]!;

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % c.industries.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + c.industries.length) % c.industries.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = c.industries.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <section id="industries" className="border-y border-vx-line bg-vx-bg2/35 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.eyebrow}</p>
          <RevealText as="h2" text={c.title} className="mt-4 text-3xl font-bold tracking-[-0.045em] sm:text-5xl" />
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">{c.body}</p>
        </div>
        <div className="mt-9 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div role="tablist" aria-label={c.title} className="industry-tabs">
            {c.industries.map(([name], index) => (
              <button
                key={name}
                id={`${baseId}-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls={`${baseId}-panel`}
                tabIndex={active === index ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="industry-tab"
              >
                <span>{name}</span><ArrowRight size={16} aria-hidden />
              </button>
            ))}
          </div>
          <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="industry-panel">
            <div className="flex items-center gap-3"><span className="system-card-icon"><Building2 size={20} aria-hidden /></span><h3 className="text-xl font-bold">{current[0]}</h3></div>
            <motion.ol key={current[0]} className="industry-flow" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {current[1].map((step, index) => { const Icon = icons[index % icons.length]!; return (
                <li key={step}><span className="industry-flow-icon"><Icon size={16} aria-hidden /></span><strong>{step}</strong>{index < current[1].length - 1 ? <span className="industry-flow-line" aria-hidden /> : null}</li>
              ); })}
            </motion.ol>
          </div>
        </div>
        <div className="mt-8 text-center"><Button href="/industries" variant="secondary">{c.cta}</Button></div>
      </Container>
    </section>
  );
}
