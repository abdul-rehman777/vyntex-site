"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bot, CalendarDays, Check, Globe2, MessageSquareText, Route, Sparkles, Users, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useLang } from "@/context/LanguageContext";
import { revealVariants, staggerVariants } from "@/components/home/motion";

const copy = {
  en: {
    eyebrow: "THREE CORE SYSTEMS",
    title: "The Technology Your Business Uses, Working Together",
    body: "Start with one system or connect all three around the way your team already works.",
    cta: "Explore Services",
    cards: [
      { title: "CRM and Operations", body: "Organize customer records, pipelines, appointments, tasks, files, and team activity.", labels: ["Inquiry captured", "Record created", "Task linked"] },
      { title: "Automation and Communication", body: "Automate messages, reminders, assignments, follow-up, intake, and internal notifications.", labels: ["Trigger detected", "Message sent", "Follow-up scheduled"] },
      { title: "Web, Marketing, and AI", body: "Capture leads, connect campaigns, improve customer journeys, and use practical AI where it adds value.", labels: ["Form submitted", "Source recorded", "Inquiry categorized"] },
    ],
  },
  es: {
    eyebrow: "TRES SISTEMAS PRINCIPALES",
    title: "La Tecnología de su Negocio, Trabajando en Conjunto",
    body: "Comience con un sistema o conecte los tres según la forma en que ya trabaja su equipo.",
    cta: "Explorar Servicios",
    cards: [
      { title: "CRM y Operaciones", body: "Organice clientes, procesos, citas, tareas, archivos y actividad del equipo.", labels: ["Consulta captada", "Registro creado", "Tarea vinculada"] },
      { title: "Automatización y Comunicación", body: "Automatice mensajes, recordatorios, asignaciones, seguimiento, admisión y avisos internos.", labels: ["Activador detectado", "Mensaje enviado", "Seguimiento programado"] },
      { title: "Web, Marketing e IA", body: "Capte prospectos, conecte campañas, mejore la experiencia y use IA cuando aporte valor.", labels: ["Formulario enviado", "Fuente registrada", "Consulta clasificada"] },
    ],
  },
} as const;

const mainIcons = [Users, Workflow, Sparkles] as const;
const flowIcons = [[Globe2, Users, CalendarDays], [Route, MessageSquareText, CalendarDays], [Globe2, Bot, Users]] as const;

export default function ServiceSystems() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion();
  return (
    <section id="services" className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] sm:text-5xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">{c.body}</p>
        </div>
        <motion.div className="mt-10 grid gap-5 lg:grid-cols-3" variants={staggerVariants} initial={reduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {c.cards.map((card, index) => {
            const Icon = mainIcons[index]!;
            const MiniIcons = flowIcons[index]!;
            return (
              <motion.article key={card.title} variants={revealVariants} className="system-card">
                <div className="flex items-center gap-3"><span className="system-card-icon"><Icon size={21} aria-hidden /></span><h3 className="text-xl font-bold">{card.title}</h3></div>
                <p className="mt-4 text-sm leading-6 text-vx-muted">{card.body}</p>
                <div className="mt-6 rounded-xl border border-vx-line bg-vx-bg/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    {card.labels.map((label, flowIndex) => {
                      const MiniIcon = MiniIcons[flowIndex]!;
                      return (
                        <div key={label} className="min-w-0 flex-1 text-center">
                          <motion.span className="mx-auto grid h-9 w-9 place-items-center rounded-lg border border-vx-blue/25 bg-vx-blue/10 text-vx-cyan" whileInView={reduceMotion ? undefined : { scale: [0.92, 1.04, 1] }} transition={{ delay: flowIndex * 0.18 }} viewport={{ once: true }}><MiniIcon size={16} aria-hidden /></motion.span>
                          <span className="mt-2 block text-[0.68rem] leading-4 text-vx-muted">{label}</span>
                          {flowIndex < card.labels.length - 1 ? <span className="system-mini-line" aria-hidden /> : null}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-vx-silver"><Check size={14} className="text-vx-cyan" aria-hidden />Connected and ready</div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
        <div className="mt-8 text-center"><Button href="/services" variant="secondary">{c.cta}</Button></div>
      </Container>
    </section>
  );
}
