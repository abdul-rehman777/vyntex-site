"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Check,
  ClipboardCheck,
  FileText,
  Headphones,
  Languages,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  PlugZap,
  Route,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { DIRECT_PRICING } from "@/lib/pricing";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { openConsultation } from "@/components/BookConsultation";

const content = {
  en: {
    hero: {
      eyebrow: "CONNECTED BUSINESS SYSTEMS",
      title: "One Connected System for Running Your Business",
      body: "Vyntex designs and connects your CRM, customer communication, appointments, payments, marketing, automation, portals, and reporting into one organized business system.",
      primary: "Book a Consultation",
      secondary: "See How It Works",
      note: "Built for growing service businesses that want fewer disconnected tools, less manual work, and better control.",
    },
    dashboard: {
      label: "YOUR CONNECTED BUSINESS DASHBOARD",
      disclaimer: "Illustrative dashboard preview. Data shown is for demonstration purposes.",
    },
    what: {
      eyebrow: "WHAT VYNTEX DOES",
      title: "We Connect the Technology Your Business Uses Every Day",
      body: "Vyntex helps businesses replace scattered tools and manual processes with one connected system. We configure the technology, automation, and workflows around the way your company actually operates.",
    },
    categories: {
      eyebrow: "CONNECTED SOLUTIONS",
      title: "Four areas. One organized system.",
      items: [
        { title: "Manage Customers and Work", body: "CRM, customer records, appointments, tasks, files, and payment activity." },
        { title: "Communicate From One Place", body: "Email, text messages, forms, customer inquiries, reminders, and conversation history." },
        { title: "Automate Repetitive Processes", body: "Lead routing, follow-up, notifications, intake, appointment reminders, and routine updates." },
        { title: "Understand Business Performance", body: "Sales pipeline, team activity, payment status, customer activity, and operational reporting." },
      ],
    },
    outcomes: {
      eyebrow: "BUSINESS OUTCOMES",
      title: "Less manual work. More visibility and control.",
      items: [
        { title: "Respond Faster", body: "Capture inquiries and route them to the right person without depending on manual follow-up." },
        { title: "Stay Organized", body: "Keep customer records, conversations, appointments, documents, and tasks connected." },
        { title: "Reduce Repetitive Work", body: "Automate reminders, internal notifications, customer updates, and routine processes." },
        { title: "See What Is Happening", body: "Track leads, payments, appointments, team activity, and workflow status from one dashboard." },
      ],
    },
    journey: {
      eyebrow: "HOW THE SYSTEM WORKS",
      title: "See How One Customer Moves Through Your Business",
      items: [
        { title: "A Lead Contacts You", body: "A website form, phone call, message, or referral creates a customer record." },
        { title: "Your Team Is Notified", body: "The inquiry is assigned to the correct employee, department, or location." },
        { title: "Follow-Up Happens Automatically", body: "The customer receives a response, booking link, document request, or reminder." },
        { title: "You Track the Result", body: "Your team can see appointments, conversations, payments, tasks, and next steps." },
      ],
    },
    industries: {
      eyebrow: "INDUSTRY SOLUTIONS",
      title: "Configured for the way your business works.",
      items: ["Professional Services", "Accounting & Tax", "Home Services", "Healthcare & Wellness", "Real Estate", "Restaurants & Retail"],
      cta: "View Industry Solutions",
    },
    integrations: {
      eyebrow: "INTEGRATIONS",
      title: "Connect the tools you already rely on.",
      body: "Your solution can connect payment, email, calendar, accounting, form, communication, and productivity tools based on your workflow.",
      items: ["Square", "Google Workspace", "Microsoft 365", "QuickBooks", "Calendars", "Email & SMS"],
    },
    trust: {
      eyebrow: "WHY BUSINESSES CHOOSE VYNTEX",
      title: "Clear Technology. Practical Implementation. Human Support.",
      items: [
        { title: "Clear Project Scope", body: "You receive a defined plan covering the work, timeline, responsibilities, software, and third-party costs." },
        { title: "Bilingual Support", body: "English and Spanish support for business owners, teams, and customers." },
        { title: "Solutions Built Around Your Operations", body: "We configure the system around your actual workflow instead of forcing every business into the same template." },
        { title: "Secure, Controlled Access", body: "Access can be organized by role so employees, customers, partners, and administrators see only what they need." },
      ],
    },
    pricing: {
      eyebrow: "PRICING PREVIEW",
      title: "Choose the Right Starting Point",
      body: "Begin with one focused service or combine multiple solutions into a connected business system. Final pricing depends on scope, integrations, software requirements, and implementation complexity.",
      cards: [
        { name: "Professional Website & Lead Capture", tierId: "web-basic", note: "A professional website, lead capture, booking, and customer-ready experience." },
        { name: "Automation & AI Implementation", tierId: "ai-simple", note: "Follow-up, routing, reminders, notifications, and practical AI-assisted workflows." },
        { name: "CRM & Operations System", tierId: "crm-basic", note: "CRM configuration, pipeline, workflows, reporting, and operational setup." },
      ],
      cardCta: "Request a Consultation",
      cta: "View Pricing",
      starting: "Starting at",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Clear answers before implementation begins.",
      items: [
        ["How does the Vyntex system work?", "Vyntex connects the tools and workflows your business needs into one organized experience. Depending on your requirements, the system may include Vyntex-built components and carefully selected third-party technology. We explain all required software, costs, and responsibilities before implementation begins."],
        ["Do I have to replace every tool I use?", "No. We first identify what should stay, what should connect, and what should be replaced. The goal is less complexity, not disruption for its own sake."],
        ["Can Vyntex work for a small business?", "Yes. You can begin with one focused service or workflow and expand the connected system as your team and operational needs grow."],
        ["How long does implementation take?", "Timing depends on scope, integrations, data, approvals, and third-party requirements. You receive an implementation plan before work begins."],
        ["Can customers and employees have separate portals?", "Yes. Access can be configured by role so customers, employees, partners, and administrators see only what they need."],
      ],
    },
    process: {
      eyebrow: "WHAT HAPPENS NEXT?",
      title: "A clear process from consultation to launch.",
      items: [
        { title: "Discovery", body: "We review your current tools, challenges, and priorities." },
        { title: "Solution Plan", body: "We recommend what should remain, what should connect, and what should be replaced." },
        { title: "Proposal", body: "You receive the scope, pricing, responsibilities, software requirements, and expected timeline." },
        { title: "Implementation", body: "Vyntex builds, configures, tests, launches, and supports the approved system." },
      ],
    },
    final: {
      title: "Bring your business tools into one connected system.",
      body: "Book a consultation to identify what should stay, what should connect, and what can be automated.",
      primary: "Book a Consultation",
      secondary: "View Services",
    },
  },
  es: {
    hero: {
      eyebrow: "SISTEMAS EMPRESARIALES CONECTADOS",
      title: "Un Sistema Conectado para Administrar su Negocio",
      body: "Vyntex diseña y conecta su CRM, comunicación con clientes, citas, pagos, marketing, automatización, portales y reportes en un sistema empresarial organizado.",
      primary: "Reservar una Consulta",
      secondary: "Ver Cómo Funciona",
      note: "Creado para empresas de servicios en crecimiento que desean menos herramientas desconectadas, menos trabajo manual y mayor control.",
    },
    dashboard: {
      label: "SU PANEL EMPRESARIAL CONECTADO",
      disclaimer: "Vista ilustrativa del panel. Los datos se muestran únicamente con fines de demostración.",
    },
    what: {
      eyebrow: "QUÉ HACE VYNTEX",
      title: "Conectamos la Tecnología que su Negocio Usa Cada Día",
      body: "Vyntex ayuda a reemplazar herramientas dispersas y procesos manuales con un sistema conectado. Configuramos la tecnología, automatización y flujos según la forma en que realmente opera su empresa.",
    },
    categories: {
      eyebrow: "SOLUCIONES CONECTADAS",
      title: "Cuatro áreas. Un sistema organizado.",
      items: [
        { title: "Administrar Clientes y Trabajo", body: "CRM, registros de clientes, citas, tareas, archivos y actividad de pagos." },
        { title: "Comunicarse Desde un Solo Lugar", body: "Correo, mensajes de texto, formularios, consultas, recordatorios e historial de conversaciones." },
        { title: "Automatizar Procesos Repetitivos", body: "Asignación de prospectos, seguimiento, notificaciones, admisión, recordatorios y actualizaciones rutinarias." },
        { title: "Entender el Rendimiento", body: "Pipeline de ventas, actividad del equipo, pagos, actividad de clientes y reportes operativos." },
      ],
    },
    outcomes: {
      eyebrow: "RESULTADOS DEL NEGOCIO",
      title: "Menos trabajo manual. Mayor visibilidad y control.",
      items: [
        { title: "Responder Más Rápido", body: "Capture consultas y asígnelas a la persona correcta sin depender del seguimiento manual." },
        { title: "Mantenerse Organizado", body: "Mantenga conectados clientes, conversaciones, citas, documentos y tareas." },
        { title: "Reducir Trabajo Repetitivo", body: "Automatice recordatorios, notificaciones internas, actualizaciones y procesos rutinarios." },
        { title: "Ver Qué Está Ocurriendo", body: "Controle prospectos, pagos, citas, actividad del equipo y estado de los flujos desde un panel." },
      ],
    },
    journey: {
      eyebrow: "CÓMO FUNCIONA EL SISTEMA",
      title: "Vea Cómo un Cliente Avanza por su Negocio",
      items: [
        { title: "Un Prospecto le Contacta", body: "Un formulario, llamada, mensaje o referido crea un registro de cliente." },
        { title: "Su Equipo Recibe una Notificación", body: "La consulta se asigna al empleado, departamento o ubicación correcta." },
        { title: "El Seguimiento Ocurre Automáticamente", body: "El cliente recibe una respuesta, enlace de cita, solicitud de documentos o recordatorio." },
        { title: "Usted Controla el Resultado", body: "Su equipo puede ver citas, conversaciones, pagos, tareas y próximos pasos." },
      ],
    },
    industries: {
      eyebrow: "SOLUCIONES POR INDUSTRIA",
      title: "Configurado para la forma en que trabaja su empresa.",
      items: ["Servicios Profesionales", "Contabilidad e Impuestos", "Servicios para el Hogar", "Salud y Bienestar", "Bienes Raíces", "Restaurantes y Comercio"],
      cta: "Ver Soluciones por Industria",
    },
    integrations: {
      eyebrow: "INTEGRACIONES",
      title: "Conecte las herramientas que ya utiliza.",
      body: "Su solución puede conectar pagos, correo, calendarios, contabilidad, formularios, comunicación y productividad según su flujo de trabajo.",
      items: ["Square", "Google Workspace", "Microsoft 365", "QuickBooks", "Calendarios", "Correo y SMS"],
    },
    trust: {
      eyebrow: "POR QUÉ LAS EMPRESAS ELIGEN VYNTEX",
      title: "Tecnología Clara. Implementación Práctica. Apoyo Humano.",
      items: [
        { title: "Alcance Claro", body: "Recibe un plan definido con trabajo, tiempo, responsabilidades, software y costos de terceros." },
        { title: "Apoyo Bilingüe", body: "Atención en inglés y español para dueños, equipos y clientes." },
        { title: "Soluciones Según su Operación", body: "Configuramos el sistema según su flujo real, sin obligar a todas las empresas a usar la misma plantilla." },
        { title: "Acceso Seguro y Controlado", body: "El acceso se organiza por rol para que cada persona vea únicamente lo que necesita." },
      ],
    },
    pricing: {
      eyebrow: "VISTA DE PRECIOS",
      title: "Elija el Punto de Inicio Correcto",
      body: "Comience con un servicio específico o combine varias soluciones en un sistema conectado. El precio final depende del alcance, integraciones, software y complejidad de implementación.",
      cards: [
        { name: "Sitio Profesional y Captura de Prospectos", tierId: "web-basic", note: "Sitio profesional, captura de prospectos, reservas y experiencia preparada para clientes." },
        { name: "Implementación de Automatización e IA", tierId: "ai-simple", note: "Seguimiento, asignaciones, recordatorios, notificaciones y flujos prácticos con IA." },
        { name: "Sistema de CRM y Operaciones", tierId: "crm-basic", note: "Configuración de CRM, pipeline, flujos, reportes y operaciones." },
      ],
      cardCta: "Solicitar una Consulta",
      cta: "Ver Precios",
      starting: "Desde",
    },
    faq: {
      eyebrow: "PREGUNTAS FRECUENTES",
      title: "Respuestas claras antes de comenzar.",
      items: [
        ["¿Cómo funciona el sistema Vyntex?", "Vyntex conecta las herramientas y flujos que su negocio necesita en una experiencia organizada. Según sus requisitos, el sistema puede incluir componentes creados por Vyntex y tecnología de terceros cuidadosamente seleccionada. Explicamos todo el software, costos y responsabilidades antes de comenzar."],
        ["¿Debo reemplazar todas mis herramientas?", "No. Primero identificamos qué debe mantenerse, conectarse o reemplazarse. El objetivo es reducir complejidad."],
        ["¿Vyntex funciona para una empresa pequeña?", "Sí. Puede comenzar con un servicio o flujo específico y ampliar el sistema conectado con el crecimiento de su empresa."],
        ["¿Cuánto tarda la implementación?", "Depende del alcance, integraciones, datos, aprobaciones y requisitos de terceros. Recibirá un plan antes de comenzar."],
        ["¿Puede haber portales separados?", "Sí. El acceso puede configurarse por rol para clientes, empleados, socios y administradores."],
      ],
    },
    process: {
      eyebrow: "¿QUÉ SUCEDE DESPUÉS?",
      title: "Un proceso claro desde la consulta hasta el lanzamiento.",
      items: [
        { title: "Descubrimiento", body: "Revisamos sus herramientas actuales, desafíos y prioridades." },
        { title: "Plan de Solución", body: "Recomendamos qué debe mantenerse, conectarse o reemplazarse." },
        { title: "Propuesta", body: "Recibe alcance, precio, responsabilidades, software y tiempo estimado." },
        { title: "Implementación", body: "Vyntex crea, configura, prueba, lanza y apoya el sistema aprobado." },
      ],
    },
    final: {
      title: "Conecte las herramientas de su negocio en un solo sistema.",
      body: "Reserve una consulta para identificar qué debe mantenerse, conectarse y automatizarse.",
      primary: "Reservar una Consulta",
      secondary: "Ver Servicios",
    },
  },
} as const;

