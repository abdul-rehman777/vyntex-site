"use client";

import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleDollarSign,
  ClipboardList,
  Construction,
  HeartPulse,
  Home,
  Landmark,
  Layers3,
  MessageSquareText,
  Network,
  ReceiptText,
  Scale,
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
      title: "One Connected Business System",
      body: "Connect your CRM, customer communication, automation, marketing, scheduling, and operations into one organized business solution.",
      primary: "Book Consultation",
      secondary: "See How It Works",
    },
    dashboard: {
      title: "Your Business Dashboard",
      body: "Everything your business needs, connected in one place.",
      labels: ["CRM", "Appointments", "Automation", "Messages", "Payments", "Reports"],
      disclaimer: "Illustrative dashboard preview. Data shown is for demonstration purposes.",
    },
    what: {
      eyebrow: "WHAT VYNTEX DOES",
      title: "Technology that works together",
      body: "Vyntex connects the systems your business uses every day, then configures the workflows around how your team actually works.",
      items: [
        ["Manage Customers", "CRM, records, appointments, tasks, files, and payment activity."],
        ["Communicate Clearly", "Email, text messages, forms, reminders, and conversation history."],
        ["Automate Work", "Lead routing, follow-up, intake, notifications, and routine updates."],
        ["See Performance", "Pipeline, team activity, payments, customer activity, and reporting."],
      ],
    },
    comparison: {
      eyebrow: "SIMPLIFY YOUR OPERATIONS",
      title: "Replace Disconnected Tools With One Connected System",
      leftTitle: "Instead of using",
      rightTitle: "Use Vyntex",
      left: ["Multiple CRM systems", "Separate email software", "Separate SMS platform", "Separate scheduling tool", "Separate automation software", "Separate client portal", "Separate reporting tool"],
      right: ["One connected CRM", "Built-in communication", "Smart automation", "Scheduling and reminders", "Client portal", "Payments and invoices", "Reporting dashboard"],
      cta: "Simplify Your Business",
    },
    workflow: {
      eyebrow: "ONE CONNECTED WORKFLOW",
      title: "See how work moves through your business",
      steps: ["Website Form", "Lead Created", "Automatic Text", "Appointment Booked", "Invoice Sent", "Customer Portal", "Automation", "Reporting"],
    },
    industries: {
      eyebrow: "INDUSTRY SOLUTIONS",
      title: "Built around the way your business works",
      body: "See the systems and workflows Vyntex can configure for businesses like yours.",
      items: [
        ["Accounting Firms", ["Client onboarding", "Appointment reminders", "Document collection", "Pipeline tracking", "Invoices and follow-up"]],
        ["Medical Offices", ["Appointment reminders", "Patient communication", "Lead tracking", "Follow-up automation", "Internal tasks"]],
        ["Home Services", ["Lead capture", "Estimates and invoices", "Job scheduling", "Customer reminders", "Review requests"]],
        ["Construction", ["Project inquiries", "Client follow-up", "Estimate tracking", "Scheduling", "Reporting"]],
        ["Legal & Professional", ["Client intake", "Appointment scheduling", "Document collection", "CRM tracking", "Automated follow-up"]],
        ["Insurance & Financial", ["Lead management", "Service reminders", "Customer communication", "Pipeline tracking", "Reporting"]],
      ],
      cta: "View All Industries",
    },
    why: {
      eyebrow: "WHY VYNTEX",
      title: "Why Businesses Choose Vyntex",
      items: [
        ["One Partner", "No juggling multiple vendors."],
        ["One Connected System", "Everything works together."],
        ["Built Around Your Business", "No cookie-cutter templates."],
        ["Transparent Pricing", "Clear scope and no hidden surprises."],
        ["Ongoing Support", "Real people and practical support."],
      ],
    },
    fit: {
      eyebrow: "IS VYNTEX RIGHT FOR YOU?",
      title: "A strong fit for businesses ready to operate better",
      perfectTitle: "Perfect if you",
      notTitle: "Not ideal if you",
      perfect: ["Manage customers daily", "Need automation", "Want fewer software subscriptions", "Have multiple employees", "Need better organization", "Need CRM and customer communication", "Need online scheduling", "Need reporting"],
      not: ["Only need a basic website", "Are not ready to automate", "Do not want a CRM", "Want a one-time design with no systems strategy"],
      note: "If your business feels scattered, Vyntex is built to bring everything together.",
    },
    pricing: {
      eyebrow: "PRICING",
      title: "Choose the right starting point",
      body: "Start with one focused solution or combine services into a complete connected system.",
      starting: "Starting at",
      perfect: "Perfect for",
      cta: "Book Consultation",
      view: "View Full Pricing",
      cards: [
        ["Website Package", "web-basic", "Small businesses that need a professional online presence."],
        ["CRM Package", "crm-basic", "Growing teams that need better organization and follow-up."],
        ["Automation Package", "ai-simple", "Businesses that want to save time and reduce manual work."],
        ["Complete Business System", "crm-custom", "Multi-location or scaling businesses that need everything connected."],
      ],
    },
    process: {
      eyebrow: "WHAT HAPPENS NEXT",
      title: "A clear path from consultation to launch",
      items: [
        ["Discovery", "We review your tools, challenges, and priorities."],
        ["Solution Plan", "We map what should stay, connect, or be replaced."],
        ["Proposal", "You receive scope, pricing, requirements, and timeline."],
        ["Implementation", "We configure, test, launch, and support the system."],
      ],
    },
    final: {
      title: "Ready to Simplify Your Business?",
      body: "Stop managing disconnected software. Let’s build a connected business system around your company.",
      button: "Book Your Consultation",
    },
  },
  es: {
    hero: {
      title: "Un Sistema Empresarial Conectado",
      body: "Conecte su CRM, comunicación, automatización, marketing, citas y operaciones en una sola solución empresarial organizada.",
      primary: "Reservar Consulta",
      secondary: "Ver Cómo Funciona",
    },
    dashboard: {
      title: "El Panel de su Negocio",
      body: "Todo lo que su empresa necesita, conectado en un solo lugar.",
      labels: ["CRM", "Citas", "Automatización", "Mensajes", "Pagos", "Reportes"],
      disclaimer: "Vista ilustrativa del panel. Los datos se muestran únicamente con fines de demostración.",
    },
    what: {
      eyebrow: "QUÉ HACE VYNTEX",
      title: "Tecnología que trabaja en conjunto",
      body: "Vyntex conecta los sistemas que su negocio usa cada día y configura los flujos según la forma real de trabajar de su equipo.",
      items: [
        ["Administrar Clientes", "CRM, registros, citas, tareas, archivos y actividad de pagos."],
        ["Comunicar con Claridad", "Correo, mensajes, formularios, recordatorios e historial."],
        ["Automatizar el Trabajo", "Asignación, seguimiento, admisión, notificaciones y actualizaciones."],
        ["Ver el Rendimiento", "Pipeline, actividad del equipo, pagos, clientes y reportes."],
      ],
    },
    comparison: {
      eyebrow: "SIMPLIFIQUE SUS OPERACIONES",
      title: "Reemplace Herramientas Desconectadas con un Sistema Conectado",
      leftTitle: "En vez de usar",
      rightTitle: "Use Vyntex",
      left: ["Varios sistemas CRM", "Correo separado", "Plataforma SMS separada", "Herramienta de citas separada", "Automatización separada", "Portal separado", "Reportes separados"],
      right: ["Un CRM conectado", "Comunicación integrada", "Automatización inteligente", "Citas y recordatorios", "Portal de clientes", "Pagos y facturas", "Panel de reportes"],
      cta: "Simplificar mi Negocio",
    },
    workflow: {
      eyebrow: "UN FLUJO CONECTADO",
      title: "Vea cómo el trabajo avanza por su negocio",
      steps: ["Formulario Web", "Prospecto Creado", "Texto Automático", "Cita Reservada", "Factura Enviada", "Portal del Cliente", "Automatización", "Reportes"],
    },
    industries: {
      eyebrow: "SOLUCIONES POR INDUSTRIA",
      title: "Creado alrededor de la forma en que trabaja su negocio",
      body: "Vea los sistemas y flujos que Vyntex puede configurar para empresas como la suya.",
      items: [
        ["Firmas Contables", ["Admisión de clientes", "Recordatorios", "Documentos", "Pipeline", "Facturas y seguimiento"]],
        ["Oficinas Médicas", ["Recordatorios de citas", "Comunicación", "Seguimiento", "Automatización", "Tareas internas"]],
        ["Servicios del Hogar", ["Captura de prospectos", "Estimados y facturas", "Programación", "Recordatorios", "Reseñas"]],
        ["Construcción", ["Consultas de proyectos", "Seguimiento", "Estimados", "Programación", "Reportes"]],
        ["Servicios Legales", ["Admisión", "Citas", "Documentos", "CRM", "Seguimiento automático"]],
        ["Seguros y Finanzas", ["Prospectos", "Recordatorios", "Comunicación", "Pipeline", "Reportes"]],
      ],
      cta: "Ver Todas las Industrias",
    },
    why: {
      eyebrow: "POR QUÉ VYNTEX",
      title: "Por Qué las Empresas Eligen Vyntex",
      items: [
        ["Un Solo Socio", "Sin coordinar múltiples proveedores."],
        ["Un Sistema Conectado", "Todo trabaja en conjunto."],
        ["Creado para su Negocio", "Sin plantillas genéricas."],
        ["Precios Transparentes", "Alcance claro y sin sorpresas."],
        ["Apoyo Continuo", "Personas reales y apoyo práctico."],
      ],
    },
    fit: {
      eyebrow: "¿VYNTEX ES PARA USTED?",
      title: "Ideal para empresas listas para operar mejor",
      perfectTitle: "Ideal si usted",
      notTitle: "No es ideal si usted",
      perfect: ["Administra clientes diariamente", "Necesita automatización", "Quiere menos suscripciones", "Tiene varios empleados", "Necesita organización", "Necesita CRM y comunicación", "Necesita citas en línea", "Necesita reportes"],
      not: ["Solo necesita un sitio básico", "No está listo para automatizar", "No desea un CRM", "Busca un diseño único sin estrategia de sistemas"],
      note: "Si su negocio se siente disperso, Vyntex está diseñado para conectarlo todo.",
    },
    pricing: {
      eyebrow: "PRECIOS",
      title: "Elija el punto de inicio correcto",
      body: "Comience con una solución o combine servicios en un sistema conectado completo.",
      starting: "Desde",
      perfect: "Ideal para",
      cta: "Reservar Consulta",
      view: "Ver Todos los Precios",
      cards: [
        ["Paquete de Sitio Web", "web-basic", "Pequeñas empresas que necesitan una presencia profesional."],
        ["Paquete CRM", "crm-basic", "Equipos en crecimiento que necesitan organización y seguimiento."],
        ["Paquete de Automatización", "ai-simple", "Empresas que desean ahorrar tiempo y reducir trabajo manual."],
        ["Sistema Empresarial Completo", "crm-custom", "Empresas con varias ubicaciones o en crecimiento."],
      ],
    },
    process: {
      eyebrow: "QUÉ SUCEDE DESPUÉS",
      title: "Un camino claro desde la consulta hasta el lanzamiento",
      items: [
        ["Descubrimiento", "Revisamos sus herramientas, desafíos y prioridades."],
        ["Plan de Solución", "Definimos qué debe mantenerse, conectarse o reemplazarse."],
        ["Propuesta", "Recibe alcance, precio, requisitos y tiempo."],
        ["Implementación", "Configuramos, probamos, lanzamos y apoyamos el sistema."],
      ],
    },
    final: {
      title: "¿Listo para Simplificar su Negocio?",
      body: "Deje de administrar software desconectado. Construyamos un sistema conectado alrededor de su empresa.",
      button: "Reservar su Consulta",
    },
  },
} as const;

