"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BarChart3, CalendarCheck2, CreditCard, FileText, Globe2, LayoutDashboard, MessageSquareText, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealText from "@/components/ui/RevealText";
import { useLang } from "@/context/LanguageContext";
import { motionTokens, revealVariants, staggerVariants } from "@/components/home/motion";

const icons = [Globe2, Users, MessageSquareText, CalendarCheck2, FileText, CreditCard, LayoutDashboard, BarChart3] as const;
const copy = {
  en: {
    eyebrow: "CONNECTED WORKFLOW",
    title: "See One Customer Move Through Your Business",
    body: "One inquiry becomes a coordinated customer journey, without manual handoffs between disconnected tools.",
    steps: ["Website Inquiry", "CRM Record Created", "Automatic Message Sent", "Appointment Booked", "Invoice Generated", "Payment Recorded", "Customer Portal Updated", "Report Updated"],
  },
  es: {
    eyebrow: "FLUJO CONECTADO",
    title: "Vea Cómo un Cliente Avanza por su Negocio",
    body: "Una consulta se convierte en una experiencia coordinada, sin transferencias manuales entre herramientas desconectadas.",
    steps: ["Consulta Web", "Registro Creado en CRM", "Mensaje Automático", "Cita Reservada", "Factura Generada", "Pago Registrado", "Portal Actualizado", "Reporte Actualizado"],
  },
} as const;

export default function WorkflowDemo() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="border-y border-vx-line bg-vx-bg2/35 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.eyebrow}</p>
          <RevealText as="h2" text={c.title} className="mt-4 text-3xl font-bold tracking-[-0.045em] sm:text-5xl" />
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">{c.body}</p>
        </div>
        <motion.ol ref={ref} className="workflow-track mt-10" variants={staggerVariants} initial={reduceMotion ? "visible" : "hidden"} animate={inView ? "visible" : "hidden"}>
          {c.steps.map((step, index) => {
            const Icon = icons[index]!;
            return (
              <motion.li key={step} className="workflow-step" variants={revealVariants}>
                <div className="workflow-icon"><Icon size={19} aria-hidden /></div>
                <span className="workflow-index">{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
                {index < c.steps.length - 1 ? (
                  <motion.span className="workflow-connector" aria-hidden initial={reduceMotion ? false : { scaleX: 0 }} animate={inView ? { scaleX: 1 } : { scaleX: 0 }} transition={{ duration: 0.42, delay: reduceMotion ? 0 : index * 0.1 + 0.18, ease: motionTokens.ease }} />
                ) : null}
              </motion.li>
            );
          })}
        </motion.ol>
      </Container>
    </section>
  );
}
