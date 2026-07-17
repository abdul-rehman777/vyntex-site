"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease, useVyntexMotion } from "@/lib/motion";

const industryContexts: Record<string, string[]> = {
  "Accounting & Tax": ["Client intake", "Document collection", "Appointment reminder", "Invoice follow-up"],
  "Medical Offices": ["Patient registration", "Appointment scheduling", "Reminder SMS", "Post-visit survey"],
  "Home Services": ["Lead request", "Estimate generation", "Scheduling", "Review request"],
  "Construction": ["Project inquiry", "Estimate tracking", "Task coordination", "Status reporting"],
  "Professional Services": ["Consultation booking", "Proposal sending", "Contract signing", "Invoicing"],
  "Financial Services": ["Client onboarding", "Compliance checks", "Meeting scheduling", "Quarterly updates"],
  
  // Spanish translations
  "Contabilidad e Impuestos": ["Recepción de clientes", "Recolección de documentos", "Recordatorio de cita", "Seguimiento de factura"],
  "Oficinas Médicas": ["Registro de pacientes", "Programación de citas", "SMS de recordatorio", "Encuesta post-visita"],
  "Servicios del Hogar": ["Solicitud de prospecto", "Generación de presupuesto", "Programación", "Solicitud de reseña"],
  "Construcción": ["Consulta de proyecto", "Seguimiento de presupuesto", "Coordinación de tareas", "Reporte de estado"],
  "Servicios Profesionales": ["Reserva de consulta", "Envío de propuesta", "Firma de contrato", "Facturación"],
  "Servicios Financieros": ["Integración de clientes", "Controles de cumplimiento", "Programación de reuniones", "Actualizaciones trimestrales"],
};

export default function IndustrySelector({
  items,
}: {
  items: readonly string[];
}) {
  const [activeIndustry, setActiveIndustry] = useState<string>(items[0] || "");
  const { shouldReduceMotion } = useVyntexMotion();

  const activeContext = industryContexts[activeIndustry] || industryContexts[items[0] || ""] || [];

  return (
    <div className="flex flex-col gap-8 w-full max-w-lg mx-auto lg:mx-0">
      {/* Pills */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {items.map((item) => {
          const isActive = activeIndustry === item;
          return (
            <button
              key={item}
              onClick={() => setActiveIndustry(item)}
              className={`relative rounded-full border px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-vx-blue ${
                isActive
                  ? "border-vx-cyan/30 text-vx-ink"
                  : "border-vx-line bg-vx-bg2 text-vx-silver hover:bg-vx-bg3 hover:text-vx-ink"
              }`}
            >
              {isActive && !shouldReduceMotion && (
                <motion.div
                  layoutId="industry-active-pill"
                  className="absolute inset-0 rounded-full bg-vx-blue/10 border border-vx-cyan/50 pointer-events-none"
                  transition={{ ease: ease.snappy, duration: 0.3 }}
                />
              )}
              <span className="relative z-10">{item}</span>
            </button>
          );
        })}
      </div>

      {/* Context visual */}
      <div className="relative rounded-2xl border border-vx-line bg-vx-bg p-6 min-h-[220px] shadow-sm">
        <h4 className="text-xs font-mono text-vx-cyan uppercase tracking-widest mb-4">
          Typical Workflow
        </h4>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: ease.smooth }}
            className="flex flex-col gap-3"
          >
            {activeContext.map((step: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-vx-blue/10 border border-vx-line text-[10px] font-mono text-vx-cyan">
                  {idx + 1}
                </div>
                <div className="text-sm font-medium text-vx-silver bg-vx-bg2/50 px-3 py-1.5 rounded-lg border border-vx-line/50 w-full">
                  {step}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
