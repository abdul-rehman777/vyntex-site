"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Users, MessageSquareText, CalendarDays, Workflow, CreditCard, BarChart3, Network } from "lucide-react";
import { useVyntexMotion, ease } from "@/lib/motion";

const dashboardIcons = [Users, CalendarDays, MessageSquareText, Workflow, CreditCard, BarChart3] as const;

export default function DashboardSequence({
  title,
  body,
  labels,
  note,
}: {
  title: string;
  body: string;
  labels: readonly string[];
  note: string;
}) {
  const { shouldReduceMotion } = useVyntexMotion();
  const [activeStep, setActiveStep] = useState(shouldReduceMotion ? labels.length : -1);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let step = 0;
    const interval = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= labels.length) {
        clearInterval(interval);
      }
    }, 800); // Sequence step timing

    return () => clearInterval(interval);
  }, [shouldReduceMotion, labels.length]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-[1.75rem] border border-vx-line bg-vx-bg2 shadow-vx-glow-sm">
        <div className="flex items-center justify-between border-b border-vx-line px-5 py-4 sm:px-7">
          <div>
            <p className="font-semibold text-vx-ink">{title}</p>
            <p className="mt-1 text-xs text-vx-muted sm:text-sm">{body}</p>
          </div>
          <span className="hidden rounded-full border border-vx-blue/25 bg-vx-blue/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-vx-cyan sm:inline">
            Your Business, Connected
          </span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
          {labels.map((label, index) => {
            const Icon = dashboardIcons[index] ?? Network;
            const isActive = activeStep >= index;
            const isJustActivated = activeStep === index;

            return (
              <motion.div
                key={label}
                initial={{ opacity: shouldReduceMotion ? 1 : 0.4, scale: 1 }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  scale: isJustActivated ? [1, 1.05, 1] : 1,
                  borderColor: isActive ? "rgba(34, 211, 238, 0.4)" : "rgba(14, 165, 233, 0.15)",
                }}
                transition={{ duration: 0.4, ease: ease.snappy }}
                className="flex items-center gap-3 rounded-xl border bg-vx-bg px-4 py-4 relative overflow-hidden"
              >
                {/* Background pulse when active */}
                <AnimatePresence>
                  {isJustActivated && !shouldReduceMotion && (
                    <motion.div
                      className="absolute inset-0 bg-vx-cyan/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    />
                  )}
                </AnimatePresence>

                <span
                  className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                    isActive ? "bg-vx-cyan/20 text-vx-glow" : "bg-vx-blue/10 text-vx-cyan"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className={`font-semibold transition-colors ${isActive ? "text-vx-ink" : "text-vx-silver"}`}>
                  {label}
                </span>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  className="ml-auto"
                >
                  <Check size={15} className="text-vx-cyan" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-vx-muted">{note}</p>
    </div>
  );
}
