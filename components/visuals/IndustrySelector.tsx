"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease, useVyntexMotion } from "@/lib/motion";

const industryContexts: Record<string, string[]> = {
  "Accounting and Tax": ["Client intake", "Document collection", "Appointment reminder", "Invoice follow-up"],
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
  const [visibleSteps, setVisibleSteps] = useState(shouldReduceMotion ? 4 : 0);

  const activeContext = industryContexts[activeIndustry] || industryContexts[items[0] || ""] || [];

  // Animate steps sequentially on industry change
  useEffect(() => {
    if (shouldReduceMotion) {
      setVisibleSteps(activeContext.length);
      return;
    }
    
    setVisibleSteps(0);
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setVisibleSteps(step);
      if (step >= activeContext.length) {
        clearInterval(timer);
      }
    }, 300);
    
    return () => clearInterval(timer);
  }, [activeIndustry, shouldReduceMotion, activeContext.length]);

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

      {/* Context visual - Animated Workflow */}
      <div className="relative rounded-2xl border border-vx-line bg-vx-bg/80 backdrop-blur-xl p-6 min-h-[260px] shadow-vx-glow-sm">
        <h4 className="text-xs font-mono text-vx-cyan uppercase tracking-widest mb-5">
          Connected Workflow
        </h4>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndustry}
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {/* Vertical connecting line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-vx-line/30 rounded-full" />
            
            {/* Animated progress line */}
            <motion.div 
              className="absolute left-[15px] top-4 w-[2px] bg-gradient-to-b from-vx-cyan via-vx-blue to-vx-cyan/30 rounded-full"
              initial={{ height: 0 }}
              animate={{ height: `${(visibleSteps / activeContext.length) * 100}%` }}
              transition={{ duration: 0.4, ease: ease.smooth }}
            />
            
            <div className="flex flex-col gap-4 relative">
              {activeContext.map((step: string, idx: number) => {
                const isVisible = visibleSteps > idx;
                const isJustVisible = visibleSteps === idx + 1;
                
                return (
                  <motion.div
                    key={`${activeIndustry}-${idx}`}
                    initial={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0.3, x: 0 }}
                    transition={{ duration: 0.3, ease: ease.smooth }}
                    className="flex items-center gap-4"
                  >
                    {/* Node */}
                    <div className="relative">
                      <motion.div 
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-mono font-bold transition-colors duration-300 ${
                          isVisible 
                            ? "bg-vx-blue/15 border-vx-cyan/40 text-vx-cyan shadow-vx-glow" 
                            : "bg-vx-bg2 border-vx-line text-vx-muted"
                        }`}
                      >
                        {idx + 1}
                      </motion.div>
                      
                      {/* Burst on activation */}
                      {isJustVisible && !shouldReduceMotion && (
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-vx-cyan/30"
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )}
                    </div>
                    
                    {/* Step label */}
                    <motion.div 
                      className={`text-sm font-medium px-4 py-2.5 rounded-xl border w-full transition-colors duration-300 ${
                        isVisible
                          ? "text-vx-ink bg-vx-bg2/80 border-vx-cyan/20"
                          : "text-vx-muted bg-vx-bg2/30 border-vx-line/30"
                      }`}
                    >
                      {step}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
