"use client";

import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CircleDollarSign,
  Construction,
  HeartPulse,
  Home,
  Layers3,
  MessageSquareText,
  Network,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { DIRECT_PRICING } from "@/lib/pricing";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { openConsultation } from "@/components/BookConsultation";

const copy = {
  en: {
    hero: {
      eyebrow: "CONNECTED BUSINESS SYSTEMS",
      title: "Run Your Business With Less Software and Less Manual Work",
      body: "Vyntex connects your CRM, communication, scheduling, payments, automation, and reporting into one organized system built around your business.",
      primary: "Book a Consultation",
      secondary: "See How It Works",
    },
    dashboard: {
      title: "Your Connected Business Dashboard",
      body: "Customers, communication, appointments, payments, tasks, and reporting in one clear view.",
      labels: ["CRM", "Appointments", "Automation", "Messages", "Payments", "Reports"],
      disclaimer: "Illustrative dashboard preview. Data shown is for demonstration purposes.",
    },
    solutions: {
      eyebrow: "WHAT VYNTEX CONNECTS",
      title: "The essential systems your business uses every day",
      items: [
        ["Manage Customers", "CRM, records, appointments, tasks, files, and payments."],
        ["Communicate Clearly", "Email, text messages, forms, reminders, and history."],
        ["Automate Repetitive Work", "Follow-up, routing, intake, notifications, and updates."],
        ["See What Is Happening", "Pipeline, team activity, payments, and reporting."],
      ],
    },
    comparison: {
      eyebrow: "SIMPLIFY YOUR OPERATIONS",
      title: "Replace disconnected tools with one connected system",
      leftTitle: "Scattered setup",
      rightTitle: "Vyntex setup",
      left: ["Separate CRM and inbox", "Manual follow-up and reminders", "Disconnected scheduling and payments", "Reporting spread across tools"],
      right: ["Connected CRM and communication", "Automated follow-up and routing", "Scheduling, payments, and portal", "One operational dashboard"],
      cta: "Simplify Your Business",
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: "One customer journey, connected from start to finish",
      steps: ["Inquiry", "Lead Created", "Automatic Follow-Up", "Appointment", "Payment", "Portal & Reporting"],
    },
    industries: {
      eyebrow: "BUILT FOR SERVICE BUSINESSES",
      title: "Practical systems for the way your industry works",
      body: "Vyntex adapts the workflow, not the other way around.",
      items: [
        ["Accounting Firms", ["Client intake and documents", "Appointments and reminders", "Pipeline and payment follow-up"]],
        ["Medical Offices", ["Patient inquiries", "Appointment communication", "Follow-up and internal tasks"]],
        ["Home Services", ["Lead capture and estimates", "Scheduling and reminders", "Invoices and review requests"]],
        ["Construction", ["Project inquiries", "Estimate and follow-up tracking", "Scheduling and reporting"]],
      ],
      cta: "Explore Industry Solutions",
    },
    why: {
      eyebrow: "WHY VYNTEX",
      title: "One partner. One connected plan. Ongoing support.",
      items: [
        ["Built Around Your Business", "We configure the system around your actual workflow."],
        ["Clear Scope and Pricing", "You know what is included, required, and optional."],
        ["Connected Implementation", "Your website, CRM, automation, and communication work together."],
        ["Human Support", "English and Spanish support from real people."],
      ],
      fit: "A strong fit for growing service businesses that manage customers daily, need better organization, and want fewer disconnected tools.",
    },
    pricing: {
      eyebrow: "STARTING POINTS",
      title: "Start with what will improve your business first",
      body: "Choose one focused service or combine solutions into a connected business system.",
      starting: "Starting at",
      perfect: "Best for",
      cta: "Book a Consultation",
      view: "View Full Pricing",
      cards: [
        ["Professional Website", "web-basic", "Businesses that need a credible website and better lead capture."],
        ["CRM & Operations", "crm-basic", "Teams that need customer organization, follow-up, and visibility."],
        ["Automation & AI", "ai-simple", "Businesses ready to reduce repetitive work and respond faster."],
      ],
    },
    process: {
      eyebrow: "WHAT HAPPENS NEXT",
      title: "A simple path from consultation to launch",
      items: [
        ["1. Discovery", "We review your current tools, challenges, and priorities."],
        ["2. Plan", "We recommend what should stay, connect, or change."],
        ["3. Proposal", "You receive the scope, pricing, software, and timeline."],
        ["4. Implementation", "We configure, test, launch, and support the system."],
      ],
    },
    final: {
      title: "Ready to Simplify Your Business?",
      body: "Stop managing disconnected software. Let’s build a connected system around the way your company works.",
      button: "Book Your Consultation",
    },
  },
  es: {
    hero: {
      eyebrow: "SISTEMAS EMPRESARIALES CONECTADOS",
      title: "Administre su Negocio con Menos Software y Menos Trabajo Manual",
      body: "Vyntex conecta su CRM, comunicación, citas, pagos, automatización y reportes en un sistema organizado alrededor de su negocio.",
      primary: "Reservar una Consulta",
      secondary: "Ver Cómo Funciona",
    },
    dashboard: {
      title: "El Panel Conectado de su Negocio",
      body: "Clientes, comunicación, citas, pagos, tareas y reportes en una sola vista.",
      labels: ["CRM", "Citas", "Automatización", "Mensajes", "Pagos", "Reportes"],
      disclaimer: "Vista ilustrativa del panel. Los datos se muestran únicamente con fines de demostración.",
    },
    solutions: {
      eyebrow: "LO QUE VYNTEX CONECTA",
      title: "Los sistemas esenciales que su negocio usa cada día",
      items: [
        ["Administrar Clientes", "CRM, registros, citas, tareas, archivos y pagos."],
        ["Comunicar con Claridad", "Correo, mensajes, formularios, recordatorios e historial."],
        ["Automatizar Trabajo Repetitivo", "Seguimiento, asignación, admisión, avisos y actualizaciones."],
        ["Ver lo que Está Pasando", "Pipeline, equipo, pagos y reportes."],
      ],
    },
    comparison: {
      eyebrow: "SIMPLIFIQUE SUS OPERACIONES",
      title: "Reemplace herramientas desconectadas con un sistema conectado",
      leftTitle: "Sistema disperso",
      rightTitle: "Sistema Vyntex",
      left: ["CRM y bandeja separados", "Seguimiento y recordatorios manuales", "Citas y pagos desconectados", "Reportes en varias herramientas"],
      right: ["CRM y comunicación conectados", "Seguimiento y asignación automáticos", "Citas, pagos y portal", "Un panel operativo"],
      cta: "Simplificar mi Negocio",
    },
    workflow: {
      eyebrow: "CÓMO FUNCIONA",
      title: "Un recorrido del cliente conectado de principio a fin",
      steps: ["Consulta", "Prospecto Creado", "Seguimiento Automático", "Cita", "Pago", "Portal y Reportes"],
    },
    industries: {
      eyebrow: "PARA EMPRESAS DE SERVICIOS",
      title: "Sistemas prácticos para la forma en que trabaja su industria",
      body: "Vyntex adapta el flujo a su negocio, no al contrario.",
      items: [
        ["Firmas Contables", ["Admisión y documentos", "Citas y recordatorios", "Pipeline y seguimiento de pagos"]],
        ["Oficinas Médicas", ["Consultas de pacientes", "Comunicación de citas", "Seguimiento y tareas internas"]],
        ["Servicios del Hogar", ["Prospectos y estimados", "Programación y recordatorios", "Facturas y reseñas"]],
        ["Construcción", ["Consultas de proyectos", "Estimados y seguimiento", "Programación y reportes"]],
      ],
      cta: "Explorar Soluciones por Industria",
    },
    why: {
      eyebrow: "POR QUÉ VYNTEX",
      title: "Un socio. Un plan conectado. Apoyo continuo.",
      items: [
        ["Creado para su Negocio", "Configuramos el sistema alrededor de su flujo real."],
        ["Alcance y Precios Claros", "Usted sabe qué está incluido, requerido y opcional."],
        ["Implementación Conectada", "Su sitio, CRM, automatización y comunicación trabajan juntos."],
        ["Apoyo Humano", "Apoyo en inglés y español de personas reales."],
      ],
      fit: "Ideal para empresas de servicios en crecimiento que administran clientes, necesitan más organización y quieren menos herramientas desconectadas.",
    },
    pricing: {
      eyebrow: "PUNTOS DE INICIO",
      title: "Comience con lo que más mejorará su negocio",
      body: "Elija un servicio o combine soluciones en un sistema empresarial conectado.",
      starting: "Desde",
      perfect: "Ideal para",
      cta: "Reservar una Consulta",
      view: "Ver Todos los Precios",
      cards: [
        ["Sitio Web Profesional", "web-basic", "Empresas que necesitan credibilidad y mejor captura de prospectos."],
        ["CRM y Operaciones", "crm-basic", "Equipos que necesitan organización, seguimiento y visibilidad."],
        ["Automatización e IA", "ai-simple", "Empresas listas para reducir trabajo repetitivo y responder más rápido."],
      ],
    },
    process: {
      eyebrow: "QUÉ SUCEDE DESPUÉS",
      title: "Un camino simple desde la consulta hasta el lanzamiento",
      items: [
        ["1. Descubrimiento", "Revisamos sus herramientas, desafíos y prioridades."],
        ["2. Plan", "Recomendamos qué mantener, conectar o cambiar."],
        ["3. Propuesta", "Recibe alcance, precio, software y tiempo."],
        ["4. Implementación", "Configuramos, probamos, lanzamos y apoyamos el sistema."],
      ],
    },
    final: {
      title: "¿Listo para Simplificar su Negocio?",
      body: "Deje de administrar software desconectado. Construyamos un sistema alrededor de la forma en que trabaja su empresa.",
      button: "Reservar su Consulta",
    },
  },
} as const;

