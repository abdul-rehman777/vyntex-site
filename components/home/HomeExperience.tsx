"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock3,
  Database,
  FileText,
  Gauge,
  Inbox,
  Layers3,
  LineChart,
  MessageSquareText,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { DIRECT_PRICING } from "@/lib/pricing";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { openConsultation } from "@/components/BookConsultation";

const content = {
  en: {
    hero: {
      eyebrow: "ONE PLATFORM FOR DAILY BUSINESS OPERATIONS",
      title: "Run your entire business from one place.",
      body: "VYNTEX brings your CRM, customer communication, appointments, payments, marketing, automation, portals, reporting, and AI tools into one connected platform.",
      primary: "Book a Demo",
      secondary: "Explore the Platform",
      note: "Built for growing service businesses, teams, and multi-location operations.",
    },
    product: {
      eyebrow: "THE VYNTEX PLATFORM",
      title: "One clear workspace instead of disconnected software.",
      body: "See customers, conversations, appointments, tasks, payments, and performance without jumping between systems.",
    },
    what: {
      eyebrow: "WHAT IS VYNTEX?",
      title: "Your business operating system.",
      body: "VYNTEX centralizes the tools your team uses every day, then connects them with automation so work moves forward without constant manual follow-up.",
    },
    benefits: [
      { title: "Work from one source of truth", body: "Customer records, conversations, appointments, files, payments, and tasks stay connected." },
      { title: "Reduce repetitive work", body: "Automate follow-up, reminders, intake, routing, notifications, and routine updates." },
      { title: "Give everyone a better experience", body: "Create smoother journeys for customers, employees, managers, and partners." },
    ],
    outcomes: {
      eyebrow: "BUSINESS OUTCOMES",
      title: "Less software chaos. More control.",
      items: [
        "Respond to leads faster",
        "Stop losing customer information",
        "Reduce manual follow-up",
        "Keep teams aligned",
        "Make payments and appointments easier",
        "See what is happening across the business",
      ],
    },
    categories: {
      eyebrow: "CORE CAPABILITIES",
      title: "Everything is organized around four jobs.",
      items: [
        { title: "Manage Your Business", bullets: ["CRM and customer records", "Appointments and tasks", "Payments and documents", "Employee and customer portals"] },
        { title: "Communicate With Customers", bullets: ["Email and SMS", "Inbox and conversation history", "Forms and intake", "Automated reminders"] },
        { title: "Automate Your Work", bullets: ["Lead routing", "Follow-up sequences", "Internal notifications", "AI-assisted workflows"] },
        { title: "Grow With Insights", bullets: ["Dashboards and reports", "Pipeline visibility", "Performance trends", "Operational analytics"] },
      ],
    },
    walkthrough: {
      eyebrow: "PRODUCT WALKTHROUGH",
      title: "A connected workflow from first contact to completed service.",
      tabs: [
        { label: "Capture", title: "Capture every lead in one place", body: "Forms, calls, messages, and referrals create a complete customer record automatically." },
        { label: "Organize", title: "Move work through a clear process", body: "Assign owners, schedule appointments, collect documents, and track every next step." },
        { label: "Automate", title: "Let routine work happen automatically", body: "Send reminders, follow up, update statuses, and notify the right people without manual chasing." },
        { label: "Measure", title: "Understand what is working", body: "See pipeline, response time, appointments, revenue activity, and team performance from one dashboard." },
      ],
    },
    industries: {
      eyebrow: "INDUSTRY SOLUTIONS",
      title: "Flexible enough for the way your business works.",
      items: ["Professional Services", "Accounting & Tax", "Home Services", "Healthcare & Wellness", "Real Estate", "Restaurants & Retail"],
      cta: "View Industry Solutions",
    },
    integrations: {
      eyebrow: "INTEGRATIONS",
      title: "Connect the tools you already rely on.",
      body: "VYNTEX can connect with payment, email, calendar, accounting, form, communication, and productivity tools based on your workflow.",
      items: ["Square", "Google Workspace", "Microsoft 365", "QuickBooks", "Calendars", "Email & SMS"],
    },
    proof: {
      eyebrow: "TRUST WITHOUT THE THEATER",
      title: "Built around practical operations, not feature noise.",
      body: "We do not publish invented customer counts, fake logos, or unsupported results. Real case studies and testimonials will appear only after client approval.",
      cards: [
        { title: "Bilingual support", body: "English and Spanish service for teams and customers." },
        { title: "Clear implementation", body: "Defined scope, transparent pricing, testing, launch, and support." },
        { title: "Secure access", body: "Role-based portals, protected admin tools, and server-side secrets." },
      ],
    },
    pricing: {
      eyebrow: "PRICING PREVIEW",
      title: "Start with what your business needs now.",
      body: "Implementation is scoped around your workflow. Third-party software fees remain separate unless included in writing.",
      cards: [
        { name: "Website & Client Experience", tierId: "web-basic", note: "A professional website, lead capture, booking, and customer-ready experience." },
        { name: "Automation & AI Workflows", tierId: "ai-simple", note: "Automated follow-up, routing, reminders, and AI-assisted customer workflows." },
        { name: "CRM & Business Operations", tierId: "crm-basic", note: "A connected CRM, pipeline, workflows, reporting, and operational setup." },
      ],
      cta: "View Full Pricing",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Straight answers before you book a demo.",
      items: [
        ["Is VYNTEX one software platform?", "VYNTEX is a connected business management platform configured around your operations. Some capabilities may use integrated third-party services behind the scenes, but your team works through one organized experience."],
        ["Do I have to replace every tool I use?", "No. We first identify what should stay, what should be connected, and what should be replaced. The goal is less complexity, not disruption for its own sake."],
        ["Can VYNTEX work for a small business?", "Yes. The platform can start with a focused workflow and expand as your team, customers, and operational needs grow."],
        ["How long does implementation take?", "Timing depends on scope, integrations, data, and approvals. A clear implementation plan is provided before work begins."],
        ["Can customers and employees have separate portals?", "Yes. Portal access can be configured by role so customers, employees, partners, and administrators see only what they need."],
      ],
    },
    final: {
      title: "Replace disconnected tools with one clear system.",
      body: "See how VYNTEX can simplify your customer experience, team workflow, and daily operations.",
      primary: "Book a Demo",
      secondary: "Contact VYNTEX",
    },
  },
  es: {
    hero: {
      eyebrow: "UNA PLATAFORMA PARA LAS OPERACIONES DIARIAS",
      title: "Administra todo tu negocio desde un solo lugar.",
      body: "VYNTEX reúne CRM, comunicación con clientes, citas, pagos, marketing, automatización, portales, reportes y herramientas de IA en una plataforma conectada.",
      primary: "Reservar una Demostración",
      secondary: "Explorar la Plataforma",
      note: "Creado para empresas de servicios, equipos y operaciones con varias ubicaciones.",
    },
    product: {
      eyebrow: "LA PLATAFORMA VYNTEX",
      title: "Un espacio claro en vez de programas desconectados.",
      body: "Consulta clientes, conversaciones, citas, tareas, pagos y resultados sin cambiar constantemente de sistema.",
    },
    what: {
      eyebrow: "¿QUÉ ES VYNTEX?",
      title: "El sistema operativo de tu negocio.",
      body: "VYNTEX centraliza las herramientas que tu equipo usa cada día y las conecta con automatización para que el trabajo avance sin seguimiento manual constante.",
    },
    benefits: [
      { title: "Una sola fuente de información", body: "Clientes, conversaciones, citas, archivos, pagos y tareas permanecen conectados." },
      { title: "Menos trabajo repetitivo", body: "Automatiza seguimiento, recordatorios, formularios, asignaciones y actualizaciones." },
      { title: "Una mejor experiencia", body: "Crea procesos más simples para clientes, empleados, gerentes y socios." },
    ],
    outcomes: {
      eyebrow: "RESULTADOS DEL NEGOCIO",
      title: "Menos caos tecnológico. Más control.",
      items: ["Responder más rápido", "Evitar pérdida de información", "Reducir seguimiento manual", "Mantener al equipo alineado", "Facilitar pagos y citas", "Entender lo que ocurre en el negocio"],
    },
    categories: {
      eyebrow: "CAPACIDADES PRINCIPALES",
      title: "Todo está organizado alrededor de cuatro funciones.",
      items: [
        { title: "Administrar el Negocio", bullets: ["CRM y clientes", "Citas y tareas", "Pagos y documentos", "Portales para clientes y empleados"] },
        { title: "Comunicarse con Clientes", bullets: ["Correo y SMS", "Bandeja e historial", "Formularios", "Recordatorios automáticos"] },
        { title: "Automatizar el Trabajo", bullets: ["Asignación de prospectos", "Secuencias de seguimiento", "Notificaciones internas", "Flujos con IA"] },
        { title: "Crecer con Información", bullets: ["Paneles y reportes", "Visibilidad del pipeline", "Tendencias", "Analítica operativa"] },
      ],
    },
    walkthrough: {
      eyebrow: "RECORRIDO DEL PRODUCTO",
      title: "Un flujo conectado desde el primer contacto hasta el servicio completado.",
      tabs: [
        { label: "Capturar", title: "Captura cada prospecto", body: "Formularios, llamadas, mensajes y referidos crean un registro completo automáticamente." },
        { label: "Organizar", title: "Organiza el trabajo", body: "Asigna responsables, agenda citas, recopila documentos y controla cada próximo paso." },
        { label: "Automatizar", title: "Automatiza lo repetitivo", body: "Envía recordatorios, da seguimiento, actualiza estados y avisa a las personas correctas." },
        { label: "Medir", title: "Entiende lo que funciona", body: "Consulta pipeline, tiempos de respuesta, citas, actividad de ingresos y rendimiento del equipo." },
      ],
    },
    industries: { eyebrow: "SOLUCIONES POR INDUSTRIA", title: "Flexible para la forma en que trabaja tu empresa.", items: ["Servicios Profesionales", "Contabilidad e Impuestos", "Servicios para el Hogar", "Salud y Bienestar", "Bienes Raíces", "Restaurantes y Comercio"], cta: "Ver Soluciones por Industria" },
    integrations: { eyebrow: "INTEGRACIONES", title: "Conecta las herramientas que ya utilizas.", body: "VYNTEX puede conectarse con herramientas de pagos, correo, calendarios, contabilidad, formularios, comunicación y productividad según tu flujo.", items: ["Square", "Google Workspace", "Microsoft 365", "QuickBooks", "Calendarios", "Correo y SMS"] },
    proof: { eyebrow: "CONFIANZA SIN EXAGERACIONES", title: "Creado para operaciones reales, no para mostrar funciones sin contexto.", body: "No publicamos cifras inventadas, logos falsos ni resultados sin respaldo. Los casos y testimonios aparecerán solo con aprobación real del cliente.", cards: [{ title: "Servicio bilingüe", body: "Atención en inglés y español." }, { title: "Implementación clara", body: "Alcance, precios, pruebas, lanzamiento y soporte definidos." }, { title: "Acceso seguro", body: "Portales por rol, administración protegida y secretos del servidor." }] },
    pricing: { eyebrow: "VISTA DE PRECIOS", title: "Comienza con lo que tu empresa necesita ahora.", body: "La implementación se define según tu flujo. Las tarifas de terceros son separadas salvo que se incluyan por escrito.", cards: [{ name: "Sitio Web y Experiencia del Cliente", tierId: "web-basic", note: "Sitio profesional, captura de prospectos, citas y experiencia para clientes." }, { name: "Automatización y Flujos con IA", tierId: "ai-simple", note: "Seguimiento, asignaciones, recordatorios y flujos de atención automatizados." }, { name: "CRM y Operaciones", tierId: "crm-basic", note: "CRM conectado, pipeline, automatizaciones, reportes y configuración operativa." }], cta: "Ver Todos los Precios" },
    faq: { eyebrow: "PREGUNTAS FRECUENTES", title: "Respuestas claras antes de reservar.", items: [["¿VYNTEX es una sola plataforma?", "VYNTEX es una plataforma conectada configurada alrededor de tus operaciones. Puede integrar servicios de terceros, pero tu equipo trabaja desde una experiencia organizada."], ["¿Debo reemplazar todas mis herramientas?", "No. Primero identificamos qué debe mantenerse, conectarse o reemplazarse. El objetivo es reducir complejidad."], ["¿Funciona para una empresa pequeña?", "Sí. Puedes comenzar con un flujo específico y ampliar la plataforma con el crecimiento de tu equipo y clientes."], ["¿Cuánto tarda la implementación?", "Depende del alcance, integraciones, datos y aprobaciones. Recibirás un plan claro antes de comenzar."], ["¿Puede haber portales separados?", "Sí. El acceso puede configurarse por rol para clientes, empleados, socios y administradores."]] },
    final: { title: "Reemplaza herramientas desconectadas con un sistema claro.", body: "Descubre cómo VYNTEX puede simplificar la experiencia del cliente, el trabajo del equipo y las operaciones diarias.", primary: "Reservar una Demostración", secondary: "Contactar a VYNTEX" },
  },
} as const;

