"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Globe, Users, MessageSquareText, CalendarDays, Receipt, CreditCard, LayoutDashboard, BarChart3 } from "lucide-react";
import { useVyntexMotion, ease } from "@/lib/motion";

const flowIcons = [Globe, Users, MessageSquareText, CalendarDays, Receipt, CreditCard, LayoutDashboard, BarChart3] as const;

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
    }, 700); // 700ms between each node activation

    return () => clearInterval(interval);
  }, [shouldReduceMotion, labels.length]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-[1.75rem] border border-vx-line bg-vx-bg2/80 shadow-vx-glow-sm backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-vx-line px-5 py-5 sm:px-8 text-center sm:text-left gap-4">
          <div>
            <h3 className="text-xl font-bold text-vx-ink">{title}</h3>
            {/* The body text is no longer the arrows, just simple text if passed, or we ignore it if it's visually redundant. I'll hide the explicit text arrows because the visual does it better, or just render it small for screen readers. */}
            <p className="sr-only">{body}</p>
          </div>
          <button
            onClick={() => setActiveStep(-1)}
            className="rounded-full border border-vx-blue/25 bg-vx-blue/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-vx-cyan hover:bg-vx-cyan/20 transition-colors"
          >
            Replay Flow
          </button>
        </div>
        
        {/* Horizontal Desktop / Vertical Mobile Timeline */}
        <div className="relative px-6 py-10 sm:px-10 sm:py-16">
          {/* Main connecting line background */}
          <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-vx-blue/10 sm:left-10 sm:right-10 sm:top-1/2 sm:-translate-y-1/2 sm:h-0.5 sm:w-auto" />
          
          {/* Animated active line */}
          <motion.div 
            className="absolute left-10 top-10 w-0.5 bg-vx-cyan sm:left-10 sm:top-1/2 sm:-translate-y-1/2 sm:h-0.5 shadow-vx-glow"
            initial={{ height: 0, width: "2px" }}
            animate={{ 
              height: typeof window !== "undefined" && window.innerWidth < 640 ? `${(Math.max(0, activeStep) / (labels.length - 1)) * 100}%` : "2px",
              width: typeof window !== "undefined" && window.innerWidth >= 640 ? `${(Math.max(0, activeStep) / (labels.length - 1)) * 100}%` : "2px"
            }}
            transition={{ duration: 0.5, ease: ease.smooth }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-8 sm:gap-4">
            {labels.map((label, index) => {
              const Icon = flowIcons[index] ?? Globe;
              const isActive = activeStep >= index;
              const isJustActivated = activeStep === index;

              return (
                <div key={label} className="flex sm:flex-col items-center gap-4 sm:gap-3 group relative">
                  {/* Node icon */}
                  <motion.div
                    initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: shouldReduceMotion ? 1 : 0.5 }}
                    animate={{ 
                      scale: isActive ? 1 : 0.8, 
                      opacity: isActive ? 1 : 0.5,
                      borderColor: isActive ? "rgba(34,211,238,0.5)" : "rgba(14,165,233,0.2)"
                    }}
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-vx-bg transition-colors ${isActive ? "shadow-vx-glow bg-vx-blue/10" : ""}`}
                  >
                    <AnimatePresence>
                      {isJustActivated && !shouldReduceMotion && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-vx-cyan/30"
                          initial={{ scale: 1, opacity: 0.8 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      )}
                    </AnimatePresence>
                    
                    <Icon size={20} className={isActive ? "text-vx-cyan" : "text-vx-blue"} />
                    
                    {/* Status badge */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-vx-cyan text-black"
                        >
                          <Check size={12} strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Label */}
                  <div className="flex flex-col sm:items-center sm:text-center sm:w-24">
                    <motion.span 
                      animate={{ color: isActive ? "#F8FAFC" : "#64748B" }}
                      className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-wider leading-tight"
                    >
                      {label}
                    </motion.span>
                    <AnimatePresence>
                      {isJustActivated && (
                        <motion.span 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[0.6rem] text-vx-cyan mt-1 hidden sm:block"
                        >
                          Updated
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-vx-muted">{note}</p>
    </div>
  );
}
