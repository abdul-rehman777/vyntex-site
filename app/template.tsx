"use client";

import { motion } from "framer-motion";
import { useVyntexMotion, ease } from "@/lib/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const { shouldReduceMotion } = useVyntexMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: ease.smooth }}
    >
      {children}
    </motion.div>
  );
}
