"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bot, CalendarCheck2, CreditCard, FileText, Globe2, MessageSquareText, Sparkles, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/home/ScrollReveal";
import { useLang } from "@/context/LanguageContext";

const copy = {
  en: {
    title: "One Customer Journey, Fully Connected",
    body: "Each step updates the next, so your team sees the same customer history from inquiry to payment.",
    labels: ["Lead Capture", "CRM Record", "Automatic Message", "Appointment", "Invoice", "Payment", "Portal", "Reporting"],
  },
  es: {
    title: "Un Recorrido del Cliente, Totalmente Conectado",
    body: "Cada paso actualiza el siguiente para que su equipo vea el mismo historial desde la consulta hasta el pago.",
    labels: ["Captación", "Registro CRM", "Mensaje Automático", "Cita", "Factura", "Pago", "Portal", "Reporte"],
  },
} as const;

const icons = [Globe2, Users, MessageSquareText, CalendarCheck2, FileText, CreditCard, Bot, Sparkles] as const;

export default function WorkflowDemo() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion() === true;

  return (
    <section className="vx-workflow-ribbon border-y border-vx-line py-16 sm:py-20">
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.045em] sm:text-5xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">{c.body}</p>
        </ScrollReveal>

        <div className="vx-ribbon-stage mt-10">
          <div className="vx-ribbon-grid" aria-hidden="true" />
          <div className="vx-ribbon-cursor" aria-hidden="true"><span /></div>
          <div className="vx-ribbon-track">
            {c.labels.map((label, index) => {
              const Icon = icons[index]!;
              return (
                <motion.div
                  key={label}
                  className="vx-ribbon-pill"
                  initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.38, delay: reduceMotion ? 0 : index * 0.065 }}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span>{label}</span>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            className="vx-ribbon-signal"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { x: ["0%", "730%"], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
          />
        </div>
      </Container>
    </section>
  );
}
