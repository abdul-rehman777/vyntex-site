"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PenTool, Rocket } from "lucide-react";
import { ease, useVyntexMotion } from "@/lib/motion";

const stepIcons = [Search, PenTool, Rocket] as const;

export default function ProcessTimeline({
  items,
}: {
  items: readonly (readonly [string, string, string])[];
}) {
  const { shouldReduceMotion } = useVyntexMotion();
  const [activeStep, setActiveStep] = useState(shouldReduceMotion ? items.length - 1 : -1);
  const [hasAnimated, setHasAnimated] = useState(shouldReduceMotion);

  useEffect(() => {
    if (shouldReduceMotion || hasAnimated) return;

    // We'll trigger the sequence once when visible via IntersectionObserver in the parent
    // For now, just stagger in after a delay
    let step = 0;
    const timer = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= items.length) {
        clearInterval(timer);
        setHasAnimated(true);
      }
    }, 800);

    return () => clearInterval(timer);
  }, [shouldReduceMotion, hasAnimated, items.length]);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.25 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.smooth } },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="mx-auto mt-9 grid max-w-5xl gap-4 relative md:grid-cols-3"
    >
      {/* Connecting line background */}
      <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-[2px] bg-vx-line/30 pointer-events-none rounded-full" />
      
      {/* Animated connecting line that draws as steps activate */}
      <motion.div
        initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={shouldReduceMotion ? undefined : { scaleX: activeStep >= items.length - 1 ? 1 : (activeStep + 1) / items.length }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: ease.smooth }}
        className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-[2px] origin-left bg-gradient-to-r from-vx-blue via-vx-cyan to-vx-glow pointer-events-none z-0 rounded-full"
      />

      {/* Signal pulse that travels along the line */}
      {!shouldReduceMotion && hasAnimated && (
        <motion.div
          className="hidden md:block absolute top-[50px] h-[6px] w-8 rounded-full bg-vx-cyan/60 blur-sm pointer-events-none z-0"
          animate={{ left: ["16%", "84%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      )}

      {items.map(([number, title, body], index) => {
        const Icon = stepIcons[index] ?? Search;
        const isActive = activeStep >= index;
        const isJustActivated = activeStep === index;
        
        return (
          <motion.article 
            key={number} 
            variants={shouldReduceMotion ? undefined : itemVariants}
            className={`rounded-2xl border bg-vx-bg p-6 relative z-10 transition-colors duration-500 ${isActive ? "border-vx-cyan/30 shadow-vx-glow-sm" : "border-vx-line"}`}
          >
            <div className="relative inline-flex">
              <motion.span 
                className="grid h-12 w-12 place-items-center rounded-xl font-mono text-sm font-bold ring-4 ring-vx-bg relative z-10 transition-colors duration-500"
                animate={{
                  backgroundColor: isActive ? "rgba(14,165,233,0.15)" : "rgba(14,165,233,0.05)",
                  color: isActive ? "#22D3EE" : "#0EA5E9",
                }}
              >
                <Icon size={22} />
              </motion.span>
              
              {/* Activation burst */}
              <AnimatePresence>
                {isJustActivated && !shouldReduceMotion && (
                  <motion.span 
                    className="absolute inset-0 rounded-xl bg-vx-cyan/40"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-xs text-vx-cyan/60">0{number}</span>
            </div>
            <h3 className="mt-2 text-xl font-bold">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
