"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, CreditCard, Mail, Network, RefreshCcw, Users } from "lucide-react";
import Container from "@/components/ui/Container";
import RevealText from "@/components/ui/RevealText";
import Button from "@/components/ui/Button";
import { openConsultation } from "@/components/BookConsultation";
import { useLang } from "@/context/LanguageContext";
import { revealVariants } from "@/components/home/motion";

const copy = {
  en: {
    eyebrow: "BEFORE AND AFTER",
    title: "Replace Disconnected Tools With One Connected System",
    before: "Without VYNTEX",
    after: "With VYNTEX",
    beforeItems: ["Separate CRM", "Separate email and scheduling", "Manual follow-up", "Scattered reporting"],
    afterItems: ["One connected CRM", "Unified communication", "Automated customer journey", "Live operational visibility"],
    cta: "Simplify Your Business",
  },
  es: {
    eyebrow: "ANTES Y DESPUÉS",
    title: "Reemplace Herramientas Desconectadas con un Sistema Conectado",
    before: "Sin VYNTEX",
    after: "Con VYNTEX",
    beforeItems: ["CRM separado", "Correo y citas separados", "Seguimiento manual", "Reportes dispersos"],
    afterItems: ["Un CRM conectado", "Comunicación unificada", "Recorrido automatizado", "Visibilidad operativa"],
    cta: "Simplificar su Negocio",
  },
} as const;

const icons = [Users, Mail, RefreshCcw, CreditCard] as const;

export default function BeforeAfterSystem() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-y border-vx-line bg-vx-bg2/35 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.eyebrow}</p>
          <RevealText as="h2" text={c.title} className="mt-4 text-3xl font-bold tracking-[-0.045em] sm:text-5xl" />
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <motion.article className="comparison-panel comparison-panel-before" variants={revealVariants} initial={reduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
            <div className="flex items-center gap-3"><AlertCircle size={20} className="text-vx-muted" aria-hidden /><h3 className="text-xl font-bold">{c.before}</h3></div>
            <div className="comparison-node-grid mt-6">
              {c.beforeItems.map((item, index) => { const Icon = icons[index]!; return <div key={item} className={`comparison-node disconnected-${index}`}><Icon size={16} aria-hidden /><span>{item}</span></div>; })}
            </div>
            <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 560 330" aria-hidden><path d="M95 95 L220 120 M340 85 L470 135 M125 235 L245 205 M335 225 L455 245" stroke="#475569" strokeWidth="2" strokeDasharray="5 10" /></svg>
          </motion.article>

          <motion.article className="comparison-panel comparison-panel-after" variants={revealVariants} initial={reduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
            <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-vx-cyan" aria-hidden /><h3 className="text-xl font-bold">{c.after}</h3></div>
            <div className="comparison-core"><Network size={22} aria-hidden /><span>VYNTEX</span></div>
            <div className="comparison-node-grid mt-6">
              {c.afterItems.map((item, index) => { const Icon = icons[index]!; return <motion.div key={item} className="comparison-node connected" initial={reduceMotion ? false : { opacity: 0.45, x: index % 2 ? 8 : -8 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}><Icon size={16} aria-hidden /><span>{item}</span></motion.div>; })}
            </div>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 330" aria-hidden><motion.path d="M115 100 C210 100 205 165 280 165 C355 165 350 100 445 100 M115 235 C210 235 205 165 280 165 C355 165 350 235 445 235" fill="none" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="2" initial={reduceMotion ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.1 }} viewport={{ once: true }} /></svg>
          </motion.article>
        </div>
        <div className="mt-8 text-center"><Button onClick={openConsultation}>{c.cta}</Button></div>
      </Container>
    </section>
  );
}