type InfoCardProps = { icon: React.ReactNode; title: string; body: string };

function InfoCard({ icon, title, body }: InfoCardProps) {
  return (
    <article className="rounded-2xl border border-vx-line bg-vx-bg2/70 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.16)]">
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-vx-line bg-vx-bg3 text-vx-cyan">{icon}</span>
      <h3 className="mt-5 text-xl font-bold text-vx-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p>
    </article>
  );
}

function DashboardMockup({ label, disclaimer }: { label: string; disclaimer: string }) {
  const rows = [
    ["New inquiry", "Website", "Assigned"],
    ["Consultation", "Calendar", "Scheduled"],
    ["Payment", "Square", "Recorded"],
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(14,165,233,0.22)] bg-[#080b1b] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-vx-line px-5 py-4">
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-vx-blue"/><span className="h-2.5 w-2.5 rounded-full bg-vx-muted/50"/><span className="h-2.5 w-2.5 rounded-full bg-vx-muted/30"/></div>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-vx-muted">{label}</span>
        </div>
        <div className="grid min-h-[430px] md:grid-cols-[170px_1fr]">
          <aside className="hidden border-r border-vx-line p-4 md:block">
            {["Overview", "Customers", "Inbox", "Appointments", "Payments", "Automation", "Reports"].map((item, index) => (
              <div key={item} className={`mb-1 rounded-lg px-3 py-2 text-xs ${index === 0 ? "bg-vx-blue/15 text-vx-cyan" : "text-vx-muted"}`}>{item}</div>
            ))}
          </aside>
          <div className="p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div><p className="text-xs uppercase tracking-[0.18em] text-vx-muted">EXAMPLE VIEW</p><h3 className="mt-1 text-xl font-bold">Business Overview</h3></div>
              <div className="rounded-lg border border-vx-line bg-vx-bg3 px-3 py-2 text-xs text-vx-silver">Connected workflow</div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {["New leads", "Appointments", "Open tasks", "Payment activity"].map((label, index) => (
                <div key={label} className="rounded-xl border border-vx-line bg-vx-bg2 p-4"><p className="text-xs text-vx-muted">{label}</p><div className="mt-3 h-5 rounded bg-vx-blue/15" style={{ width: `${58 + index * 8}%` }}/></div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
              <div className="rounded-xl border border-vx-line bg-vx-bg2 p-4">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold">Workflow activity</p><span className="text-xs text-vx-cyan">Illustrative</span></div>
                <div className="mt-4 space-y-3">{rows.map((row) => <div key={row[0]} className="grid grid-cols-3 items-center rounded-lg bg-vx-bg3 px-3 py-3 text-xs"><span className="text-vx-ink">{row[0]}</span><span className="text-vx-muted">{row[1]}</span><span className="text-right text-vx-cyan">{row[2]}</span></div>)}</div>
              </div>
              <div className="rounded-xl border border-vx-line bg-vx-bg2 p-4">
                <p className="text-sm font-semibold">Connected systems</p>
                <div className="mt-5 space-y-3">{["CRM", "Communication", "Automation", "Reporting"].map((item) => <div key={item} className="flex items-center gap-3 rounded-lg bg-vx-bg3 px-3 py-3 text-xs text-vx-silver"><Check size={14} className="text-vx-cyan"/>{item}</div>)}</div>
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
  const c = content[lang];
  const categoryIcons = [<Users key="1" size={22}/>, <MessageSquareText key="2" size={22}/>, <Workflow key="3" size={22}/>, <BarChart3 key="4" size={22}/>];
  const outcomeIcons = [<Route key="1" size={22}/>, <Layers3 key="2" size={22}/>, <ClipboardCheck key="3" size={22}/>, <BarChart3 key="4" size={22}/>];
  const trustIcons = [<FileText key="1" size={22}/>, <Languages key="2" size={22}/>, <Headphones key="3" size={22}/>, <LockKeyhole key="4" size={22}/>];

  return (
    <>
      <section id="home" className="relative overflow-hidden pb-20 pt-[118px] sm:pb-28 sm:pt-[150px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[650px] max-w-6xl bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.16),transparent_68%)]" />
        <Container>
          <div className="mx-auto max-w-5xl text-center">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-vx-cyan">{c.hero.eyebrow}</p>
            <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">{c.hero.title}</h1>
            <p className="mx-auto mt-7 max-w-4xl text-base leading-7 text-vx-muted sm:text-xl sm:leading-8">{c.hero.body}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={openConsultation} size="lg">{c.hero.primary}<ArrowRight size={18}/></Button>
              <Button href="#customer-journey" variant="secondary" size="lg">{c.hero.secondary}</Button>
            </div>
            <p className="mx-auto mt-5 max-w-3xl text-sm text-vx-muted">{c.hero.note}</p>
          </div>
          <div className="mx-auto mt-14 max-w-6xl"><DashboardMockup label={c.dashboard.label} disclaimer={c.dashboard.disclaimer}/></div>
        </Container>
      </section>

      <section id="solutions" className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.what.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.what.title}</h2>
            <p className="mx-auto mt-5 max-w-3xl text-vx-muted sm:text-lg">{c.what.body}</p>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {c.categories.items.map((item, index) => <InfoCard key={item.title} icon={categoryIcons[index]} title={item.title} body={item.body}/>) }
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.outcomes.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.outcomes.title}</h2></div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">{c.outcomes.items.map((item, index) => <InfoCard key={item.title} icon={outcomeIcons[index]} title={item.title} body={item.body}/>)}</div>
        </Container>
      </section>

      <section id="customer-journey" className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.journey.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.journey.title}</h2></div>
          <ol className="mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-4">{c.journey.items.map((item, index) => <li key={item.title} className="relative rounded-2xl border border-vx-line bg-vx-bg p-6"><span className="font-mono text-xs text-vx-cyan">{String(index + 1).padStart(2,"0")}</span><h3 className="mt-5 text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-vx-muted">{item.body}</p></li>)}</ol>
        </Container>
      </section>

      <section className="py-20 sm:py-28"><Container><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div className="max-w-3xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.industries.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.industries.title}</h2></div><Button href="/industries" variant="secondary">{c.industries.cta}<ArrowRight size={17}/></Button></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{c.industries.items.map((item)=><Link key={item} href="/industries" className="group flex items-center justify-between rounded-2xl border border-vx-line bg-vx-bg2/60 px-5 py-5 font-semibold transition hover:border-vx-blue/50"><span>{item}</span><ArrowRight size={17} className="text-vx-muted transition group-hover:translate-x-1 group-hover:text-vx-cyan"/></Link>)}</div></Container></section>

      <section className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28"><Container><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.integrations.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.integrations.title}</h2><p className="mt-5 text-vx-muted sm:text-lg">{c.integrations.body}</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{c.integrations.items.map((item)=><div key={item} className="flex min-h-24 items-center justify-center rounded-2xl border border-vx-line bg-vx-bg px-4 text-center text-sm font-bold text-vx-silver"><PlugZap size={17} className="mr-2 text-vx-cyan"/>{item}</div>)}</div></div></Container></section>

      <section className="py-20 sm:py-28"><Container><div className="mx-auto max-w-4xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.trust.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.trust.title}</h2></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{c.trust.items.map((item,index)=><InfoCard key={item.title} icon={trustIcons[index]} title={item.title} body={item.body}/>)}</div></Container></section>

      <section id="pricing" className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28"><Container><div className="mx-auto max-w-4xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.pricing.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.pricing.title}</h2><p className="mt-5 text-vx-muted sm:text-lg">{c.pricing.body}</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{c.pricing.cards.map((card)=>{const tier=DIRECT_PRICING.find(t=>t.id===card.tierId);return <article key={card.name} className="flex h-full flex-col rounded-2xl border border-vx-line bg-vx-bg p-7"><h3 className="text-xl font-extrabold tracking-tight text-vx-ink">{card.name}</h3><p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-vx-muted">{c.pricing.starting}</p><p className="mt-2 text-4xl font-extrabold text-vx-cyan">{tier?.price}</p><p className="mt-5 flex-1 text-sm leading-6 text-vx-muted">{card.note}</p><Button onClick={openConsultation} className="mt-7" fullWidth>{c.pricing.cardCta}</Button></article>})}</div><div className="mt-9 text-center"><Button href="/pricing" variant="secondary">{c.pricing.cta}<ArrowRight size={17}/></Button></div></Container></section>

      <section id="faq" className="py-20 sm:py-28"><Container><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.faq.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.faq.title}</h2></div><div className="divide-y divide-vx-line rounded-2xl border border-vx-line bg-vx-bg2/50 px-5 sm:px-7">{c.faq.items.map(([q,a])=><details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold"><span>{q}</span><span className="text-vx-cyan transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-vx-muted">{a}</p></details>)}</div></div></Container></section>

      <section className="border-y border-vx-line bg-vx-bg2/35 py-20 sm:py-28"><Container><div className="mx-auto max-w-3xl text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-vx-blue">{c.process.eyebrow}</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">{c.process.title}</h2></div><ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{c.process.items.map((item,index)=><li key={item.title} className="rounded-2xl border border-vx-line bg-vx-bg p-6"><span className="grid h-10 w-10 place-items-center rounded-full bg-vx-blue/15 font-mono text-sm text-vx-cyan">{index+1}</span><h3 className="mt-5 text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-vx-muted">{item.body}</p></li>)}</ol></Container></section>

      <section className="py-20 sm:py-28"><Container><div className="relative overflow-hidden rounded-3xl border border-vx-line bg-vx-bg2 px-6 py-14 text-center shadow-vx-glow-sm sm:px-12 sm:py-20"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.18),transparent_62%)]"/><div className="relative mx-auto max-w-3xl"><Sparkles className="mx-auto text-vx-cyan"/><h2 className="mt-5 text-3xl font-bold sm:text-5xl">{c.final.title}</h2><p className="mx-auto mt-5 max-w-2xl text-vx-muted sm:text-lg">{c.final.body}</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={openConsultation} size="lg">{c.final.primary}<ArrowRight size={18}/></Button><Button href="/services" variant="secondary" size="lg">{c.final.secondary}</Button></div></div></div></Container></section>
    </>
  );
}
