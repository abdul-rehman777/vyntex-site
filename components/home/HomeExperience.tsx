"use client";

import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CreditCard,
  MessageSquareText,
  Network,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { openConsultation } from "@/components/BookConsultation";

const copy = {
  en: {
    hero: {
      eyebrow: "CONNECTED BUSINESS SYSTEMS",
      title: "One Connected System for Your Entire Business",
      body: "Vyntex connects your CRM, customer communication, scheduling, payments, automation, websites, marketing, and reporting so your business runs from one organized system.",
      primary: "Book a Consultation",
      secondary: "View Services",
    },
    dashboard: {
      title: "Your Business, Connected",
      body: "See customers, appointments, messages, payments, tasks, and performance in one clear view.",
      labels: ["CRM", "Appointments", "Messages", "Automation", "Payments", "Reports"],
      note: "Illustrative dashboard preview",
    },
    offer: {
      eyebrow: "WHAT WE DO",
      title: "We connect the tools your business needs to operate and grow.",
      body: "Start with one service or let Vyntex build a complete connected system around your workflow.",
      items: [
        ["CRM & Operations", "Organize customers, leads, appointments, tasks, files, and team activity."],
        ["Automation & Communication", "Automate follow-up, reminders, intake, messages, and routine updates."],
        ["Web, Marketing & AI", "Capture leads, improve your online presence, and add practical AI where it helps."],
      ],
      cta: "Explore Services",
    },
    difference: {
      eyebrow: "WHY VYNTEX",
      title: "Less software. Less manual work. More control.",
      before: "Without Vyntex",
      after: "With Vyntex",
      beforeItems: ["Disconnected tools", "Manual follow-up", "Scattered customer information"],
      afterItems: ["One connected workflow", "Automated communication", "Clear business visibility"],
    },
    process: {
      eyebrow: "HOW IT WORKS",
      title: "A simple path from scattered tools to one organized system.",
      items: [
        ["1", "Review", "We learn how your business works today."],
        ["2", "Plan", "We identify what should connect, improve, or change."],
        ["3", "Build", "We configure, test, and launch your system."],
      ],
    },
    industries: {
      eyebrow: "BUILT FOR SERVICE BUSINESSES",
      title: "Flexible enough for the way your business actually works.",
      items: ["Accounting & Tax", "Medical Offices", "Home Services", "Construction", "Professional Services", "Financial Services"],
      cta: "View Industries",
    },
    final: {
      title: "Ready to Simplify Your Business?",
      body: "Let’s replace disconnected tools and manual work with one connected business system.",
      button: "Book Your Consultation",
    },
  },
  es: {
    hero: {
      eyebrow: "SISTEMAS EMPRESARIALES CONECTADOS",
      title: "Un Sistema Conectado para Todo su Negocio",
      body: "Vyntex conecta su CRM, comunicación con clientes, citas, pagos, automatización, sitios web, marketing y reportes para operar desde un sistema organizado.",
      primary: "Reservar una Consulta",
      secondary: "Ver Servicios",
    },
    dashboard: {
      title: "Su Negocio, Conectado",
      body: "Vea clientes, citas, mensajes, pagos, tareas y rendimiento en una sola vista.",
      labels: ["CRM", "Citas", "Mensajes", "Automatización", "Pagos", "Reportes"],
      note: "Vista ilustrativa del panel",
    },
    offer: {
      eyebrow: "LO QUE HACEMOS",
      title: "Conectamos las herramientas que su negocio necesita para operar y crecer.",
      body: "Comience con un servicio o permita que Vyntex cree un sistema completo alrededor de su flujo de trabajo.",
      items: [
        ["CRM y Operaciones", "Organice clientes, prospectos, citas, tareas, archivos y actividad del equipo."],
        ["Automatización y Comunicación", "Automatice seguimiento, recordatorios, admisión, mensajes y actualizaciones."],
        ["Web, Marketing e IA", "Capture prospectos, mejore su presencia digital y use IA de forma práctica."],
      ],
      cta: "Explorar Servicios",
    },
    difference: {
      eyebrow: "POR QUÉ VYNTEX",
      title: "Menos software. Menos trabajo manual. Más control.",
      before: "Sin Vyntex",
      after: "Con Vyntex",
      beforeItems: ["Herramientas desconectadas", "Seguimiento manual", "Información dispersa"],
      afterItems: ["Un flujo conectado", "Comunicación automatizada", "Visibilidad clara del negocio"],
    },
    process: {
      eyebrow: "CÓMO FUNCIONA",
      title: "Un camino simple de herramientas dispersas a un sistema organizado.",
      items: [
        ["1", "Revisión", "Conocemos cómo funciona su negocio hoy."],
        ["2", "Plan", "Definimos qué conectar, mejorar o cambiar."],
        ["3", "Implementación", "Configuramos, probamos y lanzamos su sistema."],
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
      body: "Reemplacemos herramientas desconectadas y trabajo manual con un sistema empresarial conectado.",
      button: "Reservar su Consulta",
    },
  },
} as const;

const serviceIcons = [Users, Workflow, Sparkles] as const;
const dashboardIcons = [Users, CalendarDays, MessageSquareText, Workflow, CreditCard, BarChart3] as const;

function Dashboard({ title, body, labels, note }: { title: string; body: string; labels: readonly string[]; note: string }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-[1.75rem] border border-vx-line bg-vx-bg2 shadow-vx-glow-sm">
        <div className="flex items-center justify-between border-b border-vx-line px-5 py-4 sm:px-7">
          <div>
            <p className="font-semibold text-vx-ink">{title}</p>
            <p className="mt-1 text-xs text-vx-muted sm:text-sm">{body}</p>
          </div>
          <span className="hidden rounded-full border border-vx-blue/25 bg-vx-blue/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-vx-cyan sm:inline">Live overview</span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {labels.map((label, index) => {
            const Icon = dashboardIcons[index] ?? Network;
            return (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-vx-line bg-vx-bg px-4 py-4">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-vx-blue/10 text-vx-cyan"><Icon size={18}/></span>
                <span className="font-semibold text-vx-silver">{label}</span>
                <Check size={15} className="ml-auto text-vx-cyan"/>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-vx-muted">{note}</p>
    </div>
  );
}

export default function HomeExperience() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <>
      <section id="home" className="relative overflow-hidden pb-14 pt-[118px] sm:pb-18 sm:pt-[138px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[520px] max-w-6xl bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.18),transparent_68%)]"/>
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-vx-cyan">{c.hero.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.03] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{c.hero.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-vx-muted sm:text-xl sm:leading-8">{c.hero.body}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={openConsultation} size="lg">{c.hero.primary}<ArrowRight size={18}/></Button>
              <Button href="/services" variant="secondary" size="lg">{c.hero.secondary}</Button>
            </div>
          </div>
          <div className="mt-10 sm:mt-12"><Dashboard {...c.dashboard}/></div>
        </Container>
      </section>

      <section id="services" className="border-y border-vx-line bg-vx-bg2/35 py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.offer.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.offer.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">{c.offer.body}</p>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {c.offer.items.map(([title, body], index) => {
              const Icon = serviceIcons[index] ?? Network;
              return (
                <article key={title} className="rounded-2xl border border-vx-line bg-vx-bg p-6 sm:p-7">
                  <Icon size={23} className="text-vx-cyan"/>
                  <h3 className="mt-5 text-xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p>
                </article>
              );
            })}
          </div>
          <div className="mt-7 text-center"><Button href="/services" variant="secondary">{c.offer.cta}<ArrowRight size={17}/></Button></div>
        </Container>
      </section>

      <section className="py-14 sm:py-18">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.difference.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.difference.title}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-red-400/15 bg-red-400/[0.03] p-6">
                <h3 className="font-bold text-vx-silver">{c.difference.before}</h3>
                <ul className="mt-5 space-y-3">{c.difference.beforeItems.map(item=><li key={item} className="flex items-center gap-3 text-sm text-vx-muted"><span className="h-1.5 w-1.5 rounded-full bg-red-300/70"/>{item}</li>)}</ul>
              </article>
              <article className="rounded-2xl border border-vx-blue/30 bg-vx-blue/[0.06] p-6">
                <h3 className="font-bold text-vx-ink">{c.difference.after}</h3>
                <ul className="mt-5 space-y-3">{c.difference.afterItems.map(item=><li key={item} className="flex items-center gap-3 text-sm text-vx-silver"><Check size={15} className="text-vx-cyan"/>{item}</li>)}</ul>
              </article>
            </div>
          </div>
        </Container>
      </section>

      <section id="process" className="border-y border-vx-line bg-vx-bg2/35 py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.process.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.process.title}</h2>
          </div>
          <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-3">
            {c.process.items.map(([number, title, body]) => (
              <article key={number} className="rounded-2xl border border-vx-line bg-vx-bg p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-vx-blue/10 font-mono text-sm font-bold text-vx-cyan">{number}</span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="industries" className="py-14 sm:py-18">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-cyan">{c.industries.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.industries.title}</h2>
              <div className="mt-7"><Button href="/industries" variant="secondary">{c.industries.cta}<ArrowRight size={17}/></Button></div>
            </div>
            <div className="flex flex-wrap gap-3">
              {c.industries.items.map(item=><span key={item} className="rounded-full border border-vx-line bg-vx-bg2 px-4 py-3 text-sm font-semibold text-vx-silver">{item}</span>)}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-vx-line bg-vx-bg2/50 py-14 sm:py-18">
        <Container>
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-vx-blue/25 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,.12),transparent_42%),rgba(14,165,233,.05)] px-6 py-12 text-center sm:px-10 sm:py-14">
            <h2 className="text-3xl font-bold tracking-[-0.04em] sm:text-5xl">{c.final.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted sm:text-lg">{c.final.body}</p>
            <div className="mt-7"><Button onClick={openConsultation} size="lg">{c.final.button}<ArrowRight size={18}/></Button></div>
          </div>
        </Container>
      </section>
    </>
  );
}
