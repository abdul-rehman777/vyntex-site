"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Bot,
  CalendarCheck2,
  Check,
  CreditCard,
  FileText,
  Globe2,
  MailCheck,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/home/ScrollReveal";
import { useLang } from "@/context/LanguageContext";

const copy = {
  en: {
    title: "One Customer Journey, Fully Connected",
    body: "Each step updates the next, so your team sees the same customer history from inquiry to payment.",
    demo: "Illustrative connected workflow",
    secure: "Role-based access and organized records",
    sync: "Real-time visibility across your team",
    stages: [
      {
        label: "Lead Capture",
        cardTitle: "New Inquiry",
        status: "LIVE",
        rows: ["Website form received", "Contact details captured", "Source recorded"],
        result: "Ready for follow-up",
      },
      {
        label: "CRM Record",
        cardTitle: "Customer Profile",
        status: "SYNCED",
        rows: ["Record created", "Lead source attached", "Owner assigned"],
        result: "One complete history",
      },
      {
        label: "Automatic Message",
        cardTitle: "Response Sent",
        status: "DELIVERED",
        rows: ["Confirmation sent", "Booking link included", "Conversation logged"],
        result: "No manual first reply",
      },
      {
        label: "Appointment",
        cardTitle: "Appointment Set",
        status: "CONFIRMED",
        rows: ["Time selected", "Calendar updated", "Reminder scheduled"],
        result: "Team is prepared",
      },
      {
        label: "Invoice",
        cardTitle: "Invoice Created",
        status: "SENT",
        rows: ["Service selected", "Invoice generated", "Due date recorded"],
        result: "Clear payment request",
      },
      {
        label: "Payment",
        cardTitle: "Payment Recorded",
        status: "PAID",
        rows: ["Payment confirmed", "CRM updated", "Receipt delivered"],
        result: "Status updates instantly",
      },
      {
        label: "Portal",
        cardTitle: "Portal Updated",
        status: "ACTIVE",
        rows: ["Access enabled", "Documents organized", "Next steps visible"],
        result: "Customer stays informed",
      },
      {
        label: "Reporting",
        cardTitle: "Journey Summary",
        status: "UPDATED",
        rows: ["Pipeline refreshed", "Activity recorded", "Outcome visible"],
        result: "Better operational insight",
      },
    ],
  },
  es: {
    title: "Un Recorrido del Cliente, Totalmente Conectado",
    body: "Cada paso actualiza el siguiente para que su equipo vea el mismo historial desde la consulta hasta el pago.",
    demo: "Flujo conectado ilustrativo",
    secure: "Acceso por funciones y registros organizados",
    sync: "Visibilidad en tiempo real para su equipo",
    stages: [
      {
        label: "Captación",
        cardTitle: "Nueva Consulta",
        status: "ACTIVA",
        rows: ["Formulario recibido", "Datos capturados", "Fuente registrada"],
        result: "Lista para seguimiento",
      },
      {
        label: "Registro CRM",
        cardTitle: "Perfil del Cliente",
        status: "SINCRONIZADO",
        rows: ["Registro creado", "Fuente vinculada", "Responsable asignado"],
        result: "Un solo historial",
      },
      {
        label: "Mensaje Automático",
        cardTitle: "Respuesta Enviada",
        status: "ENTREGADO",
        rows: ["Confirmación enviada", "Enlace de cita incluido", "Conversación guardada"],
        result: "Sin respuesta manual inicial",
      },
      {
        label: "Cita",
        cardTitle: "Cita Confirmada",
        status: "CONFIRMADA",
        rows: ["Horario elegido", "Calendario actualizado", "Recordatorio programado"],
        result: "El equipo está preparado",
      },
      {
        label: "Factura",
        cardTitle: "Factura Creada",
        status: "ENVIADA",
        rows: ["Servicio seleccionado", "Factura generada", "Vencimiento registrado"],
        result: "Solicitud de pago clara",
      },
      {
        label: "Pago",
        cardTitle: "Pago Registrado",
        status: "PAGADO",
        rows: ["Pago confirmado", "CRM actualizado", "Recibo entregado"],
        result: "Estado actualizado al instante",
      },
      {
        label: "Portal",
        cardTitle: "Portal Actualizado",
        status: "ACTIVO",
        rows: ["Acceso habilitado", "Documentos organizados", "Próximos pasos visibles"],
        result: "El cliente se mantiene informado",
      },
      {
        label: "Reporte",
        cardTitle: "Resumen del Recorrido",
        status: "ACTUALIZADO",
        rows: ["Embudo actualizado", "Actividad registrada", "Resultado visible"],
        result: "Mejor visibilidad operativa",
      },
    ],
  },
} as const;

