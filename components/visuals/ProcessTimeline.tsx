"use client";

import { motion } from "framer-motion";
import { ease, useVyntexMotion } from "@/lib/motion";

export default function ProcessTimeline({
  items,
}: {
  items: readonly (readonly [string, string, string])[];
}) {
  const { shouldReduceMotion } = useVyntexMotion();

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
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
      <div className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-[1px] bg-vx-line pointer-events-none" />
      
      {/* Animated connecting line */}
      <motion.div
        initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
        whileInView={shouldReduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: ease.smooth, delay: 0.2 }}
        className="hidden md:block absolute top-[44px] left-[16%] right-[16%] h-[1px] origin-left bg-gradient-to-r from-vx-blue via-vx-cyan to-vx-glow pointer-events-none z-0"
      />

      {items.map(([number, title, body]) => (
        <motion.article 
          key={number} 
          variants={shouldReduceMotion ? undefined : itemVariants}
          className="rounded-2xl border border-vx-line bg-vx-bg p-6 relative z-10"
        >
          <div className="relative inline-flex">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-vx-blue/10 font-mono text-sm font-bold text-vx-cyan ring-4 ring-vx-bg relative z-10">
              {number}
            </span>
            {/* Pulse behind number */}
            {!shouldReduceMotion && (
              <motion.span 
                className="absolute inset-0 rounded-full bg-vx-cyan/30 blur-sm"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: parseInt(number) * 0.3 }}
              />
            )}
          </div>
          <h3 className="mt-5 text-xl font-bold">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-vx-muted">{body}</p>
        </motion.article>
      ))}
    </motion.div>
  );
}
