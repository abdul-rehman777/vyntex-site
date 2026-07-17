"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CreditCard,
  Globe2,
  Megaphone,
  MessageSquareText,
  RefreshCw,
  Users,
  Workflow,
} from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import { openConsultation } from "@/components/BookConsultation";
import { useLang } from "@/context/LanguageContext";
import { motionTokens } from "@/components/home/motion";

const moduleIcons = [
  Users,
  MessageSquareText,
  CalendarDays,
  Workflow,
  Globe2,
  CreditCard,
  Megaphone,
  BarChart3,
] as const;

const modulePositions = [
  "left-[3%] top-[12%]",
  "left-[29%] top-[4%]",
  "right-[28%] top-[4%]",
  "right-[3%] top-[12%]",
  "left-[3%] bottom-[12%]",
  "left-[29%] bottom-[4%]",
  "right-[28%] bottom-[4%]",
  "right-[3%] bottom-[12%]",
] as const;

const copy = {
  en: {
    eyebrow: "CONNECTED BUSINESS SYSTEMS",
    title: "One Connected System for Your Entire Business",
    body: "VYNTEX connects your CRM, customer communication, scheduling, payments, automation, website, marketing, and reporting into one organized business system.",
    primary: "Book Consultation",
    secondary: "View Services",
    modules: ["CRM", "Messages", "Appointments", "Automation", "Website", "Payments", "Marketing", "Reports"],
    inquiry: "Website inquiry received",
    connected: "Connected workflow active",
    replay: "Replay connection sequence",
  },
  es: {
    eyebrow: "SISTEMAS EMPRESARIALES CONECTADOS",
    title: "Un Sistema Conectado para Todo su Negocio",
    body: "VYNTEX conecta su CRM, comunicación con clientes, citas, pagos, automatización, sitio web, marketing y reportes en un sistema empresarial organizado.",
    primary: "Reservar una Consulta",
    secondary: "Ver Servicios",
    modules: ["CRM", "Mensajes", "Citas", "Automatización", "Sitio Web", "Pagos", "Marketing", "Reportes"],
    inquiry: "Consulta web recibida",
    connected: "Flujo conectado activo",
    replay: "Repetir secuencia de conexión",
  },
} as const;

export default function ConnectedHero() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion() === true;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.28 });
  const [run, setRun] = useState(0);
  const play = reduceMotion || inView;

  // Subtle scroll-linked parallax on the visual stage (Nexaro-style scroll
  // effect), molded to VYNTEX: GPU transform only, and flat under reduced motion.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [34, -34]);

  const paths = useMemo(
    () => [
      "M120 215 C190 215 230 270 342 270",
      "M265 95 C290 160 310 220 342 270",
      "M420 95 C395 160 375 220 342 270",
      "M565 215 C495 215 455 270 342 270",
      "M120 330 C190 330 230 285 342 270",
      "M265 445 C290 380 310 320 342 270",
      "M420 445 C395 380 375 320 342 270",
      "M565 330 C495 330 455 285 342 270",
    ],
    [],
  );

  return (
    <section id="home" className="relative overflow-hidden pb-16 pt-[116px] sm:pb-20 sm:pt-[136px]">
      <div className="hero-atmosphere" aria-hidden />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="relative z-10 max-w-2xl">
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: motionTokens.ease }}
              className="font-mono text-xs uppercase tracking-[0.22em] text-vx-cyan"
            >
              {c.eyebrow}
            </motion.p>

            <div className="mt-5 overflow-hidden pb-1">
              <RevealText
                as="h1"
                text={c.title}
                trigger="mount"
                delay={0.08}
                className="text-4xl font-extrabold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[4.45rem]"
              />
            </div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.18, ease: motionTokens.ease }}
              className="mt-6 max-w-xl text-base leading-7 text-vx-muted sm:text-lg sm:leading-8"
            >
              {c.body}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.28, ease: motionTokens.ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button onClick={openConsultation} size="lg">
                {c.primary}<ArrowRight size={18} aria-hidden />
              </Button>
              <Button href="/services" variant="secondary" size="lg">{c.secondary}</Button>
            </motion.div>
          </div>

          <div ref={ref} className="relative mx-auto w-full max-w-[680px]">
            <motion.div style={{ y: stageY }} className="will-change-transform">
            <motion.div
              key={run}
              className="hero-system-stage"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.975, y: 18 }}
              animate={play ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.975, y: 18 }}
              transition={{ duration: 0.7, ease: motionTokens.ease }}
            >
              <div className="hero-stage-sheen" aria-hidden />

              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 684 540" aria-hidden="true">
                <defs>
                  <linearGradient id="hero-path-premium" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#0ea5e9" stopOpacity="0.15" />
                    <stop offset="0.55" stopColor="#22d3ee" stopOpacity="0.86" />
                    <stop offset="1" stopColor="#cbd5e1" stopOpacity="0.16" />
                  </linearGradient>
                </defs>
                {paths.map((d, index) => (
                  <g key={d}>
                    <path d={d} fill="none" stroke="rgba(34,211,238,.08)" strokeWidth="5" />
                    <motion.path
                      d={d}
                      fill="none"
                      stroke="url(#hero-path-premium)"
                      strokeWidth="2"
                      initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                      animate={play ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.8, delay: reduceMotion ? 0 : 0.42 + index * 0.08, ease: motionTokens.ease }}
                    />
                  </g>
                ))}
              </svg>

              {c.modules.map((label, index) => {
                const Icon = moduleIcons[index]!;
                return (
                  <motion.div
                    key={label}
                    className={`hero-module ${modulePositions[index]}`}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 10 }}
                    animate={play ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 10 }}
                    transition={{ duration: 0.42, delay: reduceMotion ? 0 : 0.16 + index * 0.055, ease: motionTokens.ease }}
                  >
                    <span className="hero-module-icon"><Icon size={17} aria-hidden /></span>
                    <span>{label}</span>
                    <motion.span
                      className="hero-module-status"
                      aria-hidden
                      animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.9, 1.08, 0.9] }}
                      transition={{ duration: 3.6, repeat: Infinity, delay: index * 0.18 }}
                    />
                  </motion.div>
                );
              })}

              <motion.div
                className="hero-core"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
                animate={play ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.72, delay: reduceMotion ? 0 : 0.56, ease: motionTokens.ease }}
              >
                <motion.span
                  className="hero-core-ring"
                  aria-hidden
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                />
                <span className="hero-core-mark"><Workflow size={30} aria-hidden /></span>
                <strong>VYNTEX</strong>
                <small>{c.connected}</small>
              </motion.div>

              <motion.div
                className="hero-inquiry"
                initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                animate={play ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.36 }}
              >
                <Globe2 size={14} aria-hidden />{c.inquiry}
              </motion.div>
            </motion.div>
            </motion.div>

            {!reduceMotion ? (
              <button
                type="button"
                onClick={() => setRun((value) => value + 1)}
                className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-vx-muted transition-colors hover:text-vx-ink"
                aria-label={c.replay}
              >
                <RefreshCw size={14} aria-hidden />{c.replay}
              </button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