const icons = [
  Globe2,
  Users,
  MessageSquareText,
  CalendarCheck2,
  FileText,
  CreditCard,
  Bot,
  Sparkles,
] as const;

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function WorkflowDemo() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion() === true;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.34, once: false });
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || !inView || paused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % c.stages.length);
    }, 2300);

    return () => window.clearInterval(timer);
  }, [c.stages.length, inView, paused, reduceMotion]);

  const activeStage = c.stages[activeIndex]!;
  const progress = useMemo(
    () => `${((activeIndex + 1) / c.stages.length) * 100}%`,
    [activeIndex, c.stages.length],
  );

  return (
    <section
      ref={sectionRef}
      className="vx-customer-journey border-y border-vx-line py-16 sm:py-20"
    >
      <Container className="max-w-[1500px]">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
            {c.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vx-muted">
            {c.body}
          </p>
        </ScrollReveal>

        <motion.div
          className="vx-journey-shell mt-10"
          variants={reduceMotion ? undefined : panelVariants}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={{ once: true, amount: 0.18 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
          style={{ "--vx-journey-progress": progress } as React.CSSProperties}
        >
          <div className="vx-journey-atmosphere" aria-hidden="true" />
          <div className="vx-journey-grid" aria-hidden="true" />

          <div className="vx-journey-toolbar">
            <span>{c.demo}</span>
            <div className="vx-journey-live" aria-hidden="true">
              <i />
              <span>{activeStage.status}</span>
            </div>
          </div>

          <div
            className="vx-journey-stepper"
            role="tablist"
            aria-label={c.title}
          >
            <div className="vx-journey-rail" aria-hidden="true">
              <motion.span
                initial={false}
                animate={{ width: progress }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            {c.stages.map((stage, index) => {
              const Icon = icons[index]!;
              const active = activeIndex === index;
              const completed = activeIndex > index;

              return (
                <button
                  key={stage.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`journey-card-${index}`}
                  className="vx-journey-step"
                  data-active={active}
                  data-complete={completed}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="vx-journey-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="vx-journey-step-pill">
                    <Icon size={17} aria-hidden="true" />
                    <span>{stage.label}</span>
                  </span>
                  <span className="vx-journey-node" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div className="vx-journey-card-grid">
            {c.stages.map((stage, index) => {
              const Icon = icons[index]!;
              const active = activeIndex === index;
              const completed = activeIndex > index;

              return (
                <motion.article
                  id={`journey-card-${index}`}
                  key={stage.cardTitle}
                  className="vx-journey-card"
                  data-active={active}
                  data-complete={completed}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.42, delay: reduceMotion ? 0 : index * 0.055 }}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="vx-journey-card-head">
                    <span className="vx-journey-card-icon">
                      <Icon size={17} aria-hidden="true" />
                    </span>
                    <div>
                      <small>{stage.label}</small>
                      <strong>{stage.cardTitle}</strong>
                    </div>
                    <span className="vx-journey-badge">{stage.status}</span>
                  </div>

                  <div className="vx-journey-card-body">
                    {stage.rows.map((row, rowIndex) => (
                      <motion.div
                        key={row}
                        initial={false}
                        animate={
                          active || completed
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0.46, x: 0 }
                        }
                        transition={{ duration: 0.24, delay: active ? rowIndex * 0.07 : 0 }}
                      >
                        <Check size={13} aria-hidden="true" />
                        <span>{row}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="vx-journey-card-result">
                    <Zap size={13} aria-hidden="true" />
                    <span>{stage.result}</span>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="vx-journey-streams" aria-hidden="true">
            {c.stages.map((stage, index) => (
              <span
                key={stage.label}
                className="vx-journey-stream"
                data-active={activeIndex === index}
                style={{ "--stream-index": index } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="vx-journey-core" aria-hidden="true">
            <span className="vx-journey-core-ring" />
            <span className="vx-journey-core-mark">V</span>
            <span className="vx-journey-core-pulse" />
          </div>

          <div className="vx-journey-footer-notes">
            <span>
              <ShieldCheck size={16} aria-hidden="true" />
              {c.secure}
            </span>
            <span>
              <MailCheck size={16} aria-hidden="true" />
              {c.sync}
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
