"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, CalendarDays, CheckCircle2, Globe2, Mail, MessageSquareText, Route, Sparkles, TrendingUp, Users, Workflow } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useLang } from "@/context/LanguageContext";

const copy = {
  en: {
    eyebrow: "CONNECTED SERVICES",
    title: "Systems That Work Better Together",
    body: "Start with the service you need now, then connect more as your business grows.",
    cta: "Explore Services",
    cards: [
      { tag: "CRM & OPERATIONS", title: "Organize Customers and Daily Work", body: "Connect records, pipelines, appointments, tasks, files, and team activity.", labels: ["Lead received", "Record created", "Task assigned"] },
      { tag: "AUTOMATION & COMMUNICATION", title: "Automate Follow-Up and Service", body: "Send messages, reminders, assignments, intake requests, and updates automatically.", labels: ["Rule triggered", "Message sent", "Reminder scheduled"] },
      { tag: "WEB, MARKETING & AI", title: "Capture and Qualify Better Leads", body: "Connect your website, campaigns, forms, and practical AI to the customer journey.", labels: ["Form submitted", "Source captured", "Lead categorized"] },
    ],
  },
  es: {
    eyebrow: "SERVICIOS CONECTADOS",
    title: "Sistemas que Funcionan Mejor Juntos",
    body: "Comience con el servicio que necesita hoy y conecte más a medida que su negocio crece.",
    cta: "Explorar Servicios",
    cards: [
      { tag: "CRM Y OPERACIONES", title: "Organice Clientes y Trabajo Diario", body: "Conecte registros, procesos, citas, tareas, archivos y actividad del equipo.", labels: ["Prospecto recibido", "Registro creado", "Tarea asignada"] },
      { tag: "AUTOMATIZACIÓN Y COMUNICACIÓN", title: "Automatice Seguimiento y Servicio", body: "Envíe mensajes, recordatorios, asignaciones, solicitudes y actualizaciones automáticamente.", labels: ["Regla activada", "Mensaje enviado", "Recordatorio programado"] },
      { tag: "WEB, MARKETING E IA", title: "Capte y Califique Mejores Prospectos", body: "Conecte su web, campañas, formularios e IA práctica al recorrido del cliente.", labels: ["Formulario enviado", "Fuente captada", "Prospecto clasificado"] },
    ],
  },
} as const;

const cardIcons = [Users, Workflow, Sparkles] as const;
const flowIcons = [[Globe2, Users, CalendarDays], [Route, MessageSquareText, Mail], [Globe2, TrendingUp, Bot]] as const;

export default function ServiceSystems() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion() === true;

  return (
    <section id="services" className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-vx-cyan">{c.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.045em] sm:text-5xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">{c.body}</p>
        </div>

        <div className="mt-12 space-y-7">
          {c.cards.map((card, index) => {
            const Icon = cardIcons[index]!;
            const mini = flowIcons[index]!;
            const reverse = index % 2 === 1;
            return (
              <motion.article
                key={card.title}
                className={`vx-service-story ${reverse ? "vx-service-story-reverse" : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.58 }}
              >
                <div className="vx-service-copy">
                  <span className="vx-service-tag">{card.tag}</span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>

                <div className="vx-service-demo">
                  <div className="vx-demo-header"><span><Icon size={17} />VYNTEX</span><small>{lang === "es" ? "Sistema activo" : "System active"}</small></div>
                  <div className="vx-demo-flow">
                    {card.labels.map((label, flowIndex) => {
                      const MiniIcon = mini[flowIndex]!;
                      return (
                        <div key={label} className="vx-demo-step">
                          <motion.span
                            animate={reduceMotion ? undefined : { y: [0, -3, 0], boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 24px rgba(34,211,238,.18)", "0 0 0 rgba(34,211,238,0)"] }}
                            transition={{ duration: 4.2, repeat: Infinity, delay: flowIndex * 0.55 }}
                          ><MiniIcon size={17} /></motion.span>
                          <strong>{label}</strong>
                          <CheckCircle2 size={14} className="text-vx-cyan" />
                          {flowIndex < card.labels.length - 1 ? <i><motion.b animate={reduceMotion ? undefined : { x: ["-100%", "180%"] }} transition={{ duration: 2.9, repeat: Infinity, delay: flowIndex * 0.5, ease: "linear" }} /></i> : null}
                        </div>
                      );
                    })}
                  </div>
                  <div className="vx-demo-console">
                    <span />
                    <div>
                      <small>{lang === "es" ? "Automatización verificada" : "Automation verified"}</small>
                      <strong>{lang === "es" ? "Flujo sincronizado" : "Workflow synchronized"}</strong>
                    </div>
                    <ArrowRight size={17} />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-9 text-center"><Button href="/services" variant="secondary">{c.cta}</Button></div>
      </Container>
    </section>
  );
}
