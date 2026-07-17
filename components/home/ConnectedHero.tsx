"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
import { openConsultation } from "@/components/BookConsultation";
import { useLang } from "@/context/LanguageContext";
import { motionTokens } from "@/components/home/motion";

const moduleIcons = [Users, MessageSquareText, CalendarDays, Workflow, Globe2, CreditCard, Megaphone, BarChart3] as const;
const modulePositions = [
  "left-[2%] top-[9%]",
  "left-[26%] top-[1%]",
  "right-[25%] top-[1%]",
  "right-[2%] top-[9%]",
  "left-[1%] bottom-[11%]",
  "left-[25%] bottom-[1%]",
  "right-[25%] bottom-[1%]",
  "right-[1%] bottom-[11%]",
] as const;

const copy = {
  en: {
    eyebrow: "CONNECTED BUSINESS SYSTEMS",
    title: "One Connected System for Your Entire Business",
    body: "VYNTEX connects your CRM, customer communication, scheduling, payments, automation, website, marketing, and reporting into one organized business system.",
    primary: "Book Consultation",
    secondary: "View Services",
    modules: ["CRM", "Messages", "Appointments", "Automation", "Website", "Payments", "Marketing", "Reports"],
    inquiry: "New website inquiry",
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
    inquiry: "Nueva consulta web",
    connected: "Flujo conectado activo",
    replay: "Repetir secuencia de conexión",
  },
} as const;

export default function ConnectedHero() {
  const { lang } = useLang();
  const c = copy[lang];
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [run, setRun] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const active = reduceMotion ? 8 : inView ? 8 : 0;
  const sequenceKey = `${run}-${inView}`;

  useEffect(() => {
    if (!inView) return;
    setRun((value) => value + 1);
  }, [inView]);

  const pathPoints = useMemo<readonly (readonly [number, number])[]>(() => [
    [120, 210], [265, 95], [420, 95], [565, 210], [565, 330], [420, 445], [265, 445], [120, 330], [342, 270],
  ], []);

  return (
    <section id="home" className="relative overflow-hidden pb-16 pt-[116px] sm:pb-20 sm:pt-[136px]">
      <div className="hero-atmosphere" aria-hidden />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div className="relative z-10 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-vx-cyan">{c.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-[4.45rem]">{c.title}</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-vx-muted sm:text-lg sm:leading-8">{c.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={openConsultation} size="lg">{c.primary}<ArrowRight size={18} aria-hidden /></Button>
              <Button href="/services" variant="secondary" size="lg">{c.secondary}</Button>
            </div>
          </div>

          <div
            ref={ref}
            className="relative mx-auto w-full max-w-[680px]"
            onPointerMove={(event) => {
              if (reduceMotion || event.pointerType !== "mouse") return;
              const rect = event.currentTarget.getBoundingClientRect();
              setPointer({
                x: ((event.clientX - rect.left) / rect.width - 0.5) * 8,
                y: ((event.clientY - rect.top) / rect.height - 0.5) * 8,
              });
            }}
            onPointerLeave={() => setPointer({ x: 0, y: 0 })}
          >
            <motion.div
              className="hero-system-stage"
              animate={{ rotateX: -pointer.y * 0.3, rotateY: pointer.x * 0.35 }}
              transition={motionTokens.spring}
            >
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 684 540" aria-hidden="true">
                <defs>
                  <linearGradient id="hero-path" x1="0" y1="0" x2="1" y2="1">
                    <stop stopColor="#0ea5e9" stopOpacity="0.18" />
                    <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#cbd5e1" stopOpacity="0.18" />
                  </linearGradient>
                  <filter id="hero-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {pathPoints.slice(0, -1).map((point, index) => {
                  const next = pathPoints[index + 1]!;
                  const d = `M ${point[0]} ${point[1]} C ${(point[0] + next[0]) / 2} ${point[1]}, ${(point[0] + next[0]) / 2} ${next[1]}, ${next[0]} ${next[1]}`;
                  return <motion.path key={d} d={d} fill="none" stroke="url(#hero-path)" strokeWidth="2" strokeDasharray="8 10" initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0.3 }} animate={{ pathLength: active ? 1 : 0, opacity: active ? 0.9 : 0.3 }} transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.18, ease: motionTokens.ease }} />;
                })}
                {!reduceMotion && inView ? (
                  <motion.circle key={sequenceKey} r="5" fill="#e8eaff" filter="url(#hero-glow)" initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }} transition={{ duration: 2.4, ease: "linear" }} style={{ offsetPath: "path('M120 210 C190 210 195 95 265 95 C340 95 345 95 420 95 C495 95 495 210 565 210 C565 270 565 270 565 330 C495 330 495 445 420 445 C345 445 340 445 265 445 C195 445 190 330 120 330 C190 330 245 270 342 270')" }} />
                ) : null}
              </svg>

              {c.modules.map((label, index) => {
                const Icon = moduleIcons[index]!;
                return (
                  <motion.div
                    key={label}
                    className={`hero-module ${modulePositions[index]}`}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : index * 0.07, ease: motionTokens.ease }}
                    whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                  >
                    <span className="hero-module-icon"><Icon size={17} aria-hidden /></span>
                    <span>{label}</span>
                    <span className="hero-module-status" aria-hidden />
                  </motion.div>
                );
              })}

              <motion.div className="hero-core" initial={reduceMotion ? false : { opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.55, ease: motionTokens.ease }}>
                <span className="hero-core-ring" aria-hidden />
                <span className="hero-core-mark"><Workflow size={30} aria-hidden /></span>
                <strong>VYNTEX</strong>
                <small>{c.connected}</small>
              </motion.div>

              <motion.div className="hero-inquiry" initial={reduceMotion ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduceMotion ? 0 : 0.7 }}>
                <Globe2 size={14} aria-hidden />{c.inquiry}
              </motion.div>
            </motion.div>

            {!reduceMotion ? (
              <button type="button" onClick={() => setRun((value) => value + 1)} className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-vx-muted transition-colors hover:text-vx-ink" aria-label={c.replay}>
                <RefreshCw size={14} aria-hidden />{c.replay}
              </button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