type IconCardProps = { icon: ReactNode; title: string; body: string };

function IconCard({ icon, title, body }: IconCardProps) {
  return (
    <article className="rounded-2xl border border-vx-line bg-vx-bg2/70 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-vx-line bg-vx-bg3 text-vx-cyan">{icon}</span>
      <h3 className="mt-5 text-lg font-bold text-vx-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-vx-muted">{body}</p>
    </article>
  );
}

function DashboardMockup() {
  const rows = [
    ["New lead", "Website", "Assigned"],
    ["Consultation", "Calendar", "Booked"],
    ["Invoice", "Square", "Paid"],
  ];
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(14,165,233,0.22)] bg-[#080b1b] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between border-b border-vx-line px-5 py-4">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-vx-blue"/><span className="h-2.5 w-2.5 rounded-full bg-vx-muted/50"/><span className="h-2.5 w-2.5 rounded-full bg-vx-muted/30"/></div>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-vx-muted">VYNTEX COMMAND CENTER</span>
      </div>
      <div className="grid min-h-[430px] md:grid-cols-[170px_1fr]">
        <aside className="hidden border-r border-vx-line p-4 md:block">
          {["Overview", "Customers", "Inbox", "Appointments", "Payments", "Automation", "Reports"].map((item, index) => (
            <div key={item} className={`mb-1 rounded-lg px-3 py-2 text-xs ${index === 0 ? "bg-vx-blue/15 text-vx-cyan" : "text-vx-muted"}`}>{item}</div>
          ))}
        </aside>
        <div className="p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="text-xs uppercase tracking-[0.18em] text-vx-muted">TODAY</p><h3 className="mt-1 text-xl font-bold">Business Overview</h3></div>
            <div className="rounded-lg border border-vx-line bg-vx-bg3 px-3 py-2 text-xs text-vx-silver">All systems connected</div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[["New leads","18"],["Appointments","12"],["Open tasks","7"],["Payments","$8.4K"]].map(([label,value]) => (
              <div key={label} className="rounded-xl border border-vx-line bg-vx-bg2 p-4"><p className="text-xs text-vx-muted">{label}</p><p className="mt-2 text-xl font-bold text-vx-ink">{value}</p></div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
            <div className="rounded-xl border border-vx-line bg-vx-bg2 p-4">
              <div className="flex items-center justify-between"><p className="text-sm font-semibold">Live activity</p><span className="text-xs text-vx-cyan">View all</span></div>
              <div className="mt-4 space-y-3">{rows.map((row) => <div key={row[0]} className="grid grid-cols-3 items-center rounded-lg bg-vx-bg3 px-3 py-3 text-xs"><span className="text-vx-ink">{row[0]}</span><span className="text-vx-muted">{row[1]}</span><span className="text-right text-vx-cyan">{row[2]}</span></div>)}</div>
            </div>
            <div className="rounded-xl border border-vx-line bg-vx-bg2 p-4">
              <p className="text-sm font-semibold">Automation health</p>
              <div className="mt-5 grid place-items-center"><div className="grid h-28 w-28 place-items-center rounded-full border-[12px] border-vx-blue/20 border-t-vx-cyan"><div className="text-center"><p className="text-2xl font-bold">96%</p><p className="text-[10px] text-vx-muted">ON TRACK</p></div></div></div>
              <p className="mt-4 text-center text-xs text-vx-muted">24 workflows active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeExperience() {
  const { lang } = useLang();
  const c = content[lang];
  const [tab, setTab] = useState(0);
  const activeWalkthrough = c.walkthrough.tabs[tab] ?? c.walkthrough.tabs[0];
  const icons = [<Layers3 key="a" size={21}/>, <MessageSquareText key="b" size={21}/>, <Workflow key="c" size={21}/>, <LineChart key="d" size={21}/>];
  const benefitIcons = [<Database key="a" size={22}/>, <Zap key="b" size={22}/>, <Users key="c" size={22}/>];

  return (
    <>
      <section id="home" className="relative overflow-hidden pb-20 pt-[118px] sm:pb-28 sm:pt-[150px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[650px] max-w-6xl bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.16),transparent_68%)]" />
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-vx-cyan">{c.hero.eyebrow}</p>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">{c.hero.title}</h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-vx-muted sm:text-xl sm:leading-8">{c.hero.body}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={openConsultation} size="lg">{c.hero.primary}<ArrowRight size={18}/></Button>
              <Button href="#platform" variant="secondary" size="lg">{c.hero.secondary}</Button>
            </div>
            <p className="mt-5 text-sm text-vx-muted">{c.hero.note}</p>
          </div>
          <div className="mx-auto mt-14 max-w-6xl"><DashboardMockup /></div>
        </Container>
      </section>

      <section id="platform" className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.product.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.product.title}</h2><p className="mt-5 text-vx-muted sm:text-lg">{c.product.body}</p></div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">{c.benefits.map((item, i) => <IconCard key={item.title} icon={benefitIcons[i]} title={item.title} body={item.body}/>)}</div>
        </Container>
      </section>

      <section className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.what.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.what.title}</h2><p className="mt-5 text-vx-muted sm:text-lg">{c.what.body}</p></div>
            <div className="grid gap-4 sm:grid-cols-2">{c.categories.items.map((item, i) => <article key={item.title} className="rounded-2xl border border-vx-line bg-vx-bg/70 p-6"><span className="text-vx-cyan">{icons[i]}</span><h3 className="mt-4 text-lg font-bold">{item.title}</h3><ul className="mt-4 space-y-2">{item.bullets.map(b => <li key={b} className="flex gap-2 text-sm text-vx-muted"><Check size={15} className="mt-0.5 shrink-0 text-vx-blue"/>{b}</li>)}</ul></article>)}</div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.outcomes.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.outcomes.title}</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{c.outcomes.items.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-vx-line bg-vx-bg2/60 px-4 py-3 text-sm text-vx-silver"><Check size={16} className="text-vx-cyan"/>{item}</div>)}</div></div>
            <div className="rounded-3xl border border-vx-line bg-vx-bg2 p-6 sm:p-8"><div className="grid grid-cols-2 gap-4">{[[Clock3,"Faster response"],[Inbox,"One shared inbox"],[CircleDollarSign,"Clear payment activity"],[Gauge,"Live operational visibility"]].map(([Icon,label]) => { const I = Icon as typeof Clock3; return <div key={String(label)} className="rounded-2xl bg-vx-bg3 p-5"><I className="text-vx-cyan" size={22}/><p className="mt-5 text-sm font-semibold">{String(label)}</p></div>})}</div></div>
          </div>
        </Container>
      </section>

      <section className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.walkthrough.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.walkthrough.title}</h2></div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[.55fr_1.45fr]">
            <div role="tablist" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">{c.walkthrough.tabs.map((item, i) => <button key={item.label} role="tab" aria-selected={tab===i} onClick={() => setTab(i)} className={`min-w-max rounded-xl border px-5 py-4 text-left text-sm font-semibold transition ${tab===i ? "border-vx-blue bg-vx-blue/10 text-vx-cyan" : "border-vx-line bg-vx-bg text-vx-muted hover:text-vx-ink"}`}>{String(i+1).padStart(2,"0")} · {item.label}</button>)}</div>
            <div className="rounded-3xl border border-vx-line bg-vx-bg p-7 sm:p-10"><div className="grid gap-8 md:grid-cols-[1fr_.9fr] md:items-center"><div><p className="text-xs uppercase tracking-[0.18em] text-vx-cyan">{activeWalkthrough.label}</p><h3 className="mt-4 text-2xl font-bold sm:text-4xl">{activeWalkthrough.title}</h3><p className="mt-4 text-vx-muted sm:text-lg">{activeWalkthrough.body}</p></div><div className="space-y-3">{["Customer record","Workflow status","Automated action","Team notification"].map((x,i)=><div key={x} className="flex items-center justify-between rounded-xl border border-vx-line bg-vx-bg2 px-4 py-4"><span className="text-sm text-vx-silver">{x}</span><span className={`h-2.5 w-2.5 rounded-full ${i<=tab ? "bg-vx-cyan" : "bg-vx-muted/30"}`}/></div>)}</div></div></div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28"><Container><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.industries.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.industries.title}</h2></div><Button href="/industries" variant="secondary">{c.industries.cta}<ArrowRight size={17}/></Button></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{c.industries.items.map((item)=><Link key={item} href="/industries" className="group flex items-center justify-between rounded-2xl border border-vx-line bg-vx-bg2/60 px-5 py-5 font-semibold transition hover:border-vx-blue/50"><span>{item}</span><ArrowRight size={17} className="text-vx-muted transition group-hover:translate-x-1 group-hover:text-vx-cyan"/></Link>)}</div></Container></section>

      <section className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28"><Container><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.integrations.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.integrations.title}</h2><p className="mt-5 text-vx-muted sm:text-lg">{c.integrations.body}</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{c.integrations.items.map((item)=><div key={item} className="flex min-h-24 items-center justify-center rounded-2xl border border-vx-line bg-vx-bg px-4 text-center text-sm font-bold text-vx-silver"><PlugZap size={17} className="mr-2 text-vx-cyan"/>{item}</div>)}</div></div></Container></section>

      <section className="py-20 sm:py-28"><Container><div className="mx-auto max-w-3xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.proof.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.proof.title}</h2><p className="mt-5 text-vx-muted sm:text-lg">{c.proof.body}</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{c.proof.cards.map((item,i)=><IconCard key={item.title} icon={[<MessageSquareText key="a" size={22}/>,<FileText key="b" size={22}/>,<ShieldCheck key="c" size={22}/>][i]} title={item.title} body={item.body}/>)}</div></Container></section>

      <section id="pricing" className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28"><Container><div className="mx-auto max-w-3xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.pricing.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.pricing.title}</h2><p className="mt-5 text-vx-muted sm:text-lg">{c.pricing.body}</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{c.pricing.cards.map((card)=>{const tier=DIRECT_PRICING.find(t=>t.id===card.tierId);return <article key={card.name} className="flex h-full flex-col rounded-2xl border border-vx-line bg-vx-bg p-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-vx-cyan">{card.name}</p><p className="mt-6 text-sm uppercase tracking-[0.16em] text-vx-muted">Starting at</p><p className="mt-2 text-4xl font-extrabold text-vx-ink">{tier?.price}</p><p className="mt-5 flex-1 text-sm leading-6 text-vx-muted">{card.note}</p><Button href={`/checkout?service=${card.tierId}`} className="mt-7" fullWidth>{lang==="en"?"Get Started":"Comenzar"}</Button></article>})}</div><div className="mt-9 text-center"><Button href="/pricing" variant="secondary">{c.pricing.cta}<ArrowRight size={17}/></Button></div></Container></section>

      <section id="faq" className="py-20 sm:py-28"><Container><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.faq.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.faq.title}</h2></div><div className="divide-y divide-vx-line rounded-2xl border border-vx-line bg-vx-bg2/50 px-5 sm:px-7">{c.faq.items.map(([q,a])=><details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold"><span>{q}</span><span className="text-vx-cyan transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-vx-muted">{a}</p></details>)}</div></div></Container></section>

      <section className="pb-20 sm:pb-28"><Container><div className="relative overflow-hidden rounded-3xl border border-vx-line bg-vx-bg2 px-6 py-14 text-center shadow-vx-glow-sm sm:px-12 sm:py-20"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.18),transparent_62%)]"/><div className="relative mx-auto max-w-3xl"><Sparkles className="mx-auto text-vx-cyan"/><h2 className="mt-5 text-3xl font-bold sm:text-5xl">{c.final.title}</h2><p className="mx-auto mt-5 max-w-2xl text-vx-muted sm:text-lg">{c.final.body}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={openConsultation} size="lg">{c.final.primary}<ArrowRight size={18}/></Button><Button href="/contact" variant="secondary" size="lg">{c.final.secondary}</Button></div></div></div></Container></section>
    </>
  );
}
