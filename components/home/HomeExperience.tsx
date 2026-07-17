"use client";

import { ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { openConsultation } from "@/components/BookConsultation";

// New Visual Components
import HeroAnimation from "@/components/home/HeroAnimation";
import DashboardSequence from "@/components/visuals/DashboardSequence";
import ServiceCards from "@/components/visuals/ServiceCards";
import TransformationCompare from "@/components/visuals/TransformationCompare";
import ProcessTimeline from "@/components/visuals/ProcessTimeline";
import IndustrySelector from "@/components/visuals/IndustrySelector";
import { motion } from "framer-motion";
import { variants, useVyntexMotion } from "@/lib/motion";

const copy = {
  en: {
    hero: {
      eyebrow: "CONNECTED BUSINESS SYSTEMS",
      title: "One Connected System for Your Entire Business",
      body: "VYNTEX connects your CRM, customer communication, scheduling, payments, automation, website, marketing, and reporting into one organized business system.",
      primary: "Book Consultation",
      secondary: "View Services",
    },
    dashboard: {
      title: "See One Customer Move Through Your Business",
      body: "Website Inquiry → CRM Record → Message Sent → Appointment → Invoice → Payment → Portal → Report",
      labels: ["Website Inquiry", "CRM Record", "Message Sent", "Appointment Booked", "Invoice Generated", "Payment Recorded", "Portal Updated", "Report Updated"],
      note: "Illustrative workflow preview",
    },
    offer: {
      eyebrow: "WHAT WE DO",
      title: "We connect the tools your business needs to operate.",
      body: "Start with one service or let Vyntex build a complete connected system around your workflow.",
      items: [
        ["CRM and Operations", "Organize customer records, pipelines, appointments, tasks, files, and team activity."],
        ["Automation and Communication", "Automate messages, reminders, assignments, follow-up, intake, and internal notifications."],
        ["Web, Marketing, and AI", "Capture leads, connect campaigns, improve customer journeys, and use practical AI where it adds value."],
      ],
      cta: "View Services",
    },
    difference: {
      eyebrow: "WHY VYNTEX",
      title: "Replace Disconnected Tools With One Connected System",
      before: "Without VYNTEX",
      after: "With VYNTEX",
      beforeItems: ["Separate CRM", "Separate email tool", "Separate scheduling tool", "Separate payment system", "Manual follow-up", "Scattered reports"],
      afterItems: ["One connected CRM", "Unified communication", "Automated scheduling", "Connected payments", "Clear customer journey", "Live operational visibility"],
    },
    process: {
      eyebrow: "HOW IT WORKS",
      title: "A simple path from scattered tools to one organized system.",
      items: [
        ["1", "Review", "We identify your current tools, manual work, and operational gaps."],
        ["2", "Design", "We create the connected workflow and recommend what should stay, connect, or change."],
        ["3", "Build", "We configure, automate, test, launch, and support the approved system."],
      ],
    },
    industries: {
      eyebrow: "BUILT FOR SERVICE BUSINESSES",
      title: "Flexible enough for the way your business actually works.",
      items: ["Accounting and Tax", "Medical Offices", "Home Services", "Construction", "Professional Services", "Financial Services"],
      cta: "View Industries",
    },
    final: {
      title: "Ready to Simplify Your Business?",
      body: "Stop managing disconnected tools. Let VYNTEX build a connected business system around your company.",
      button: "Book Your Consultation",
    },
  },
  es: {
    hero: {
      eyebrow: "SISTEMAS EMPRESARIALES CONECTADOS",
      title: "Un Sistema Conectado para Todo su Negocio",
      body: "VYNTEX conecta su CRM, comunicación, citas, pagos, automatización, web, marketing y reportes en un sistema empresarial organizado.",
      primary: "Reservar una Consulta",
      secondary: "Ver Servicios",
    },
    dashboard: {
      title: "Vea a un Cliente Moverse por su Negocio",
      body: "Consulta Web → Registro CRM → Mensaje Enviado → Cita → Factura → Pago → Portal → Reporte",
      labels: ["Consulta Web", "Registro CRM", "Mensaje Enviado", "Cita Programada", "Factura Generada", "Pago Registrado", "Portal Actualizado", "Reporte Actualizado"],
      note: "Vista ilustrativa del flujo de trabajo",
    },
    offer: {
      eyebrow: "LO QUE HACEMOS",
      title: "Conectamos las herramientas que su negocio necesita.",
      body: "Comience con un servicio o permita que Vyntex cree un sistema completo para su flujo de trabajo.",
      items: [
        ["CRM y Operaciones", "Organice clientes, prospectos, citas, tareas y actividad del equipo."],
        ["Automatización y Com.", "Automatice seguimiento, recordatorios, admisión, mensajes y actualizaciones."],
        ["Web, Marketing e IA", "Capture prospectos, mejore su presencia digital y use IA práctica."],
      ],
      cta: "Ver Servicios",
    },
    difference: {
      eyebrow: "POR QUÉ VYNTEX",
      title: "Reemplace Herramientas Desconectadas con un Sistema Conectado",
      before: "Sin VYNTEX",
      after: "Con VYNTEX",
      beforeItems: ["CRM separado", "Email separado", "Citas separadas", "Pagos separados", "Seguimiento manual", "Reportes dispersos"],
      afterItems: ["CRM conectado", "Comunicación unificada", "Citas automatizadas", "Pagos conectados", "Trayectoria clara", "Visibilidad en vivo"],
    },
    process: {
      eyebrow: "CÓMO FUNCIONA",
      title: "Un camino simple de herramientas dispersas a un sistema organizado.",
      items: [
        ["1", "Revisión", "Identificamos sus herramientas actuales, trabajo manual y brechas operativas."],
        ["2", "Diseño", "Creamos el flujo de trabajo y recomendamos qué conservar, conectar o cambiar."],
        ["3", "Construcción", "Configuramos, automatizamos, probamos, lanzamos y damos soporte al sistema."],
      ],
    },
    industries: {
      eyebrow: "PARA EMPRESAS DE SERVICIOS",
      title: "Flexible para la forma en que realmente funciona su negocio.",
      items: ["Contabilidad e Impuestos", "Oficinas Médicas", "Servicios del Hogar", "Construcción", "Servicios Profesionales", "Servicios Financieros"],
      cta: "Ver Industrias",
    },
    final: {
      title: "¿Listo para Simplificar su Negocio?",
      body: "Deje de manejar herramientas desconectadas. Permita que VYNTEX cree un sistema conectado alrededor de su empresa.",
      button: "Reservar una Consulta",
    },
  },
} as const;

export default function HomeExperience() {
  const { lang } = useLang();
  const c = copy[lang];
  const { shouldReduceMotion } = useVyntexMotion();

  return (
    <>
      <section id="home" className="relative overflow-hidden pb-14 pt-[118px] sm:pb-18 sm:pt-[138px]">
        {/* Subtle radial background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[600px] max-w-7xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,233,0.12),transparent_70%)]"/>
        
        <Container>
          <motion.div 
            variants={shouldReduceMotion ? undefined : variants.container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-4xl text-center relative z-10"
          >
            <motion.p variants={shouldReduceMotion ? undefined : variants.itemFadeUp} className="font-mono text-xs uppercase tracking-[0.22em] text-vx-cyan">
              {c.hero.eyebrow}
            </motion.p>
            <motion.h1 variants={shouldReduceMotion ? undefined : variants.itemFadeUp} className="mt-5 text-4xl font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {c.hero.title}
            </motion.h1>
            <motion.p variants={shouldReduceMotion ? undefined : variants.itemFadeUp} className="mx-auto mt-6 max-w-3xl text-base leading-7 text-vx-muted sm:text-xl sm:leading-8">
              {c.hero.body}
            </motion.p>
            <motion.div variants={shouldReduceMotion ? undefined : variants.itemFadeUp} className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={openConsultation} size="lg">{c.hero.primary}<ArrowRight size={18}/></Button>
              <Button href="/services" variant="secondary" size="lg">{c.hero.secondary}</Button>
            </motion.div>
          </motion.div>
          
          <HeroAnimation />
          
          <motion.div 
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-16 sm:mt-20"
          >
            <DashboardSequence {...c.dashboard} />
          </motion.div>
        </Container>
      </section>

      <section id="services" className="border-y border-vx-line bg-vx-bg2/35 py-14 sm:py-18 relative">
        <Container>
          <motion.div 
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.offer.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.offer.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">{c.offer.body}</p>
          </motion.div>
          
          <ServiceCards items={c.offer.items} />
          
          <div className="mt-10 text-center">
            <Button href="/services" variant="secondary">{c.offer.cta}<ArrowRight size={17}/></Button>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-18 overflow-hidden">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, x: -30 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.difference.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.difference.title}</h2>
            </motion.div>
            <TransformationCompare 
              before={c.difference.before}
              after={c.difference.after}
              beforeItems={c.difference.beforeItems}
              afterItems={c.difference.afterItems}
            />
          </div>
        </Container>
      </section>

      <section id="process" className="border-y border-vx-line bg-vx-bg2/35 py-14 sm:py-18">
        <Container>
          <motion.div 
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.process.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.process.title}</h2>
          </motion.div>
          
          <ProcessTimeline items={c.process.items} />
        </Container>
      </section>

      <section id="industries" className="py-14 sm:py-20 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-vx-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.industries.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.industries.title}</h2>
              <div className="mt-8">
                <Button href="/industries" variant="secondary">{c.industries.cta}<ArrowRight size={17}/></Button>
              </div>
            </motion.div>
            
            <IndustrySelector items={c.industries.items} />
          </div>
        </Container>
      </section>

      <section className="border-t border-vx-line bg-vx-bg2/50 py-14 sm:py-24 relative overflow-hidden">
        {/* Subtle animated particles or rays could go here, but a clean gradient is safer for performance */}
        <Container>
          <motion.div 
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl rounded-[2rem] border border-vx-blue/25 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,.12),transparent_60%),rgba(14,165,233,.05)] px-6 py-12 text-center sm:px-10 sm:py-16 shadow-vx-glow relative overflow-hidden"
          >
            {/* Ambient pulse on the final CTA container */}
            <motion.div 
              className="absolute inset-0 bg-vx-glow/5 pointer-events-none"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="relative z-10 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.final.title}</h2>
            <p className="relative z-10 mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted sm:text-lg">{c.final.body}</p>
            <div className="relative z-10 mt-8">
              <Button onClick={openConsultation} size="lg">{c.final.button}<ArrowRight size={18}/></Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