const solutionIcons = [Users, MessageSquareText, Workflow, BarChart3];
const industryIcons = [ReceiptText, HeartPulse, Home, Construction, Scale, Landmark];
const whyIcons = [BriefcaseBusiness, Network, Layers3, CircleDollarSign, ShieldCheck];

function SectionTitle({ eyebrow, title, body, icon: Icon }: { eyebrow: string; title: string; body?: string; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">
        {Icon ? <Icon size={17} className="text-vx-cyan" /> : null}
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">{title}</h2>
      {body ? <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-vx-muted sm:text-lg">{body}</p> : null}
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
        <div className="grid min-h-[380px] md:grid-cols-[190px_1fr]">
          <aside className="hidden border-r border-vx-line p-4 md:block">
            {labels.map((item, index) => <div key={item} className={`mb-1 rounded-lg px-3 py-2.5 text-xs ${index === 0 ? "bg-vx-blue/15 text-vx-cyan" : "text-vx-muted"}`}>{item}</div>)}
          </aside>
          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {labels.map((label, index) => (
                <div key={label} className="rounded-xl border border-vx-line bg-vx-bg2 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-vx-silver"><Check size={15} className="text-vx-cyan" />{label}</div>
                  <div className="mt-4 h-2 rounded bg-vx-blue/15"><div className="h-full rounded bg-vx-blue/70" style={{ width: `${42 + index * 8}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-xl border border-vx-line bg-vx-bg2 p-5">
                <div className="flex items-center justify-between"><p className="font-semibold">Customer activity</p><span className="text-xs text-vx-cyan">Connected</span></div>
                <div className="mt-4 space-y-3">{[["New inquiry","Assigned"],["Appointment","Scheduled"],["Invoice","Sent"],["Follow-up","Automated"]].map(([a,b]) => <div key={a} className="flex items-center justify-between rounded-lg bg-vx-bg3 px-4 py-3 text-sm"><span>{a}</span><span className="text-vx-cyan">{b}</span></div>)}</div>
              </div>
              <div className="rounded-xl border border-vx-line bg-vx-bg2 p-5">
                <p className="font-semibold">Business snapshot</p>
                <div className="mt-5 space-y-4">{["Pipeline visibility","Team activity","Payment status","Workflow health"].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-vx-muted"><BarChart3 size={16} className="text-vx-cyan" />{item}</div>)}</div>
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
      <section id="home" className="relative overflow-hidden pb-16 pt-[120px] sm:pb-24 sm:pt-[150px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[600px] max-w-6xl bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.17),transparent_68%)]" />
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold leading-[1.04] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{c.hero.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-vx-muted sm:text-xl sm:leading-8">{c.hero.body}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={openConsultation} size="lg">{c.hero.primary}<ArrowRight size={18}/></Button>
              <Button href="#workflow" variant="secondary" size="lg">{c.hero.secondary}</Button>
            </div>
          </div>
          <div className="mt-12 sm:mt-16"><DashboardVisual {...c.dashboard}/></div>
        </Container>
      </section>

      <section id="solutions" className="border-y border-vx-line bg-vx-bg2/35 py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.what.eyebrow} title={c.what.title} body={c.what.body} icon={Network}/>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {c.what.items.map(([title, body], index) => { const Icon = solutionIcons[index] ?? Users; return <article key={title} className="rounded-2xl border border-vx-line bg-vx-bg p-6"><Icon size={23} className="text-vx-cyan"/><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p></article>; })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.comparison.eyebrow} title={c.comparison.title} icon={Layers3}/>
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-red-400/15 bg-red-400/[0.035] p-6 sm:p-8"><h3 className="flex items-center gap-2 text-xl font-bold"><X size={20} className="text-red-300"/>{c.comparison.leftTitle}</h3><ul className="mt-6 space-y-3">{c.comparison.left.map(item=><li key={item} className="flex items-center gap-3 text-sm text-vx-muted"><X size={15} className="shrink-0 text-red-300/70"/>{item}</li>)}</ul></article>
            <article className="rounded-2xl border border-vx-blue/35 bg-vx-blue/[0.06] p-6 sm:p-8"><h3 className="flex items-center gap-2 text-xl font-bold"><Check size={20} className="text-vx-cyan"/>{c.comparison.rightTitle}</h3><ul className="mt-6 space-y-3">{c.comparison.right.map(item=><li key={item} className="flex items-center gap-3 text-sm text-vx-silver"><Check size={15} className="shrink-0 text-vx-cyan"/>{item}</li>)}</ul></article>
          </div>
          <div className="mt-8 text-center"><Button onClick={openConsultation}>{c.comparison.cta}<ArrowRight size={17}/></Button></div>
        </Container>
      </section>

      <section id="workflow" className="border-y border-vx-line bg-vx-bg2/35 py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.workflow.eyebrow} title={c.workflow.title} icon={Workflow}/>
          <div className="mx-auto mt-10 max-w-4xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {c.workflow.steps.map((step, index) => <div key={step} className="relative rounded-2xl border border-vx-line bg-vx-bg p-5 text-center"><span className="font-mono text-xs text-vx-cyan">{String(index + 1).padStart(2,"0")}</span><p className="mt-3 font-bold">{step}</p>{index < c.workflow.steps.length - 1 ? <ArrowDown size={16} className="mx-auto mt-4 text-vx-blue lg:hidden"/> : null}</div>)}
            </div>
          </div>
        </Container>
      </section>

      <section id="industries" className="py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.industries.eyebrow} title={c.industries.title} body={c.industries.body} icon={Building2}/>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {c.industries.items.map(([title, bullets], index) => { const Icon = industryIcons[index] ?? Building2; return <article key={title as string} className="rounded-2xl border border-vx-line bg-vx-bg2/60 p-6"><Icon size={23} className="text-vx-cyan"/><h3 className="mt-5 text-xl font-bold">{title}</h3><ul className="mt-4 space-y-2">{(bullets as readonly string[]).map(item=><li key={item} className="flex items-start gap-2 text-sm text-vx-muted"><Check size={14} className="mt-1 shrink-0 text-vx-cyan"/>{item}</li>)}</ul></article>; })}
          </div>
          <div className="mt-8 text-center"><Button href="/industries" variant="secondary">{c.industries.cta}<ArrowRight size={17}/></Button></div>
        </Container>
      </section>

      <section className="border-y border-vx-line bg-vx-bg2/35 py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.why.eyebrow} title={c.why.title} icon={ShieldCheck}/>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {c.why.items.map(([title, body], index) => { const Icon = whyIcons[index] ?? ShieldCheck; return <article key={title} className="rounded-2xl border border-vx-line bg-vx-bg p-5"><Icon size={22} className="text-vx-cyan"/><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-vx-muted">{body}</p></article>; })}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.fit.eyebrow} title={c.fit.title} icon={ClipboardList}/>
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-vx-blue/30 bg-vx-blue/[0.05] p-6 sm:p-8"><h3 className="text-xl font-bold text-vx-cyan">{c.fit.perfectTitle}</h3><ul className="mt-5 grid gap-3 sm:grid-cols-2">{c.fit.perfect.map(item=><li key={item} className="flex items-start gap-2 text-sm"><Check size={15} className="mt-0.5 shrink-0 text-vx-cyan"/>{item}</li>)}</ul></article>
            <article className="rounded-2xl border border-vx-line bg-vx-bg2/60 p-6 sm:p-8"><h3 className="text-xl font-bold">{c.fit.notTitle}</h3><ul className="mt-5 space-y-3">{c.fit.not.map(item=><li key={item} className="flex items-start gap-2 text-sm text-vx-muted"><X size={15} className="mt-0.5 shrink-0"/>{item}</li>)}</ul></article>
          </div>
          <p className="mx-auto mt-7 max-w-3xl text-center text-lg font-semibold text-vx-silver">{c.fit.note}</p>
        </Container>
      </section>

      <section id="pricing" className="border-y border-vx-line bg-vx-bg2/35 py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.pricing.eyebrow} title={c.pricing.title} body={c.pricing.body} icon={CircleDollarSign}/>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {c.pricing.cards.map(([name, tierId, perfect]) => { const tier = DIRECT_PRICING.find(t => t.id === tierId); return <article key={name} className="flex h-full flex-col rounded-2xl border border-vx-line bg-vx-bg p-6"><h3 className="text-xl font-extrabold">{name}</h3><p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-vx-muted">{c.pricing.starting}</p><p className="mt-2 text-3xl font-extrabold text-vx-cyan">{tier?.price ?? "Custom"}</p><div className="mt-5 flex-1 rounded-xl bg-vx-bg3 p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-vx-blue">{c.pricing.perfect}</p><p className="mt-2 text-sm leading-6 text-vx-muted">{perfect}</p></div><Button onClick={openConsultation} className="mt-6" fullWidth>{c.pricing.cta}</Button></article>; })}
          </div>
          <div className="mt-8 text-center"><Button href="/pricing" variant="secondary">{c.pricing.view}<ArrowRight size={17}/></Button></div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <SectionTitle eyebrow={c.process.eyebrow} title={c.process.title} icon={Sparkles}/>
          <ol className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-4">{c.process.items.map(([title, body], index)=><li key={title} className="rounded-2xl border border-vx-line bg-vx-bg2/60 p-6"><span className="font-mono text-xs text-vx-cyan">{String(index+1).padStart(2,"0")}</span><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p></li>)}</ol>
        </Container>
      </section>

      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="rounded-[2rem] border border-vx-blue/30 bg-[linear-gradient(135deg,rgba(14,165,233,0.13),rgba(11,15,35,0.95))] px-6 py-12 text-center sm:px-10 sm:py-16">
            <h2 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl">{c.final.title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-vx-muted sm:text-lg">{c.final.body}</p>
            <div className="mt-8"><Button onClick={openConsultation} size="lg">{c.final.button}<ArrowRight size={18}/></Button></div>
          </div>
        </Container>
      </section>
    </>
  );
}
