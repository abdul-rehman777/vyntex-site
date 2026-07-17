"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ease, useVyntexMotion } from "@/lib/motion";

export default function TransformationCompare({
  before,
  after,
  beforeItems,
  afterItems,
}: {
  before: string;
  after: string;
  beforeItems: readonly string[];
  afterItems: readonly string[];
}) {
  const { shouldReduceMotion } = useVyntexMotion();

  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.smooth } },
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid gap-4 sm:grid-cols-2 relative"
    >
      {/* Decorative arrow/line between them on desktop */}
      <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <motion.div
          initial={shouldReduceMotion ? undefined : { width: 0, opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { width: 40, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: ease.smooth }}
          className="h-[1px] bg-gradient-to-r from-red-400/50 to-vx-cyan overflow-hidden"
        >
          <motion.div 
             animate={{ x: ["-100%", "200%"] }} 
             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             className="w-1/2 h-full bg-white/50" 
          />
        </motion.div>
      </div>

      <motion.article 
        variants={shouldReduceMotion ? undefined : itemVariants}
        className="rounded-2xl border border-red-400/15 bg-red-400/[0.03] p-6 relative overflow-hidden group"
      >
        <h3 className="font-bold text-vx-silver">{before}</h3>
        <ul className="mt-5 space-y-3">
          {beforeItems.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-vx-muted transition-colors group-hover:text-vx-silver/80">
              <span className="h-1.5 w-1.5 rounded-full bg-red-300/70" />
              {item}
            </li>
          ))}
        </ul>
      </motion.article>

      <motion.article 
        variants={shouldReduceMotion ? undefined : itemVariants}
        className="rounded-2xl border border-vx-blue/30 bg-vx-blue/[0.06] p-6 relative overflow-hidden"
      >
        {/* Subtle glow effect on the "After" card */}
        <motion.div 
          className="absolute -inset-10 bg-vx-glow/5 rounded-full blur-2xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <h3 className="font-bold text-vx-ink relative z-10">{after}</h3>
        <ul className="mt-5 space-y-3 relative z-10">
          {afterItems.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-vx-silver">
              <Check size={15} className="text-vx-cyan" />
              {item}
            </li>
          ))}
        </ul>
      </motion.article>
    </motion.div>
  );
}