const solutionIcons = [Users, MessageSquareText, Workflow, BarChart3];
const industryIcons = [ReceiptText, HeartPulse, Home, Construction];
const whyIcons = [Layers3, CircleDollarSign, Network, ShieldCheck];

function SectionTitle({ eyebrow, title, body, icon: Icon }: { eyebrow: string; title: string; body?: string; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">
        {Icon ? <Icon size={17} className="text-vx-cyan" /> : null}
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">{title}</h2>
      {body ? <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted sm:text-lg">{body}</p> : null}
    </div>
  );
}

function DashboardVisual({ title, body, labels, disclaimer }: { title: string; body: string; labels: readonly string[]; disclaimer: string }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 text-center">
        <p className="text-xl font-bold text-vx-ink sm:text-2xl">{title}</p>
        <p className="mt-2 text-sm text-vx-muted sm:text-base">{body}</p>
      </div>
      <div className="overflow-hidden rounded-[1.6rem] border border-vx-line bg-[#080b1b] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-vx-line px-5 py-4">
          <div className="flex gap-2"><span className="h-2.5 w-2.5 rounded-full bg-vx-blue"/><span className="h-2.5 w-2.5 rounded-full bg-vx-muted/50"/><span className="h-2.5 w-2.5 rounded-full bg-vx-muted/30"/></div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-vx-muted">Connected overview</span>
        </div>
        <div className="grid min-h-[340px] md:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-vx-line p-4 md:block">
            {labels.map((item, index) => <div key={item} className={`mb-1 rounded-lg px-3 py-2.5 text-xs ${index === 0 ? "bg-vx-blue/15 text-vx-cyan" : "text-vx-muted"}`}>{item}</div>)}
          </aside>
          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {labels.map((label, index) => (
                <div key={label} className="rounded-xl border border-vx-line bg-vx-bg2 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-vx-silver"><Check size={15} className="text-vx-cyan" />{label}</div>
                  <div className="mt-4 h-2 rounded bg-vx-blue/15"><div className="h-full rounded bg-vx-blue/70" style={{ width: `${48 + index * 7}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-xl border border-vx-line bg-vx-bg2 p-5">
                <div className="flex items-center justify-between"><p className="font-semibold">Customer journey</p><span className="text-xs text-vx-cyan">Connected</span></div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Inquiry","Assigned"],["Appointment","Scheduled"],["Invoice","Sent"],["Follow-up","Automated"]].map(([a,b]) => <div key={a} className="flex items-center justify-between rounded-lg bg-vx-bg3 px-4 py-3 text-sm"><span>{a}</span><span className="text-vx-cyan">{b}</span></div>)}</div>
              </div>
              <div className="rounded-xl border border-vx-line bg-vx-bg2 p-5">
                <p className="font-semibold">Live visibility</p>
                <div className="mt-5 space-y-4">{["Pipeline","Team activity","Payments","Workflows"].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-vx-muted"><BarChart3 size={16} className="text-vx-cyan" />{item}</div>)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-vx-muted">{disclaimer}</p>
    </div>
  );
}

export default function HomeExperience() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <>
      <section id="home" className="relative overflow-hidden pb-14 pt-[118px] sm:pb-20 sm:pt-[145px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[560px] max-w-6xl bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.17),transparent_68%)]" />
        <Container>
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-vx-cyan">{c.hero.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.04] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{c.hero.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-vx-muted sm:text-xl sm:leading-8">{c.hero.body}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={openConsultation} size="lg">{c.hero.primary}<ArrowRight size={18}/></Button>
              <Button href="#workflow" variant="secondary" size="lg">{c.hero.secondary}</Button>
            </div>
          </div>
          <div className="mt-11 sm:mt-14"><DashboardVisual {...c.dashboard}/></div>
        </Container>
      </section>

      <section id="solutions" className="border-y border-vx-line bg-vx-bg2/35 py-14 sm:py-20">
        <Container>
          <SectionTitle eyebrow={c.solutions.eyebrow} title={c.solutions.title} icon={Network}/>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {c.solutions.items.map(([title, body], index) => { const Icon = solutionIcons[index] ?? Users; return <article key={title} className="rounded-2xl border border-vx-line bg-vx-bg p-6"><Icon size={23} className="text-vx-cyan"/><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p></article>; })}
          </div>
        </Container>
      </section>

      <section id="workflow" className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <SectionTitle eyebrow={c.comparison.eyebrow} title={c.comparison.title} icon={Layers3}/>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-red-400/15 bg-red-400/[0.035] p-6"><h3 className="flex items-center gap-2 font-bold"><X size={18} className="text-red-300"/>{c.comparison.leftTitle}</h3><ul className="mt-5 space-y-3">{c.comparison.left.map(item=><li key={item} className="flex items-start gap-3 text-sm text-vx-muted"><X size={14} className="mt-0.5 shrink-0 text-red-300/70"/>{item}</li>)}</ul></article>
                <article className="rounded-2xl border border-vx-blue/35 bg-vx-blue/[0.06] p-6"><h3 className="flex items-center gap-2 font-bold"><Check size={18} className="text-vx-cyan"/>{c.comparison.rightTitle}</h3><ul className="mt-5 space-y-3">{c.comparison.right.map(item=><li key={item} className="flex items-start gap-3 text-sm text-vx-silver"><Check size={14} className="mt-0.5 shrink-0 text-vx-cyan"/>{item}</li>)}</ul></article>
              </div>
              <div className="mt-7 text-center lg:text-left"><Button onClick={openConsultation}>{c.comparison.cta}<ArrowRight size={17}/></Button></div>
            </div>
            <div className="rounded-[1.75rem] border border-vx-line bg-vx-bg2/60 p-6 sm:p-8">
              <div className="text-center lg:text-left"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.workflow.eyebrow}</p><h2 className="mt-3 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">{c.workflow.title}</h2></div>
              <div className="mt-7 space-y-3">
                {c.workflow.steps.map((step, index) => <div key={step} className="flex items-center gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-vx-blue/40 bg-vx-blue/10 font-mono text-xs text-vx-cyan">{index + 1}</span><div className="flex-1 rounded-xl border border-vx-line bg-vx-bg px-4 py-3 font-semibold">{step}</div>{index < c.workflow.steps.length - 1 ? <ArrowDown size={15} className="hidden text-vx-blue sm:block"/> : null}</div>)}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="industries" className="border-y border-vx-line bg-vx-bg2/35 py-14 sm:py-20">
        <Container>
          <SectionTitle eyebrow={c.industries.eyebrow} title={c.industries.title} body={c.industries.body} icon={Building2}/>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {c.industries.items.map(([title, bullets], index) => { const Icon = industryIcons[index] ?? Building2; return <article key={title as string} className="rounded-2xl border border-vx-line bg-vx-bg p-6"><Icon size={23} className="text-vx-cyan"/><h3 className="mt-5 text-lg font-bold">{title}</h3><ul className="mt-4 space-y-2">{(bullets as readonly string[]).map(item=><li key={item} className="flex items-start gap-2 text-sm text-vx-muted"><Check size={14} className="mt-1 shrink-0 text-vx-cyan"/>{item}</li>)}</ul></article>; })}
          </div>
          <div className="mt-7 text-center"><Button href="/industries" variant="secondary">{c.industries.cta}<ArrowRight size={17}/></Button></div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <SectionTitle eyebrow={c.why.eyebrow} title={c.why.title} icon={ShieldCheck}/>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {c.why.items.map(([title, body], index) => { const Icon = whyIcons[index] ?? ShieldCheck; return <article key={title} className="rounded-2xl border border-vx-line bg-vx-bg2/60 p-6"><Icon size={22} className="text-vx-cyan"/><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-vx-muted">{body}</p></article>; })}
          </div>
          <div className="mx-auto mt-7 max-w-4xl rounded-2xl border border-vx-blue/25 bg-vx-blue/[0.05] px-6 py-5 text-center text-sm font-semibold leading-6 text-vx-silver">{c.why.fit}</div>
        </Container>
      </section>

      <section id="pricing" className="border-y border-vx-line bg-vx-bg2/35 py-14 sm:py-20">
        <Container>
          <SectionTitle eyebrow={c.pricing.eyebrow} title={c.pricing.title} body={c.pricing.body} icon={CircleDollarSign}/>
          <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-3">
            {c.pricing.cards.map(([name, tierId, perfect]) => { const tier = DIRECT_PRICING.find(t => t.id === tierId); return <article key={name} className="flex h-full flex-col rounded-2xl border border-vx-line bg-vx-bg p-6"><h3 className="text-xl font-extrabold">{name}</h3><p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-vx-muted">{c.pricing.starting}</p><p className="mt-2 text-3xl font-extrabold text-vx-cyan">{tier?.price ?? "Custom"}</p><div className="mt-5 flex-1 rounded-xl bg-vx-bg3 p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-vx-blue">{c.pricing.perfect}</p><p className="mt-2 text-sm leading-6 text-vx-muted">{perfect}</p></div><Button onClick={openConsultation} className="mt-6" fullWidth>{c.pricing.cta}</Button></article>; })}
          </div>
          <div className="mt-7 text-center"><Button href="/pricing" variant="secondary">{c.pricing.view}<ArrowRight size={17}/></Button></div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <SectionTitle eyebrow={c.process.eyebrow} title={c.process.title} icon={Sparkles}/>
          <ol className="mx-auto mt-9 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">{c.process.items.map(([title, body])=><li key={title} className="rounded-2xl border border-vx-line bg-vx-bg2/60 p-6"><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p></li>)}</ol>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="rounded-[2rem] border border-vx-blue/30 bg-[linear-gradient(135deg,rgba(14,165,233,0.13),rgba(11,15,35,0.95))] px-6 py-11 text-center sm:px-10 sm:py-14">
            <h2 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl">{c.final.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted sm:text-lg">{c.final.body}</p>
            <div className="mt-7"><Button onClick={openConsultation} size="lg">{c.final.button}<ArrowRight size={18}/></Button></div>
          </div>
        </Container>
      </section>
    </>
  );
}
