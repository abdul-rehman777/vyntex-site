"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/components/home/motion";

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 22,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: distance, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.62,
        delay: reduceMotion ? 0 : delay,
        ease: motionTokens.ease,
      }}
    >
      {children}
    </motion.div>
  );
}
